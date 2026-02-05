import pandas as pd

# ---------------------
# 1️⃣ EMA - Exponential Moving Average
# ---------------------
def ema(series: pd.Series, period: int):
    return series.ewm(span=period, adjust=False).mean()

# ---------------------
# 2️⃣ RSI - Relative Strength Index
# ---------------------
def rsi(series: pd.Series, period: int = 14):
    delta = series.diff()
    gain = (delta.where(delta > 0, 0)).rolling(period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(period).mean()
    rs = gain / loss
    rsi_series = 100 - (100 / (1 + rs))
    return rsi_series

# ---------------------
# 3️⃣ MACD - Moving Average Convergence Divergence
# ---------------------
def macd(series: pd.Series):
    ema12 = ema(series, 12)
    ema26 = ema(series, 26)
    macd_line = ema12 - ema26
    signal_line = ema(macd_line, 9)
    return macd_line, signal_line

# ---------------------
# 4️⃣ Apply all indicators
# ---------------------
def apply_indicators(df: pd.DataFrame):
    df = df.copy()
    df["ema9"] = ema(df["close"], 9)
    df["ema21"] = ema(df["close"], 21)
    df["rsi"] = rsi(df["close"], 14)

    df["macd"], df["macd_signal"] = macd(df["close"])

    return df

# ---------------------
# 5️⃣ Generate Signals
# ---------------------
def generate_signal(df: pd.DataFrame):
    df = df.copy()
    signals = []

    for i in range(len(df)):
        signal = "HOLD"
        # EMA Crossover Signal
        if i > 0:
            if df["ema9"].iloc[i] > df["ema21"].iloc[i] and df["ema9"].iloc[i-1] <= df["ema21"].iloc[i-1]:
                signal = "BUY"
            elif df["ema9"].iloc[i] < df["ema21"].iloc[i] and df["ema9"].iloc[i-1] >= df["ema21"].iloc[i-1]:
                signal = "SELL"

        # RSI Overbought / Oversold
        if df["rsi"].iloc[i] > 70:
            signal = "SELL"
        elif df["rsi"].iloc[i] < 30:
            signal = "BUY"

        # MACD Crossover
        if df["macd"].iloc[i] > df["macd_signal"].iloc[i] and df["macd"].iloc[i-1] <= df["macd_signal"].iloc[i-1]:
            signal = "BUY"
        elif df["macd"].iloc[i] < df["macd_signal"].iloc[i] and df["macd"].iloc[i-1] >= df["macd_signal"].iloc[i-1]:
            signal = "SELL"

        signals.append(signal)

    df["signal"] = signals
    return df
