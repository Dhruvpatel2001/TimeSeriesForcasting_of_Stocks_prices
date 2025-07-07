from fastapi import APIRouter
from services.data_fetch import get_stock_data
from services.model_predict import predict_stock_price_arima, predict_stock_price_lstm

router = APIRouter()

@router.get("/predict/{symbol}")
def predict_stock(symbol: str):
    stock_data = get_stock_data(symbol, "2024-01-01", "2025-01-01")
    arima_prediction = predict_stock_price_arima(stock_data)
    lstm_prediction = predict_stock_price_lstm(stock_data)
    
    return {
        "symbol": symbol,
        "arima_prediction": arima_prediction,
        "lstm_prediction": lstm_prediction
    }
