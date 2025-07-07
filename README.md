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

| Connector       | Component                           |Description                                         |
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

### Connectors

|Connector       |Description                                                          |
|----------------|---------------------------------------------------------------------|
|**HTTP**        |Standard communication protocol                                      |
|**GraphQL**     |Query communication protocol                                         |
|**REST**        |Format of HTTP(S) request that process requests using RESTful principles (GET, POST, PUT, DELETE, etc.)|
|**DB Protocol** |Low level protocol and format that varies depending on the database it communicates with.|

### Architecute Styles:

|Style  | Description|
| -------- | -------------- |
|Microservices|A distributed approach where the system is composed of small, independent services that communicate over a network and are responsible for a single business capability.|
|Client-Server Architecture| A style where clients request services and servers provide responses, separating concerns between the user interface and data processing.|
|Laeyered Architecture | A structure that organizes the system into layers, each with a distinct responsibility, typically including presentation, logic, and data access.|

### Architecture patterns:

|Pattern | Description |
| -------- | -------------- |
|Api Gateway|A centralized entry point that manages and routes client requests to the appropriate backend services, often handling cross-cutting concerns like authentication and logging.|
|Server Side Rendering | A technique where web page content is generated on the server and sent to the client, typically to improve performance and accessibility.|
|Reverse Proxy|A proxy server that sits in front of one or more services, forwarding client requests and often providing security, load balancing, and caching.|

### Layered View

![image](https://github.com/user-attachments/assets/860d21d4-31a2-4ac0-92a5-851d62e360d4)

|Layer        |Description                                                                 |Elements|
|-------------|----------------------------------------------------------------------------|-|
|Client Side  |The interface users interact with. (web or mobile app)                      |Client web browser / App|
|Presentation |Formats and displays data to the user and handles input/output interactions.|`fe`, `fe_app`, `fe_server`|
|Orchestration|Coordinates communication between services, APIs, and components.           |`process_px`, API Gateway|
|Logic        |Contains the core business rules and application behavior.                  |`ss_process_ms`, `ss_offers_ms`, `ss_admin_ms`|
|Storage      |Manages data persistence using databases or file systems.                   |`ss_process_db`, `ss_offers_db`, `ss_admin_db`|

### Deployment View

![image](https://github.com/user-attachments/assets/5b67dd1a-1d9e-47f3-94dc-16d46900d9e0)

|Container|In-Private Network?|Description|Port|
|-|-|-|-|
|`fe`           |No |Web browser user display.                  |-|
|`fe_server`    |No |Web browser content rednerer.              |3000|
|`fe_app`       |No |App user display.                          |3001|
|`process_px`   |No |Network direction divider.                 |3002|
|`api-gateway`  |Yes|Load balancer and microservice coordinator.|3010|
|`ss_process_ms`|Yes|Student accounts, information, and internship application progress logic.  |4001|
|`ss_process_db`|Yes|Student accounts, information, and internship application progress storage.|4011|
|`ss_offers_ms` |Yes|Existing internship details, contacts, status, and other details logic.    |4002|
|`ss_offers_db` |Yes|Existing internship details, contacts, status, and other details storage.  |4012|
|`ss_admin_ms`  |Yes|Administration access for the management of accounts and data. Logic.      |4003|
|`ss_admin_db`  |Yes|Administration access for the management of accounts and data. Storage.    |4013|

### Decomposition View

![image](https://github.com/user-attachments/assets/be252b97-2b74-4063-bf18-73d28f32782c)

|Function           |Elements|Description|
|-|-|-|
|User access        |User access for student, business, and administrative users.                    |Account and system access, and verification of the type of account and permissions of it.|
|Manage Offers      |Display listing and, if authorized, provide editing tools for internship offers.|See and manage, if authorized, live internship offers registered to the SPOPA system.|
|Administrator Tools|Manage registered students.                                                     |See and manage student accounts registered to the SPOPA system.|
|Student Portal     |Toolbar for the use of students during their internship application process.    |The student portal reffers to the tools exclusively thought for the student to facilitate the process of their application. This includes to track the total progress and information of their specific application, a checklist with all the necessary steps to get faculty approval, and a defined set list of approved proffessors affiliated with the University.|


## Quality Attributes

### Security
#### Scenarios
#### Scenario 1: the software system must implement the Secure Channel Pattern.
#### Scenario 2: the software system must implement the Reverse Proxy Pattern.
#### Scenario 3: the software system must implement the Network Segmentation Pattern.
#### Scenario 4: the software system must implement a pattern deffined by the team.

#### Applied patterns and tactics
Patterns:
|Pattern|Description|
|-|-|
|Secure channel|Usage of more secure communication protocols through HTTPS between components.|
|API Gateway pattern|Central point of access for security and access enforcement.|
|Reverse Proxy Net|All communications are filtered to public nets through a reverse proxy, keeping the private net isolated.|
|Authorization pattern|Differing functionalities, services and views to student, business, and administrator depending on the role.|

Tactics:
|Tactic|Description|
|-|-|
|Authentication pattern|Use of OAuth for the managing of user accounts to ensure user identity.|
|Input validation|Restrictions are applied to the worked information to avoid inadequate injections.|


### Performance and Scalability
#### Scenarios:
#### Scenario 1: the software system must implement the Load Balancer Pattern.
The project uses a load balancing pattern using the [a] algorithm within the API Gateway component of the structure, taking care of [something].

#### Scenario 2: the software system must implement a pattern deffined by the team.

#### Applied patterns and tactics

|Pattern|Description|
|-|-|
|Load Balancing Pattern|With the use of the API Gateway, as well with the slight amount of support provided by the reverse proxy, the requests that are handled within the private net are distributed as best as the components allow.|
|Bulkhead Pattern|The separation of services allows for components of the system to continue operating for certain roles in the case of maintnance or failure in any given microservice.|
|Horizontal scaling|With the division of services defined to the roles of users we expect, were it needed to contemplate a new whole role it is possible to add another branch upon the API Gateway, or to include more services for specific roles.|

|Tactic|Description|
|-|-|
|a|a|

## Testing (Analysis and Results)

## System Architecture Overview

### Architectural Styles Used

#### 1. Microservices Architecture
- The system follows the microservices pattern, where each service encapsulates a specific business domain.
- Services are independently deployable, scalable, and loosely coupled, with separate databases.

#### 2. API Gateway Pattern
- An API Gateway serves as a single entry point for mobile clients, handling routing and orchestration.
- For web clients, routing is handled by Server-Side Rendering (Next.js), which communicates directly with internal services.

#### 3. Polyglot Persistence
- The system employs different database technologies to suit varying data needs:
  - MySQL: Used by the Business Service for relational and transactional data.
  - MongoDB: Used by the Student and Admin Services for flexible, semi-structured data.

### Architectural Elements and Relations

#### Presentation Layer

- **Web Frontend (React + Next.js)**
  - Responsive user interface for students and companies.
  - Uses Server-Side Rendering for performance and SEO.
  - Auth0 is used for authentication and token handling.

- **Mobile Frontend (Flutter)**
  - Native-like experience.
  - Communicates exclusively via the API Gateway.
  - Secured using Auth0 tokens.

#### Interface / Gateway Layer

- **API Gateway (Node.js / Express)**
  - Single entry point for mobile traffic.
  - Routes and orchestrates requests to the correct microservice (Student, Business, Admin).
  - Handles token verification and basic access control.

#### Application Logic Layer (Microservices)

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

#### Data Layer

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
