from fastapi import FastAPI, Query, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import time
import firebase_admin
from firebase_admin import credentials, firestore, auth

from binance import get_klines
from indicators import apply_indicators, generate_signal

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = FastAPI(title="Crypto Signal API", version="1.3")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def clean_for_json(df: pd.DataFrame) -> pd.DataFrame:
    df = df.replace([np.inf, -np.inf], np.nan)
    return df.where(pd.notnull(df), None)

ALL_SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT", "ADAUSDT"]
SYMBOL_LIMITS = {"1 Month": 3, "6 Months": 6, "12 Months": len(ALL_SYMBOLS)}

def allowed_symbols(plan: str):
    return ALL_SYMBOLS[:SYMBOL_LIMITS.get(plan, 0)]

# 🔥 FIXED AUTH (NO MORE 422)
def get_current_user(authorization: str | None = Header(default=None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = authorization.replace("Bearer ", "")
    try:
        decoded = auth.verify_id_token(token)
        return decoded["uid"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@app.get("/signals/{symbol}")
def get_signals(
    symbol: str,
    interval: str = Query("5m"),
    limit: int = Query(10, ge=5, le=20),
    user_id: str = Depends(get_current_user),
):
    symbol = symbol.upper()

    user_doc = db.collection("users").document(user_id).get()
    if not user_doc.exists:
        raise HTTPException(status_code=403, detail="User not found")

    plan = user_doc.to_dict().get("plan")
    if symbol not in allowed_symbols(plan):
        raise HTTPException(status_code=403, detail="Symbol not allowed")

    df = get_klines(symbol, interval).tail(limit + 30)
    df = apply_indicators(df)
    df = generate_signal(df)
    df = df.tail(limit)

    now_ms = int(time.time() * 1000)
    df["time_gap_ms"] = df["open_time"].apply(
        lambda t: int(t.timestamp() * 1000) - now_ms
    )

    df["is_current"] = df["time_gap_ms"] <= 0
    df["is_future"] = df["time_gap_ms"] > 0

    df = df.round(2)
    df = clean_for_json(df)

    return df.to_dict(orient="records")
