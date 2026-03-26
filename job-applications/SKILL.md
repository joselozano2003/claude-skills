---
name: jose-job-applications
description: Generate tailored resumes and cover letters for Jose Lozano's job applications. Use this skill any time a job description is pasted, a company or role is mentioned for application, or the user says things like "apply to", "resume for", "cover letter for", "tailor my resume", or "new job". Automatically loads Jose's full profile, selects the right projects, tailors content to the JD, and outputs .docx files organized into company/role folders. Also trigger if the user asks to regenerate or fix a previously created resume or cover letter. This skill should be used proactively — if a JD appears anywhere in the conversation, assume this skill is needed.
---
 
# Jose Job Applications Skill
 
You are helping Jose Lozano (22, CS grad May 2026, Calgary) apply to software engineering jobs. Every session starts the same way: refresh the profile from Obsidian, read the heuristics, understand the JD, tailor the output, keep context lean.
 
## Step 0: Resolve paths + refresh profile (do this first, every session)
 
### 0a. Establish concrete paths
 
This SKILL.md lives inside the Resumes folder. Derive both key paths from where this file is located:
 
```
SKILL_DIR  = (directory containing this SKILL.md)
             e.g. /sessions/[id]/mnt/Resumes/.skills/jose-job-applications
 
RESUMES_ROOT = SKILL_DIR/../../
             e.g. /sessions/[id]/mnt/Resumes
```
 
All output files go directly under `RESUMES_ROOT/[Company]/[Role]/` — never anywhere else. Do not use temp folders, workspace subdirectories, or deeply nested paths for final output.
 
To compute RESUMES_ROOT in bash:
```bash
SKILL_DIR="$(dirname "$(realpath "$0")")"   # or use the known path
RESUMES_ROOT="$(realpath "$SKILL_DIR/../..")"
echo $RESUMES_ROOT   # should print .../mnt/Resumes
```
 
### 0b. Refresh profile from Obsidian
 
```bash
obsidian read file="Jose Lozano - Full Profile" > "$SKILL_DIR/references/profile.md"
```
 
If Obsidian is not open or the command fails, fall back to the existing `references/profile.md`. Do not block on this step.
 
## Step 1: Load context (do this once per session)
 
Read these two files before doing any work:
 
- **`references/profile.md`** — Jose's full background, all 5 projects, experience details, tech stack, motivations (refreshed from Obsidian above)
- **`references/heuristics.md`** — All rules for resume tailoring, cover letter writing, tone by company, what to never do
 
Do not proceed without reading both. They are short and contain everything you need.
 
## Gap Analysis Mode
 
Trigger this mode when the user says things like "compare with my resume", "highlight missing skills", "how well do I match", "rephrase my experience to match", or pastes a JD with that kind of intent.
 
### How to run a gap analysis
 
**1. Extract all JD requirements** into two lists:
- Hard requirements (Required / Must have)
- Soft requirements (Nice to have / Bonus)
 
