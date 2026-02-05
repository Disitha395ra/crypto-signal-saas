from binance import get_klines
from indicators import apply_indicators, generate_signal

# Get last 100 BTC candles
df = get_klines("BTCUSDT")

# Calculate indicators
df = apply_indicators(df)

# Generate trading signals
df = generate_signal(df)

# Show last 5 candles with signals
print(df[["open_time", "close", "ema9", "ema21", "rsi", "macd", "macd_signal", "signal"]].tail())
