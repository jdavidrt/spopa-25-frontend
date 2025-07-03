# ss_admin_ms/app/config.py
import os
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

# MongoDB configuration
MONGO_HOST = os.getenv("MONGO_HOST", "localhost")
MONGO_PORT = int(os.getenv("MONGO_PORT", "27017"))
MONGO_DB = os.getenv("MONGO_DB", "spopa_admin")
MONGO_USERNAME = os.getenv("MONGO_USERNAME", "admin")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD", "spopapassword2025")

# Construct MongoDB connection URL
if MONGO_USERNAME and MONGO_PASSWORD:
    MONGO_URL = f"mongodb://{MONGO_USERNAME}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/{MONGO_DB}?authSource=admin"
else:
    MONGO_URL = f"mongodb://{MONGO_HOST}:{MONGO_PORT}/{MONGO_DB}"

# Global MongoDB client
_mongo_client: Optional[AsyncIOMotorClient] = None

async def get_database():
    """
    Returns a MongoDB database instance.
    Creates a new connection if one doesn't exist.
    """
    global _mongo_client
    
    if _mongo_client is None:
        try:
            _mongo_client = AsyncIOMotorClient(
                MONGO_URL,
                serverSelectionTimeoutMS=5000,
                maxPoolSize=50,
                minPoolSize=5
            )
            # Test the connection
            await _mongo_client.admin.command('ping')
            print(f"✅ Successfully connected to MongoDB at {MONGO_HOST}:{MONGO_PORT}")
        except Exception as e:
            print(f"❌ Failed to connect to MongoDB: {e}")
            raise e
    
    return _mongo_client[MONGO_DB]

def get_database_dependency():
    """
    Dependency function for FastAPI to inject database instance.
    """
    return get_database()

# Application configuration
class Settings:
    API_PORT = int(os.getenv("API_PORT", "8000"))
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001,http://localhost:8080").split(",")
    
    # Logging configuration
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    
    # API settings
    API_PREFIX = "/api"
    API_VERSION = "v1"
    
settings = Settings()