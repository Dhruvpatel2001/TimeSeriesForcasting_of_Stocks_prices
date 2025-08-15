import yfinance as yf
from typing import List, Dict, Any
import math


def get_stock_data(symbol: str, start: str, end: str) -> List[Dict[str, Any]]:
	try:
		stock = yf.download(symbol, start=start, end=end, progress=False)
		if stock is None or stock.empty:
			return []
		
		# Handle multi-level columns from yfinance
		stock = stock.reset_index()
		
		# Convert to records and handle the multi-level column structure
		records = stock.to_dict(orient="records")
		
		# Filter out rows without a numeric Close
		cleaned: List[Dict[str, Any]] = []
		for row in records:
			# Try different possible Close column names
			close = None
			if 'Close' in row:
				close = row['Close']
			elif ('Close', symbol) in row:
				close = row[('Close', symbol)]
			elif ('Close', symbol.upper()) in row:
				close = row[('Close', symbol.upper())]
			
			if isinstance(close, (int, float)) and not (isinstance(close, float) and math.isnan(close)):
				# Create a clean record with just the essential data
				clean_row = {
					'Close': float(close),
					'Date': str(row.get(('Date', ''), row.get('Date', 'Unknown')))
				}
				cleaned.append(clean_row)
		
		return cleaned
	except Exception as e:
		print(f"Error in get_stock_data: {e}")
		# On any error, return empty list so callers can degrade gracefully
		return []
