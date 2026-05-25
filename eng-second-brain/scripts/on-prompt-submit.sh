#!/bin/bash
# Remind user to /save when they use closing phrases while context is still live

INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty' 2>/dev/null)

if [ -z "$PROMPT" ]; then
    exit 0
fi

if echo "$PROMPT" | grep -qiE \
    "^(bye|goodbye|thanks|done|that.?s all|wrap up|end session|signing off|see you|closing|finish up|all done)"; then
    echo "Reminder: run /save before you go — context is lost when this session closes."
fi
