# 🚀 TeamTask Backend API

**TeamTask** is a robust, modular, and scalable RESTful API built with **Node.js, Express.js, MongoDB, and Mongoose** for collaborative task and project management. Designed with production-style clean architecture, request validation, authentication, authorization, rate limiting, and automated security scanning workflows.

---

## 🛠️ Tech Stack & Architecture

- **Runtime Environment**: Node.js (v18+)
- **Web Framework**: Express.js
- **Database & ODM**: MongoDB & Mongoose
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **Security**: Helmet, CORS, Express Rate Limit
- **Request Validation**: Express-Validator
- **CI/CD Security Scanning**: GitHub Actions (SonarQube & Trivy)

---

## 🌲 Git Branching Strategy

Our repository strictly follows a 3-branch strategy with **no `main` branch**:
- `dev` - Primary integration branch for active development.
- `stage` - Staging branch for pre-production QA testing.
- `prod` - Production-ready release branch.

### Feature Workflow:
1. All feature work is isolated in dedicated feature branches created off `dev` (e.g., `feature/auth`, `feature/projects`, `feature/tasks-and-invitations`, `feature/security-and-ci`).
2. Completed features are committed within their feature branch and merged back into `dev`.

---

## 📁 Project Structure

```
.
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── .github/
│   └── workflows/
│       └── ci-cd-scan.yml     # SonarQube & Trivy scanning pipeline
└── src/
    ├── app.js                 # Express application initialization
    ├── server.js              # Server entry point & DB connection
    ├── config/
    │   ├── db.js              # MongoDB database connector
    │   └── env.js             # Centralized environment configurations
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── project.controller.js
    │   ├── task.controller.js
    │   ├── invitation.controller.js
    │   └── health.controller.js
    ├── middlewares/
    │   ├── auth.middleware.js        # JWT authentication check
    │   ├── projectAuth.middleware.js # Project membership & role checks
    │   ├── error.middleware.js       # Centralized error handler
    │   ├── validate.middleware.js    # Express-validator error handler
    │   └── rateLimiter.middleware.js # Brute-force protection
    ├── models/
    │   ├── user.model.js
    │   ├── project.model.js
    │   ├── task.model.js
    │   └── invitation.model.js
    ├── routes/
    │   ├── index.js                  # Master router aggregator
    │   ├── auth.routes.js
    │   ├── project.routes.js
    │   ├── task.routes.js
    │   ├── invitation.routes.js
    │   └── health.routes.js
    ├── services/
    │   ├── auth.service.js
    │   ├── project.service.js
    │   ├── task.service.js
    │   └── invitation.service.js
    ├── utils/
    │   ├── apiError.js
    │   ├── apiResponse.js
    │   ├── asyncWrapper.js
    │   └── jwt.js
    └── validators/
        ├── auth.validator.js
        ├── project.validator.js
        ├── task.validator.js
        └── invitation.validator.js
```

---

## ⚙️ Environment Variables (`.env.example`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Application server port | `5000` |
| `NODE_ENV` | Environment mode (`development`/`production`/`test`) | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/teamtask_db` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `super_secret_jwt_key_teamtask_2026` |
| `JWT_EXPIRES_IN` | JWT expiration duration | `7d` |
| `CORS_ORIGIN` | Allowed client origins for CORS | `http://localhost:3000` |

---

## 🚀 Setup & Local Running Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB server running locally or via MongoDB Atlas connection URI

### 2. Installation
```bash
git clone <repository_url>
cd freelancing
npm install
```

### 3. Environment Configuration
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

### 4. Running the Backend
- **Development Mode** (with nodemon auto-reloading):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

The API server will run at `http://localhost:5000/api`.

---

## 📖 API Documentation & Endpoints

