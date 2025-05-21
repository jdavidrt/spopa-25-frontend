from pydantic import BaseModel, Field, BeforeValidator
from typing import List, Optional, Annotated
from bson import ObjectId
from datetime import datetime

# --- Tipo Personalizado para IDs de MongoDB ---

def _convert_id_to_str(v: any) -> str:
    """Convierte un ObjectId de BSON a su representación en cadena de texto."""
    if isinstance(v, ObjectId):
        return str(v)
    return v

PyObjectId = Annotated[str, BeforeValidator(_convert_id_to_str)]


# --- Modelo Pydantic: Offer ---

class Offer(BaseModel):
    """
    Define el esquema de datos para una oferta de empleo.
    """
    id: Optional[PyObjectId] = Field(None, alias="_id")

    nombre_empresa: str
    sector_empresa: str
    correo_electronico: str
    programas_academicos_buscados: List[str]
    titulo: str
    cargo: str
    horario: str
    modalidad: str
    tipo: str
    fecha_cierre: str  # Considera usar datetime.date o datetime
    fecha_inicio: str  # Considera usar datetime.date o datetime
    vacantes: int
    ciudad: str
    descripcion: str
    perfil_aspirante: str
    observaciones: Optional[str] = None

    class Config:
        populate_by_name = True  # <-- ¡Esto es crucial! Permite que Pydantic use el alias "_id"
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str} # <-- ¡Esto también es crucial! Serializa ObjectId a string