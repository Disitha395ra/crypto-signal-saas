from fastapi import FastAPI, Query
from binance import get_klines
from indicators import apply_indicators, generate_signal
import pandas as pd
import numpy as np

app = FastAPI(title="Crypto Signal API", version="1.0")

# ---------------------
# Helper: convert numpy floats to JSON-safe Python floats
# ---------------------
def safe_float_conversion(df: pd.DataFrame) -> pd.DataFrame:
    for col in df.select_dtypes(include=[np.float64, np.float32]).columns:
        df[col] = df[col].apply(float)
    return df

# ---------------------
# Route: Get trading signals for a symbol
# ---------------------
@app.get("/signals/{symbol}")
def get_signals(
    symbol: str,
    interval: str = Query("5m", pattern="^[1-9][0-9]*[mhd]$"),  # 1m, 5m, 15m, 1h, 1d
    limit: int = Query(50, ge=1, le=100)
):
    try:
        # 1️⃣ Fetch candles
        df = get_klines(symbol.upper(), interval)

        # 2️⃣ Apply indicators
        df = apply_indicators(df)

        # 3️⃣ Generate signals
        df = generate_signal(df)

        # 4️⃣ Only last 'limit' candles
        df = df.tail(limit)

        # 5️⃣ Convert floats to JSON-safe
        df = safe_float_conversion(df)

        # 6️⃣ Optional: round values for cleaner JSON
        df = df.round({
            "close": 2,
            "ema9": 2,
            "ema21": 2,
            "rsi": 2,
            "macd": 2,
            "macd_signal": 2,
        })

        # 7️⃣ Return as JSON
        return df.to_dict(orient="records")

    except Exception as e:
        return {"error": str(e)}
