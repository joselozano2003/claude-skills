---
title: Acme API Patterns
type: patterns
project: acme-api
ingested: 2026-01-15
updated: 2026-01-15
---

## Quick index
1. **Service layer contract** — routes call services, services call repositories; never skip a layer
2. **Zod validation at route boundary** — validate input before it reaches service layer
3. **Repository scoping** — every DB query filters by userId to prevent cross-tenant leaks
4. **Error propagation** — services throw typed errors; routes catch and format them
5. **Async queue for side effects** — anything that shouldn't block the response goes to BullMQ

---

## Pattern 1: Service layer contract
**Routes call services, services call repositories. Never call Prisma directly from a route.**

```typescript
// routes/tasks.ts
fastify.post('/api/tasks', async (req, reply) => {
  const task = await TaskService.create(req.user.id, req.body)
  return reply.status(201).send(task)
})

// services/task.service.ts
async function create(userId: string, input: CreateTaskInput) {
  return TaskRepository.create({ ...input, createdById: userId })
}
```

**Do not:**
```typescript
// Never Prisma directly in a route handler
fastify.post('/api/tasks', async (req, reply) => {
  const task = await prisma.task.create({ data: req.body }) // ❌
})
```

---

## Pattern 2: Zod validation at route boundary
**Parse and validate all input at the route level before touching any service or DB.**

```typescript
const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200),
  projectId: z.string().uuid(),
  assigneeId: z.string().uuid().optional(),
})

fastify.post('/api/tasks', {
  schema: { body: zodToJsonSchema(CreateTaskSchema) }
}, async (req, reply) => {
  const input = CreateTaskSchema.parse(req.body)
  const task = await TaskService.create(req.user.id, input)
  return reply.status(201).send(task)
})
```

**Do not:**
```typescript
// Never validate inside services — they should receive already-valid data
async function create(userId: string, input: any) {
  if (!input.title) throw new Error('title required') // ❌ wrong layer
}
```

---

## Pattern 3: Repository scoping
**Every query that returns user-owned data must filter by userId. No exceptions.**

```typescript
// repositories/task.repository.ts
async function findMany(userId: string, projectId?: string) {
  return prisma.task.findMany({
    where: {
      project: { members: { some: { userId } } }, // ✅ tenant-scoped
      ...(projectId ? { projectId } : {}),
    }
  })
}
```

**Do not:**
```typescript
// Never fetch all records and filter in application code
const allTasks = await prisma.task.findMany() // ❌
return allTasks.filter(t => t.assigneeId === userId) // ❌ leaks other data, no index
```

---

## Pattern 4: Error propagation
**Services throw typed AppError instances. Routes have a single catch block that formats them.**

```typescript
// lib/errors.ts
class AppError extends Error {
  constructor(public code: string, message: string, public status = 400) {
    super(message)
  }
}

// services/task.service.ts
if (!task) throw new AppError('NOT_FOUND', 'Task not found', 404)

// routes — Fastify error handler (registered once in index.ts)
fastify.setErrorHandler((error, req, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.status).send({ error: error.code, message: error.message })
  }
  reply.status(500).send({ error: 'INTERNAL_ERROR', message: 'Unexpected error' })
})
```

**Do not:**
```typescript
// Never format error responses inside service or repository code
async function findById(id: string) {
  const task = await prisma.task.findUnique({ where: { id } })
  if (!task) return reply.status(404).send(...) // ❌ reply not available here
}
```

---

## Pattern 5: Async queue for side effects
**Anything that shouldn't block the HTTP response — emails, notifications, analytics — goes to BullMQ.**

```typescript
// services/task.service.ts
async function updateStatus(taskId: string, status: TaskStatus) {
  const task = await TaskRepository.update(taskId, { status })
  await notificationQueue.add('task-status-changed', { taskId, status }) // non-blocking
  return task // respond immediately
}
```

**Do not:**
```typescript
async function updateStatus(taskId: string, status: TaskStatus) {
  const task = await TaskRepository.update(taskId, { status })
  await sendEmailNotification(task) // ❌ blocks response, fails silently if email service is down
  return task
}
```
