# 📘 TeamTask API Specification & Endpoint Documentation

This document provides complete specification for every REST API endpoint exposed by the **TeamTask Backend**. It details HTTP methods, access permissions, required request headers, input parameters, request payloads, expected success response models, and error responses.

---

## 🔐 Base URL & Authentication

- **Base URL**: `http://localhost:5000/api` (or `http://localhost:5000/api` inside Docker)
- **Content-Type**: `application/json`
- **Authentication**: JWT Bearer Token provided via HTTP Authorization Header:
  ```http
  Authorization: Bearer <YOUR_JWT_TOKEN>
  ```

---

## 📋 Endpoint Sitemap Summary

| Category | HTTP Method | Endpoint Path | Auth Required | Description |
| :--- | :---: | :--- | :---: | :--- |
| **Health** | `GET` | `/api/health` | No | System & database health status check |
| **Auth** | `POST` | `/api/auth/register` | No | Register a new user account |
| **Auth** | `POST` | `/api/auth/login` | No | Authenticate user & receive JWT token |
| **Auth** | `GET` | `/api/auth/me` | Yes | Get authenticated user profile |
| **Projects** | `POST` | `/api/projects` | Yes | Create a new project |
| **Projects** | `GET` | `/api/projects` | Yes | List all projects current user belongs to |
| **Projects** | `GET` | `/api/projects/:id` | Yes (Member) | Get specific project details |
| **Projects** | `PUT` | `/api/projects/:id` | Yes (Owner/Admin) | Update project name/description/status |
| **Projects** | `DELETE` | `/api/projects/:id` | Yes (Owner Only) | Delete a project |
| **Projects** | `POST` | `/api/projects/:id/members` | Yes (Owner/Admin) | Add member to project |
| **Projects** | `DELETE` | `/api/projects/:id/members/:userId` | Yes (Owner/Admin) | Remove member from project |
| **Tasks** | `POST` | `/api/projects/:projectId/tasks` | Yes (Member) | Create a task inside project |
| **Tasks** | `GET` | `/api/projects/:projectId/tasks` | Yes (Member) | Filter & list project tasks |
| **Tasks** | `GET` | `/api/tasks/:id` | Yes (Member) | Get single task by ID |
| **Tasks** | `PUT` | `/api/tasks/:id` | Yes (Member) | Update task status, priority, assignee |
| **Tasks** | `DELETE` | `/api/tasks/:id` | Yes (Member) | Delete task by ID |
| **Invitations**| `POST` | `/api/projects/:projectId/invitations` | Yes (Owner/Admin) | Create invitation token for email |
| **Invitations**| `GET` | `/api/projects/:projectId/invitations` | Yes (Owner/Admin) | View pending invitations for project |
| **Invitations**| `POST` | `/api/invitations/accept/:token` | Yes | Accept project invitation token |
| **Invitations**| `POST` | `/api/invitations/reject/:token` | Yes | Reject project invitation token |

---

## 1. 🩺 Health Check API

### `GET /api/health`
- **Description**: Returns backend API server, system uptime, and MongoDB connection status.
- **Auth Required**: No

#### Response: `200 OK`
```json
{
  "success": true,
  "message": "TeamTask API is running smoothly",
  "data": {
    "status": "UP",
    "timestamp": "2026-10-01T12:00:00.000Z",
    "uptime": 145.67,
    "database": "connected"
  }
}
```

---

## 2. 🔐 Authentication API

### `POST /api/auth/register`
- **Description**: Registers a new user account, hashes password using bcrypt, and issues a JWT token.
- **Auth Required**: No (Rate limited: 15 attempts / 15 mins)

#### Request Body:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secretPassword123"
}
```

#### Response: `201 Created`
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
      "createdAt": "2026-10-01T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
}
```

#### Error Response: `409 Conflict` (Email already registered)
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

### `POST /api/auth/login`
- **Description**: Verifies credentials and returns user profile with JWT token.
- **Auth Required**: No (Rate limited)

#### Request Body:
```json
{
  "email": "jane@example.com",
  "password": "secretPassword123"
}
```

#### Response: `200 OK`
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "651a2b3c4d5e6f7a8b9c0d1e",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "avatar": "",
      "createdAt": "2026-10-01T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
}
```

#### Error Response: `401 Unauthorized`
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### `GET /api/auth/me`
- **Description**: Retrieves current authenticated user details.
- **Auth Required**: Yes (`Authorization: Bearer <JWT_TOKEN>`)

#### Headers:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

#### Response: `200 OK`
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
      "avatar": "",
      "createdAt": "2026-10-01T12:00:00.000Z",
      "updatedAt": "2026-10-01T12:00:00.000Z"
    }
  }
}
```

---

## 3. 📂 Project Management API

### `POST /api/projects`
- **Description**: Creates a new project. The creator is set as project `owner` and added to `members` list with role `owner`.
- **Auth Required**: Yes

#### Request Body:
```json
{
  "name": "TeamTask Mobile App",
  "description": "Cross-platform mobile application build"
}
```

