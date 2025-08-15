from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.prediction import Prediction
from models.user import User
from auth import require_admin
from pydantic import BaseModel

class CreateUserRequest(BaseModel):
    email: str
    role: str = "user"

router = APIRouter()

@router.get("/predictions/recent")
def list_recent_predictions(limit: int = 30, db: Session = Depends(get_db)):
	rows = (
		db.query(Prediction)
		.order_by(Prediction.created_at.desc())
		.limit(limit)
		.all()
	)
	return [
		{
			"id": r.id,
			"symbol": r.symbol,
			"model": r.model,
			"step": r.step,
			"value": r.value,
			"created_at": r.created_at,
		}
		for r in rows
	]

@router.get("/users")
def list_users(db: Session = Depends(get_db), _: bool = Depends(require_admin)):
	users = db.query(User).all()
	return [
		{
			"id": user.id,
			"username": user.username,
			"role": user.role,
			"created_at": getattr(user, 'created_at', None),
		}
		for user in users
	]

@router.post("/users")
def create_user(user_data: CreateUserRequest, db: Session = Depends(get_db), _: bool = Depends(require_admin)):
	# Check if user already exists
	existing = db.query(User).filter(User.username == user_data.email).first()
	if existing:
		raise HTTPException(status_code=400, detail="User already exists")
	
	# Create new user
	new_user = User(
		username=user_data.email,
		hashed_password="temp_password",  # In production, hash a real password
		role=user_data.role
	)
	
	db.add(new_user)
	db.commit()
	db.refresh(new_user)
	
	return {
		"status": "created",
		"id": new_user.id,
		"email": new_user.username,
		"role": new_user.role
	}

@router.post("/users/demo")
def create_demo_user(db: Session = Depends(get_db), _: bool = Depends(require_admin)):
	username = "demo"
	existing = db.query(User).filter(User.username == username).first()
	if existing:
		return {"status": "exists"}
	user = User(username=username, hashed_password="not_used", role="admin")
	db.add(user)
	db.commit()
	db.refresh(user)
	return {"status": "created", "id": user.id}
