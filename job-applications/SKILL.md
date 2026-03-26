---
name: job-applications
description: Generate tailored resumes and cover letters for Jose Lozano's job applications. Use this skill any time a job description is pasted, a company or role is mentioned for application, or the user says things like "apply to", "resume for", "cover letter for", "tailor my resume", or "new job". Automatically loads Jose's full profile, selects the right projects, tailors content to the JD, and outputs .docx files organized into company/role folders. Also trigger if the user asks to regenerate or fix a previously created resume or cover letter. This skill should be used proactively — if a JD appears anywhere in the conversation, assume this skill is needed.
---

# Jose Job Applications Skill

You are helping Jose Lozano (22, CS grad May 2026, Calgary) apply to software engineering jobs.

## Fixed paths (use these directly)

```
SKILL_DIR   = /Users/joselozano2003/.claude/skills/job-applications
RESUMES_ROOT = /Users/joselozano2003/Desktop/Resumes
```

Output for every application: `RESUMES_ROOT/[Company]/[Role]/`

## Step 0: Load context (do this once per session)

Read both files before doing any work:

- `$SKILL_DIR/references/profile.md` — Jose's full background, all 5 projects, experience, tech stack
- `$SKILL_DIR/references/heuristics.md` — All rules for tailoring, tone by company, what to never do

Optionally refresh profile from Obsidian first (skip if it fails):

```bash
obsidian read file="Jose Lozano - Full Profile" > "$SKILL_DIR/references/profile.md"
```

## Gap Analysis Mode

Trigger when the user asks to "compare with my resume", "highlight missing skills", "how well do I match", or pastes a JD with that intent.

1. **Extract JD requirements** into: Hard requirements / Nice-to-haves
2. **Score each** against Jose's profile:
   - ✅ Has it — clearly evidenced
   - ~ Partial — adjacent experience (note gap)
   - ❌ Missing — do not claim
3. **Show match summary** before generating files:

```
JD: [Role] at [Company]

MATCH SUMMARY
─────────────────────────────────────────
✅  [requirement]   → [evidence]
~   [requirement]   → [what Jose has / what's missing]
❌  [requirement]   → not in profile — do not claim

Overall fit: X% required, Y% nice-to-have
```

4. **Rephrase bullets** using JD language for ✅ items, honest framing for ~ items, omit ❌ items entirely. Target 80–90% coverage.

---

## Step 1: Analyze the JD

Extract:
- **Required tech** — languages, frameworks, tools explicitly named
- **Desired/bonus tech** — nice-to-haves Jose actually has
- **Role focus** — backend, frontend, AI/ML, infra, full-stack, security
- **Company tone** — startup (conversational), enterprise (professional), high-stakes like Stripe/Palantir (direct)
- **Key values** — ownership, collaboration, systems thinking, etc.

## Step 2: Make tailoring decisions

**Skills section**: Reorder Languages and Frameworks to lead with what the JD values. Never fabricate skills.

**Experience bullets**: Pick the version of each bullet most relevant to this JD. Reorder within a company if it helps. Never reassign work between companies.

**Hard rules (never break):**
- GitHub Actions belongs to MapleQuest only, never LodgeLink
- MapleQuest is a team project — Jose was sole architect of cloud infra specifically
- Go self-assessed as intermediate — don't overclaim
- No em dashes anywhere, ever
- No AI filler: no "delve", "dive into", "it's worth noting", "in today's world"

**Project selection (pick 2 from the 5 available):**
- AI/ML roles → CSA GPT + Talk-PDF
- Backend/infra roles → MapleQuest + Chrome Tab Recorder
- Frontend roles → CSA GPT + MapleQuest
- Security/network roles → CSA GPT + MapleQuest
- Full-stack (default) → CSA GPT + MapleQuest

## Step 3: Generate files

Use parallel subagents (one per file) to keep the main context clean.

### Resume subagent prompt