#### Response: `201 Created`
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "project": {
      "_id": "651b11114d5e6f7a8b9c0d22",
      "name": "TeamTask Mobile App",
      "description": "Cross-platform mobile application build",
      "status": "active",
      "owner": {
        "_id": "651a2b3c4d5e6f7a8b9c0d1e",
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      "members": [
        {
          "user": {
            "_id": "651a2b3c4d5e6f7a8b9c0d1e",
            "name": "Jane Doe",
            "email": "jane@example.com"
          },
          "role": "owner",
          "joinedAt": "2026-10-01T12:00:00.000Z"
        }
      ],
      "createdAt": "2026-10-01T12:00:00.000Z"
    }
  }
}
```

---

### `GET /api/projects`
- **Description**: Retrieves all projects where the authenticated user is either the owner or a team member.
- **Auth Required**: Yes

#### Response: `200 OK`
```json
{
  "success": true,
  "message": "User projects retrieved successfully",
  "data": {
    "count": 1,
    "projects": [
      {
        "_id": "651b11114d5e6f7a8b9c0d22",
        "name": "TeamTask Mobile App",
        "status": "active",
        "owner": { "name": "Jane Doe", "email": "jane@example.com" },
        "members": [ ... ]
      }
    ]
  }
}
```

---

### `GET /api/projects/:id`
- **Description**: Gets single project details.
- **Auth Required**: Yes (Must be owner or member)
- **Path Parameter**: `:id` (Project ID)

#### Response: `200 OK`

#### Error Response: `403 Forbidden`
```json
{
  "success": false,
  "message": "You are not authorized to access this project"
}
```

---

### `PUT /api/projects/:id`
- **Description**: Updates project name, description, or status (`active`, `archived`, `completed`).
- **Auth Required**: Yes (Must be Owner or Admin)

#### Request Body:
```json
{
  "name": "TeamTask Enterprise App",
  "status": "active"
}
```

#### Response: `200 OK`

---

### `DELETE /api/projects/:id`
- **Description**: Permanently deletes a project.
- **Auth Required**: Yes (Project Owner Only)

#### Response: `200 OK`
```json
{
  "success": true,
  "message": "Project deleted successfully",
  "data": null
}
```

---

### `POST /api/projects/:id/members`
- **Description**: Adds a user to project members list with a role (`admin` or `member`).
- **Auth Required**: Yes (Owner or Admin)

#### Request Body:
```json
{
  "userId": "651c33334d5e6f7a8b9c0d33",
  "role": "member"
}
```

---

### `DELETE /api/projects/:id/members/:userId`
- **Description**: Removes a member from project.
- **Auth Required**: Yes (Owner or Admin)

---

## 4. 📋 Task Management API

### `POST /api/projects/:projectId/tasks`
- **Description**: Creates a new task inside a specific project. Assigned user must be a member of the project.
- **Auth Required**: Yes (Project Member)

#### Request Body:
```json
{
  "title": "Build Authentication Controller",
  "description": "Implement register, login, and getMe handlers",
  "priority": "high",
  "status": "todo",
  "assignedTo": "651a2b3c4d5e6f7a8b9c0d1e",
  "dueDate": "2026-10-15T00:00:00.000Z"
}
```

#### Response: `201 Created`
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "651d44444d5e6f7a8b9c0d44",
      "title": "Build Authentication Controller",
      "description": "Implement register, login, and getMe handlers",
      "status": "todo",
      "priority": "high",
      "project": "651b11114d5e6f7a8b9c0d22",
      "assignedTo": { "name": "Jane Doe", "email": "jane@example.com" },
      "createdBy": { "name": "Jane Doe", "email": "jane@example.com" },
      "dueDate": "2026-10-15T00:00:00.000Z",
      "createdAt": "2026-10-01T12:00:00.000Z"
    }
  }
}
```

---

### `GET /api/projects/:projectId/tasks`
- **Description**: Retrieves list of tasks for a project with optional query filters.
- **Auth Required**: Yes (Project Member)
- **Query Parameters**:
  - `status`: `todo`, `in_progress`, or `completed`
  - `priority`: `low`, `medium`, `high`, or `urgent`
  - `assignedTo`: User ID
  - `search`: Title search term

#### Example Request URL:
`GET /api/projects/651b11114d5e6f7a8b9c0d22/tasks?status=todo&priority=high`

#### Response: `200 OK`

---

### `PUT /api/tasks/:id`
- **Description**: Updates task attributes (status, priority, assignee, due date, title, description).
- **Auth Required**: Yes (Project Member)

#### Request Body:
```json
{
  "status": "in_progress",
  "priority": "urgent"
}
```

#### Response: `200 OK`

---

### `DELETE /api/tasks/:id`
- **Description**: Deletes a task by ID.
- **Auth Required**: Yes (Project Member)

---

## 5. ✉️ Invitation API

### `POST /api/projects/:projectId/invitations`
- **Description**: Generates a secure invitation token for an email address.
- **Auth Required**: Yes (Project Owner or Admin)

#### Request Body:
```json
{
  "email": "developer@example.com",
  "role": "member"
}
```

#### Response: `201 Created`
```json
{
  "success": true,
  "message": "Invitation created successfully",
  "data": {
    "invitation": {
      "_id": "651e55554d5e6f7a8b9c0d55",
      "project": { "name": "TeamTask Mobile App" },
      "email": "developer@example.com",
      "role": "member",
      "token": "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d...",
      "status": "pending",
      "expiresAt": "2026-10-08T12:00:00.000Z"
    }
  }
}
```

---

### `POST /api/invitations/accept/:token`
- **Description**: Accepts invitation token and adds logged-in user to project members list.
- **Auth Required**: Yes

---

### `POST /api/invitations/reject/:token`
- **Description**: Rejects an invitation token.
- **Auth Required**: Yes
