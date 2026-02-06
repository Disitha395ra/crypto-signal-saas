import requests
import pandas as pd

BINANCE_URL = "https://api.binance.com/api/v3/klines"

def fetch_candles(symbol: str, interval: str = "5m", limit: int = 1000) -> pd.DataFrame:
    """
    Fetch last `limit` candles from Binance and return as DataFrame
    """

    params = {
        "symbol": symbol,
        "interval": interval,
        "limit": limit
    }

    response = requests.get(BINANCE_URL, params=params, timeout=10)
    response.raise_for_status()

    data = response.json()

    # Convert to DataFrame
    df = pd.DataFrame(data, columns=[
        "open_time",
        "open",
        "high",
        "low",
        "close",
        "volume",
        "close_time",
        "quote_asset_volume",
        "number_of_trades",
        "taker_buy_base_volume",
        "taker_buy_quote_volume",
        "ignore"
    ])

    # Keep only what we need
    df = df[["open_time", "open", "high", "low", "close", "volume"]]

    # Convert types
    df["open_time"] = pd.to_datetime(df["open_time"], unit="ms")
    df[["open", "high", "low", "close", "volume"]] = df[
        ["open", "high", "low", "close", "volume"]
    ].astype(float)

    return df
