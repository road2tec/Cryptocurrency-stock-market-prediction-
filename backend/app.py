from flask import Flask, jsonify
from flask_cors import CORS
from db import db

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Import blueprints/routes
from auth import auth_bp
from predict import predict_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(predict_bp, url_prefix='/api')

@app.route('/')
def home():
    return jsonify({"message": "Crypto Prediction Backend is Running!"})

if __name__ == '__main__':
    from auth import create_default_admin
    create_default_admin()
    app.run(debug=True, port=5000)
