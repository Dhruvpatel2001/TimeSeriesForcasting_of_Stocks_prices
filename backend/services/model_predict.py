import os
import pickle
import numpy as np
try:
    import tensorflow as tf
except Exception as e:
    print(f"TensorFlow import failed: {e}")
    tf = None  # type: ignore
from typing import List, Any

# Get absolute paths for model files - models are in the backend/models directory
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
arima_path = os.path.join(base_dir, 'models', 'arima_model.pkl')
lstm_path = os.path.join(base_dir, 'models', 'lstm_model.h5')

print(f"Looking for ARIMA model at: {arima_path}")
print(f"Looking for LSTM model at: {lstm_path}")
print(f"ARIMA exists: {os.path.exists(arima_path)}")
print(f"LSTM exists: {os.path.exists(lstm_path)}")

# Initialize model variables
arima_model = None
lstm_model = None

# Load ARIMA Model
try:
    if os.path.exists(arima_path):
        with open(arima_path, "rb") as f:
            arima_model = pickle.load(f)
        print("ARIMA model loaded successfully")
    else:
        print("ARIMA model file not found")
except Exception as e:
    print(f"Error loading ARIMA model: {e}")
    arima_model = None

# Load LSTM Model
try:
    if os.path.exists(lstm_path) and tf is not None:
        lstm_model = tf.keras.models.load_model(lstm_path, compile=False)
        print("LSTM model loaded successfully")
    elif not os.path.exists(lstm_path):
        print("LSTM model file not found")
    else:
        print("TensorFlow not available; skipping LSTM model load")
except Exception as e:
    print(f"Error loading LSTM model: {e}")
    lstm_model = None


def _extract_close_series(data: List[Any]) -> List[float]:
	"""Extract numeric Close prices from yfinance records list."""
	close_values: List[float] = []
	for row in data:
		if isinstance(row, dict):
			value = row.get("Close")
			if isinstance(value, (int, float)):
				close_values.append(float(value))
	return close_values


def predict_stock_price_arima(data: List[Any]):
	# ARIMA here is pre-fit; we forecast next 5 steps. Fallback to naive if needed.
	if arima_model is None:
		print("ARIMA model not loaded, using fallback prediction")
		close_values = _extract_close_series(data)
		last = close_values[-1] if close_values else 0.0
		return [last] * 5
	
	try:
		arima_forecast = arima_model.forecast(steps=5).tolist()
		# Ensure plain Python floats for JSON serialization
		return [float(x) for x in arima_forecast]
	except Exception as e:
		print(f"ARIMA prediction error: {e}")
		close_values = _extract_close_series(data)
		last = close_values[-1] if close_values else 0.0
		return [last] * 5


