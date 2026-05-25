---
name: eng-second-brain
description: >
  Manages a persistent engineering knowledge base in Obsidian across ALL Claude Code sessions,
  regardless of which repo or directory Claude Code is opened in. Use this skill whenever the
  user mentions their wiki, second brain, engineering notes, ADRs, sprint context, or says
  things like "save this session", "log this decision", "sync my CLAUDE.md", "what did we
  decide about X", "update the wiki", "start a new sprint", or "check my notes". Also trigger
  automatically at session end to save hot cache. The vault path is stored in
  ~/.claude/eng-brain-config.json and resolved at runtime — the skill works from any directory.
---

# Engineering Second Brain

Persistent knowledge base for engineering work. Accessible from any Claude Code session,
any repo, any directory. The vault lives at a fixed path on disk. This skill finds it,
reads it, and writes to it regardless of where Claude Code is opened.

---

## Step 0: Resolve vault path (always do this first)

```bash
cat ~/.claude/eng-brain-config.json
```

This returns:
```json
{ "vault_path": "/absolute/path/to/your/eng-brain" }
```

All wiki operations use `$VAULT` as the root. If the config file doesn't exist, run the
setup flow (see `references/setup.md`).

Export for the session:
```bash
VAULT=$(cat ~/.claude/eng-brain-config.json | python3 -c "import sys,json; print(json.load(sys.stdin)['vault_path'])")
```

---

## Vault structure

```
$VAULT/
├── CLAUDE.md                  ← symlinked or copied into each repo root
├── wiki/
│   ├── architecture/          ← ADRs (ADR-NNN-title.md)
│   ├── patterns/              ← code patterns
│   ├── context/               ← sprint context pages
│   └── meta/
│       ├── hot.md             ← session continuity cache (~400 words)
│       ├── index.md           ← master page list
│       └── log.md             ← append-only session history
└── .claude/
    └── commands/              ← /adr /sprint /save /sync definitions
```

---

## Session start protocol

Run silently at the top of every session:

1. Resolve `$VAULT` from config
2. Detect project: `git remote get-url origin 2>/dev/null | sed 's/.*\///' | sed 's/\.git//' || basename $(pwd)`
3. Read `$VAULT/wiki/meta/hot-$PROJECT.md` if it exists — restore last session context for this repo. Fall back to `$VAULT/wiki/meta/hot.md` only on first session.
4. Read `$VAULT/wiki/meta/index.md` — know what's in the vault
5. If files exist in `$VAULT/raw/` (unprocessed), mention it once

Do not narrate this. Just be context-loaded and ready.

---

## The four commands

### /save
Extract knowledge from the current conversation and persist to the wiki.
Full instructions: `references/commands.md` → SAVE section

Quick version:
1. Scan conversation for: decisions, patterns, files touched, sprint progress
2. Create/update ADR pages, pattern pages, sprint context
3. Write ~400 words to `$VAULT/wiki/meta/hot-$PROJECT.md`
4. Append one line to `$VAULT/wiki/meta/log.md`
5. Run /sync
6. Report: X ADRs, Y patterns, sprint updated — 3 lines max

### /sync
Regenerate `CLAUDE.md` from wiki content so it stays under 200 lines.
Full instructions: `references/commands.md` → SYNC section

Quick version:
1. Read all ADRs, patterns, active sprint context
2. Compress into `<!-- SECTION -->` blocks in `$VAULT/CLAUDE.md`
3. Link `CLAUDE.md` into current repo if not already there (see below)

### /adr
Create a new Architecture Decision Record.
Full instructions: `references/commands.md` → ADR section

Quick version:
1. Get: decision, alternatives, consequences
2. Write `$VAULT/wiki/architecture/ADR-NNN-title.md`
3. Update index + CLAUDE.md closed decisions

### /sprint
Update sprint context across the vault and CLAUDE.md.
Full instructions: `references/commands.md` → SPRINT section

---

## Linking CLAUDE.md into a repo

When starting a session in a new repo, Claude should check if CLAUDE.md exists there.
If not, offer to link it:

```bash
# Option A: symlink (changes to wiki reflect instantly)
ln -s $VAULT/CLAUDE.md /path/to/repo/CLAUDE.md

# Option B: copy (repo gets a snapshot, manually synced)
cp $VAULT/CLAUDE.md /path/to/repo/CLAUDE.md
```

Symlink is preferred. Claude Code reads symlinks fine.
If the repo already has a CLAUDE.md, merge — don't overwrite.

---

## Token budget

| What Claude reads | Tokens | Why |
|-------------------|--------|-----|
| hot.md | ~500 | Last session context |
| index.md | ~300 | Vault map |
| CLAUDE.md (in repo) | ~2,000 | Architecture + patterns + sprint |
| Specific ADR or pattern (when needed) | ~300 each | Deep context on demand |
| **Total orientation** | **~3,000** | vs ~15,000+ reading raw files |

Never read entire source files speculatively. Read CLAUDE.md first. If a pattern is
listed there, follow it without opening the source file.

---

## Vault operations

Prefer obsidian-cli when Obsidian is running (faster, native search):
```
Invoke obsidian:obsidian-cli: obsidian read file="wiki/meta/hot"
Invoke obsidian:obsidian-cli: obsidian search query="<term>"
```
If obsidian-cli returns an error or times out, fall back to direct Read:
```
Read $VAULT/wiki/meta/hot.md
```
For all writes, always use the Write/Edit tools directly on `$VAULT` paths.

---

## /ingest

Deep, thorough read of the current repo. Expensive upfront — run once per project, re-run after major refactors.
**IMPORTANT: /ingest only writes new files. Never delete, move, or overwrite existing wiki files unless explicitly told to.**
Full instructions: `references/ingest.md` — read it before starting, especially the RULES section.
Examples for every output file: `references/examples/` — use these as templates.

Quick version — 4 phases:
1. **Map** — file tree, README, config files, git log, package manifest
2. **Architecture** — entry points, routes, data models/migrations, services, auth, external clients
3. **Pattern sampling** — 3-5 files per major directory; 2-3 test files; look for repeated structure
4. **Synthesis** — write 6 focused wiki pages under `$VAULT/wiki/{architecture,patterns}/$PROJECT/`:
   - `overview.md` — purpose, stack, ASCII arch diagram, numbered data flow, deployment, [[cross-links]] (≤500w)
   - `structure.md` — directory map, finding things table, generated files list (≤300w)
   - `data-models.md` — relationships paragraph first, then per-model field tables (≤500w)
   - `api.md` — auth, all endpoints, 2+ request/response examples, unused endpoints, error format (≤500w)
   - `patterns.md` — quick index first, then 5-7 patterns each with rule + code + Do not block (≤600w)
   - `conventions.md` — naming rules, imports, errors, Workflows section, tests, comments (≤300w)

Self-check before finishing: every file has complete frontmatter (title/type/project/ingested/updated)? No Known Issues/Dead Code sections in wiki pages? All required sections present?

Then: update index.md, append log, run /sync, **auto-symlink** CLAUDE.md into current repo.

---

## References

- `references/setup.md` — first-time setup, creating the config file
- `references/commands.md` — full instructions for /save, /sync, /adr, /sprint
- `references/claude-md-template.md` — CLAUDE.md template with all section blocks
- `scripts/init.sh` — creates vault structure and config file from scratch
