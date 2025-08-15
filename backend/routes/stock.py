from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from services.data_fetch import get_stock_data
from services.model_predict import predict_stock_price_arima, predict_stock_price_lstm, predict_stock_price_hybrid
import os
import shutil
import subprocess
import logging
from sqlalchemy.orm import Session
from database import get_db
from auth import require_admin
from models.prediction import Prediction

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/predict/{symbol}")
def predict_stock(symbol: str, db: Session = Depends(get_db)):
    try:
        logger.info(f"Received prediction request for symbol: {symbol}")
        
        stock_data = get_stock_data(symbol, "2024-01-01", "2025-01-01")
        logger.info(f"Retrieved stock data: {len(stock_data) if stock_data else 0} records")
        
        # Extract actual historical prices for the chart
        actual_prices = []
        dates = []
        if stock_data:
            # Get the last 30 days of actual prices for comparison
            for i, record in enumerate(stock_data[-30:]):
                if 'Close' in record and record['Close'] is not None:
                    actual_prices.append(float(record['Close']))
                    dates.append(f"Historical {i+1}")
        
        logger.info(f"Extracted {len(actual_prices)} actual prices")
        
        # Get predictions from all models
        arima_prediction = predict_stock_price_arima(stock_data)
        lstm_prediction = predict_stock_price_lstm(stock_data)
        hybrid_prediction = predict_stock_price_hybrid(stock_data)
        
        logger.info(f"Generated predictions - ARIMA: {len(arima_prediction)}, LSTM: {len(lstm_prediction)}, Hybrid: {len(hybrid_prediction)}")
        
        # Persist predictions
        try:
            for idx, value in enumerate(arima_prediction, start=1):
                db.add(Prediction(symbol=symbol.upper(), model='arima', step=idx, value=float(value)))
            for idx, value in enumerate(lstm_prediction, start=1):
                db.add(Prediction(symbol=symbol.upper(), model='lstm', step=idx, value=float(value)))
            for idx, value in enumerate(hybrid_prediction, start=1):
                db.add(Prediction(symbol=symbol.upper(), model='hybrid', step=idx, value=float(value)))
            db.commit()
        except Exception as persist_err:
            db.rollback()
            logger.error(f"Failed to persist predictions for {symbol}: {persist_err}")

        response_data = {
            "symbol": symbol,
            "actual_prices": actual_prices,
            "actual_dates": dates,
            "arima_prediction": arima_prediction,
            "lstm_prediction": lstm_prediction,
            "hybrid_prediction": hybrid_prediction,
        }
        
        logger.info(f"Returning response with {len(actual_prices)} actual prices and predictions")
        return response_data
        
    except Exception as e:
        logger.error(f"Error in predict_stock for {symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@router.post("/upload/")
def upload_dataset(file: UploadFile = File(...), _: bool = Depends(require_admin)):
    # Save uploaded file
    os.makedirs("uploaded_data", exist_ok=True)
    file_path = os.path.join("uploaded_data", file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # Optionally, trigger retraining (example: call train_all.py)
    try:
        subprocess.run(["python", "train_all.py"], check=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retraining failed: {str(e)}")
    return {"message": "File uploaded and retraining started."}

@router.get("/metrics/")
def get_model_metrics():
    # Example static metrics, replace with real metrics if available
    return {
        "rmse": 0.32,
        "mae": 0.28,
        "r2": 0.92
    }

@router.get("/users/")
def get_users():
    # Example static users, replace with real DB query if needed
    return [
        {"id": 1, "username": "user1", "lastActive": "2024-03-20"},
        {"id": 2, "username": "user2", "lastActive": "2024-03-19"},
        {"id": 3, "username": "user3", "lastActive": "2024-03-18"},
    ]

@router.get("/stats/")
def get_api_stats():
    # Example static stats, replace with real tracking if needed
    return {
        "api_requests": 2547,
        "active_users": 3,
        "model_accuracy": 92
    }
