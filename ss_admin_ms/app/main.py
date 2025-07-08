from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers import offer_controller
import uvicorn
import ssl
import os

# Crea la instancia de la aplicación FastAPI
app = FastAPI(
    title="Backfront de Admin",
    description="Una API para gestionar el back del componente de admin.",
    version="1.0.0",
)

# Configuración CORS
origins = [
    "http://localhost:3000",
    "https://localhost:3443",
    "http://localhost:3001",
    "https://localhost:3001",
    "http://localhost:3010",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluye el router de ofertas
app.include_router(offer_controller.router, prefix="/api", tags=["Offers"])

@app.get("/", summary="Punto de entrada de la API")
async def root():
    return {"message": "Back API para administradores."}

@app.on_event("shutdown")
async def shutdown_db_client():
    from app.config import _mongo_client
    if _mongo_client:
        _mongo_client.close()
        print("Conexión a MongoDB cerrada.")

if __name__ == "__main__":
    # Configuración para desarrollo local con HTTPS
    ssl_context = None
    
    # Intentar cargar certificados SSL si existen
    if os.path.exists("/app/ssl/cert.pem") and os.path.exists("/app/ssl/key.pem"):
        ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
        ssl_context.load_cert_chain("/app/ssl/cert.pem", "/app/ssl/key.pem")
        print("🔒 SSL certificates loaded - HTTPS enabled")
    else:
        print("⚠️ No SSL certificates found - HTTP only")
    
    # Ejecutar servidor
    if ssl_context:
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8443,
            ssl_context=ssl_context,
            reload=True
        )
    else:
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True
        )