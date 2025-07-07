import pickle
import numpy as np
import tensorflow as tf

# Load ARIMA Model
with open("models/arima_model.pkl", "rb") as f:
    arima_model = pickle.load(f)

# Load LSTM Model
lstm_model = tf.keras.models.load_model("models/lstm_model.h5")

def predict_stock_price_arima(data):
    return arima_model.forecast(steps=5).tolist()

def predict_stock_price_lstm(data):
    data = np.array(data).reshape(1, -1, 1)
    prediction = lstm_model.predict(data)
    return prediction.tolist()
