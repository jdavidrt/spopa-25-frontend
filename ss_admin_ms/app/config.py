# app/config.py
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
from typing import Optional

_mongo_client: Optional[AsyncIOMotorClient] = None
_db = None

async def get_mongo_client():
    global _mongo_client
    if _mongo_client is None:
        # Cambiar de "mongodb://mongo:27017" a "mongodb://admin_db:27017"
        mongo_url = os.getenv("MONGODB_URL", "mongodb://admin_db:27017")
        
        max_retries = 10
        retry_delay_seconds = 2
        for i in range(max_retries):
            try:
                _mongo_client = AsyncIOMotorClient(mongo_url)
                await _mongo_client.admin.command('ping')
                print(f"Conexión a MongoDB exitosa en: {mongo_url}")
                break
            except Exception as e:
                print(f"Intento {i+1}/{max_retries}: Falló la conexión a MongoDB. Reintentando en {retry_delay_seconds} segundos... Error: {e}")
                await asyncio.sleep(retry_delay_seconds)
        if _mongo_client is None:
            raise ConnectionError("No se pudo conectar a MongoDB después de varios reintentos.")
    return _mongo_client

async def get_database():
    global _db
    if _db is None:
        client = await get_mongo_client()
        _db = client["job_offers_db"]
    return _db

async def get_database_dependency():
    return await get_database()


