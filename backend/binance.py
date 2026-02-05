import requests
import pandas as pd
from datetime import datetime
from cache import get_from_cache, save_to_cache

BINANCE_BASE_URL = "https://api.binance.com"
DEFAULT_INTERVAL = "5m"
LIMIT = 1000

# --- this ONLY fetches Binance API ---
def fetch_from_binance(symbol: str, interval: str = DEFAULT_INTERVAL):
    url = f"{BINANCE_BASE_URL}/api/v3/klines"
    params = {"symbol": symbol, "interval": interval, "limit": LIMIT}

    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()

    df = pd.DataFrame(data, columns=[
        "open_time", "open", "high", "low", "close", "volume",
        "close_time", "qav", "num_trades",
        "taker_base_vol", "taker_quote_vol", "ignore"
    ])
    # Convert types
    df["open_time"] = pd.to_datetime(df["open_time"], unit="ms")
    df["close"] = df["close"].astype(float)
    df["high"] = df["high"].astype(float)
    df["low"] = df["low"].astype(float)
    df["volume"] = df["volume"].astype(float)
    return df


def get_klines(symbol: str, interval: str = DEFAULT_INTERVAL):
    cache_key = f"{symbol}_{interval}"
    cached = get_from_cache(cache_key)
    if cached is not None:
        return cached

    df = fetch_from_binance(symbol, interval)  
    save_to_cache(cache_key, df)
    return df