### 🩺 Health Check Endpoint
- **`GET /api/health`**
  - **Auth Required**: No
  - **Description**: Returns backend API server & MongoDB connection health status.
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "TeamTask API is running smoothly",
      "data": {
        "status": "UP",
        "timestamp": "2026-10-01T11:00:00.000Z",
        "uptime": 12.34,
        "database": "connected"
      }
    }
    ```

---

### 🔐 Authentication Endpoints

#### 1. `POST /api/auth/register`
- **Auth Required**: No (Rate limited)
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securePassword123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "651a2b3c4d5e6f7a8b9c0d1e",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user",
        "avatar": "",
        "createdAt": "2026-10-01T11:00:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    }
  }
  ```

#### 2. `POST /api/auth/login`
- **Auth Required**: No (Rate limited)
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "securePassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User logged in successfully",
    "data": {
      "user": {
        "id": "651a2b3c4d5e6f7a8b9c0d1e",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    }
  }
  ```

#### 3. `GET /api/auth/me`
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User profile retrieved successfully",
    "data": {
      "user": {
        "_id": "651a2b3c4d5e6f7a8b9c0d1e",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user",
        "avatar": ""
      }
    }
  }
  ```

---

### 📂 Project Endpoints

#### 1. `POST /api/projects`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "name": "E-Commerce Revamp",
    "description": "Redesigning checkout flow and product recommendation engine"
  }
  ```
- **Response (201 Created)**

#### 2. `GET /api/projects`
- **Auth Required**: Yes
- **Description**: Retrieves all projects where current user is owner or member.

#### 3. `GET /api/projects/:id`
- **Auth Required**: Yes (Must be member or owner of project)

#### 4. `PUT /api/projects/:id`
- **Auth Required**: Yes (Must be owner or admin of project)
- **Request Body**:
  ```json
  {
    "name": "E-Commerce Platform v2",
    "status": "active"
  }
  ```

#### 5. `DELETE /api/projects/:id`
- **Auth Required**: Yes (Must be owner of project)

#### 6. `POST /api/projects/:id/members`
- **Auth Required**: Yes (Owner or Admin)
- **Request Body**:
  ```json
  {
    "userId": "651a99994d5e6f7a8b9c0d99",
    "role": "member"
  }
  ```

---

### 📋 Task Endpoints

#### 1. `POST /api/projects/:projectId/tasks`
- **Auth Required**: Yes (Must be project member)
- **Request Body**:
  ```json
  {
    "title": "Design Database Schema",
    "description": "Create ER diagrams for users, projects, and tasks",
    "priority": "high",
    "status": "todo",
    "assignedTo": "651a2b3c4d5e6f7a8b9c0d1e",
    "dueDate": "2026-10-15T00:00:00.000Z"
  }
  ```

#### 2. `GET /api/projects/:projectId/tasks`
- **Auth Required**: Yes (Must be project member)
- **Query Filters**: `?status=todo&priority=high&search=schema`

#### 3. `GET /api/tasks/:id`
- **Auth Required**: Yes (Must be project member)

#### 4. `PUT /api/tasks/:id`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "status": "in_progress",
    "priority": "urgent"
  }
  ```

#### 5. `DELETE /api/tasks/:id`
- **Auth Required**: Yes

---

### ✉️ Invitation Endpoints

- **`POST /api/projects/:projectId/invitations`** (Owner/Admin creates member invitation token)
- **`GET /api/projects/:projectId/invitations`** (View pending project invitations)
- **`POST /api/invitations/accept/:token`** (Authenticated user accepts invitation)
- **`POST /api/invitations/reject/:token`** (Reject invitation token)

---

## 🔍 Security Scanning (Trivy & SonarQube)

This codebase is configured with GitHub Actions (`.github/workflows/ci-cd-scan.yml`) to automatically perform static analysis & vulnerability scanning:
- **SonarQube**: Detects code smells, security hotspots, duplication, and coverage.
- **Trivy**: Scans node package dependencies and filesystem for CVEs.

---

## 🎨 Consistent API Response Format

#### Success Format:
```json
{
  "success": true,
  "message": "Resource operating message",
  "data": { ... }
}
```

#### Error Format:
```json
{
  "success": false,
  "message": "Error description message",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```
