# app/services/offer_service.py
from app.repositories.offer_repository import OfferRepository
from app.models.offer_model import Offer # ¡CORRECTO! Importa desde offer_model.py
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient 

class OfferService:
    def __init__(self, db: AsyncIOMotorClient): 
        # Pasa la instancia de la base de datos al repositorio
        self.repository = OfferRepository(db)

    async def get_all_offers(self) -> List[Offer]:
        offers_data = await self.repository.get_all()
        # Convierte la lista de dicts de MongoDB a una lista de modelos Pydantic Offer
        return [Offer(**offer) for offer in offers_data]

    async def create_offer(self, offer: Offer) -> Offer: 
        # ¡CRÍTICO! Convierte el modelo Pydantic a un diccionario para pasarlo al repositorio
        # `by_alias=True` asegura que 'id' se convierte a '_id' en el dict
        # `exclude_unset=True` excluye campos que no fueron proporcionados (ej. 'id' si es Optional)
        offer_data_dict = offer.model_dump(by_alias=True, exclude_unset=True)
        
        # Si el campo '_id' existe en el dict (lo cual no debería para una creación,
        # pero es una buena práctica para asegurar), lo eliminamos, ya que MongoDB lo genera.
        if "_id" in offer_data_dict:
            del offer_data_dict["_id"]

        new_id = await self.repository.create(offer_data_dict)
        # Después de crear, recupera la oferta completa (con el _id generado) para devolverla como un modelo Pydantic
        created_offer_data = await self.repository.get_by_id(new_id)
        if created_offer_data:
            return Offer(**created_offer_data)
        raise Exception("Failed to retrieve created offer.") # Manejo de error si no se encuentra la oferta creada

    async def get_offer_by_id(self, offer_id: str) -> Optional[Offer]:
        offer_data = await self.repository.get_by_id(offer_id)
        if offer_data:
            return Offer(**offer_data) # Convierte el dict de MongoDB a modelo Pydantic
        return None

    async def update_offer(self, offer_id: str, offer: Offer) -> Optional[Offer]:
        # ¡CRÍTICO! Convierte el modelo Pydantic a un diccionario para la actualización
        update_data_dict = offer.model_dump(by_alias=True, exclude_unset=True)
        
        # No se debe incluir el '_id' en los datos de actualización, ya que es inmutable.
        if "_id" in update_data_dict:
            del update_data_dict["_id"]
        
        updated_offer_data = await self.repository.update(offer_id, update_data_dict)
        if updated_offer_data:
            return Offer(**updated_offer_data) # Convierte el dict de MongoDB a modelo Pydantic
        return None

    async def delete_offer(self, offer_id: str) -> bool:
        return await self.repository.delete(offer_id)