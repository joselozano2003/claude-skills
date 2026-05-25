# /ingest — Deep Codebase Ingestion

Thorough, deliberate, one-time read of a codebase. Expensive upfront. Pays off across every future session by avoiding raw file reads.

All output goes to `$VAULT/wiki/architecture/$PROJECT/` and `$VAULT/wiki/patterns/$PROJECT/`.

---

## RULES — Read before doing anything else

### PROHIBITED in all wiki files
- No `## Known Issues`, `## Tech Debt`, `## Dead Code`, or `## Bugs` sections — bugs go in `index.md`, not wiki pages
- No frontmatter-only pages — every file must have real content under every section header
- No copying raw source code verbatim — distill into examples that illustrate the pattern, not dumps
- No semicolons to compact multi-line code onto one line (`let a: String; let b: Int` → multi-line)
- No omitting required sections — if a section is empty, write `*(none)*`, never skip the header

### REQUIRED in all wiki files
- Frontmatter with ALL five fields: `title`, `type`, `project`, `ingested`, `updated`
- Cross-links in `overview.md` using `[[wikilink]]` format pointing to the other 5 pages
- Quick index in `patterns.md` listing all patterns before the first one
- `Do not:` block after EVERY pattern in `patterns.md`
- Self-check before finishing: verify every required section is present in every file

### Symlink (automatic, not offered)
After writing all files and running /sync:
```bash
CLAUDE_MD="$(pwd)/CLAUDE.md"
if [ -L "$CLAUDE_MD" ]; then
    echo "CLAUDE.md symlink already exists"
elif [ -f "$CLAUDE_MD" ]; then
    echo "WARNING: CLAUDE.md exists and is not a symlink — not overwriting"
else
    ln -s "$VAULT/CLAUDE.md" "$CLAUDE_MD"
    echo "Symlinked $VAULT/CLAUDE.md → $CLAUDE_MD"
fi
```

---

## Phase 1 — Map (always, cheap)

Goal: understand the full shape of the codebase before reading any files.

```bash
# File tree (exclude noise)
find . -not -path "*/node_modules/*" -not -path "*/.git/*" \
       -not -path "*/dist/*" -not -path "*/__pycache__/*" \
       -not -path "*/.venv/*" -not -path "*/build/*" \
       -type f | sort

# Recent history
git log --oneline -30

# Active contributors
git shortlog -s -n --no-merges | head -10
```

Also read:
- `README.md` (or `README.rst`)
- First match of: `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `mix.exs`
- All config files at root: `*.config.*`, `.env.example`, `Makefile`, `Dockerfile`
- Language-specific tooling: `tsconfig.json`, `jest.config.*`, `vite.config.*`, `.eslintrc*`

---

## Phase 2 — Architecture (medium cost)

Read in this order, skipping categories that don't apply:

**Entry points** — `main.py`, `index.ts`, `app.py`, `main.go`, `server.ts`, route files

**Data layer** — migration files (filenames + 3-5 representative ones), model files, schema files, type definitions

**Core business logic** — services, controllers/handlers, lib/utils (read all, focus on non-trivial)

**Infrastructure** — auth middleware, queue/job files, external API clients

---

## Phase 3 — Pattern sampling (thorough)

For each major directory category (routes, services, models, utils, tests):
- Read 3-5 representative files in full
- Look for: repeated structure, naming conventions, error handling, import style, response shapes, validation, test structure

Read test files specifically:
- 2-3 unit tests, 2-3 integration tests, test setup files

---

## Phase 4 — Write wiki pages

### Frontmatter template (copy for every file, fill in all fields)
```yaml
---
title: <Project> <PageType>
type: overview | structure | data-models | api | patterns | conventions
project: <project-slug>
ingested: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

Write ALL six files. See `references/examples/` for a filled-in skeleton of each.

---

### File 1: `wiki/architecture/$PROJECT/overview.md`

See: `references/examples/overview-example.md`

Required sections (in order):
1. Frontmatter (all 5 fields)
2. `## What it is` — 2-3 sentences: purpose, users, current phase
3. `## Tech stack` — table or bullets with actual versions
4. `## Architecture` — ASCII diagram of component relationships
5. `## Data flow` — numbered steps for a representative operation end-to-end
6. `## Deployment / infra` — how it runs in prod
7. `## See also` — `[[wikilink]]` to all other 5 pages

Max 500 words.

---

### File 2: `wiki/architecture/$PROJECT/structure.md`

See: `references/examples/structure-example.md`

Required sections:
1. Frontmatter
2. `## Directory map` — ASCII tree or table, one tight phrase per entry
3. `## Finding things` — table mapping tasks to files
4. `## Generated / do not edit` — list of dirs/files that are auto-generated

Max 300 words.

---

### File 3: `wiki/architecture/$PROJECT/data-models.md`

See: `references/examples/data-models-example.md`

Required sections:
1. Frontmatter
2. `## Model relationships` — prose paragraph at the top explaining how entities connect
3. One `### ModelName` subsection per model with: fields table, relationships, non-obvious notes

Max 500 words. Only key fields — not every column.

---

### File 4: `wiki/architecture/$PROJECT/api.md`

See: `references/examples/api-example.md`

Required sections:
1. Frontmatter
2. `## Auth` — token format, header name, expiry, refresh
3. One `## GroupName` section per route group with endpoint table: Method | Path | Auth | Description
4. Request/response JSON for at least 2 key endpoints
5. `## Unused / stub endpoints` — endpoints defined but never called from client
6. `## Error format` — what error responses look like

Max 500 words.

---

### File 5: `wiki/patterns/$PROJECT/patterns.md`

See: `references/examples/patterns-example.md`

Required sections:
1. Frontmatter
2. `## Quick index` — bulleted list of all pattern names (before Pattern 1)
3. One `## Pattern N: Name` section per pattern containing:
   - One-sentence rule (bold)
   - Code example (5-15 lines, real code, properly formatted)
   - `**Do not:**` block with anti-pattern

5-7 patterns max. Up to 600 words including code.

---

### File 6: `wiki/patterns/$PROJECT/conventions.md`

See: `references/examples/conventions-example.md`

Required sections:
1. Frontmatter
2. `## Naming` — rules + 1-2 examples (no exhaustive lists)
3. `## Imports` — absolute vs relative, barrel files, import order
4. `## Error handling` — throw or return, custom error types, where errors surface
5. `## Workflows` — subsections: `### Adding a new [thing]` as numbered steps
6. `## Tests` — location, naming, runner, structure
7. `## Comments` — when to comment, docstring style

Max 300 words. No `## Known Issues` or `## Dead Code` section.

---

## After writing all pages

1. Self-check every file: all required sections present? No prohibited sections? Frontmatter complete?
2. Update `$VAULT/wiki/meta/index.md` — add all new pages under `## $PROJECT` heading, include known issues as bullets
3. Append to `$VAULT/wiki/meta/log.md`: `YYYY-MM-DD | INGEST | project: $PROJECT | pages: N | <tech stack>`
4. Run `/sync` → regenerates `$VAULT/CLAUDE.md` with content from wiki
5. Create symlink (see RULES section above — automatic, not offered)

## Output to user
```
Ingested <project>:
  wiki/architecture/$PROJECT/ — overview, structure, data-models, api
  wiki/patterns/$PROJECT/    — patterns, conventions
  CLAUDE.md updated. Symlinked at $(pwd)/CLAUDE.md.
```
