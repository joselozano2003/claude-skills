# Resume & Cover Letter Heuristics

## Resume Rules

### ATS & Format
- Single column, no tables, no text boxes
- Standard section headers: EDUCATION, TECHNICAL SKILLS, PROFESSIONAL EXPERIENCE, PROJECTS
- Keyword-rich skills section with explicit categories
- Section order: Education → Technical Skills → Professional Experience → Projects
- Optional: add LEADERSHIP section if role values extracurriculars (uses LASA story)

### Bullet writing
- Every bullet: action verb → outcome structure
- Quantified results front-loaded where possible
- Strong verbs: Engineered, Architected, Designed, Drove, Implemented, Deployed, Built, Owned
- Never claim sole ownership of something shared. MapleQuest infra = Jose's. MapleQuest app = team's.
- Never attribute GitHub Actions to LodgeLink. That was MapleQuest only.
- Never fabricate metrics. If a number doesn't exist, don't invent one.

### Hard rules
- No em dashes anywhere in the document
- No fabricating skills, tools, or frameworks Jose doesn't have
- Go = intermediate. Don't overclaim multi-year depth.
- Never say Jose "led" the MapleQuest project — he led the infra. The team built the app.

### Skills section
- Reorder Languages and Frameworks to lead with what the JD values most
- Add tools to Tools & Platforms only if Jose genuinely uses them (Claude Code, Cursor = yes)
- Group AWS services explicitly when the role is AWS-heavy: "AWS (CloudWatch, SQS, DynamoDB, ECS Fargate, S3)"

---

## Cover Letter Rules

### Content
- Each letter is tailored to the specific JD. Read it carefully. Address named technologies and values.
- Lead with what genuinely draws Jose to that role. Not a generic opener.
- **AWS is the silver bullet for technical roles**: agentic system, Java, full lifecycle ownership, no DevOps/QA, production scale, deliberate architecture decisions.
- **LodgeLink supports AWS**: Go microservices, GraphQL, React/Next.js, full ownership model.
- **MapleQuest is an add-on**: always frame as team project where Jose owned the infrastructure layer.
- **CSA GPT / Talk-PDF**: use for AI roles as evidence of genuine personal interest in LLM/RAG work.
- **Chrome Tab Recorder**: use for systems/infra roles to show fault-tolerant pipeline thinking.
- **Diplomat background** (7 countries): use for roles requiring cross-cultural collaboration or travel. Don't force it.
- **LASA VP of Events**: use only when role explicitly values extracurricular leadership.
- Never overclaim. If Jose doesn't have something, say so directly, then bridge to what he does have.

### Tone by company type
- **Stripe / Palantir**: direct, high-stakes, no warmth padding. Every sentence earns its place.
- **Startups (EviSmart, CORA, etc.)**: conversational, opinionated, first-person voice with real stakes.
- **Large enterprise (BMO, Fortinet, Xero)**: professional but not stiff. Enthusiastic about the domain.
- **Healthcare/mission-driven (Qualifacts)**: warm, genuine interest in the impact, honest about gaps.

### Prose rules
- No em dashes. Ever. Replace with: period (split the sentence), colon (introduce a list), comma (absorb the pause).
- No AI filler: no "it's worth noting", "delve", "dive into", "in today's world", "at the end of the day"
- No hollow openers: never start with "I am writing to apply for..."
- Vary sentence length. Short sentences land hard.
- Specific over general. Every claim grounded in a named project, number, or experience.
- Smart quotes via unicode: \u2018 \u2019 \u201C \u201D (apostrophes and quotes in JS strings)

### Format
- Default output: .docx styled to match resume (Calibri, navy blue header, ruled divider)
- Cover letter header: JOSE LOZANO (navy, bold, size 32, LEFT-aligned — NOT centered like resume)
- Contact line: Calibri, size 22, color 555555
- Divider: bottom border paragraph, navy, sz 8
- Body: Calibri, size 22, color 000000, spacing after 200 per paragraph
- Closing: "Thank you for your time." → "Sincerely," → bold "Jose Lozano"

---

## docx Format Spec (resume)

Reference these exact values — the base-resume.js script encodes them:

| Element | Value |
|---|---|
| Page size | US Letter: 12240 × 15840 DXA |
| Margins | top/bottom: 864, left/right: 1008 DXA |
| Font | Calibri throughout |
| Name | bold, color 1F4E79, size 36, centered |
| Contact | color 555555, size 18, centered |
| Section header | bold, color 1F4E79, size 22, bottom border SINGLE sz 8 color 1F4E79 space 2, spacing before 160 after 60 |
| Company name | bold, black, size 22; role in same para, color 444444, size 22, " | " separator |
| Date line | italic, color 444444, default size, spacing after 40 |
| Bullets | LevelFormat.BULLET, indent left 720, hanging 360, spacing before/after 30 |
| Skill lines | bold category label + normal text; last line spacing after 40, others after 30 |
| Project header | bold black size 22 name; italic grey tech stack, " | " separator |

**Critical docx rules:**
- Never use unicode bullets manually — always use numbering config with LevelFormat.BULLET
- Never use em dashes as separators — use " | "
- Never use \n — use separate Paragraph elements
- Validate every output with: `python [docx skill path]/scripts/office/validate.py [output.docx]`
- docx package installed at: the working directory where npm install was run (check /sessions/ or install fresh with `npm install docx`)