---
title: Acme API Data Models
type: data-models
project: acme-api
ingested: 2026-01-15
updated: 2026-01-15
---

## Model relationships
`User` owns many `Project`s. Each `Project` has many `Task`s. A `Task` belongs to one `Project` and is optionally assigned to one `User`. `TaskAttachment` is a child of `Task` (one-to-many). `Team` is a many-to-many join between `User` and `Project` via `TeamMember`. Auth tokens are not stored — JWT is stateless; refresh tokens are in the `RefreshToken` table keyed by `userId`.

---

### User
| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID PK | auto-generated |
| `email` | String | unique |
| `passwordHash` | String | bcrypt, write-only |
| `name` | String | display name |
| `role` | Enum | `ADMIN \| MEMBER` |
| `createdAt` | DateTime | auto |

Relations: has many `Project` (owner), has many `TeamMember`, has many `Task` (assignee).

### Task
| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID PK | |
| `title` | String | |
| `status` | Enum | `TODO \| IN_PROGRESS \| DONE` |
| `projectId` | UUID FK → Project | cascade delete |
| `assigneeId` | UUID FK → User | nullable |
| `dueAt` | DateTime | nullable |

Non-obvious: `status` changes queue a BullMQ notification job — see `TaskService.updateStatus()`.

### RefreshToken
| Field | Type | Notes |
|-------|------|-------|
| `token` | String PK | hashed SHA-256 |
| `userId` | UUID FK → User | cascade delete |
| `expiresAt` | DateTime | |
| `rotatedAt` | DateTime | nullable — set on rotation |

Old tokens are kept for 30d for audit. `rotatedAt` non-null means the token was already used once (rotation blacklist).
