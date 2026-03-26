# Jose Lozano — Full Profile

## Personal
- Age: 22
- Location: Calgary, AB
- Phone: +1 825 365 1552
- Email: josecamilolozano2003@gmail.com
- Background: Grew up across 7 countries (father is a diplomat). Fluent in adapting quickly and building trust with diverse people. Sees travel requirements as a feature.

## Education
Bachelor of Computer Science — University of Calgary
Expected Graduation: May 2026

## Technical Skills (base — reorder per JD)
- **Languages:** Java, Go, JavaScript, TypeScript, Python, SQL
- **Frameworks:** React, Next.js, gRPC, GraphQL, Django, TensorFlow, PyTorch, scikit-learn
- **Cloud & Infrastructure:** AWS, Azure, Docker, DynamoDB, RDS PostgreSQL, S3, ECS Fargate
- **Tools & Platforms:** Redis, Firebase, MongoDB, GitHub Actions, Claude Code, Cursor, LLMs, RAG, Vector Databases, MCP

---

## Professional Experience

### Amazon Web Services (AWS) — Software Development Engineering Intern
May 2025 – August 2025 | Vancouver, BC
**Tech stack: Java, AWS (SQS, DynamoDB, ECS Fargate, CloudWatch), event-driven architecture**

Engineering culture: No dedicated DevOps or QA team. Engineers owned the full lifecycle: design, structured unit/integration/e2e testing, CI pipelines, deployment, and production reliability.

**Architecture (CloudWatch Agentic System):**
- Event-driven: investigations triggered by CloudWatch alarm firing or user-initiated telemetry
- SQS as message broker / event bus
- Each Fargate task acquired a lease on an investigation, solely dedicated to that job until completion
- Lease released on completion signal; heartbeat/timeout fallback for stalled tasks
- Point-in-time recovery: failed tasks resumed from exact point of failure, not from scratch

**Available bullets (mix and reframe per JD):**
- Engineered an agentic workflow execution service in Java within AWS CloudWatch, automating root cause analysis on alarm triggers via SQS-brokered, lease-managed Fargate workers, reducing MTTR by up to 30% across automation-enabled alarms serving millions of global users.
- Architected a DynamoDB data model for operator-defined workflow configurations at global scale, deliberately choosing eventually consistent reads to halve cost and maximize throughput for a 95% read-heavy, non-critical data layer.
- Integrated third-party diagnostic tools via APIs to automate stakeholder sharing of incident findings, accelerating cross-team incident response with full lifecycle ownership across design, testing, deployment, and production reliability.
- Maintained full SDLC ownership with no dedicated DevOps or QA support, writing structured unit and integration tests in Java, managing CI pipelines, and maintaining production monitoring through CloudWatch.

### LodgeLink — Full Stack Software Developer Intern
May 2024 – April 2025 | Calgary, AB
**Tech stack: Go, gRPC, Docker, React, Next.js, TypeScript, GraphQL**

Management gave end-to-end ownership. No handholding. Accountable for delivery.

**Available bullets (reorder per JD focus):**
- Decomposed a monolithic backend into Go-based microservices using gRPC and Docker, applying service boundary design that reduced memory consumption by 72% and established a scalable, independently deployable architecture.
- Built RESTful and GraphQL API endpoints in TypeScript, streamlining data retrieval and reducing query complexity across the core customer-facing web portal.
- Led front-end modernization of the customer portal in React and Next.js, driving Webpack optimizations that cut build and deployment times by 60%.
- Participated in code reviews and partnered with product managers and designers on feature scoping, delivering production-grade enhancements across the full stack on a consistent release cadence.
- Collaborated with product managers and designers to translate wireframes into production components, delivering enhancements on a consistent weekly release cadence.

---

## Projects (5 available — pick 2 best fits per role)

### 1. MapleQuest
**Team school project | AWS, Swift, SwiftUI, Django, PostgreSQL, GitHub Actions, Docker**
Role: Sole architect of all cloud infrastructure (team built the iOS app, Jose owned infra entirely)

