# Spopa

![Spopa Logo](https://i.imgur.com/tDGdNvW.png)

## Team 1E
- Juan David Ramírez Torres
- Full Name Student 2
- Full Name Student 3

## Software System

### Name
Spopa

### Description
Spopa is a distributed platform designed to connect university students with professional internship opportunities. The system allows companies to publish their internship offers and enables students to find opportunities that align with their academic and professional profiles. The platform offers advanced search functionalities, internship application processes, and selection process tracking, all built on a modern and scalable microservices architecture.

## Architectural Structures

### Component and Connector (C&C) Structure

#### C&C View

```
┌─────────────────┐      ┌───────────────────┐      ┌────────────────────┐
│                 │      │                   │      │                    │
│  Web Frontend   │<────>│  API Gateway      │<────>│  Authentication    │
│  (React.js)     │      │  (Node.js/Express)│      │  Microservice      │
│                 │      │                   │      │  (Python/Flask)    │
└─────────────────┘      └───────────────────┘      └────────────────────┘
                                  ▲                           │
                                  │                           │
                                  │                           ▼
                          ┌───────┴───────┐         ┌─────────────────────┐
                          │               │         │                     │
                          │  Service Bus  │<───────>│  Students           │
                          │  (RabbitMQ)   │         │  Microservice       │
                          │               │         │  (Node.js/Express)  │
                          └───────┬───────┘         └─────────────────────┘
                                  │                           │
                                  │                           │
                                  ▼                           ▼
                         ┌────────────────────┐     ┌──────────────────────┐
                         │                    │     │                      │
                         │  Internships       │     │  SQL Database        │
                         │  Microservice      │     │  (PostgreSQL)        │
                         │  (Python/FastAPI)  │     │  [Students]          │
                         │                    │     │                      │
                         └────────┬───────────┘     └──────────────────────┘
                                  │
                                  │
                                  ▼
                         ┌────────────────────┐
                         │                    │
                         │  NoSQL Database    │
                         │  (MongoDB)         │
                         │  [Offers]          │
                         │                    │
                         └────────────────────┘
```

#### Description of Architectural Styles Used

1. **Microservices Architecture**:
   - The system is designed following the microservices pattern, where each component has a single, well-defined responsibility.
   - Services are independent and can be deployed, updated, and scaled individually.

2. **API Gateway Pattern**:
   - An API Gateway is implemented as a single entry point for client requests.
   - The gateway manages authentication, routing, and orchestration of requests to the corresponding microservices.

3. **Event-Driven Communication**:
   - A Service Bus (RabbitMQ) is used to implement asynchronous communication between microservices.
   - This approach improves system scalability and resilience.

4. **Polyglot Persistence**:
   - PostgreSQL (relational database) is used for structured data requiring ACID transactions.
   - MongoDB (NoSQL database) is used for semi-structured data such as internship offers.

#### Description of Architectural Elements and Relations

**Presentation Components**:
- **Web Frontend (React.js)**: Responsive user interface that allows students and companies to interact with the system based on their role.

**Logic Components**:
- **API Gateway (Node.js/Express)**: Acts as a single entry point for client requests, handling routing and orchestration.
- **Authentication Microservice (Python/Flask)**: Manages user authentication, JWT token generation, and permissions.
- **Students Microservice (Node.js/Express)**: Manages student profiles, preferences, and applications.
- **Internships Microservice (Python/FastAPI)**: Manages the creation, updating, and searching of internship offers.
- **Service Bus (RabbitMQ)**: Facilitates asynchronous communication between microservices.

**Data Components**:
- **SQL Database (PostgreSQL)**: Stores data related to students, profiles, applications, and users.
- **NoSQL Database (MongoDB)**: Stores data related to internship offers, allowing efficient searches.

**Connectors**:
- **REST API**: Used for synchronous communication between the frontend, API Gateway, and microservices.
- **GraphQL API**: Implemented in the internships microservice for complex and efficient offer queries.
- **Asynchronous Messaging**: Used for communication between microservices through the Service Bus.

## Prototype

### Instructions for Deploying the System Locally

#### Prerequisites
- Docker and Docker Compose installed
- Git

#### Deployment Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/username/prakticum-connect.git
   cd prakticum-connect
   ```

2. **Build and Start the Containers**
   ```bash
   docker-compose up -d
   ```

3. **Verify the Deployment**
   ```bash
   docker-compose ps
   ```

4. **Access the Services**
   - Frontend: http://localhost:3000
   - API Gateway ADMIN: http://localhost:8000
   - API Documentation (Swagger): http://localhost:8000/docs

5. **Stop the Services**
   ```bash
   docker-compose down
   ```

### Directory Structure
```
prakticum-connect/
├── fe/                    # Frontend
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── ss_admin_ms/           # Admin Microservice
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── ss_offers_ms/          # Offers Microservice (MongoDB)
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
├── ss_process_ms/         # Process Microservice
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── ss_routes_ms/          # Routes Microservice
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
├── docker-compose.yml
└── README.md
```