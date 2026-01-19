from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from app.config import get_settings

settings = get_settings()

# Async MongoDB client for FastAPI
client = AsyncIOMotorClient(settings.mongodb_url)
database = client.iot_order_system
table_collection = database.tables

# Sync MongoDB client for initialization
def init_db():
    sync_client = MongoClient(settings.mongodb_url)
    db = sync_client.iot_order_system
    
    # Create indexes
    db.tables.create_index("tableName", unique=True)
    
    print("Database initialized successfully")
    sync_client.close()