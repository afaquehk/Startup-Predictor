"""
Stock Service
Fetches stock price data (mock implementation for demo)
"""

from typing import Dict, Optional, Any
import logging
from datetime import datetime, timedelta
import random

logger = logging.getLogger(__name__)

class StockService:
    def __init__(self):
        pass
    
    def is_ready(self) -> bool:
        """Check if service is ready"""
        return True
    
    async def get_stock_data(self, ticker: str) -> Optional[Dict[str, Any]]:
        """
        Fetch stock data (mock implementation for demo)
        In production, this would use Yahoo Finance or another API
        """
        try:
            # Mock stock data for demo
            # In production, you would use yfinance or another API
            
            # Generate mock current price
            base_price = random.uniform(50, 500)
            previous_close = base_price * random.uniform(0.95, 1.05)
            current_price = base_price
            price_change = current_price - previous_close
            price_change_percent = (price_change / previous_close * 100)
            
            # Generate mock historical prices (last 30 days)
            historical_prices = []
            price = base_price
            for i in range(30):
                date = datetime.now() - timedelta(days=30-i)
                price = price * random.uniform(0.97, 1.03)
                historical_prices.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "price": round(price, 2)
                })
            
            return {
                "ticker": ticker.upper(),
                "name": f"{ticker.upper()} Inc.",
                "current_price": round(current_price, 2),
                "previous_close": round(previous_close, 2),
                "price_change": round(price_change, 2),
                "price_change_percent": round(price_change_percent, 2),
                "market_cap": int(current_price * random.uniform(1e9, 1e11)),
                "volume": int(random.uniform(1e6, 1e8)),
                "avg_volume": int(random.uniform(1e6, 1e8)),
                "day_high": round(current_price * 1.02, 2),
                "day_low": round(current_price * 0.98, 2),
                "52_week_high": round(current_price * 1.15, 2),
                "52_week_low": round(current_price * 0.85, 2),
                "pe_ratio": round(random.uniform(15, 50), 2),
                "historical_prices": historical_prices
            }
            
        except Exception as e:
            logger.error(f"Error fetching stock data for {ticker}: {str(e)}")
            return None
