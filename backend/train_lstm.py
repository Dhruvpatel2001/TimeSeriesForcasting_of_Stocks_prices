import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import yfinance as yf
import joblib

# Fetch historical stock data
def fetch_stock_data(symbol, start="2020-01-01", end="2024-01-01"):
    data = yf.download(symbol, start=start, end=end)
    return data["Close"].values.reshape(-1, 1)

# Prepare dataset for LSTM
def prepare_data(series, time_steps=10):
    X, y = [], []
    for i in range(len(series) - time_steps):
        X.append(series[i:i+time_steps])
        y.append(series[i+time_steps])
    return np.array(X), np.array(y)

# Train LSTM model
def train_lstm(symbol):
    stock_data = fetch_stock_data(symbol)
    X, y = prepare_data(stock_data)
    
    # Define LSTM model
    model = Sequential([
        LSTM(50, activation="relu", return_sequences=True, input_shape=(X.shape[1], 1)),
        LSTM(50, activation="relu"),
        Dense(1)
    ])
    
    model.compile(optimizer="adam", loss="mse")
    
    # Train model
    model.fit(X, y, epochs=20, batch_size=16, verbose=1)
    
    # Save model
    model.save("models/lstm_model.h5")
    print("LSTM model saved successfully!")

if __name__ == "__main__":
    train_lstm("AAPL")  # Train model for Apple stock
