from ml.data_loader import fetch_candles

def main():
    df = fetch_candles("BTCUSDT", "5m", 1000)

    print("First 5 rows:")
    print(df.head())

    print("\nLast 5 rows:")
    print(df.tail())

    print("\nTotal rows:", len(df))

    print("\nColumns:", df.columns)

if __name__ == "__main__":
    main()
