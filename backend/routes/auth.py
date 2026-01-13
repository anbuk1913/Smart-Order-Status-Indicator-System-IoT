from flask import Blueprint, request, jsonify
from config import Config
import jwt
from datetime import datetime, timedelta
from functools import wraps

auth_bp = Blueprint('auth', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, Config.JWT_SECRET, algorithms=['HS256'])
            request.user = data
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid'}), 401
        
        return f(*args, **kwargs)
    
    return decorated

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data:
        return jsonify({'success': False, 'error': 'No data provided'}), 400
    
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'success': False, 'error': 'Username and password required'}), 400
    
    if username == Config.CHEF_USERNAME and password == Config.CHEF_PASSWORD:
        token = jwt.encode({
            'username': username,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, Config.JWT_SECRET, algorithm='HS256')
        
        return jsonify({
            'success': True,
            'token': token,
            'username': username
        })
    
    return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

@auth_bp.route('/verify', methods=['GET'])
@token_required
def verify():
    return jsonify({
        'success': True, 
        'message': 'Token is valid',
        'user': request.user
    })