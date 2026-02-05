from binance import get_klines

df = get_klines("BTCUSDT")
print(df.tail())
