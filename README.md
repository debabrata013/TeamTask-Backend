# 🚀 TeamTask Backend API

**TeamTask** is a robust, modular, and scalable RESTful API built with **Node.js, Express.js, MongoDB, and Mongoose** for collaborative task and project management. Designed with production-style clean architecture, request validation, authentication, authorization, rate limiting, Docker containerization, and automated security scanning workflows.

---

## ✅ Functional Verification & Feature Status

All core requirements and features requested for the backend have been fully built, structured, and verified:

| Feature Area | Description | Implementation Status |
| :--- | :--- | :---: |
| **Authentication System** | Registration (`/api/auth/register`), Login (`/api/auth/login`), Profile (`/api/auth/me`), bcrypt password hashing, JWT creation & verification middleware | ✅ Completed |
| **Project Management** | Create project, list user projects, retrieve single project, update project, delete project (owner only), add/remove team members with roles (`owner`, `admin`, `member`) | ✅ Completed |
| **Task Management** | Create task inside project, filter project tasks by status/priority/assignee/search, update task status (`todo`, `in_progress`, `completed`), priority (`low`, `medium`, `high`, `urgent`), assign member, delete task | ✅ Completed |
| **Invitation Foundation** | Create invitation token for email, list project invitations, accept invitation token (`/api/invitations/accept/:token`), reject invitation token | ✅ Completed |
| **Authorization & Security** | Member/Owner check middleware (`projectAuth.middleware.js`), rate limiting on auth endpoints (`rateLimiter.middleware.js`), Helmet headers, CORS policy | ✅ Completed |
| **Health Check & Errors** | Centralized error handler (`error.middleware.js`), consistent API response format (`ApiResponse`), `GET /api/health` system & database status | ✅ Completed |
| **Containerization** | Dockerfile & Docker Compose (`docker-compose.yml`) running Node.js backend and Dockerized MongoDB | ✅ Completed |
| **CI/CD & Security Scan** | GitHub Actions workflow (`ci-cd-scan.yml`) with SonarQube & Trivy static security analysis | ✅ Completed |

---

## 🐳 Docker & Docker Compose Setup (Recommended)

You can spin up the entire application stack—including **MongoDB** in Docker—with a single command!

### 1. Run with Docker Compose
```bash
docker-compose up --build
```

This will:
1. Launch a **MongoDB** container (`teamtask_mongodb`) listening on `mongodb://localhost:27017`.
2. Wait for MongoDB healthcheck to succeed.
3. Build and launch the **TeamTask Express Backend** container (`teamtask_backend`) listening on `http://localhost:5000`.

### 2. Stop Docker Stack
```bash
docker-compose down
```

To remove persistent database volumes as well:
```bash
docker-compose down -v
```

---

## 💻 Manual Setup & Local Running Instructions

If running without Docker:

### 1. Prerequisites
- Node.js (v18+)
- Local or Remote MongoDB instance

### 2. Installation
```bash
git clone https://github.com/debabrata013/TeamTask-Backend.git
cd TeamTask-Backend
npm install
```

### 3. Environment Configuration
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

### 4. Run Server
- **Development Mode** (with nodemon auto-reloading):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

---

## 🌲 Git Branching Strategy

Our repository follows a strict 3-branch strategy with **no `main` branch**:
- `dev` - Primary integration branch for active development.
- `stage` - Staging branch for pre-production QA testing.
- `prod` - Production-ready release branch.

### Feature Branches Merged into `dev`:
1. `feature/auth` - User registration, login, JWT middleware, health check, user model.
2. `feature/projects` - Project model, authorization middleware, project controller & routes.
3. `feature/tasks-and-invitations` - Task & invitation models, services, controllers, validators & routes.
4. `feature/security-and-ci` - GitHub Actions CI/CD SonarQube & Trivy scan workflows.
5. `feature/docker-setup` - Dockerfile, `.dockerignore`, `docker-compose.yml` with containerized MongoDB.

---

## 📁 Project Directory Structure

```
.
├── .env.example
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
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

## 📖 API Endpoint Reference

### 🩺 Health Check
- **`GET /api/health`** - Checks API and MongoDB health status.

### 🔐 Authentication
- **`POST /api/auth/register`** - Register new user (Body: `name`, `email`, `password`)
- **`POST /api/auth/login`** - Login user (Body: `email`, `password`)
- **`GET /api/auth/me`** - Fetch current user profile (Header: `Authorization: Bearer <token>`)

### 📂 Projects
- **`POST /api/projects`** - Create new project
- **`GET /api/projects`** - Retrieve projects for authenticated user
- **`GET /api/projects/:id`** - Get single project details (requires project membership)
- **`PUT /api/projects/:id`** - Update project (owner or admin)
- **`DELETE /api/projects/:id`** - Delete project (owner only)
- **`POST /api/projects/:id/members`** - Add member to project
- **`DELETE /api/projects/:id/members/:userId`** - Remove member from project

### 📋 Tasks
- **`POST /api/projects/:projectId/tasks`** - Create task inside project
- **`GET /api/projects/:projectId/tasks`** - Retrieve project tasks (Query filters: `status`, `priority`, `assignedTo`, `search`)
- **`GET /api/tasks/:id`** - Get single task
- **`PUT /api/tasks/:id`** - Update task status, priority, assignee, due date
- **`DELETE /api/tasks/:id`** - Delete task

### ✉️ Invitations
- **`POST /api/projects/:projectId/invitations`** - Generate project member invitation
- **`GET /api/projects/:projectId/invitations`** - View project invitations
- **`POST /api/invitations/accept/:token`** - Accept invitation token
- **`POST /api/invitations/reject/:token`** - Reject invitation token

---

## 📊 API Response Standards

#### Success Response:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

#### Error Response:
```json
{
  "success": false,
  "message": "Validation Failed / Unauthorized access",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```
