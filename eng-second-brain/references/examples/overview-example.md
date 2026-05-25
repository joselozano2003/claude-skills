---
title: Acme API Overview
type: overview
project: acme-api
ingested: 2026-01-15
updated: 2026-01-15
---

## What it is
A Node.js REST API backing a task-management SaaS. Teams create projects, assign tasks, and track time. Currently in production with ~200 customers. Auth is JWT; billing is Stripe.

## Tech stack
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 + TypeScript 5.3 |
| Framework | Fastify 4.x |
| Database | PostgreSQL 15 via Prisma ORM |
| Auth | JWT (access 15m / refresh 7d, rotating) |
| Queue | BullMQ + Redis |
| Storage | AWS S3 presigned uploads |
| Infra | AWS ECS via Terraform |

## Architecture
```
Client
  └── Bearer token → AuthMiddleware
        └── Route handlers (src/routes/)
              ├── Prisma → PostgreSQL
              ├── BullMQ → Redis → Worker processes
              └── S3ImageUploader (presigned PUT, never proxies)
```

## Data flow
Representative operation — user creates a task with an attachment:

1. `POST /api/tasks` with `Authorization: Bearer <token>`
2. `AuthMiddleware` validates JWT, attaches `req.user`
3. `TaskService.create()` validates input via Zod, writes to DB
4. If attachment: `POST /api/uploads/presign` → S3 presigned URL returned to client
5. Client PUTs file directly to S3, sends `public_url` back in task body
6. BullMQ job queued: notify assignee via email worker
7. Returns 201 with full task object

## Deployment / infra
Docker → ECR → ECS Fargate. Two services: `api` and `worker`. Terraform in `infra/`. Secrets via AWS Secrets Manager. RDS in private subnet, not publicly accessible.

## See also
- [[structure]] — directory map, where to find things
- [[data-models]] — Prisma schema, entity relationships
- [[api]] — all endpoints, auth, request/response shapes
- [[patterns]] — code patterns with examples
- [[conventions]] — naming, imports, error handling, tests
