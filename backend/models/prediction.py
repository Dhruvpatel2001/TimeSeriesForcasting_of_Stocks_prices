from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class Prediction(Base):
	__tablename__ = 'predictions'
	id = Column(Integer, primary_key=True, index=True)
	symbol = Column(String, index=True, nullable=False)
	model = Column(String, index=True, nullable=False)  # 'arima' | 'lstm' | 'hybrid'
	step = Column(Integer, nullable=False)  # prediction horizon step (e.g., 1..5)
	value = Column(Float, nullable=False)
	created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
