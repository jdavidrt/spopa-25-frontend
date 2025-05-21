from fastapi import FastAPI # Importa la clase principal de FastAPI
from fastapi.middleware.cors import CORSMiddleware # ¡Importación crucial para permitir la comunicación con el frontend!
from app.controllers import offer_controller # Importa el router de ofertas desde el módulo de controladores

# Crea la instancia de la aplicación FastAPI.
# Este es el punto de entrada principal para tu API.
app = FastAPI(
    title="Backfront de Admin", # Título para la documentación de la API (Swagger UI)
    description="Una API para gestionar el back del componenete de admin.", # Descripción para la documentación
    version="1.0.0", # Versión de la API
)

# --- Configuración CORS (Cross-Origin Resource Sharing) ---
# Esta configuración es esencial para permitir que el frontend (ej. React en localhost:3000)
# pueda hacer solicitudes a el backend (FastAPI en localhost:8000).
# Sin esto, el navegador bloquearía las solicitudes por seguridad.
origins = [
    "http://localhost:3000",  # Permite solicitudes desde  frontend React
    # Si el frontend se despliega en otro dominio o puerto, toca añádirlo aquí:
    # "http://otro-dominio.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Lista de orígenes permitidos
    allow_credentials=True,         # Permite cookies de origen cruzado
    allow_methods=["*"],            # Permite todos los métodos HTTP (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],            # Permite todos los encabezados HTTP
)
# --- Fin Configuración CORS ---

# Incluye el router de ofertas en la aplicación FastAPI.
# - 'prefix="/api"': Todas las rutas definidas en 'offer_controller' tendrán el prefijo '/api'.
#                    Ej. '/offers' se convierte en '/api/offers'.
# - 'tags=["Offers"]': Agrupa las operaciones relacionadas con ofertas en la documentación (Swagger UI).
app.include_router(offer_controller.router, prefix="/api", tags=["Offers"])

@app.get("/", summary="Punto de entrada de la API")
async def root():
    """
    Endpoint raíz de la API.
    Retorna un mensaje de bienvenida.
    """
    return {"message": "Back API para administradores."}

# Define un evento que se ejecuta cuando la aplicación FastAPI se cierra (shutdown).
@app.on_event("shutdown")
async def shutdown_db_client():
    """
    Cierra la conexión con la base de datos MongoDB cuando la aplicación se apaga.
    """
    # Importa _mongo_client directamente desde app.config para acceder a la instancia global del cliente.
    from app.config import _mongo_client
    if _mongo_client:
        _mongo_client.close() # Cierra la conexión del cliente de MongoDB
        print("Conexión a MongoDB cerrada.")