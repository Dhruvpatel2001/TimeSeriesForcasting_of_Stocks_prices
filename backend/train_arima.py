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
    
    # Save model
    with open("models/arima_model.pkl", "wb") as f:
        pickle.dump(arima_model, f)
    print("ARIMA model saved successfully!")

if __name__ == "__main__":
    train_arima("AAPL")  # Train model for Apple stock
