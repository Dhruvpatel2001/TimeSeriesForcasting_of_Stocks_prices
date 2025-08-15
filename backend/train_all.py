import os
import pickle
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import yfinance as yf
from statsmodels.tsa.arima.model import ARIMA

# Ensure models directory exists
os.makedirs('models', exist_ok=True)

def fetch_stock_data(symbol, start="2020-01-01", end="2024-01-01"):
    data = yf.download(symbol, start=start, end=end)
    return data["Close"].values.reshape(-1, 1), data["Close"]

def prepare_data(series, time_steps=10):
    X, y = [], []
    for i in range(len(series) - time_steps):
        X.append(series[i:i+time_steps])
        y.append(series[i+time_steps])
    return np.array(X), np.array(y)

def train_arima(symbol):
    _, stock_data_series = fetch_stock_data(symbol)
    model = ARIMA(stock_data_series, order=(5,1,0))
    arima_model = model.fit()
    with open("models/arima_model.pkl", "wb") as f:
        pickle.dump(arima_model, f)
    print(f"ARIMA model for {symbol} saved successfully!")

def train_lstm(symbol):
    stock_data, _ = fetch_stock_data(symbol)
    X, y = prepare_data(stock_data)
    model = Sequential([
        LSTM(50, activation="relu", return_sequences=True, input_shape=(X.shape[1], 1)),
        LSTM(50, activation="relu"),
        Dense(1)
    ])
    model.compile(optimizer="adam", loss="mse")
    model.fit(X, y, epochs=20, batch_size=16, verbose=1)
    model.save("models/lstm_model.h5")
    print(f"LSTM model for {symbol} saved successfully!")

def train_all(symbol="AAPL"):
    print(f"Training models for {symbol}...")
    train_arima(symbol)
    train_lstm(symbol)
    print("All models trained and saved.")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Train ARIMA and LSTM models for a stock symbol.")
    parser.add_argument('--symbol', type=str, default="AAPL", help='Stock symbol to train models for')
    args = parser.parse_args()
    train_all(args.symbol) 