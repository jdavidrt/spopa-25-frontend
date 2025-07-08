"""
Performance Testing Script for SS Admin Microservice
Laboratory 4 - Performance and Scalability Testing

This script tests the main CRUD operations of the offers API
to measure response times and identify system limitations.
"""

from locust import HttpUser, task, between
import json
import random

class AdminMicroserviceUser(HttpUser):
    """
    Simulates user behavior for the Admin Microservice.
    Tests the main functionality: listing, creating, updating, and deleting offers.
    """
    
    # Wait time between requests (simulates user think time)
    wait_time = between(1, 3)
    
    def on_start(self):
        """
        Called when a user starts. Sets up test data.
        """
        self.offer_ids = []
        self.test_offer_data = {
            "nombre_empresa": f"Test Company {random.randint(1000, 9999)}",
            "sector_empresa": "Technology",
            "correo_electronico": f"test{random.randint(100, 999)}@testcompany.com",
            "programas_academicos_buscados": ["Computer Science", "Systems Engineering"],
            "titulo": f"Test Internship Position {random.randint(1, 100)}",
            "cargo": "Software Developer Intern",
            "horario": "9:00 AM - 5:00 PM",
            "modalidad": "Remote",
            "tipo": "Full-time",
            "fecha_cierre": "2025-12-31",
            "fecha_inicio": "2025-08-01",
            "vacantes": random.randint(1, 5),
            "ciudad": "Bogota",
            "descripcion": "Test internship description for performance testing purposes.",
            "perfil_aspirante": "Computer Science or Systems Engineering student",
            "observaciones": "This is a test offer for performance evaluation"
        }

    @task(4)  # Weight: 40% of requests
    def get_all_offers(self):
        """
        Test endpoint: GET /api/offers
        Most frequent operation - listing all offers
        """
        with self.client.get("/api/offers", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed to get offers: {response.status_code}")

    @task(2)  # Weight: 20% of requests
    def create_offer(self):
        """
        Test endpoint: POST /api/offers
        Creates a new offer and stores ID for later operations
        """
        headers = {"Content-Type": "application/json"}
        
        with self.client.post(
            "/api/offers", 
            data=json.dumps(self.test_offer_data),
            headers=headers,
            catch_response=True
        ) as response:
            if response.status_code == 201:
                try:
                    offer_data = response.json()
                    if "id" in offer_data:
                        self.offer_ids.append(offer_data["id"])
                    response.success()
                except json.JSONDecodeError:
                    response.failure("Invalid JSON response")
            else:
                response.failure(f"Failed to create offer: {response.status_code}")

    @task(1)  # Weight: 10% of requests
    def get_specific_offer(self):
        """
        Test endpoint: GET /api/offers/{id}
        Gets a specific offer if we have created any
        """
        if self.offer_ids:
            offer_id = random.choice(self.offer_ids)
            with self.client.get(f"/api/offers/{offer_id}", catch_response=True) as response:
                if response.status_code == 200:
                    response.success()
                elif response.status_code == 404:
                    # Remove from our list if it doesn't exist
                    if offer_id in self.offer_ids:
                        self.offer_ids.remove(offer_id)
                    response.success()  # 404 is expected behavior
                else:
                    response.failure(f"Failed to get offer: {response.status_code}")

    @task(1)  # Weight: 10% of requests  
    def update_offer(self):
        """
        Test endpoint: PUT /api/offers/{id}
        Updates an existing offer if available
        """
        if self.offer_ids:
            offer_id = random.choice(self.offer_ids)
            updated_data = self.test_offer_data.copy()
            updated_data["titulo"] = f"Updated Test Position {random.randint(1, 100)}"
            
            headers = {"Content-Type": "application/json"}
            
            with self.client.put(
                f"/api/offers/{offer_id}",
                data=json.dumps(updated_data),
                headers=headers,
                catch_response=True
            ) as response:
                if response.status_code == 200:
                    response.success()
                elif response.status_code == 404:
                    # Remove from our list if it doesn't exist
                    if offer_id in self.offer_ids:
                        self.offer_ids.remove(offer_id)
                    response.success()  # 404 is expected behavior
                else:
                    response.failure(f"Failed to update offer: {response.status_code}")

    @task(1)  # Weight: 10% of requests
    def delete_offer(self):
        """
        Test endpoint: DELETE /api/offers/{id}
        Deletes an offer if available (cleanup operation)
        """
        if self.offer_ids:
            offer_id = self.offer_ids.pop()  # Remove from list when deleting
            
            with self.client.delete(f"/api/offers/{offer_id}", catch_response=True) as response:
                if response.status_code == 204:
                    response.success()
                elif response.status_code == 404:
                    response.success()  # Already deleted is fine
                else:
                    response.failure(f"Failed to delete offer: {response.status_code}")

    @task(1)  # Weight: 10% of requests
    def health_check(self):
        """
        Test endpoint: GET /
        Basic health check to ensure service is responsive
        """
        with self.client.get("/", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Health check failed: {response.status_code}")


class AdminHeavyUser(AdminMicroserviceUser):
    """
    Heavy user simulation for stress testing.
    Performs more intensive operations.
    """
    wait_time = between(0.5, 1.5)  # Faster requests
    
    @task(6)  # More frequent GET requests
    def get_all_offers(self):
        super().get_all_offers()


# Performance Test Scenarios
class LightLoadUser(AdminMicroserviceUser):
    """Light load simulation - normal user behavior"""
    wait_time = between(2, 5)


class MediumLoadUser(AdminMicroserviceUser):
    """Medium load simulation - active user behavior"""
    wait_time = between(1, 3)


class HeavyLoadUser(AdminMicroserviceUser):
    """Heavy load simulation - intensive user behavior"""
    wait_time = between(0.5, 2)