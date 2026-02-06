import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from ml.data_loader import fetch_candles

# 1️⃣ Load Data
df = fetch_candles(symbol="BTCUSDT", interval="5m", limit=1000)
prices = df[["close"]].values  # Only closing price

# 2️⃣ Normalize
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_prices = scaler.fit_transform(prices)

# 3️⃣ Create sequences
SEQUENCE_LENGTH = 60
X, y = [], []
for i in range(SEQUENCE_LENGTH, len(scaled_prices)):
    X.append(scaled_prices[i-SEQUENCE_LENGTH:i])
    y.append(scaled_prices[i])

X, y = np.array(X), np.array(y)

# 4️⃣ Train-test split
split = int(0.8 * len(X))
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

# 5️⃣ Build LSTM model
model = Sequential()
model.add(LSTM(50, return_sequences=True, input_shape=(X_train.shape[1], 1)))
model.add(LSTM(50))
model.add(Dense(1))
model.compile(optimizer="adam", loss="mean_squared_error")

# 6️⃣ Train model
model.fit(X_train, y_train, epochs=5, batch_size=32, validation_data=(X_test, y_test))

# 7️⃣ Predict next price
last_sequence = scaled_prices[-SEQUENCE_LENGTH:]
last_sequence = last_sequence.reshape(1, SEQUENCE_LENGTH, 1)
predicted_scaled = model.predict(last_sequence)
predicted_price = scaler.inverse_transform(predicted_scaled)
print("Next predicted close price:", predicted_price[0][0])
