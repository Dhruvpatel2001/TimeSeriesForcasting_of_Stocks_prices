import yfinance as yf

def get_stock_data(symbol: str, start: str, end: str):
    stock = yf.download(symbol, start=start, end=end)
    return stock.reset_index().to_dict(orient="records")
