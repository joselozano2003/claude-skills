# Setup Guide

Run this once. After setup, the skill works from any directory.

---

## What setup does

1. Creates the vault directory structure on disk
2. Writes `~/.claude/eng-brain-config.json` with the vault path
3. Creates the CLAUDE.md template in the vault root
4. Initializes wiki meta files (hot.md, index.md, log.md)

---

## Option A: Run the init script (recommended)

```bash
bash $SKILL_DIR/scripts/init.sh
```

The script will ask for a vault path (e.g. `~/Documents/eng-brain`) and do everything.

---

## Option B: Manual setup

### 1. Create the vault

```bash
VAULT=~/Documents/eng-brain   # change this to wherever you want it

mkdir -p $VAULT/wiki/{architecture,patterns,context,meta}
mkdir -p $VAULT/.claude/commands
```

### 2. Write the config file

```bash
mkdir -p ~/.claude
echo "{\"vault_path\": \"$(realpath $VAULT)\"}" > ~/.claude/eng-brain-config.json
cat ~/.claude/eng-brain-config.json   # verify
```

### 3. Copy the CLAUDE.md template

```bash
cp $SKILL_DIR/references/claude-md-template.md $VAULT/CLAUDE.md
```

### 4. Initialize meta files

```bash
# hot.md
cat > $VAULT/wiki/meta/hot.md << 'EOF'
---
title: Hot Cache
updated: YYYY-MM-DD
---
# Hot Cache
Vault just initialized. No sessions yet.
EOF

# index.md
cat > $VAULT/wiki/meta/index.md << 'EOF'
---
title: Wiki Index
---
# Wiki Index
## ADRs
*(none)*
## Patterns
*(none)*
## Context
*(none)*
EOF

# log.md
cat > $VAULT/wiki/meta/log.md << 'EOF'
# Session Log
DATE       | TYPE  | DETAILS
-----------|-------|--------
EOF
date_str=$(date +%Y-%m-%d)
echo "$date_str | SETUP | Vault initialized." >> $VAULT/wiki/meta/log.md
```

### 5. Open as Obsidian vault

In Obsidian: Manage Vaults → Open folder as vault → select `$VAULT`

### 6. Verify

```bash
cat ~/.claude/eng-brain-config.json
ls $VAULT/wiki/meta/
```

---

## Linking into a repo

In any repo where you want the CLAUDE.md available:

```bash
VAULT=$(cat ~/.claude/eng-brain-config.json | python3 -c "import sys,json; print(json.load(sys.stdin)['vault_path'])")
ln -s $VAULT/CLAUDE.md $(pwd)/CLAUDE.md
```

Claude Code picks it up automatically on next session start.
