# ss_admin_ms/app/main.py
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.controllers import offer_controller
from app.config import settings, get_database

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create FastAPI application instance
app = FastAPI(
    title="SPOPA Admin Service",
    description="Administrative API for SPOPA Student Practices Management System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add trusted host middleware for security
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure appropriately for production
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count", "X-Service"]
)

# Include API routers
app.include_router(
    offer_controller.router, 
    prefix=settings.API_PREFIX, 
    tags=["Offers"]
)

@app.get("/", summary="Service health check")
async def root():
    """
    Root endpoint that provides basic service information.
    """
    return {
        "service": "SPOPA Admin Service",
        "version": "1.0.0",
        "status": "operational",
        "api_docs": "/docs"
    }

@app.get("/health", summary="Detailed health check")
async def health_check():
    """
    Health check endpoint for monitoring and container orchestration.
    """
    try:
        # Test database connection
        db = await get_database()
        await db.command("ping")
        db_status = "healthy"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        db_status = "unhealthy"
    
    return {
        "status": "healthy" if db_status == "healthy" else "unhealthy",
        "service": "SPOPA Admin Service",
        "version": "1.0.0",
        "database": db_status,
        "environment": {
            "debug": settings.DEBUG,
            "mongo_host": settings.MONGO_HOST if hasattr(settings, 'MONGO_HOST') else "localhost"
        }
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    """
    Initialize database connection on application startup.
    """
    try:
        await get_database()
        logger.info("✅ Admin service started successfully")
    except Exception as e:
        logger.error(f"❌ Failed to start admin service: {e}")
        raise e

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """
    Clean up resources on application shutdown.
    """
    from app.config import _mongo_client
    if _mongo_client:
        _mongo_client.close()
        logger.info("📴 MongoDB connection closed")
    logger.info("🛑 Admin service shutdown complete")