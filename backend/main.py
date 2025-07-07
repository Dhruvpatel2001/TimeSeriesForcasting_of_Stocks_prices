from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.stock import router as stock_router
from routes.news import router as news_router

app = FastAPI(title="Stock Prediction API")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(stock_router, prefix="/stock")
app.include_router(news_router, prefix="/news")

@app.get("/")
def root():
    return {"message": "Stock Prediction API is running!"}

