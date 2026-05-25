---
title: Acme API Endpoints
type: api
project: acme-api
ingested: 2026-01-15
updated: 2026-01-15
---

## Auth
- Header: `Authorization: Bearer <access_token>`
- Access token: 15 min JWT, signed with `JWT_SECRET`
- Refresh token: 7d, rotating — stored hashed in `RefreshToken` table
- Public endpoints: explicitly decorated with `{ auth: false }` in route options

## Auth endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | Public | Create account |
| POST | `/auth/login` | Public | Returns `{access, refresh}` |
| POST | `/auth/refresh` | Public | Rotate refresh token |
| DELETE | `/auth/logout` | ✅ | Invalidate refresh token |

**Login request/response:**
```json
// POST /auth/login
{ "email": "user@example.com", "password": "..." }

// 200
{ "access": "<jwt>", "refresh": "<token>", "user": { "id": "...", "email": "...", "name": "..." } }

// 401
{ "error": "INVALID_CREDENTIALS", "message": "Email or password is incorrect" }
```

## Tasks

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/tasks` | ✅ | List tasks for current user's projects |
| POST | `/api/tasks` | ✅ | Create task |
| PATCH | `/api/tasks/:id` | ✅ | Update task (owner or assignee only) |
| DELETE | `/api/tasks/:id` | ✅ | Delete (owner only) |

## Uploads

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/uploads/presign` | ✅ | Get S3 presigned PUT URL |

**Presign request/response:**
```json
// POST /api/uploads/presign
{ "filename": "report.pdf", "contentType": "application/pdf" }

// 200
{ "uploadUrl": "https://s3.../...", "publicUrl": "https://cdn.acme.com/...", "expiresIn": 300 }
```

## Unused / stub endpoints
| Endpoint | Status |
|----------|--------|
| `GET /api/reports` | Defined in router, handler returns 501 Not Implemented |
| `POST /api/webhooks/stripe` | Route registered, body empty — billing not wired yet |

## Error format
All errors follow this envelope:
```json
{ "error": "ERROR_CODE", "message": "Human-readable description", "details": {} }
```
Common codes: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `INTERNAL_ERROR`.
Validation errors include a `details` object keyed by field name.
