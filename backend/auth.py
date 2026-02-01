from flask import Blueprint, request, jsonify
from db import users_collection
import bcrypt
import jwt
import datetime

import os
from dotenv import load_dotenv

load_dotenv()

auth_bp = Blueprint('auth', __name__)
SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_key_if_env_missing")

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = 'user' # Force role to be user

    if not name or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    user = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "role": role,
        "created_at": datetime.datetime.utcnow()
    }
    
    users_collection.insert_one(user)
    return jsonify({"message": "User created successfully"}), 201

def create_default_admin():
    admin_email = "admin@cryptopredict.com"
    if not users_collection.find_one({"email": admin_email}):
        hashed_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt())
        admin_user = {
            "name": "Super Admin",
            "email": admin_email,
            "password": hashed_password,
            "role": "admin",
            "created_at": datetime.datetime.utcnow()
        }
        users_collection.insert_one(admin_user)
        print(f"Default Admin Created: {admin_email} / admin123")
    else:
        print("Admin account already exists.")

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({"email": email})

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        token = jwt.encode({
            'user_id': str(user['_id']),
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")
        
        return jsonify({
            "token": token,
            "role": user['role'],
            "name": user['name']
        }), 200
    
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route('/users', methods=['GET'])
def get_users():
    # Simple admin check (in real app, use decorator)
    # For now, just return all users for the admin dashboard
    users = []
    for user in users_collection.find({}, {"_id": 0, "password": 0}):
        users.append(user)
    return jsonify(users), 200
