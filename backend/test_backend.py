#!/usr/bin/env python3
"""
Simple test script to verify backend functionality
"""
import requests
import time

def test_backend():
    base_url = "http://localhost:8000"
    
    print("Testing backend connectivity...")
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        print(f"Health check: {response.status_code} - {response.json()}")
    except requests.exceptions.ConnectionError:
        print("❌ Backend server is not running!")
        print("Please start the backend with: python main.py")
        return False
    
    # Test root endpoint
    try:
        response = requests.get(f"{base_url}/")
        print(f"Root endpoint: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
        return False
    
    # Test stock prediction endpoint
    try:
        response = requests.get(f"{base_url}/stock/predict/AAPL")
        print(f"Stock prediction: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Prediction successful!")
            print(f"   Symbol: {data.get('symbol')}")
            print(f"   ARIMA predictions: {len(data.get('arima_prediction', []))}")
            print(f"   LSTM predictions: {len(data.get('lstm_prediction', []))}")
            print(f"   Hybrid predictions: {len(data.get('hybrid_prediction', []))}")
            print(f"   Actual prices: {len(data.get('actual_prices', []))}")
        else:
            print(f"❌ Prediction failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Stock prediction error: {e}")
        return False
    
    print("✅ All tests passed! Backend is working correctly.")
    return True

if __name__ == "__main__":
    test_backend()
