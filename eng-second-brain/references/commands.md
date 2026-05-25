# Command Reference

Full instructions for /save, /sync, /adr, /sprint.

All commands assume `$VAULT` is already resolved from `~/.claude/eng-brain-config.json` and `$PROJECT` is detected via `git remote get-url origin 2>/dev/null | sed 's/.*\///' | sed 's/\.git//' || basename $(pwd)`.

---

## SAVE

Extract knowledge from the current session and persist to the wiki.
Runs automatically at session end. Also triggered manually.

### What to extract

Scan the conversation for:
- **Decisions** — "we'll use X", "let's go with Y", "decided not to Z" → ADR
- **Patterns** — repeated code conventions, things Claude should always/never do → pattern page
- **Context changes** — tasks completed, blockers, sprint progress → sprint context page
- **Files touched** — which files were created or modified → key files table in CLAUDE.md

### Steps

1. Read `$VAULT/wiki/meta/index.md` — check what already exists before creating
2. Read `$VAULT/wiki/meta/hot.md` — know last session context
3. For each decision found:
   - New: create `$VAULT/wiki/architecture/ADR-NNN-title.md`
   - Existing: open and update status or consequences
4. For each pattern found:
   - New: create `$VAULT/wiki/patterns/pattern-name.md`
   - Existing: open and revise
5. Update active sprint context page with task progress
6. Update `$VAULT/wiki/meta/index.md` for any new pages
7. Write session summary to `$VAULT/wiki/meta/hot-$PROJECT.md` (creates or overwrites):

```markdown
---
title: Hot Cache
updated: YYYY-MM-DD
---
# Hot Cache

**Date:** YYYY-MM-DD
**Repo:** <repo name>
**Session type:** feature | bugfix | architecture | review

## What was worked on
<2-3 sentences>

## Files touched
- `src/...` — what changed
- `src/...` — what changed

## Decisions made
- <decision> → see [[ADR-NNN]]

## Open questions
- <question>

## Next
<what to pick up next session>
```

8. Append to `$VAULT/wiki/meta/log.md`:
```
YYYY-MM-DD | SESSION | repo: X | ADRs: N | patterns: N | <10-word summary>
```

9. Run SYNC

### Output to user
```
Saved: 2 ADRs created, 1 pattern updated, sprint context updated.
CLAUDE.md regenerated. Hot cache written.
```
3-4 lines. No wall of text.

---

## SYNC

Regenerate `$VAULT/CLAUDE.md` from wiki so it stays under 200 lines.

### Steps

1. Read all files in `$VAULT/wiki/architecture/` — extract one-line summaries per ADR
2. Read all files in `$VAULT/wiki/patterns/` — extract pattern name + one-line rule
3. Read active sprint context from `$VAULT/wiki/context/`
4. Read `$VAULT/wiki/meta/hot.md` for recent changes

5. Rewrite `$VAULT/CLAUDE.md` replacing each `<!-- SECTION -->` block:

**<!-- PROJECT_SUMMARY -->**
1-2 sentences. Tech stack. Purpose. Current phase.

**<!-- ARCHITECTURE_MAP -->**
Bullet list of major components. Max 15 bullets. One line each.
Format: `- ComponentName: what it does → talks to ComponentB`

**<!-- KEY_FILES -->**
Table of files Claude commonly needs. Max 20 rows. Skip generated/vendor files.

**<!-- PATTERNS -->**
One bullet per pattern: `- PatternName: one-line rule (see [[wiki/patterns/...]] for examples)`
Max 15 patterns. No code here.

**<!-- SPRINT_CONTEXT -->**
Current sprint goal + task checklist + blockers.

**<!-- OPEN_DECISIONS -->**
Things not yet decided. Claude should ask before choosing here.

**<!-- CLOSED_DECISIONS -->**
One line per ADR: `- ADR-001: Use Postgres — settled 2026-05-05`

6. Update `<!-- LAST_SYNCED -->` with today's date

### Hard constraint
`$VAULT/CLAUDE.md` must stay under 200 lines. If growing past that, compress.
Full context lives in the wiki — CLAUDE.md is just the map.

---

## ADR

Create a new Architecture Decision Record.

### When to create
Meaningful technical choices: which library, DB, API design, auth approach, infra choice,
data model shape, caching strategy, error handling approach.
NOT for: variable naming, file structure preferences, minor style choices.

### Steps

1. If not already in the conversation, ask:
   - What's the decision?
   - What alternatives were considered?
   - Main trade-offs?

2. Read `$VAULT/wiki/meta/index.md` to get the next NNN (increment from highest existing)

3. Create `$VAULT/wiki/architecture/ADR-NNN-kebab-case-title.md`:

```markdown
---
title: ADR-NNN <Title>
type: adr
status: accepted
date: YYYY-MM-DD
repo: <repo name or "cross-project">
tags: [adr, backend|frontend|infra|ai-ml|db|api]
---

## Context
<Why needed. What problem it solves. 2-3 sentences.>

## Decision
<What was decided. One direct sentence.>

## Consequences
- Pro: <benefit>
- Con: <trade-off>

## Alternatives rejected
- <Option>: <one-sentence reason rejected>
```

4. Update `$VAULT/wiki/meta/index.md`:
```markdown
## ADRs
- [[ADR-NNN Title]] — accepted — <one-line summary>
```

5. Update `<!-- CLOSED_DECISIONS -->` in CLAUDE.md with one-line entry
6. Append to log

### Output
`ADR-003 created: Use Zod for all input validation` — one line.

---

## SPRINT

Update sprint context in the wiki and regenerate the sprint section of CLAUDE.md.

### /sprint start

```
/sprint start
Goal: <sprint goal>
Tasks: <comma separated list>
```

Steps:
1. Close previous sprint (set status: closed, write 2-sentence retro)
2. Read existing sprint pages to get next sprint number N
3. Create `$VAULT/wiki/context/Sprint-N-Context.md`:

```markdown
---
title: Sprint N Context
type: context
sprint: N
repo: <repo>
start_date: YYYY-MM-DD
status: active
tags: [context]
---

## Goal
<sprint goal>

## Tasks
- [ ] <task>
- [ ] <task>

## Blockers
*(none)*

## Decisions made this sprint
*(updated as sprint progresses)*

## Files touched
*(updated as sprint progresses)*
```

4. Run SYNC to update `<!-- SPRINT_CONTEXT -->` in CLAUDE.md

### /sprint update

Update task status, add blockers, note decisions mid-sprint.

```
/sprint update
Done: <task name>
Blocked: <blocker description>
```

Steps:
1. Open active sprint context page
2. Check off completed tasks
3. Add/update blockers section
4. Update `<!-- SPRINT_CONTEXT -->` in CLAUDE.md directly (skip full sync)

### /sprint close

```
/sprint close
```

Steps:
1. Mark active sprint page as status: closed
2. Append 2-sentence retrospective: what shipped, what didn't, why
3. Run SYNC
