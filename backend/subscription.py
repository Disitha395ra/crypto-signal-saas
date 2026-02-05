SYMBOL_LIMITS = {
    "1 Month": 3,
    "6 Months": 6,
    "12 Months": float("inf"),
}

ALL_SYMBOLS = [
    "BTCUSDT",
    "ETHUSDT",
    "BNBUSDT",
    "SOLUSDT",
    "XRPUSDT",
    "ADAUSDT",
    "DOGEUSDT",
    "AVAXUSDT",
]

def allowed_symbols(plan: str):
    limit = SYMBOL_LIMITS.get(plan, 0)
    return ALL_SYMBOLS[:limit]
