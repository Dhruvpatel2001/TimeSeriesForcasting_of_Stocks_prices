from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.stock import router as stock_router
from routes.news import router as news_router
from routes.db import router as db_router
from database import Base, engine
import models.user  # noqa: F401
import models.prediction  # noqa: F401

app = FastAPI(title="Stock Prediction API")

# Enable CORS for frontend requests - with more permissive settings for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=False,  # Set to False when allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables at startup
Base.metadata.create_all(bind=engine)

# Include API routes
app.include_router(stock_router, prefix="/stock")
app.include_router(news_router, prefix="/news")
app.include_router(db_router, prefix="/db")

@app.get("/")
def root():
    return {"message": "Stock Prediction API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "cors_enabled": True}

@app.get("/db/health")
def db_health():
    # If metadata creation worked, DB is reachable
    return {"status": "ok"}

