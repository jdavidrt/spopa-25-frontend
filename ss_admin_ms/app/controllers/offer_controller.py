# app/controllers/offer_controller.py
from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from app.services.offer_service import OfferService
from app.models.offer_model import Offer # ¡CORRECTO! Importa desde offer_model.py
from app.config import get_database_dependency # Importa la dependencia de la base de datos
from motor.motor_asyncio import AsyncIOMotorClient # Importa para el tipo hint

router = APIRouter()

# Esta función de dependencia inyecta la base de datos y la usa para instanciar OfferService.
async def get_offer_service_dependency(db: AsyncIOMotorClient = Depends(get_database_dependency)):
    return OfferService(db)

@router.get("/offers", response_model=List[Offer], summary="Recupera todas las ofertas")
async def get_all_offers(offer_service: OfferService = Depends(get_offer_service_dependency)):
    """
    Recupera una lista de todas las ofertas de empleo disponibles.
    """
    return await offer_service.get_all_offers()

@router.post("/offers", response_model=Offer, status_code=status.HTTP_201_CREATED)
async def create_offer(offer: Offer, offer_service: OfferService = Depends(get_offer_service_dependency)):
    print("📥 Solicitud recibida para crear oferta:", offer)
    """
    Crea una nueva oferta de empleo en la base de datos.
    Retorna el objeto Offer creado con su ID generado por MongoDB.
    """
    return await offer_service.create_offer(offer)


@router.get("/offers/{offer_id}", response_model=Offer, summary="Recupera una oferta por ID")
async def get_offer_by_id(offer_id: str, offer_service: OfferService = Depends(get_offer_service_dependency)):
    """
    Recupera una oferta de empleo específica por su ID.
    Retorna la oferta si se encuentra, o un 404 si no existe.
    """
    offer = await offer_service.get_offer_by_id(offer_id)
    if offer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Oferta no encontrada")
    return offer

@router.put("/offers/{offer_id}", response_model=Offer, summary="Actualiza una oferta existente")
async def update_offer(
    offer_id: str, 
    offer: Offer, 
    offer_service: OfferService = Depends(get_offer_service_dependency)
):
    """
    Actualiza una oferta de empleo existente en la base de datos.
    Retorna el objeto Offer actualizado, o un 404 si la oferta no existe.
    """
    updated_offer = await offer_service.update_offer(offer_id, offer)
    if updated_offer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Oferta no encontrada")
    return updated_offer

@router.delete("/offers/{offer_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Elimina una oferta")
async def delete_offer(offer_id: str, offer_service: OfferService = Depends(get_offer_service_dependency)):
    """
    Elimina una oferta de empleo de la base de datos.
    Retorna un estado 204 No Content si la eliminación es exitosa.
    """
    deleted = await offer_service.delete_offer(offer_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Oferta no encontrada")
    return