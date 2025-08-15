import os
import pickle
import pandas as pd
import yfinance as yf
from statsmodels.tsa.arima.model import ARIMA

# Fetch historical stock data
def fetch_stock_data(symbol, start="2020-01-01", end="2024-01-01"):
    data = yf.download(symbol, start=start, end=end)
    return data["Close"]

# Train ARIMA model
def train_arima(symbol):
    stock_data = fetch_stock_data(symbol)
    model = ARIMA(stock_data, order=(5,1,0))
    arima_model = model.fit()
    
    # Ensure the models directory exists
    model_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, "arima_model.pkl")
    with open(model_path, "wb") as f:
        pickle.dump(arima_model, f)
    print(f"ARIMA model saved successfully at {model_path}!")

if __name__ == "__main__":
    train_arima("AAPL")  # Train model for Apple stock
