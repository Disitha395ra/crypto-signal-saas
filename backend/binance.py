import requests
import pandas as pd
import datetime import datetime


BINANCE_BASE_URL = "https://api.binance.com"
DEFAULT_INTERVAL = "5m"
LIMIT = 1000

def fetch_klines(symbol:str, interval:str=DEFAULT_INTERVAL):
    url = f"{BINANCE_BASE_URL}/api/v3/klines"
    params = {
        "symbol": symbol,
        "interval": interval,
        "limit": LIMIT
    }
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()

    data = response.json()`

    df = pd.DataFrame(data, columns=[
        "open_time", "open", "high", "low", "close", "volume",
        "close_time", "quote_asset_volume", "number_of_trades",
        "taker_buy_base_asset_volume", "taker_buy_quote_asset_volume", "ignore"
    ])

    df["open_time"] = pd.to_datetime(df["open_time"], unit='ms')
    df["close_time"] = pd.to_datetime(df["close_time"], unit='ms')
    df["close"] = df["close"].astype(float)
    df["high"] = df["high"].astype(float)
    df["low"] = df["low"].astype(float)
    df["volume"] = df["volume"].astype(float)

    return df