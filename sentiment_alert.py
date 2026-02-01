import pandas as pd
from textblob import TextBlob

# Step 1: Load the bitcoin_tweets.csv file using pandas
# Note: Based on file check, the file is named 'tweets.csv' in the data folder
# but the user requested 'data/bitcoin_tweets.csv'. I will use the available 'data/tweets.csv'.
file_path = 'data/tweets.csv'

print(f"Loading dataset from: {file_path}...")
df = pd.read_csv(file_path)

# Step 2: Identify the column that contains tweet text
# The column name is 'text' as confirmed by viewing the file
text_column = 'text'

# Step 3 & 4: Use TextBlob to analyze sentiment and classify it
def get_sentiment(text):
    # Ensure text is a string
    text = str(text)
    # Create a TextBlob object
    analysis = TextBlob(text)
    # Get polarity: > 0 is Positive, <= 0 is Negative (as per requirements)
    if analysis.sentiment.polarity > 0:
        return "Positive"
    else:
        return "Negative"

# Apply the sentiment analysis to a small sample for demonstration
print("\n--- Analyzing Sample Tweets ---")
sample_df = df.head(10).copy()
sample_df['Sentiment'] = sample_df[text_column].apply(get_sentiment)

# Step 5: Print sample tweets with their detected sentiment
for index, row in sample_df.iterrows():
    print(f"\nTweet: {row[text_column][:100]}...") # Print first 100 chars
    print(f"Sentiment: {row['Sentiment']}")

# Step 7: Create an alert function using price_change and sentiment logic
def generate_market_alert(price_change, sentiment):
    """
    Logic:
    - If price_change < 0 AND sentiment is Negative: "HIGH RISK: Market may fall"
    - If price_change > 0 AND sentiment is Positive: "GOOD TIME TO INVEST"
    - Otherwise: "HOLD: Market condition uncertain"
    """
    if price_change < 0 and sentiment == "Negative":
        return "HIGH RISK: Market may fall"
    elif price_change > 0 and sentiment == "Positive":
        return "GOOD TIME TO INVEST"
    else:
        return "HOLD: Market condition uncertain"

# Step 8: Demonstrate the alert system
print("\n--- Alert System Demonstration ---")

# Sample values
sample_tweet = "Bitcoin is reaching new heights! Amazing growth! 🚀"
sample_price_change = 0.05 # 5% increase (Positive)

# Analyze sample tweet sentiment
detected_sentiment = get_sentiment(sample_tweet)
alert_message = generate_market_alert(sample_price_change, detected_sentiment)

print(f"Sample Tweet: {sample_tweet}")
print(f"Detected Sentiment: {detected_sentiment}")
print(f"Predicted Price Change: {sample_price_change}")
print(f"Final Alert: {alert_message}")

# Another example: Negative scenario
neg_tweet = "The market is crashing, sell everything now!"
neg_price_change = -0.02 # 2% decrease (Negative)

neg_sentiment = get_sentiment(neg_tweet)
neg_alert = generate_market_alert(neg_price_change, neg_sentiment)

print(f"\nSample Tweet: {neg_tweet}")
print(f"Detected Sentiment: {neg_sentiment}")
print(f"Predicted Price Change: {neg_price_change}")
print(f"Final Alert: {neg_alert}")

# Step 9 & 10: Simple comments explaining each step added above (already done).
