import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    DB_NAME = os.getenv('DB_NAME', 'iot_order_system')
    CHEF_USERNAME = os.getenv('CHEF_USERNAME', 'chef')
    CHEF_PASSWORD = os.getenv('CHEF_PASSWORD', 'chef123')
    JWT_SECRET = os.getenv('JWT_SECRET', 'your_secret_key')
    ESP8266_IP = os.getenv('ESP8266_IP', '192.168.1.100')
    ESP8266_PORT = 80