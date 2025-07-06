# Project Artifact: SPOPA, Prototype #3.


## Team 1E
## Repository link: https://github.com/jdavidrt/spopa-25-frontend/
- David Santiago Castañeda Venegas - dscastanedav@unal.edu.co
- Gian Emanuel Morales González - gimoralesg@unal.edu.co
- Juan David Ramírez Torres - jdramirezt@unal.edu.co 
- Nicolas Machado Narvaez - nmachado@unal.edu.co
- Sergio Ivan Motta Doncel - smottad@unal.edu.co


Software Architecture.
Engineering Faculty.
2025-I
National University of Colombia.

![Unal Logo](https://lh4.googleusercontent.com/proxy/WNtyuTbDjnnITJFxg1dlI63L0jfIMRf0CIKg75VavFd3ameUuokpEiXIZvafO0UbA3rGKkhjDZ2HFtRWcGiPIn7Syd37PqnCrQuXFNHguRRPYm__safRJi9Q)


---


## Software System: SPOPA
![Spopa Logo](https://i.imgur.com/tDGdNvW.png)


### Description
Spopa is a distributed platform designed to connect university students with professional internship opportunities. The system allows companies to publish their internship offers and enables students to find opportunities that align with their academic and professional profiles. The platform offers advanced search functionalities, and selection process tracking, all built on a modern and scalable microservices architecture.

## Architectural Structures

### Component and Connector View

![image](https://github.com/user-attachments/assets/2bd62e8d-d200-4293-ad45-f3858c5ce585)

### Components

| Conector        | Component                           |Description                                         |
| --------------- | ----------------------------------- |----------------------------------------------------|
| **HTTP**        | `web browser` ↔ `fe`                |Expected user contact device                        |
| **HTTP**        | `mobile app` ↔ `fe_app`             |Expected user contact device                        |
| **SSR**         | `fe` ↔ `fe_server`                  |Web front end contact with server service           |
| **GraphQL**     | `fe_app` ↔ `process_px`             |Proxy divider between public and private net        |
| **HTTP**        | `fe_server` ↔ `process_px`          |Proxy divider between public and private net        |
| **HTTP**        | `process_px` ↔ `API Gateway`        |Proxy divider between public and private net        |
| **REST**        | `API Gateway` ↔ `process_px`        |API Gateway communication with backend microservices|
| **REST**        | `API Gateway` ↔ `ss_offers_ms`      |API Gateway communication with backend microservices|
| **REST**        | `API Gateway` ↔ `ss_admin_ms`       |API Gateway communication with backend microservices|
| **MDBProtocol** | `ss_process_ms` ↔ `students_db`     |Microservice communication with it's database       |
| **MYSQLProtocol** | `ss_offers_ms` ↔ `business_db`    |Microservice communication with it's database       |
| **MDBProtocol** | `ss_admin_ms` ↔ `admin_db`          |Microservice communication with it's database       |

###Connectors

|Conector        |Description|
|----------------|-|
|**HTTP**        |Standard communication protocol|
|**GraphQL**     |Query communication protocol|
|**REST**        |Format of HTTP(S) request that process requests using RESTful principles (GET, POST, PUT, DELETE, etc.)|
|**DB Protocol** |Low level protocol and format that varies depending on the database it communicates with.|

#### Architecute Styles:

|Style  | Description|
| -------- | -------------- |
|Microservices|A distributed approach where the system is composed of small, independent services that communicate over a network and are responsible for a single business capability.|
|Client-Server Architecture| A style where clients request services and servers provide responses, separating concerns between the user interface and data processing.|
|Laeyered Architecture | A structure that organizes the system into layers, each with a distinct responsibility, typically including presentation, logic, and data access.|

#### Architecture patterns:

|Pattern | Description |
| -------- | -------------- |
|Api Gateway|A centralized entry point that manages and routes client requests to the appropriate backend services, often handling cross-cutting concerns like authentication and logging.|
|Server Side Rendering | A technique where web page content is generated on the server and sent to the client, typically to improve performance and accessibility.|
|Reverse Proxy|A proxy server that sits in front of one or more services, forwarding client requests and often providing security, load balancing, and caching.|

#### Layered View

![image](https://github.com/user-attachments/assets/f4ccb9ad-6663-42ef-a9ed-7fbc4d869ad2)

#### Deployment View

```
+-----------------------------+
|         User Device        |
| (Browser / Mobile App)     |
|                             |
| - Web Frontend (React)      |
| - Mobile App (Flutter)      |
+-------------┬---------------+
              |
              ▼
+------------------------------------------+
|              Public Network              |
+-------------------┬----------------------+
                    |
     ┌──────────────▼────────────────┐
     │         fe_server             │
     │ (Hosting Next.js SSR App)     │
     └──────────────┬────────────────┘
                    ▼
     +----------------------------------+
     |      Internal Network/API Zone   |
     +---------------┬------------------+
                     ▼
   ┌─────────────────────────────────────────────┐
   │               API Gateway Node              │
   │      (Routing Mobile traffic to services)   │
   │      PORT:3002                              │
   └─────────────────┬───────────────────────────┘
                     │
         ┌───────────▼───────────┬────────────┬
         ▼                       ▼            ▼            
+------------------+   +----------------+  +----------------+  
| ss_process_ms    |   | ss_offers_ms   |  | ss_admin_ms    |
| (Node.js)        |   | (Laravel)      |  | (Python)       |
| PORT: 4000       |   | PORT: 8010     |  | PORT:8000       |
+--------┬---------+   +-------┬--------+  +--------┬--------+
         ▼                     ▼                   ▼
+------------------+   +---------------+   +------------------+
| process_ms       |   | MySQL DB      |   | MongoDB DB       |
| (NGINX)          |   | [Business]    |   | [Admin]          |
| PORT: 8080       |   | PORT: 3307    |   | PORT:27017       |
+--------┬---------+   +-------┬-------+   +--------┬---------+
         ▼                     ▼                   ▼
+------------------+   +---------------+   +------------------+
| MongoDB DB       |   | Broker        |   | Broker           |
| [Students]       |   | (Queueing)    |   | (Queueing)       |
| PORT: 5432       |   | PORT: 5673    |   | PORT: 5678       |
+------------------+   +---------------+   +------------------+

```
#### Decomposition View

```
System: Learning Platform (High-Level Decomposition)
─────────────────────────────────────────────────────

1. Web Frontend (React + Auth0)
   ├─ UI Components (Forms, Dashboards, Course Views)
   ├─ Auth Module (via Auth0 SDK)
   └─ API Client (talks to Next.js SSR endpoints)

2. Mobile Frontend (Flutter)
   ├─ Cross-platform UI Widgets
   ├─ Auth Module (via Auth0)
   └─ API Client (via API Gateway)

3. Server-Side Rendering (Next.js)
   ├─ Routing & Middleware
   ├─ SSR Pages & Components
   ├─ Session Management
   └─ Service Connector Layer
        ├─ Connects to Student Service
        ├─ Connects to Business Service
        └─ Connects to Admin Service

4. Student Service (Node.js)
   ├─ API Routes (REST)
   ├─ NGINX Proxy Integration
   ├─ Student Logic (enrollment, profiles, etc.)
   └─ MongoDB Handler (data access)

5. Business Service (Laravel)
   ├─ Controller Layer (REST endpoints)
   ├─ Business Logic (billing, course packages)
   ├─ Database Models (MySQL ORM/Eloquent)
   └─ Broker Publisher (event-based messages)

6. Admin Service (Python)
   ├─ REST API (e.g., Flask / FastAPI)
   ├─ Admin Operations Logic (reporting, moderation)
   ├─ MongoDB ORM Layer
   └─ Broker Publisher (async tasks/events)

7. Brokers
   ├─ Queues for async processing
   └─ Receives events from Business/Admin services

8. Databases
   ├─ MongoDB [Students, Admin]
   └─ MySQL [Business Data]
```

# System Architecture Overview

## Architectural Styles Used

### 1. Microservices Architecture
- The system follows the microservices pattern, where each service encapsulates a specific business domain.
- Services are independently deployable, scalable, and loosely coupled, with separate databases.

### 2. API Gateway Pattern
- An API Gateway serves as a single entry point for mobile clients, handling routing and orchestration.
- For web clients, routing is handled by Server-Side Rendering (Next.js), which communicates directly with internal services.

### 3. Polyglot Persistence
- The system employs different database technologies to suit varying data needs:
  - MySQL: Used by the Business Service for relational and transactional data.
  - MongoDB: Used by the Student and Admin Services for flexible, semi-structured data.

## Architectural Elements and Relations

### Presentation Layer

- **Web Frontend (React + Next.js)**
  - Responsive user interface for students and companies.
  - Uses Server-Side Rendering for performance and SEO.
  - Auth0 is used for authentication and token handling.

- **Mobile Frontend (Flutter)**
  - Native-like experience.
  - Communicates exclusively via the API Gateway.
  - Secured using Auth0 tokens.

### Interface / Gateway Layer

- **API Gateway (Node.js / Express)**
  - Single entry point for mobile traffic.
  - Routes and orchestrates requests to the correct microservice (Student, Business, Admin).
  - Handles token verification and basic access control.

### Application Logic Layer (Microservices)

- **Student Service (Node.js)**
  - Manages student profiles, preferences, and applications.
  - Exposes REST endpoints.
  - Deployed behind an NGINX Proxy.
  - Persists data in MongoDB.

- **Business Service (Laravel / PHP)**
  - Manages internship offers (create, update, search, delete).
  - Uses MySQL for structured data.
  - Publishes events to a Broker for async workflows.

- **Admin Service (Python)**
  - Handles admin features: user moderation, data curation, reporting.
  - Uses MongoDB and communicates via a Broker for event-driven tasks.

### Data Layer

- **MongoDB [Students]**
  - Stores student-related data (profiles, applications).

- **MySQL [Business]**
  - Stores relational data for internship offers and companies.

- **MongoDB [Admin]**
  - Stores admin metadata, logs, and system-level settings.

- **Brokers (Queue/Message Bus)**
  - Used by the Business and Admin Services.
  - Enables asynchronous communication and background processing.


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
   
3. **Build and Start Administrator Service**
   ```bash
   docker-compose up --build -d
   ```
   
4. **Verify the Deployment**
   ```bash
   docker-compose ps
   ```

5. **Access the Services**
   - Frontend: http://localhost:3000
   - API Gateway ADMIN: http://localhost:8000
   - API Documentation (Swagger): http://localhost:8000/docs

To build and run the Docker image, run `exec.sh`, or `exec.ps1` on Windows.

### Run your tests

```bash
npm run build
```