Key facts:
- Native iOS social media app for geolocated points of interest across Canada
- CoreLocation + MapKit for real-time geospatial features
- Cloud infra: ECS Fargate, RDS PostgreSQL, S3, IAM, load balancers, Secrets Manager
- CI/CD: GitHub Actions — container builds, ECR pushes, zero-downtime rollouts
- Local Docker environment mirroring cloud setup for pre-production validation
- Team interviewed users before building; initial assumptions were almost entirely wrong; shipped product looked nothing like first idea

**Best for:** Infra roles, CI/CD emphasis, AWS architecture, full SDLC, systems design

### 2. CSA GPT
**School project | Python, React, TypeScript, Node.js, RAG, LLMs, Vector Databases**

Key facts:
- AI-powered compliance assistant for trades professionals (CSA, HVAC, plumbing, electrical standards)
- RAG architecture with optimized prompt engineering
- Full Python pipeline: PDF/text parsing, semantic chunking, embedding generation, vector indexing
- React + TypeScript + Node.js frontend/backend

**Best for:** AI/ML roles, RAG/LLM roles, Python backend, full-stack AI

### 3. Talk-PDF
**Personal project | Next.js, TypeScript, OpenAI API, Prisma, PostgreSQL, AWS S3, Vector Databases**

Key facts:
- Conversational PDF analysis tool — users query document content through natural language
- GPT-3.5 Turbo + vector database for semantic similarity search
- Cloud PostgreSQL + Prisma ORM for document metadata management
- AWS S3 for file storage
- Type-safe TypeScript API endpoints bridging frontend with AI services

**Best for:** AI/ML roles, RAG/LLM roles, personal AI project signal, full-stack with AWS

### 4. Chrome Tab Recorder
**Personal project | Chrome Extension (MV3), Node.js, BullMQ, Redis, Google Cloud APIs, Docker**

Key facts:
- Resilient Chrome Extension automating 1440p tab recording + AI transcription
- MediaRecorder API + IndexedDB streaming for flat RAM usage (recordings > 2 hours)
- Fault-tolerant job processing pipeline: BullMQ + Redis for orchestration
- Exponential backoff retries, state persistence to chrome.storage.local (survives browser crashes + service worker suspensions)
- Google Drive resumable upload API for high data retention
- Docker environment mirroring Cloud Run + Upstash Redis for production parity

**Best for:** Backend/infra roles, distributed systems, fault-tolerant pipeline design, systems thinking roles

### 5. Party Fun Medley
**Team school project | Next.js, PostgreSQL, Supabase, Webhooks**

Key facts:
- Real-time game catalogue for a Web-Based Systems course
- Supabase for auth + real-time data updates via webhooks
- Next.js 14 + PostgreSQL
- Managed GitHub repo + coordinated team of 6 developers

**Best for:** Entry-level roles needing team collaboration signal; least technical of the 5 — use only if role explicitly values teamwork over individual technical depth

---

## Leadership
**Vice President of Events — Latin American Student Association (LASA), University of Calgary**
- Grew regular attendance from 15-20 to 30-40 per event
- Organized largest event to date: 150+ paid attendees (Latin American themed party)
- Overhauled Instagram content strategy and personally helped members adapt to university and Canadian life
- Also organizes professional events including career panels

**Use when:** Role explicitly values extracurricular leadership, community building, or cross-cultural collaboration.

---

## Motivations & Values
- Impact-driven: wants to build things where getting it wrong has real consequences
- Agentic/AI systems: CloudWatch project was formative
- End-to-end ownership: most energized when fully accountable from design to production
- User empathy: believes understanding the person on the other end separates good from great software
- Learning velocity: consistently picks up new languages/frameworks mid-project and delivers
- Comfortable with travel and change: grew up across 7 countries

## AI Tools
- Uses Claude Code for code generation and autocomplete
- Uses Claude and ChatGPT as thinking partners for debugging and architecture decisions
- Treats AI output like a Stack Overflow answer: useful starting point that still needs validation

## Writing Preferences
- No em dashes in any response (not in resume bullets, not in cover letter prose)
- Direct, efficient, practical tone
- Prefers depth over surface-level answers