```
Generate a tailored resume for Jose Lozano applying to [ROLE] at [COMPANY].

PATHS:
  SKILL_DIR   = /Users/joselozano2003/.claude/skills/job-applications
  OUTPUT_PATH = /Users/joselozano2003/Desktop/Resumes/[Company]/[Role]/Jose_Lozano_Resume_[Company].docx

BASE SCRIPT: Read $SKILL_DIR/scripts/base-resume.js, copy to /tmp/generate_[company]_resume.js

CONTENT — replace these strings only, preserve all JS structure:

Skills:
- Languages: [tailored order]
- Frameworks: [tailored order]
- Cloud & Infrastructure: [any additions]
- Tools & Platforms: [tailored]

AWS bullets (B1–B3): [text]
LodgeLink bullets (B1–B4): [text]

Projects (2 selected):
Project 1: [Name] | [tech stack]
- B1, B2: [text]
Project 2: [Name] | [tech stack]
- B1, B2: [text]

STEPS:
1. mkdir -p "$(dirname $OUTPUT_PATH)"
2. Read base script, copy to /tmp/, replace OUTPUT_PATH and all content strings
3. cd /tmp && node generate_[company]_resume.js
4. Validate: python /Users/joselozano2003/.claude/skills/docx/scripts/office/validate.py "$OUTPUT_PATH"
5. Report: validation result + file path only
```

### Cover letter format selection

| User says | Format |
|---|---|
| "cover letter" (default) | Full — multi-paragraph, technical depth |
| "short", "brief", "punchy", "4-5 sentences" | Short — 4-5 sentences, one number, call to action |

### Cover letter subagent prompt (Full)

```
Generate a cover letter for Jose Lozano applying to [ROLE] at [COMPANY].

PATHS:
  SKILL_DIR   = /Users/joselozano2003/.claude/skills/job-applications
  OUTPUT_PATH = /Users/joselozano2003/Desktop/Resumes/[Company]/[Role]/Jose_Lozano_Cover_Letter_[Company].docx

BASE SCRIPT: Read $SKILL_DIR/scripts/base-cover-letter.js, copy to /tmp/generate_[company]_cover.js

COVER LETTER — provide exact text, unicode-escaped (smart quotes as \u2018/\u2019/\u201C\u201D, NO \u2014 em dashes):

Date: [Month DD, YYYY]
Salutation: Dear [Company] Hiring Team,
P1: [hook — specific, grounded in real work]
P2: [technical depth — AWS or LodgeLink as centrepiece]
P3: [second technical angle or project]
P4: [company-specific angle / why this role]
Closing: Thank you for your time.
Sign-off: Sincerely, / Jose Lozano (bold)

STEPS: same as resume pattern
```

### Cover letter subagent prompt (Short)

```
Generate a short cover letter (4-5 sentences) for Jose Lozano applying to [ROLE] at [COMPANY].

OUTPUT_PATH = /Users/joselozano2003/Desktop/Resumes/[Company]/[Role]/Jose_Lozano_Cover_Letter_[Company]_Short.docx
BASE SCRIPT: /Users/joselozano2003/.claude/skills/job-applications/scripts/base-cover-letter.js

CONTENT — exactly 4-5 sentences:
S1 (hook): specific thing about this company/role that interests Jose
S2 (achievement): one real result with a number
S3 (skill match): connects Jose's background to the core JD requirement
S4 (call to action): confident, specific close
S5 (optional): only if needed for flow

Use P1 for the full block, leave P2/P3/P4 as empty strings.
No em dashes. No hollow openers. Smart quotes only.

STEPS: same as resume pattern
```

## Step 4: After generating

- Show file paths (e.g. `/Users/joselozano2003/Desktop/Resumes/[Company]/[Role]/...`)
- 2-3 sentence summary of key tailoring decisions
- If no cover letter was requested, ask once: "Want a cover letter for this one?"

## Context rules

- Never re-embed full JS scripts in the main context
- Keep explanations to 3-4 sentences per file
- If context grows large, suggest a fresh session
