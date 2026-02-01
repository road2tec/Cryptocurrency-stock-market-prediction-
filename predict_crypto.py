import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Create directories
if not os.path.exists('models'):
    os.makedirs('models')
if not os.path.exists('backend/models'):
    os.makedirs('backend/models')

# --- Helper Functions ---

def calculate_rsi(data, window=14):
    delta = data.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

def calculate_sma(data, window):
    return data.rolling(window=window).mean()

# --- Main Processing Function ---

def process_coin_prediction(file_path, coin_name, model_save_path, scaler_save_path, last_data_save_path):
    print(f"\n--- Processing {coin_name} ---")
    
    # 1. Load Data
    df = pd.read_csv(file_path)
    df['Date'] = pd.to_datetime(df['Date'])
    df = df.sort_values(by='Date')
    
    # 2. Feature Engineering (Autoregressive)
    # Target: Close(t)
    # Features: Close(t-1), SMA_7(t-1), RSI(t-1)
    
    # Calculate indicators first
    df['RSI'] = calculate_rsi(df['Close'])
    df['SMA_7'] = calculate_sma(df['Close'], 7)
    df['SMA_30'] = calculate_sma(df['Close'], 30)
    
    # Create Lag Features (Shift forward by 1 so row T contains T-1 data)
    df['Prev_Close'] = df['Close'].shift(1)
    df['Prev_RSI'] = df['RSI'].shift(1)
    df['Prev_SMA_7'] = df['SMA_7'].shift(1)
    df['Prev_SMA_30'] = df['SMA_30'].shift(1)
    
    # Drop NaNs (first 30 rows + 1 shift)
    df = df.dropna()
    
    # Define Features (X) and Target (y)
    feature_cols = ['Prev_Close', 'Prev_SMA_7', 'Prev_SMA_30']
    X = df[feature_cols].values
    y = df[['Close']].values
    
    # 3. Scaling
    # Use separate scalers
    scaler_X = MinMaxScaler(feature_range=(0, 1))
    X_scaled = scaler_X.fit_transform(X)
    
    scaler_y = MinMaxScaler(feature_range=(0, 1))
    y_scaled = scaler_y.fit_transform(y)
    
    # 4. Train/Test Split (Time Series Split)
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_scaled, test_size=0.2, shuffle=False)
    
    # 5. Model Training: Linear Regression (Ridge for stability)
    # This excels at "Next Day" prediction because Close(t) ~= Close(t-1)
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    # 6. Evaluation
    predictions = model.predict(X_test)
    
    # Metrics
    mae = mean_absolute_error(y_test, predictions)
    rmse = np.sqrt(mean_squared_error(y_test, predictions))
    r2 = r2_score(y_test, predictions)
    accuracy = r2 * 100
    
    print(f"{coin_name} MAE: {mae:.6f}")
    print(f"{coin_name} RMSE: {rmse:.6f}")
    print(f"{coin_name} Model Confidence (R2): {accuracy:.2f}%")
    
    # 7. Saving Artifacts
    joblib.dump(model, model_save_path)
    joblib.dump(scaler_X, scaler_save_path.replace('.pkl', '_X.pkl'))
    joblib.dump(scaler_y, scaler_save_path.replace('.pkl', '_y.pkl'))
    
    # Save the LAST actual data (values from the last row's T)
    # This will be used as "Prev_*" input to predict TOMORROW (T+1)
    # Features X are already "Prev" relative to y, so we need the *latest known* Close/SMA to be the "Prev" for the future.
    # The last row of DATA (Close, SMA) becomes the input for the prediction.
    last_row_raw = df[['Close', 'SMA_7', 'SMA_30']].iloc[-1].values.reshape(1, -1)
    # Note: We must scale this using scaler_X before predicting!
    # But joblib saves the raw features? Or scaled? 
    # Let's save the SCALED features of the last row used in training (X[-1])
    # No, that X[-1] was "Prev" for y[-1].
    # To predict y[future], we need current Close, SMA.
    # So we save `last_row_raw` and let backend scale it using `scaler_X`.
    joblib.dump(last_row_raw, last_data_save_path)
    
    print(f"Saved artifacts for {coin_name}")

    # 8. Plotting
    if not os.path.exists('graphs'):
        os.makedirs('graphs')
        
    plt.figure(figsize=(12, 6))
    plt.plot(y_test, label='Actual Price', color='#2563eb', linewidth=2)
    plt.plot(predictions, label='Predicted Price', color='#ef4444', linestyle='--', linewidth=1.5)
    plt.title(f'{coin_name} Price Prediction (Accuracy: {accuracy:.2f}%)', fontsize=14, fontweight='bold')
    plt.xlabel('Time Steps', fontsize=12)
    plt.ylabel('Normalized Price', fontsize=12)
    plt.legend(loc='upper left')
    plt.grid(True, alpha=0.1)
    plt.style.use('seaborn-v0_8-whitegrid')
    
    graph_path = f'graphs/{coin_name}_prediction.png'
    plt.savefig(graph_path, dpi=300)
    plt.close()
    print(f"Graph saved to {graph_path}")

# --- Execution Block ---

coin_files = {
    'Bitcoin': 'data/coin_Bitcoin.csv',
    'Ethereum': 'data/coin_Ethereum.csv',
    'Dogecoin': 'data/coin_Dogecoin.csv'
}

for coin, path in coin_files.items():
    if os.path.exists(path):
        process_coin_prediction(
            path, 
            coin, 
            f'backend/models/{coin.lower()}_linear_model.pkl',
            f'backend/models/{coin.lower()}_scaler.pkl',
            f'backend/models/{coin.lower()}_last_state.pkl'
        )
    else:
        print(f"Data for {coin} not found!")

print("\nTraining Complete. Models upgraded to Autoregressive Linear Regression.")
