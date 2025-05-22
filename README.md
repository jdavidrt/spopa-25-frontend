# Project Artifact: SPOPA, Prototype #1.


## Team 1E
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

### Component and Connector (C&C) Structure

#### C&C View

```
                             ┌────────────────────┐
                             │                    │
                             │      User          │
                             │                    │
                             └─────────┬──────────┘
                                       │
                                       ▼
                          ┌──────────────────────────┐
                          │                          │
                          │    Web Frontend (React)  │
                          │    + Auth UI (Auth0)     │
                          │                          │
                          └─────────┬──────────┬─────┘
                                    │          │
                     ┌──────────────┘          │
                     ▼                         │             
         ┌─────────────────────────┐           │   
         │                         │           │  
         │  Authentication (Auth0) │           │ 
         │                         │           │  
         └─────────────────────────┘           │   
                                               │  
                                               │     
               ┌──────────────────────┬─────────────────────┐
               ▼                      ▼                     ▼                       
   ┌────────────────────┐  ┌──────────────────────┐  ┌────────────────────┐
   │                    │  │                      │  │                    │
   │  Student Service   │  │ Business Service     │  │  Admin Service     │
   │  (Node.js)         │  │ (Laravel)            │  │  (Python)          │
   └─────────┬──────────┘  └─────────┬────────────┘  └──────────┬─────────┘ 
             │                       │                          │
             ▼                       ▼                          ▼
   ┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐
   │                    │   │                    │   │                    │
   │  MongoDB Database  │   │   MySQL Database   │   │  MongoDB Database  │
   │  [Students]        │   │   [Business Data]  │   │  [Admin Data]      │
   │                    │   │                    │   │                    │
   └────────────────────┘   └────────────────────┘   └────────────────────┘

```

#### Description of Architectural Styles Used

1. **Microservices Architecture**:
   - The system is designed following the microservices pattern, where each component has a single, well-defined responsibility.
   - Services are independent and can be deployed, updated, and scaled individually.

2. **API Gateway Pattern**:
   - An API Gateway is implemented as a single entry point for client requests.
   - The gateway manages authentication, routing, and orchestration of requests to the corresponding microservices.

4. **Polyglot Persistence**:
   - MySQL (relational database) is used for structured data requiring ACID transactions.
   - MongoDB (NoSQL database) is used for semi-structured data such as internship offers.

#### Description of Architectural Elements and Relations

**Presentation Components**:
- **Web Frontend (React.js)**: Responsive user interface that allows students and companies to interact with the system based on their role.

**Logic Components**:
- **API Gateway (Node.js/Express)**: Acts as a single entry point for client requests, handling routing and orchestration.
- **Authentication Microservice (Auth0)**: Manages user authentication, JWT token generation, and permissions.
- **Students Microservice (Node.js)**: Manages student profiles, preferences, and applications.
- **Business Microservice (Laravel)**: Manages the creation, updating, and searching of internship offers.
- **Administration Microservice (Python)**: Manages the creation, updating, and searching of internship offers/Users.

**Data Components**:
- **SQL Database (PostgreSQL)**: Stores data related to students, profiles, applications, and users.
- **NoSQL Database (MongoDB)**: Stores data related to internship offers, allowing efficient searches.

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

## Frequently Asked Questions

If you're having issues running the sample applications, including issues such as users not being authenticated on page refresh, please [check the auth0-react FAQ](https://github.com/auth0/auth0-react/blob/master/FAQ.md).

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple sources](https://auth0.com/docs/identityproviders), either social identity providers such as **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce** (amongst others), or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS, or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://auth0.com/docs/connections/database/custom-db)**.
* Add support for **[linking different user accounts](https://auth0.com/docs/users/user-account-linking)** with the same user.
* Support for generating signed [JSON Web Tokens](https://auth0.com/docs/tokens/json-web-tokens) to call your APIs and **flow the user identity** securely.
* Analytics of how, when, and where users are logging in.
* Pull data from other sources and add it to the user profile through [JavaScript rules](https://auth0.com/docs/rules).

## Create a Free Auth0 Account

1. Go to [Auth0](https://auth0.com) and click **Sign Up**.
2. Use Google, GitHub, or Microsoft Account to login.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/responsible-disclosure-policy) details the procedure for disclosing security issues.

## Author

[Auth0](https://auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](../LICENSE) file for more info.
