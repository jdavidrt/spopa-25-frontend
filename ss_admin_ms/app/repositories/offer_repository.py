# app/repositories/offer_repository.py
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from typing import List, Optional 

class OfferRepository:
    def __init__(self, db_client: AsyncIOMotorClient): 
        # db_client es la instancia de la base de datos ("job_offers_db")
        self.collection = db_client["offers"] 

    async def get_all(self) -> List[dict]:
        """Recupera todos los documentos de la colección 'offers'."""
        offers = []
        async for offer in self.collection.find():
            # Aseguramos que el diccionario retornado tenga el campo 'id'
            # y no '_id' para que el modelo Pydantic lo mapee correctamente.
            offer["id"] = str(offer["_id"])
            offers.append(offer)
        return offers

    async def create(self, offer_data: dict) -> str:
        """Inserta un nuevo documento (dict) y retorna su ID como string."""
        # offer_data ya debe ser un dict, pasado por el servicio
        result = await self.collection.insert_one(offer_data)
        return str(result.inserted_id)

    async def get_by_id(self, offer_id: str) -> Optional[dict]:
        """Recupera un documento por su ID."""
        try:
            object_id = ObjectId(offer_id)
        except Exception:
            return None # Si el ID no es un ObjectId válido

        offer = await self.collection.find_one({"_id": object_id})
        if offer:
            offer["id"] = str(offer["_id"]) # Asegura el mapeo 'id' para el modelo
            return offer
        return None

    async def update(self, offer_id: str, offer_data: dict) -> Optional[dict]:
        """Actualiza un documento por su ID y retorna el documento actualizado."""
        try:
            object_id = ObjectId(offer_id)
        except Exception:
            return None

        # Excluye el campo 'id' del diccionario de actualización porque '_id' no se puede cambiar
        update_data = {k: v for k, v in offer_data.items() if k != "id"} 
        
        result = await self.collection.update_one(
            {"_id": object_id},
            {"$set": update_data}
        )
        if result.modified_count == 1:
            # Recupera el documento actualizado para retornarlo como dict
            return await self.get_by_id(offer_id)
        return None

    async def delete(self, offer_id: str) -> bool:
        """Elimina un documento por su ID."""
        try:
            object_id = ObjectId(offer_id)
        except Exception:
            return False

        result = await self.collection.delete_one({"_id": object_id})
        return result.deleted_count == 1