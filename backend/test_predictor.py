from ml.ml_predictor import predict_next_price

pred = predict_next_price(symbol="BTCUSDT", interval="5m")
print("Next predicted price for BTCUSDT:", pred)