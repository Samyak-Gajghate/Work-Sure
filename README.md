# Work-Sure

A role-aware work management platform for small teams — a lightweight Jira/Asana alternative. Built with Node.js, Express, PostgreSQL, React, and TypeScript.

---

## Features

- **Role-Based Access Control** — Admin, Manager, Member with granular permissions
- **Task Management** — Full CRUD with enforced status transitions (Todo → InProgress → InReview → Done)
- **Kanban Board** — Visual 4-column board with quick status transitions
- **Comments** — Threaded comments with 24-hour edit window for authors
- **Notifications** — Real-time notification system (task assignment, comments, status changes)
- **Activity Logs** — Full audit trail per task and workspace-wide
- **Dashboard** — Personal stats, team summary, and admin workspace analytics
- **Secure Auth** — JWT access + refresh tokens with rotation, bcrypt (cost 12)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js 20, Express 4, TypeScript 5 |
| Database | PostgreSQL 16, raw SQL via `pg` |
| Auth | JWT (access + refresh token rotation) |
| Validation | Zod |
| Frontend | React 18, Vite, TypeScript 5 |
| Styling | Tailwind CSS v3, Inter font |
| State | TanStack Query v5, React Context |
| HTTP | Axios with auto-refresh interceptor |
| Testing | Jest + Supertest |
| Infra | Docker, GitHub Actions CI |

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16 running locally

### 1. Clone and install

```bash
git clone <repo-url>
cd work-sure

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
# Edit DATABASE_URL and JWT secrets in backend/.env
```

### 3. Run migrations

```bash
cd backend
npm run migrate
```

### 4. Start development servers

```bash
# Terminal 1 — backend on :3000
cd backend && npm run dev

# Terminal 2 — frontend on :5173
cd frontend && npm run dev
```

### 5. Initial setup

The **first user to register** is automatically assigned the Admin role and creates the workspace. All subsequent registrations join as Members.

---

## Running Tests

```bash
cd backend

# All tests
npm test

# Integration tests only
npm run test:integration

# Unit tests only (if added)
npm run test:unit
```

> **Note:** Integration tests require a running PostgreSQL instance. Set `TEST_DATABASE_URL` in `.env` to a separate test database.

---

## Docker

### Development

```bash
# Start postgres + api
docker compose up
```

### Production build

```bash
cd backend
docker build -t worksure-api .
docker run --env-file .env -p 3000:3000 worksure-api
```

---

## API Overview

Base URL: `http://localhost:3000/api/v1`

| Module | Endpoints |
|---|---|
| Auth | POST /auth/register, /auth/login, /auth/refresh, /auth/logout, GET /auth/me |
| Users | GET /users, POST /users/invite, PATCH /users/:id/role, DELETE /users/:id |
| Profile | GET /users/profile, PATCH /users/profile |
| Workspace | GET /workspace, PATCH /workspace, GET /workspace/members |
| Tasks | GET/POST /tasks, GET/PATCH/DELETE /tasks/:id, PATCH /tasks/:id/status |
| Comments | POST/PATCH/DELETE /tasks/:taskId/comments/:commentId |
| Notifications | GET /notifications, PATCH /notifications/:id/read, /notifications/read-all |
| Activity | GET /tasks/:taskId/activity, GET /activity |
| Dashboard | GET /dashboard/personal, /dashboard/team, /dashboard/stats |

All responses follow the envelope format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

---

## Project Structure

```
work-sure/
├── backend/
│   ├── src/
│   │   ├── config/        # env, db
│   │   ├── middlewares/   # auth, role, validate, error
│   │   ├── modules/       # auth, users, workspace, tasks, comments, notifications, activity, dashboard
│   │   ├── types/
│   │   └── utils/         # errors, jwt, hash, logger, response, paginate
│   ├── migrations/        # 13 SQL migration files
│   ├── scripts/           # migrate.ts runner
│   └── tests/             # integration tests
├── frontend/
│   └── src/
│       ├── api/           # client.ts (Axios), tasks, users, notifications
│       ├── components/    # ui/ (Button, Input, Badge, Modal, Toast…), layout/
│       ├── context/       # AuthContext
│       ├── pages/         # auth, dashboard, tasks, board, workspace, notifications, profile
│       ├── types/
│       └── utils/         # date.ts, format.ts
├── .github/workflows/     # ci.yml
└── docker-compose.yml
```

---

## License

MIT
