from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Database Connection
# Connect to local MongoDB
client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))

# Select database
db = client["crypto_app"]

# Collections
users_collection = db["users"]
predictions_collection = db["predictions"]

print("Connected to MongoDB: crypto_app")