def predict_stock_price_lstm(data: List[Any]):
	"""Predict next values using the loaded LSTM model.
	The model expects input shape (None, 10, 1) and outputs (None, 1).
	We'll generate 5 predictions by sliding the window.
	"""
	if lstm_model is None:
		print("LSTM model not loaded, using fallback prediction")
		close_values = _extract_close_series(data)
		last = close_values[-1] if close_values else 0.0
		return [last] * 5
	
	close_values = _extract_close_series(data)
	if not close_values:
		print("LSTM: No close values found in data")
		return [0.0] * 5

	print(f"LSTM: Found {len(close_values)} close values")
	print(f"LSTM: Close values range: {min(close_values):.2f} to {max(close_values):.2f}")

	try:
		# Get model input shape
		input_shape = lstm_model.input_shape
		print(f"LSTM: Model input shape: {input_shape}")
		
		if isinstance(input_shape, list):
			input_shape = input_shape[0]  # Handle multiple inputs
			print(f"LSTM: Using first input shape: {input_shape}")
		
		# Extract dimensions: (batch, timesteps, features)
		if len(input_shape) == 3:
			_, timesteps, features = input_shape
			print(f"LSTM: Extracted - timesteps: {timesteps}, features: {features}")
		else:
			# Fallback to reasonable defaults
			timesteps = min(len(close_values), 60)
			features = 1
			print(f"LSTM: Using fallback - timesteps: {timesteps}, features: {features}")
		
		# Normalize the data to 0-1 range for better LSTM performance
		close_array = np.array(close_values, dtype=np.float32)
		min_val = np.min(close_array)
		max_val = np.max(close_array)
		
		if max_val > min_val:
			normalized_data = (close_array - min_val) / (max_val - min_val)
			print(f"LSTM: Normalized data range: {np.min(normalized_data):.4f} to {np.max(normalized_data):.4f}")
		else:
			normalized_data = close_array
			print("LSTM: No normalization applied (constant values)")
		
		# Generate 5 predictions by sliding the window
		predictions = []
		for i in range(5):
			# Take the last 'timesteps' values for each prediction
			if len(normalized_data) >= timesteps:
				sequence = normalized_data[-(timesteps + i):-i] if i > 0 else normalized_data[-timesteps:]
			else:
				# Pad with the first value if not enough data
				sequence = np.pad(normalized_data, (timesteps - len(normalized_data), 0), 
								mode='constant', constant_values=normalized_data[0])
			
			# Ensure we have exactly 'timesteps' values
			if len(sequence) > timesteps:
				sequence = sequence[-timesteps:]
			elif len(sequence) < timesteps:
				sequence = np.pad(sequence, (timesteps - len(sequence), 0), 
								mode='constant', constant_values=sequence[0])
			
			# Reshape to (1, timesteps, features)
			x = sequence.reshape(1, timesteps, features)
			print(f"LSTM: Input tensor {i+1} shape: {x.shape}, dtype: {x.dtype}")
			
			# Ensure data type is float32
			x = x.astype(np.float32)
			
			# Make prediction
			print(f"LSTM: Making prediction {i+1}...")
			prediction = lstm_model.predict(x, verbose=0)
			print(f"LSTM: Raw prediction {i+1} shape: {prediction.shape}")
			print(f"LSTM: Raw prediction {i+1} value: {prediction.flatten()}")
			
			# Denormalize the prediction back to original scale
			if max_val > min_val:
				denormalized_pred = prediction.flatten()[0] * (max_val - min_val) + min_val
			else:
				denormalized_pred = prediction.flatten()[0]
			# Ensure plain Python float
			predictions.append(float(denormalized_pred))
		
		print(f"LSTM: All predictions: {predictions}")
		return predictions
		
	except Exception as e:
		print(f"LSTM prediction error: {e}")
		import traceback
		traceback.print_exc()
		# Fallback: simple naive persistence forecast
		last = close_values[-1]
		print(f"LSTM: Using fallback prediction: {[last] * 5}")
		return [last] * 5


def predict_stock_price_hybrid(data: List[Any]):
	"""Hybrid model combining ARIMA and LSTM predictions with weighted averaging.
	ARIMA weight: 0.6 (more stable for trend)
	LSTM weight: 0.4 (better for complex patterns)
	"""
	try:
		arima_pred = predict_stock_price_arima(data)
		lstm_pred = predict_stock_price_lstm(data)
		
		print(f"Hybrid: ARIMA predictions: {arima_pred}")
		print(f"Hybrid: LSTM predictions: {lstm_pred}")
		
		# Weighted combination
		hybrid_predictions = []
		for i in range(len(arima_pred)):
			arima_val = arima_pred[i] if i < len(arima_pred) else arima_pred[-1]
			lstm_val = lstm_pred[i] if i < len(lstm_pred) else lstm_pred[-1]
			
			# Weighted average: 60% ARIMA, 40% LSTM
			hybrid_val = (0.6 * float(arima_val)) + (0.4 * float(lstm_val))
			hybrid_predictions.append(round(float(hybrid_val), 2))
		
		print(f"Hybrid: Combined predictions: {hybrid_predictions}")
		return hybrid_predictions
		
	except Exception as e:
		print(f"Hybrid prediction error: {e}")
		# Fallback to ARIMA if hybrid fails
		return predict_stock_price_arima(data)
