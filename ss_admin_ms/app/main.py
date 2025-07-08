# app/main.py - Complete corrected version
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers import offer_controller
import os
import asyncio

# Import the seeding function
from app.database.seed_data import initialize_test_data

app = FastAPI(
    title="SPOPA Admin Backend",
    description="API for managing internship offers with automated test data seeding",
    version="1.0.0",
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "https://localhost:3443",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(offer_controller.router, prefix="/api", tags=["Offers"])

@app.on_event("startup")
async def startup_event():
    """
    Application startup tasks
    """
    print("🚀 Starting SPOPA Admin Service...")
    
    # Initialize test data if in development/testing environment
    environment = os.getenv("ENVIRONMENT", "development")
    print(f"📋 Environment: {environment}")
    
    if environment in ["development", "testing"]:
        print("🌱 Initializing test data for development environment...")
        try:
            await initialize_test_data()
        except Exception as e:
            print(f"❌ Error during seeding: {e}")
            import traceback
            traceback.print_exc()
    else:
        print("🏭 Production environment detected. Skipping test data seeding.")

@app.get("/", summary="API Health Check")
async def root():
    return {
        "message": "SPOPA Admin API is running",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "test_data_enabled": os.getenv("SEED_TEST_DATA", "true")
    }

@app.get("/api/seed", summary="Manual Database Seeding")
async def manual_seed():
    """
    Endpoint to manually trigger database seeding
    """
    try:
        await initialize_test_data()
        return {"message": "Database seeding completed successfully"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": f"Seeding failed: {str(e)}"}

@app.on_event("shutdown")
async def shutdown_db_client():
    from app.config import _mongo_client
    if _mongo_client:
        _mongo_client.close()
        print("🔌 MongoDB connection closed")