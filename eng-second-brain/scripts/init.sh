#!/bin/bash
# eng-second-brain init script
# Run once to set up the vault and config file

set -e

echo ""
echo "Engineering Second Brain — Setup"
echo "================================="
echo ""

# Get vault path
DEFAULT_VAULT="$HOME/Documents/eng-brain"
read -p "Vault path [$DEFAULT_VAULT]: " VAULT_INPUT
VAULT="${VAULT_INPUT:-$DEFAULT_VAULT}"
VAULT=$(eval echo "$VAULT")   # expand ~ if present
VAULT=$(python3 -c "import os,sys; print(os.path.abspath(sys.argv[1]))" "$VAULT")

echo ""
echo "Vault will be created at: $VAULT"
read -p "Confirm? (y/n): " CONFIRM
if [[ "$CONFIRM" != "y" ]]; then
  echo "Aborted."
  exit 1
fi

# Determine skill dir (where this script lives)
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo ""
echo "Creating vault structure..."

# Create directories
mkdir -p "$VAULT/wiki/architecture"
mkdir -p "$VAULT/wiki/patterns"
mkdir -p "$VAULT/wiki/context"
mkdir -p "$VAULT/wiki/meta"
mkdir -p "$VAULT/.claude/commands"

# Write config
mkdir -p "$HOME/.claude"
echo "{\"vault_path\": \"$VAULT\"}" > "$HOME/.claude/eng-brain-config.json"
echo "Config written to ~/.claude/eng-brain-config.json"

# Copy CLAUDE.md template
cp "$SKILL_DIR/references/claude-md-template.md" "$VAULT/CLAUDE.md"
echo "CLAUDE.md template created at $VAULT/CLAUDE.md"

# Initialize meta files
TODAY=$(date +%Y-%m-%d)

cat > "$VAULT/wiki/meta/hot.md" << EOF
---
title: Hot Cache
updated: $TODAY
---
# Hot Cache
Vault just initialized. No sessions yet.

**Next:** Run \`/sprint start\` with your first sprint goal, then \`/sync\`.
EOF

cat > "$VAULT/wiki/meta/index.md" << EOF
---
title: Wiki Index
updated: $TODAY
---
# Wiki Index

## ADRs
*(none)*

## Patterns
*(none)*

## Context
*(none)*
EOF

cat > "$VAULT/wiki/meta/log.md" << EOF
# Session Log

DATE       | TYPE  | DETAILS
-----------|-------|--------
$TODAY | SETUP | Vault initialized at $VAULT
EOF

echo ""
echo "Done. Summary:"
echo "  Vault:  $VAULT"
echo "  Config: ~/.claude/eng-brain-config.json"
echo ""
echo "Next steps:"
echo "  1. Open $VAULT as an Obsidian vault"
echo "  2. Open Claude Code in any repo: cd your-repo && claude"
echo "  3. Run: /sprint start"
echo "  4. To link CLAUDE.md into a repo:"
echo "     ln -s $VAULT/CLAUDE.md \$(pwd)/CLAUDE.md"
echo ""