**2. Score each requirement against Jose's actual profile** using three labels:
- ✅ **Has it** — Jose clearly has this from experience, projects, or education
- 〜 **Partial** — Jose has adjacent experience that partially covers it (note what's missing)
- ❌ **Missing** — Jose does not have this and it should not be claimed
 
**3. Output a match summary** — present this to Jose before generating any files:
 
```
JD: [Role] at [Company]
 
MATCH SUMMARY
─────────────────────────────────────────
✅  [requirement]   → [evidence from profile]
〜  [requirement]   → [what Jose has / what's missing]
❌  [requirement]   → not in profile — do not claim
 
Overall fit: [X]% of required, [Y]% of nice-to-have
```
 
**4. Rephrase experience to maximize match without exaggeration**
- Reframe existing bullets to use the JD's language where Jose genuinely did that work
- Lead bullets with the most relevant work for this JD
- For ✅ items: use the JD's exact terminology in the bullet if it accurately describes what Jose did
- For 〜 items: describe what Jose actually did, don't stretch it to claim full coverage
- For ❌ items: never mention them in the resume — omit or replace with something Jose does have
- Target 80–90% requirement coverage. Hitting 100% through fabrication is worse than honest 80%.
 
**5. Then generate the resume** (and cover letter if requested) using the rephrased bullets.
 
---
 
## Step 2: Analyze the JD
 
Extract:
- **Required tech** — languages, frameworks, tools explicitly named
- **Desired/bonus tech** — nice-to-haves that Jose actually has
- **Role focus** — backend, frontend, AI/ML, infra, full-stack, security
- **Company tone** — startup (conversational), enterprise (professional), high-stakes like Stripe or Palantir (direct)
- **Key values** — ownership, collaboration, systems thinking, mentorship, etc.
 
## Step 3: Make tailoring decisions
 
### Skills section ordering
Reorder Languages and Frameworks to lead with what the JD cares most about. Never fabricate skills Jose does not have.
 
### Experience bullet selection and framing
Each bullet should be the version of that work most relevant to this JD. Reorder bullets within a company if it improves relevance. Never reassign work between companies or fabricate metrics.
 
**Fixed rules (never break these):**
- GitHub Actions belongs to MapleQuest only, never LodgeLink
- MapleQuest is a team project — Jose was sole architect of cloud infra specifically
- Go self-assessed as intermediate — don't overclaim
- No em dashes anywhere, ever (not in resumes, not in cover letters)
- No AI filler phrases: no "delve", "dive into", "it's worth noting", "in today's world"
 
### Project selection (pick 2 best fits from the 5 available)
See `references/profile.md` for full project details. Quick guide:
- **AI/ML roles** → CSA GPT + Talk-PDF (both RAG/LLM projects)
- **Backend/infra roles** → MapleQuest + Chrome Tab Recorder (architecture + fault-tolerant pipelines)
- **Frontend roles** → CSA GPT + MapleQuest (React/TypeScript + infra ownership)
- **Security/network roles** → CSA GPT + MapleQuest (Python pipeline + CI/CD)
- **General full-stack** → CSA GPT + MapleQuest (safe default)
 
## Step 4: Generate files using parallel subagents
 
Use parallel subagents to keep main context clean. One subagent per file.
 
### Critical: keep subagent prompts lean
 
Do NOT embed the full JS source in subagent prompts. Instead, tell the subagent:
- Read the base script from: `[skill_dir]/scripts/base-resume.js` or `base-cover-letter.js`
- Copy it to a working path, replace the output path and all content strings
- Run it, validate it
 
The base scripts live at the same path as this SKILL.md, under `scripts/`.
 
### Subagent prompt pattern for resume
 
```
Generate a tailored resume for Jose Lozano applying to [ROLE] at [COMPANY].
 
PATHS (compute these first):
  SKILL_DIR   = [absolute path to jose-job-applications skill folder]
  OUTPUT_PATH = [SKILL_DIR]/../../[Company]/[Role]/Jose_Lozano_Resume_[Company].docx
 
  Example: if SKILL_DIR = /sessions/abc123/mnt/Resumes/.skills/jose-job-applications
           OUTPUT_PATH  = /sessions/abc123/mnt/Resumes/[Company]/[Role]/Jose_Lozano_Resume_[Company].docx
 
BASE SCRIPT: Read $SKILL_DIR/scripts/base-resume.js, copy to /tmp/generate_[company]_resume.js
 
CONTENT CHANGES — replace these strings only, preserve all JS structure:
 
Skills:
- Languages: [tailored order]
- Frameworks: [tailored order]
- Cloud & Infrastructure: [any additions]
- Tools & Platforms: [tailored]
 
AWS bullets:
- B1: [text]
- B2: [text]
- B3: [text]
 
LodgeLink bullets (in order):
- B1: [text]
- B2: [text]
- B3: [text]
- B4: [text]
 
Projects (2 selected):
Project 1: [Name] | [tech stack]
- B1: [text]
- B2: [text]
 
Project 2: [Name] | [tech stack]
- B1: [text]
- B2: [text]
 
STEPS:
1. mkdir -p "$(dirname $OUTPUT_PATH)"
2. Read base script, copy to /tmp/, replace OUTPUT_PATH and all content strings
3. cd /tmp && node generate_[company]_resume.js
4. Validate: python $SKILL_DIR/../../.claude/skills/docx/scripts/office/validate.py "$OUTPUT_PATH"
5. Report: validation result + file path only
```
 
### Cover letter mode: which format to use
 
Two cover letter formats exist. Choose based on what the user asks for:
 
| User says | Format |
|---|---|
| "cover letter" (no other qualifier) | **Full** — multi-paragraph, technical depth |
| "short cover letter", "4-5 sentences", "brief", "punchy", "quick" | **Short** — 4-5 sentences, one number, call to action |
 
---
 
### Subagent prompt pattern for cover letter (Full format)
 
```
Generate a cover letter for Jose Lozano applying to [ROLE] at [COMPANY].
 
PATHS (compute these first):
  SKILL_DIR   = [absolute path to jose-job-applications skill folder]
  OUTPUT_PATH = [SKILL_DIR]/../../[Company]/[Role]/Jose_Lozano_Cover_Letter_[Company].docx
 
BASE SCRIPT: Read $SKILL_DIR/scripts/base-cover-letter.js, copy to /tmp/generate_[company]_cover.js
 
COVER LETTER PARAGRAPHS — provide exact text, unicode-escaped (smart quotes as \u2018/\u2019/\u201C\u201D, NO \u2014 em dashes):
 
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
 
---
 
### Subagent prompt pattern for cover letter (Short format)
 
Trigger: user asks for a "short cover letter", "4-5 sentences", "brief", or "punchy" version.
 
Structure — exactly 4-5 sentences, in this order:
1. **Personal hook** — one specific thing about the company or role that genuinely interests Jose (not generic flattery)
2. **Measurable achievement** — one real result with a number (e.g. "reduced build times by 60%", "serving millions of global users", "cut memory consumption by 72%")
3. **Direct skill match** — one sentence connecting Jose's background to the core requirement of this JD
4. **Call to action** — confident, specific close (e.g. "I'd welcome the chance to walk you through..." or "I'd love to bring this to [Company].")
5. *(optional 5th sentence if needed for flow — keep it tight)*
 
Rules (same as full format):
- No em dashes
- No hollow openers ("I am writing to apply...")
- Smart quotes only
- Pick the achievement number that best matches what this JD cares about
 
```
Generate a short cover letter (4-5 sentences) for Jose Lozano applying to [ROLE] at [COMPANY].
 
PATHS (compute these first):
  SKILL_DIR   = [absolute path to jose-job-applications skill folder]
  OUTPUT_PATH = [SKILL_DIR]/../../[Company]/[Role]/Jose_Lozano_Cover_Letter_[Company]_Short.docx
 
BASE SCRIPT: Read $SKILL_DIR/scripts/base-cover-letter.js, copy to /tmp/generate_[company]_cover_short.js
 
CONTENT — write exactly 4-5 sentences following this structure:
S1 (personal hook): [specific thing about this company/role that interests Jose]
S2 (measurable achievement): [one result with a number from Jose's real experience]
S3 (skill match): [one sentence connecting Jose's background to the core JD requirement]
S4 (call to action): [confident, specific close]
S5 (optional): [only if needed for flow]
 
Format as body paragraphs — use P1 for the full 4-5 sentence block, leave P2/P3/P4 empty strings "".
No em dashes. No hollow openers. Smart quotes only.
 
STEPS: same as resume pattern
```
 
## Step 5: Folder organization
 
> ⚠️ FILES MUST GO IN THE RESUMES ROOT — NOT IN TEMP FOLDERS OR SKILL SUBDIRECTORIES
 
The output root is always: `SKILL_DIR/../../` — that is, two levels up from the skill folder, which resolves to the `Resumes/` folder the user selected.
 
Every application goes into: `RESUMES_ROOT/[Company]/[Role]/`
 
Concrete examples (given SKILL_DIR = /sessions/abc/mnt/Resumes/.skills/jose-job-applications):
- `/sessions/abc/mnt/Resumes/Stripe/JS Infrastructure Engineer/Jose_Lozano_Resume_Stripe.docx`
- `/sessions/abc/mnt/Resumes/Amazon/SWE New Grad/Jose_Lozano_Resume_Amazon.docx`
- `/sessions/abc/mnt/Resumes/EviSmart/Front End Developer/Jose_Lozano_Resume_EviSmart.docx`
 
Rules:
- Never save to `/tmp/`, `outputs/`, `workspace/`, or anywhere inside `.skills/`
- Use a distinct subfolder per role even at the same company
- Create the folder with `mkdir -p` before writing the file
 
## Step 6: After generating
 
- Present file links using `computer://` paths
- Give a 2-3 sentence summary of the key tailoring decisions (not a 6-bullet breakdown)
- If cover letter was NOT requested, ask once: "Want a cover letter for this one?"
- Do NOT ask about cover letter if one was already generated
 
## Context management rules
 
- Never re-embed the full JS base scripts in the main context
- Keep response explanations to 3-4 sentences max per file
- If context grows large, suggest starting a fresh session and point user to this skill
 