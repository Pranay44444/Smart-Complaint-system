# Smart Complaint

A multi-tenant complaint management platform. Organizations register, invite their team, and manage customer issues end-to-end — from submission through assignment to resolution.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Backend | NestJS, TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcrypt |

## Project structure

```
smart-complaint/
├── frontend/   # Next.js app (port 3000)
└── backend/    # NestJS API (port 3001)
```

## Roles

| Role | Access |
|---|---|
| **Super Admin** | Platform-wide — manages all organizations (suspend, activate, delete) |
| **Admin** | Organization-wide — all complaints, staff management, KPI dashboard |
| **Staff** | Personal queue — assigned complaints only, status updates |
| **User** | Self-service — submit complaints, track own issues |

## Getting started

**Prerequisites:** Node.js 18+, MongoDB running locally

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/smart-complaint
JWT_SECRET=your_jwt_secret
PORT=3001
```

```bash
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`, API at `http://localhost:3001`.

To override the API URL, set `NEXT_PUBLIC_API_URL` in `frontend/.env.local`.

## Key flows

**Organization onboarding**
1. Admin registers at `/register/org` — creates the org and becomes its first admin
2. Admin copies the invite link from their dashboard
3. Users and staff self-register via `/join/[slug]`

**Complaint lifecycle**
```
Submitted → ASSIGNED (auto, round-robin) → IN_PROGRESS → RESOLVED → CLOSED
```
Auto-assignment distributes to staff via round-robin on creation. Staff update status; admins can reassign or close any complaint.

**Authentication**
JWT stored in localStorage, attached to every request via Axios interceptor. Role-based redirect on login:

| Role | Redirect |
|---|---|
| Super Admin | `/superadmin/dashboard` |
| Admin | `/admin/dashboard` |
| Staff | `/staff/complaints` |
| User | `/dashboard` |

## API reference

| Method | Endpoint | Access |
|---|---|---|
| POST | `/auth/login` | Public |
| POST | `/auth/register/org` | Public |
| POST | `/auth/register/join/:slug` | Public |
| GET | `/complaints` | User / Staff / Admin |
| POST | `/complaints` | User / Admin |
| PATCH | `/complaints/:id/assign` | Admin |
| PATCH | `/complaints/:id/status` | Staff |
| PATCH | `/complaints/:id/close` | Admin |
| GET | `/dashboard/summary` | Admin |
| GET | `/dashboard/staff-performance` | Admin |
| GET | `/users` | Admin |
| PATCH | `/users/:id/role` | Admin |
| GET | `/superadmin/orgs` | Super Admin |
| PATCH | `/superadmin/orgs/:id/suspend` | Super Admin |
| DELETE | `/superadmin/orgs/:id` | Super Admin |

## Author

Pranay Chitare
