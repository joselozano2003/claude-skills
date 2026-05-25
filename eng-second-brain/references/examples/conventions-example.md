---
title: Acme API Conventions
type: conventions
project: acme-api
ingested: 2026-01-15
updated: 2026-01-15
---

## Naming
- Files: `kebab-case.ts` — e.g. `task.service.ts`, `auth.middleware.ts`
- Classes/types: `PascalCase` — e.g. `TaskService`, `CreateTaskInput`
- Functions/variables: `camelCase` — e.g. `findById`, `userId`
- DB columns: `camelCase` (Prisma default maps to `snake_case` in PostgreSQL via `@@map`)
- Error codes: `UPPER_SNAKE_CASE` — e.g. `NOT_FOUND`, `INVALID_CREDENTIALS`

## Imports
- Absolute imports from `src/` configured via `tsconfig.paths` — e.g. `import { TaskService } from 'services/task.service'`
- Relative imports only within the same layer (e.g. one repository importing another)
- No barrel `index.ts` re-exports — import the file directly

## Error handling
- Services throw `AppError` (see patterns.md Pattern 4)
- Repositories let Prisma errors bubble — caught by the global error handler
- Never `console.error` in production paths — use the `logger` instance from `src/lib/logger.ts`
- HTTP status mapping: `NOT_FOUND` → 404, `FORBIDDEN` → 403, `VALIDATION_ERROR` → 422

## Workflows

### Adding a new endpoint
1. Define Zod schema in `src/types/<resource>.schema.ts`
2. Add repository method in `src/repositories/<resource>.repository.ts`
3. Add service method in `src/services/<resource>.service.ts`
4. Add route handler in `src/routes/<resource>.ts`
5. Register route file in `src/index.ts` via `fastify.register()`
6. Write integration test in `src/routes/__tests__/<resource>.test.ts`

### Adding a new model
1. Add model to `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name <description>`
3. Create `src/repositories/<model>.repository.ts`
4. Update seed script if needed: `prisma/seed.ts`

## Tests
- Location: `__tests__/` co-located with the file under test
- Naming: `<file>.test.ts`
- Runner: Vitest
- Pattern: integration tests hit a real test DB (see `jest.setup.ts` for teardown); no mocking of Prisma
- Coverage target: all service methods; route handlers tested via `fastify.inject()`

## Comments
- Comment only non-obvious WHY — e.g. `// BullMQ job instead of direct call — email service has 2s p99`
- No JSDoc on internal functions — TypeScript types are the documentation
- TODO format: `// TODO(username): description` — not tracked in wiki, use GitHub issues
