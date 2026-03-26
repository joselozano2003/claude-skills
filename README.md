# claude-skills

A collection of skills for [Claude Code](https://claude.ai/code) — reusable instruction sets that extend Claude's behavior for specific tasks.

## What are skills?

Skills are markdown files (`SKILL.md`) that Claude Code loads on demand. Each skill contains task-specific instructions, rules, and workflows. Claude Code invokes them automatically based on context, or you can trigger them manually with `/skill-name`.

## Skills

### `claude-api`
Build apps with the Claude API or Anthropic SDK. Handles API setup, tool use, streaming, and agent patterns. Triggers automatically when code imports `anthropic` or `@anthropic-ai/sdk`.

### `doc-coauthoring`
Structured workflow for co-authoring documentation. Guides through context transfer, iterative drafting, and reader verification. Use when writing proposals, specs, or technical docs.

### `frontend-design`
Generate distinctive, production-grade frontend interfaces. Avoids generic AI aesthetics — produces opinionated, polished UI code.

### `human-writer`
Write prose that sounds like a real person. Covers essays, emails, LinkedIn posts, cover letters, and any freeform text. Triggers on "ghostwrite", "make this sound human", "draft this", etc.

### `job-applications`
Generate tailored resumes and cover letters. Includes gap analysis, JD parsing, project selection heuristics, and .docx output. Personal skill — contains my profile and tailoring rules.

### `mcp-builder`
Guide for building MCP (Model Context Protocol) servers in Python (FastMCP) or TypeScript (MCP SDK). Covers tool design, authentication, error handling, and deployment patterns.

### `skill-creator`
Create, modify, and evaluate Claude Code skills. Includes evals, performance benchmarking, and description optimization for trigger accuracy.

## Usage

Skills are picked up automatically from `~/.claude/skills/` when Claude Code loads. Drop a folder with a `SKILL.md` into that directory and it becomes available immediately.

To invoke manually: type `/skill-name` in any Claude Code session.

## Structure

```
skills/
├── skill-name/
│   └── SKILL.md        # skill instructions (required)
│   └── references/     # supporting files the skill reads
│   └── scripts/        # helper scripts the skill runs
```
