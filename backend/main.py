from fastapi import FastAPI, Query, Depends, HTTPException, Header
import pandas as pd
import numpy as np

# Firebase Admin
import firebase_admin
from firebase_admin import credentials, firestore, auth

# Your existing modules
from binance import get_klines
from indicators import apply_indicators, generate_signal

# ---------------------
# Firebase Init
# ---------------------
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# ---------------------
# FastAPI App
# ---------------------
app = FastAPI(title="Crypto Signal API", version="1.0")

# ---------------------
# Helper: Convert numpy → JSON-safe
# ---------------------
def safe_float_conversion(df: pd.DataFrame) -> pd.DataFrame:
    for col in df.select_dtypes(include=[np.float64, np.float32]).columns:
        df[col] = df[col].apply(float)
    return df

# ---------------------
# All Symbols & Subscription Limits
# ---------------------
ALL_SYMBOLS = [
    "BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT",
    "XRPUSDT", "ADAUSDT", "DOGEUSDT", "AVAXUSDT"
]

SYMBOL_LIMITS = {
    "1 Month": 3,
    "6 Months": 6,
    "12 Months": len(ALL_SYMBOLS)  # all symbols
}

def allowed_symbols(plan: str):
    if plan not in SYMBOL_LIMITS:
        return []
    return ALL_SYMBOLS[:SYMBOL_LIMITS[plan]]

# ---------------------
# Auth Dependency
# ---------------------
def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.replace("Bearer ", "")
    try:
        decoded = auth.verify_id_token(token)
        return decoded["uid"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# ---------------------
# Signals API (Protected)
# ---------------------
@app.get("/signals/{symbol}")
def get_signals(
    symbol: str,
    interval: str = Query("5m", pattern="^[1-9][0-9]*[mhd]$"),
    limit: int = Query(50, ge=1, le=100),
    user_id: str = Depends(get_current_user)
):
    try:
        symbol = symbol.upper()

        # 🔐 Load user subscription from Firestore
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()

        if not user_doc.exists:
            raise HTTPException(status_code=403, detail="User not found")

        user = user_doc.to_dict()
        plan = user.get("plan")  # ✅ use plan field

        allowed = allowed_symbols(plan)

        if not allowed:
            raise HTTPException(
                status_code=403,
                detail=f"Your subscription plan is invalid or has no symbols"
            )

        if symbol not in allowed:
            raise HTTPException(
                status_code=403,
                detail=f"{symbol} not allowed for your subscription plan"
            )

        # 1️⃣ Fetch candles
        df = get_klines(symbol, interval)

        # 2️⃣ Apply indicators
        df = apply_indicators(df)

        # 3️⃣ Generate signals
        df = generate_signal(df)

        # 4️⃣ Limit candles
        df = df.tail(limit)

        # 5️⃣ Safe JSON conversion
        df = safe_float_conversion(df)

        # 6️⃣ Round values for cleaner JSON
        df = df.round({
            "close": 2,
            "ema9": 2,
            "ema21": 2,
            "rsi": 2,
            "macd": 2,
            "macd_signal": 2,
        })

        return df.to_dict(orient="records")

    except HTTPException:
        raise
    except Exception as e:
        return {"error": str(e)}
