from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from pymongo import MongoClient
from config import Config
from models.table import TableModel
from utils.esp8266 import ESP8266Controller
from routes.auth import auth_bp
from routes.tables import init_tables_routes
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = Config.JWT_SECRET
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Initialize MongoDB
try:
    client = MongoClient(Config.MONGODB_URI)
    db = client[Config.DB_NAME]
    # Test connection
    client.server_info()
    logger.info(f"Connected to MongoDB: {Config.DB_NAME}")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {str(e)}")
    raise

# Initialize models and controllers
table_model = TableModel(db)
esp_controller = ESP8266Controller(Config.ESP8266_IP, Config.ESP8266_PORT)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(
    init_tables_routes(table_model, esp_controller, socketio), 
    url_prefix='/api'
)

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'database': 'connected',
        'esp8266_ip': Config.ESP8266_IP
    })

# Root endpoint
@app.route('/', methods=['GET'])
def root():
    return jsonify({
        'message': 'IoT Order Status System API',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/auth/login',
            'tables': '/api/tables',
            'health': '/health'
        }
    })

# Socket.IO events
@socketio.on('connect')
def handle_connect():
    logger.info('Client connected to WebSocket')

@socketio.on('disconnect')
def handle_disconnect():
    logger.info('Client disconnected from WebSocket')

@socketio.on('ping')
def handle_ping():
    socketio.emit('pong', {'timestamp': 'connected'})

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal error: {str(error)}")
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    logger.info('=' * 60)
    logger.info('Starting IoT Order Status System Backend')
    logger.info(f'MongoDB URI: {Config.MONGODB_URI}')
    logger.info(f'Database: {Config.DB_NAME}')
    logger.info(f'ESP8266 IP: {Config.ESP8266_IP}')
    logger.info('=' * 60)
    
    socketio.run(
        app, 
        host='0.0.0.0', 
        port=5000, 
        debug=True,
        allow_unsafe_werkzeug=True
    )