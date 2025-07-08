# app/database/seed_data.py
import asyncio
from datetime import datetime, timedelta
from typing import List
from app.models.offer_model import Offer
from app.services.offer_service import OfferService
from app.config import get_database_dependency
import os

class DatabaseSeeder:
    def __init__(self, offer_service: OfferService):
        self.offer_service = offer_service
        
    async def create_test_offers(self, count: int = 100) -> List[Offer]:
        """
        Generate comprehensive test data for performance testing
        """
        test_offers = []
        
        companies = [
            {"name": "TechnoSphere", "sector": "Technology", "email": "hr@technosphere.com"},
            {"name": "InnovateLabs", "sector": "Research", "email": "careers@innovatelabs.com"},
            {"name": "DataFlow Systems", "sector": "Analytics", "email": "jobs@dataflow.com"},
            {"name": "CloudNine Solutions", "sector": "Cloud Computing", "email": "talent@cloudnine.com"},
            {"name": "QuantumLeap Corp", "sector": "Quantum Computing", "email": "opportunities@quantumleap.com"}
        ]
        
        positions = [
            "Software Engineer", "Data Scientist", "DevOps Engineer", 
            "Frontend Developer", "Backend Developer", "Full Stack Developer",
            "Machine Learning Engineer", "Systems Analyst", "Quality Assurance Engineer"
        ]
        
        cities = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Bucaramanga"]
        modalities = ["Remote", "Presential", "Hybrid"]
        
        for i in range(count):
            company = companies[i % len(companies)]
            position = positions[i % len(positions)]
            city = cities[i % len(cities)]
            modality = modalities[i % len(modalities)]
            
            offer_data = Offer(
                nombre_empresa=f"{company['name']} - Division {i//10 + 1}",
                sector_empresa=company['sector'],
                correo_electronico=f"dept{i}@{company['email'].split('@')[1]}",
                programas_academicos_buscados=[
                    "Ingeniería de Sistemas y Computación",
                    "Ingeniería Electrónica",
                    "Ingeniería Industrial"
                ][:(i % 3) + 1],
                titulo=f"{position} - Level {(i % 3) + 1}",
                cargo=position,
                horario="Monday to Friday, 8:00 AM - 5:00 PM" if i % 2 == 0 else "Flexible Schedule",
                modalidad=modality,
                tipo="Full-time" if i % 3 != 0 else "Part-time",
                fecha_cierre=(datetime.now() + timedelta(days=30 + (i % 60))).strftime("%Y-%m-%d"),
                fecha_inicio=(datetime.now() + timedelta(days=60 + (i % 30))).strftime("%Y-%m-%d"),
                vacantes=(i % 5) + 1,
                ciudad=city,
                descripcion=f"""
                Exciting opportunity for {position} position in {company['name']}.
                We are looking for talented individuals to join our dynamic team.
                This position offers growth opportunities and competitive benefits.
                Position ID: TEST-{i:04d}
                """.strip(),
                perfil_aspirante=f"""
                - Engineering student in final semesters
                - Strong technical skills in relevant technologies
                - Excellent communication and teamwork abilities
                - Experience with {['Python', 'JavaScript', 'Java', 'C++'][i % 4]}
                - GPA above 4.0 preferred
                """.strip(),
                observaciones=f"Test data entry #{i} - Generated for performance testing" if i % 10 == 0 else None
            )
            
            try:
                created_offer = await self.offer_service.create_offer(offer_data)
                test_offers.append(created_offer)
                if i % 10 == 0:  # Progress indicator
                    print(f"✓ Created {i + 1}/{count} test offers...")
            except Exception as e:
                print(f"⚠ Failed to create offer {i}: {str(e)}")
                
        return test_offers
    
    async def check_existing_data(self) -> int:
        """
        Check if test data already exists
        """
        try:
            existing_offers = await self.offer_service.get_all_offers()
            return len(existing_offers)
        except Exception:
            return 0
    
    async def seed_database(self, force_reseed: bool = False) -> None:
        """
        Main seeding orchestration method
        """
        existing_count = await self.check_existing_data()
        
        if existing_count > 0 and not force_reseed:
            print(f"📊 Database already contains {existing_count} offers. Skipping seed.")
            return
            
        if force_reseed and existing_count > 0:
            print(f"🔄 Force reseed enabled. Current offers: {existing_count}")
            
        print("🌱 Seeding database with test data...")
        test_offers = await self.create_test_offers(100)
        print(f"✅ Successfully created {len(test_offers)} test offers!")
        
        # Create summary report
        print("\n📈 Seeding Summary:")
        print(f"  • Total offers created: {len(test_offers)}")
        print(f"  • Unique companies: {len(set(offer.nombre_empresa.split(' - ')[0] for offer in test_offers))}")
        print(f"  • Cities covered: {len(set(offer.ciudad for offer in test_offers))}")
        print(f"  • Modalities: {len(set(offer.modalidad for offer in test_offers))}")


async def initialize_test_data():
    """
    Standalone function for database initialization
    """
    try:
        db = await get_database_dependency()
        offer_service = OfferService(db)
        seeder = DatabaseSeeder(offer_service)
        
        # Check environment variable for seeding behavior
        should_seed = os.getenv("SEED_TEST_DATA", "true").lower() == "true"
        force_reseed = os.getenv("FORCE_RESEED", "false").lower() == "true"
        
        if should_seed:
            await seeder.seed_database(force_reseed=force_reseed)
        else:
            print("🚫 Test data seeding disabled via SEED_TEST_DATA environment variable")
            
    except Exception as e:
        print(f"❌ Error during database seeding: {str(e)}")
        # Don't fail the entire application startup due to seeding issues
        import traceback
        traceback.print_exc()