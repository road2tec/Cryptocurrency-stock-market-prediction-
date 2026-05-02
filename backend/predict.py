from flask import Blueprint, request, jsonify
from db import predictions_collection
import joblib
import numpy as np
import datetime
import os
import requests
import pandas as pd
from textblob import TextBlob
from dotenv import load_dotenv
from email_utils import send_alert_email

load_dotenv()

predict_bp = Blueprint('predict', __name__)

# --- Configuration ---
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models')
API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")

COIN_SYMBOL_MAP = {
    'Bitcoin': 'BTC',
    'Ethereum': 'ETH',
    'Dogecoin': 'DOGE'
}

COIN_FILE_MAP = {
    'Bitcoin': 'bitcoin',
    'Ethereum': 'ethereum',
    'Dogecoin': 'dogecoin'
}

# --- Artifact Loading ---
def load_artifacts(coin_key):
    try:
        model = joblib.load(os.path.join(MODEL_PATH, f'{coin_key}_linear_model.pkl'))
        scaler_X = joblib.load(os.path.join(MODEL_PATH, f'{coin_key}_scaler_X.pkl'))
        scaler_y = joblib.load(os.path.join(MODEL_PATH, f'{coin_key}_scaler_y.pkl'))
        last_state = joblib.load(os.path.join(MODEL_PATH, f'{coin_key}_last_state.pkl'))
        return model, scaler_X, scaler_y, last_state
    except FileNotFoundError:
        return None, None, None, None

# --- Live Data Fetching (Alpha Vantage) ---
def fetch_live_data(symbol):
    """
    Fetches Daily Digital Currency Data from Alpha Vantage.
    Returns the last computed state (Close, SMA_7, SMA_30) if successful.
    """
    if not API_KEY:
        print("Error: No API Key found.")
        return None

    url = f'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol={symbol}&market=USD&apikey={API_KEY}'
    
    try:
        response = requests.get(url)
        data = response.json()
        
        # Check for errors or rate limits
        if "Error Message" in data or "Note" in data:
            print(f"Alpha Vantage Error: {data}")
            return None
            
        time_series = data.get('Time Series (Digital Currency Daily)', {})
        if not time_series:
            return None

        # Process Data into DataFrame
        df_data = []
        for date_str, values in time_series.items():
            # Handle potential key variations just in case
            close_price = values.get('4a. close (USD)') or values.get('4. close')
            
            if close_price:
                df_data.append({
                    'Date': date_str,
                    'Close': float(close_price)
                })
        
        df = pd.DataFrame(df_data)
        df['Date'] = pd.to_datetime(df['Date'])
        df = df.sort_values(by='Date') # Ascending order needed for rolling window calculation
        
        # Calculate Technical Indicators (Same logic as training script)
        df['SMA_7'] = df['Close'].rolling(window=7).mean()
        df['SMA_30'] = df['Close'].rolling(window=30).mean()
        
        # Helper for RSI
        def calculate_rsi(data, window=14):
            delta = data.diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
            rs = gain / loss
            return 100 - (100 / (1 + rs))
            
        df['RSI'] = calculate_rsi(df['Close'])
        
        # Get the LAST row (Most recent complete data)
        # We need: Prev_Close, Prev_SMA_7, Prev_SMA_30
        # Wait, the model was trained on T-1 data predicting T.
        # To predict Tomorrow (T+1), we feed it Today's (T) data.
        
        last_row = df.iloc[-1]
        
        # Format: [Prev_Close, Prev_SMA_7, Prev_SMA_30] - Wait, check training script features!
        # Training script features: ['Prev_Close', 'Prev_SMA_7', 'Prev_SMA_30']
        # Where Prev_Close = Shift(1).
        # So to predict T, we used T-1.
        
        # NOW: We want to predict TOMORROW.
        # So we use TODAY's Close/SMA as the input.
        
        live_state = np.array([[
            last_row['Close'],
            last_row['SMA_7'], 
            last_row['SMA_30']
        ]])
        
        # Check for NaNs (e.g. if history < 30 days)
        if np.isnan(live_state).any():
            return None
            
        return live_state

    except Exception as e:
        print(f"Exception fetching live data: {e}")
        return None

# --- Sentiment & Alert Logic ---
def get_sentiment(text):
    analysis = TextBlob(str(text))
    if analysis.sentiment.polarity > 0:
        return "Positive"
    return "Negative"

def generate_market_alert(predicted_price, current_price, sentiment):
    price_change = predicted_price - current_price
    
    if price_change > 0 and sentiment == "Positive":
        return "STRONG BUY: Bullish Trend Confirmed"
    elif price_change < 0 and sentiment == "Negative":
        return "STRONG SELL: Bearish Trend Detected"
    elif price_change > 0:
        return "BUY: Technicals Positive (Caution)"
    else:
        return "HOLD: Market Conditions Weak"

def get_mock_tweets(coin):
    tweets = {
        'Bitcoin': "Bitcoin holding separate support levels, institutional interest high.",
        'Ethereum': "Ethereum L2 solutions are driving lower fees and higher adoption.",
        'Dogecoin': "Dogecoin community is active, but price action is sideways."
    }
    return tweets.get(coin, "Crypto market analysis.")

# --- API Routes ---

@predict_bp.route('/predict', methods=['POST'])
def predict():
    data = request.json
    coin = data.get('coin')
    
    if coin not in COIN_FILE_MAP:
        return jsonify({"error": "Coin not supported"}), 400

    file_prefix = COIN_FILE_MAP[coin]
    symbol = COIN_SYMBOL_MAP[coin]
    
    # Load Models
    model, scaler_X, scaler_y, fallback_state = load_artifacts(file_prefix)

    if not model:
        return jsonify({"error": "Model artifacts not found."}), 500

    # 1. Try to fetch LIVE data
    input_features = fetch_live_data(symbol)
    data_source = "Live API (Alpha Vantage)"
    
    # 2. Fallback if API fails
    if input_features is None:
        print(f"Warning: Using fallback cached data for {coin}")
        input_features = fallback_state.reshape(1, -1)
        data_source = "Cached (Fallback)"

    # 3. Predict
    # Scale Input
    try:
        input_scaled = scaler_X.transform(input_features)
        
        # Predict
        predicted_scaled = model.predict(input_scaled)
        
        # Inverse Scale Output
        predicted_price = scaler_y.inverse_transform(predicted_scaled)[0][0]
        
        # Current Price Reference (from input features)
        current_price = input_features[0][0]
        
        # Sentiment & Alert
        tweet_text = get_mock_tweets(coin)
        sentiment = get_sentiment(tweet_text)
        alert = generate_market_alert(predicted_price, current_price, sentiment)
        
        result = {
            "coin": coin,
            "predicted_price": round(float(predicted_price), 2),
            "current_reference_price": round(float(current_price), 2),
            "sentiment": sentiment,
            "alert": alert,
            "date": datetime.datetime.utcnow(),
            "source": data_source
        }
        
        # Save to DB
        predictions_collection.insert_one(result)
        result['_id'] = str(result['_id'])

        # Send Email Alert if user email is provided
        user_email = data.get('email')
        if user_email:
            send_alert_email(user_email, coin, alert, round(float(predicted_price), 2))
        
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@predict_bp.route('/history', methods=['GET'])
def get_history():
    history = []
    for item in predictions_collection.find().sort("date", -1).limit(10):
        item['_id'] = str(item['_id'])
        history.append(item)
    return jsonify(history), 200
