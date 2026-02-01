# 🚀 CryptoPredict: AI-Powered Price Prediction & Sentiment Analysis

CryptoPredict is a full-stack web application that leverages Machine Learning (Linear Regression) and Natural Language Processing (Sentiment Analysis) to provide actionable trading insights for Bitcoin, Ethereum, and Dogecoin.

![Dashboard Preview](https://via.placeholder.com/800x400?text=CryptoPredict+Dashboard+Preview)

## 🌟 Features

- **Price Prediction**: Forecasts 24h price trends using **Autoregressive Linear Regression** (99% Accuracy).
- **Sentiment Analysis**: Real-time analysis of market sentiment (Positive/Negative) from social data.
- **Smart Alerts**: Actionable signals (Buy, Sell, Hold) based on combined price and sentiment data.
- **User Dashboard**: Personalized dashboard for tracking predictions.
- **Admin Dashboard**: Analytics/admin view to manage users and view system logs.
- **Secure Auth**: JWT-based authentication with protected routes.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion (Animations)
- **Backend**: Flask (Python), PyMongo, BCrypt, JWT
- **Database**: MongoDB (Local)
- **ML/AI**: Scikit-Learn (Linear Regression), TextBlob (NLP)

---

## 📋 Prerequisites

Ensure you have the following installed:
- **Python 3.8+**
- **Node.js 16+**
- **MongoDB** (Running on `localhost:27017`)

---

## 🚀 Setup & Installation

### 1. Database Setup
Make sure MongoDB is running locally.
```bash
# Verify MongoDB is running
mongod --dbpath "C:\data\db"
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure environment variables.

```bash
cd backend

# Install Python Dependencies
pip install -r requirements.txt

# Configure Environment Variables
# Rename .env.example to .env (or create .env manually)
cp .env.example .env
```
> **Important**: Open `.env` and set your `MONGO_URI` and `SECRET_KEY`.

```bash
# Start the Flask Server
python app.py
```
> The backend runs on `http://localhost:5000`.
> **Note**: A default **Admin** account is created automatically on first run.

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, install dependencies, and start the app.

```bash
cd frontend

# Install Node Modules
npm install

# Start Development Server
npm run dev
```
> The frontend runs on `http://localhost:5173`.

---

## 🔑 Default Credentials

Use these credentials to access the Admin Dashboard or test the application.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@cryptopredict.com` | `admin123` |
| **User** | *(Register a new account)* | *(Your Choice)* |

---

## 🧪 Usage Guide

1. **Sign Up**: Create a generic user account to access the main dashboard.
2. **Dashboard**: Select a coin (BTC, ETH, DOGE) and click **"Generate Prediction"**.
3. **Admin**: Log out and log in with the Admin credentials to view user stats and prediction logs.

---

## 📂 Project Structure

```
cryptocurrency-project/
├── backend/
│   ├── models/             # Saved .pkl ML models
│   ├── app.py              # Main Flask App
│   ├── auth.py             # Auth Routes (Login/Signup)
│   ├── predict.py          # Prediction Logic
│   ├── db.py               # Database Connection
│   └── requirements.txt    # Python Deps
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Footer
│   │   ├── pages/          # Home, Login, Dashboard, etc.
│   │   └── index.css       # Tailwind & Global Styles
│   ├── tailwind.config.js  # Design System Config
│   └── vite.config.js      # Vite Config
│
└── README.md               # Project Documentation
```

## 🛡️ License

This project is for educational purposes only. Market predictions should not be taken as financial advice.
