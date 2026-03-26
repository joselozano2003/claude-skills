/**
 * BASE RESUME SCRIPT — Jose Lozano
 *
 * HOW TO USE:
 * 1. Copy this file to a temp location (e.g. /tmp/generate_[company]_resume.js)
 * 2. Replace OUTPUT_PATH with the actual destination
 * 3. Replace all CONTENT strings (skills lines, bullet text, project headers)
 *    — change ONLY text strings, never touch spacing/color/font values
 * 4. Run: cd /tmp && node generate_[company]_resume.js
 * 5. Validate: python [docx-skill-path]/scripts/office/validate.py [output]
 *
 * CRITICAL RULES:
 * - Do NOT change any spacing, margin, color, or font values
 * - Do NOT use em dashes (—) anywhere in content strings
 * - Do NOT manually insert bullet characters — use the bullet() helper
 * - Smart quotes in JS strings: \u2018 \u2019 \u201C \u201D
 * - docx package: npm install docx (if not present)
 */

const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, LevelFormat } = require('docx');
const fs = require('fs');

const NAVY  = "1F4E79";
const GREY  = "444444";
const DGREY = "555555";
const BLACK = "000000";
const F     = "Calibri";

// ── helpers (do not modify) ────────────────────────────────────────────────

function sectionHeader(text) {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: NAVY, space: 2 } },
    spacing: { before: 160, after: 60 },
    children: [new TextRun({ text, font: F, bold: true, color: NAVY, size: 22 })]
  });
}

function companyLine(company, role) {
  return new Paragraph({
    spacing: { before: 120, after: 20 },
    children: [
      new TextRun({ text: company,         font: F, bold: true, color: BLACK, size: 22 }),
      new TextRun({ text: `  |   ${role}`, font: F, color: GREY, size: 22 })
    ]
  });
}

function dateLine(text) {
  return new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text, font: F, italic: true, color: GREY })]
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 30, after: 30 },
    children: [new TextRun({ text, font: F, color: BLACK })]
  });
}

function skillLine(category, skills, last = false) {
  return new Paragraph({
    spacing: { after: last ? 40 : 30 },
    children: [
      new TextRun({ text: `${category}: `, font: F, bold: true }),
      new TextRun({ text: skills, font: F })
    ]
  });
}

function projectHeader(name, tech) {
  return new Paragraph({
    spacing: { before: 120, after: 20 },
    children: [
      new TextRun({ text: name,           font: F, bold: true, color: BLACK, size: 22 }),
      new TextRun({ text: `  |  ${tech}`, font: F, italic: true, color: GREY })
    ]
  });
}

// ── CONTENT — replace these strings ───────────────────────────────────────

const SKILLS = {
  languages:  "Java, Go, JavaScript, TypeScript, Python, SQL",
  frameworks: "React, Next.js, gRPC, GraphQL, Django, TensorFlow, PyTorch, scikit-learn",
  cloud:      "AWS, Azure, Docker, DynamoDB, RDS PostgreSQL, S3, ECS Fargate",
  tools:      "Redis, Firebase, MongoDB, GitHub Actions, Claude Code, LLMs, RAG, Vector Databases, MCP",
};

const AWS_BULLETS = [
  "Engineered an agentic workflow execution service in Java within AWS CloudWatch, automating root cause analysis on alarm triggers via SQS-brokered, lease-managed Fargate workers, reducing MTTR by up to 30% across automation-enabled alarms serving millions of global users.",
  "Architected a scalable DynamoDB data model to manage operator-defined workflow configurations across millions of global users, ensuring high availability and low-latency access at scale.",
  "Integrated third-party diagnostic tools to automate stakeholder sharing of incident findings, accelerating cross-team incident response and improving operational visibility.",
];

const LL_BULLETS = [
  "Designed and implemented Go-based microservices with gRPC and Docker to decouple a monolithic backend, reducing overall memory consumption by 72% and improving system scalability.",
  "Developed GraphQL API endpoints in TypeScript that streamlined data retrieval and reduced query complexity across the core customer-facing web portal.",
  "Drove front-end performance improvements on the React and Next.js customer portal, cutting build and deployment times by 60% through Webpack optimizations that produced leaner production bundles.",
  "Participated in code reviews and partnered with product managers and designers on feature scoping, delivering production-grade enhancements across the full stack on a consistent release cadence.",
];

// Projects — replace name, tech stack string, and both bullet strings
const PROJECT_1 = {
  name: "MapleQuest",
  tech: "AWS, Swift, SwiftUI, Django, PostgreSQL",
  b1: "Built a native iOS social media application enabling users to discover and share geolocated points of interest across Canada, integrating CoreLocation and MapKit for real-time geospatial features.",
  b2: "Deployed scalable cloud infrastructure on AWS using ECS Fargate, RDS PostgreSQL, and S3; established automated CI/CD pipelines via GitHub Actions for container builds, ECR pushes, and zero-downtime production rollouts.",
};

const PROJECT_2 = {
  name: "CSA GPT",
  tech: "Python, React, TypeScript, Node.js, RAG, LLMs, Vector Databases",
  b1: "Developed an AI-powered compliance assistant for trades professionals, delivering code-compliant guidance across CSA, HVAC, plumbing, and electrical standards using Retrieval-Augmented Generation (RAG) and optimized prompt engineering.",
  b2: "Implemented an end-to-end RAG pipeline including PDF/text parsing, semantic chunking, embedding generation, and vector indexing, enabling fast and contextually accurate lookups across regulatory documents.",
};

// ── OUTPUT PATH — replace this ─────────────────────────────────────────────

const OUTPUT_PATH = "/REPLACE/WITH/ACTUAL/PATH/Jose_Lozano_Resume.docx";

// ── document (do not modify below this line) ───────────────────────────────

const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{
        level: 0,
        format: LevelFormat.BULLET,
        text: "\u2022",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } }
      }]
    }]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 864, right: 1008, bottom: 864, left: 1008 }
      }
    },
    children: [
      new Paragraph({
        spacing: { before: 0, after: 40 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "JOSE LOZANO", font: F, bold: true, color: NAVY, size: 36 })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 20 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({
          text: "Calgary, AB   \u2022   +1 825 365 1552   \u2022   josecamilolozano2003@gmail.com",
          font: F, color: DGREY, size: 18
        })]
      }),

      sectionHeader("EDUCATION"),
      new Paragraph({
        spacing: { before: 80, after: 20 },
        children: [
          new TextRun({ text: "University of Calgary",               font: F, bold: true, size: 22 }),
          new TextRun({ text: "   |   Bachelor of Computer Science", font: F, color: GREY, size: 22 })
        ]
      }),
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: "Expected Graduation: May 2026", font: F, italic: true, color: GREY })]
      }),

      sectionHeader("TECHNICAL SKILLS"),
      skillLine("Languages",              SKILLS.languages),
      skillLine("Frameworks",             SKILLS.frameworks),
      skillLine("Cloud & Infrastructure", SKILLS.cloud),
      skillLine("Tools & Platforms",      SKILLS.tools, true),

      sectionHeader("PROFESSIONAL EXPERIENCE"),

      companyLine("Amazon Web Services (AWS)", "Software Development Engineering Intern"),
      dateLine("Vancouver, BC   \u2022   May 2025 \u2013 August 2025"),
      ...AWS_BULLETS.map(b => bullet(b)),

      companyLine("LodgeLink", "Full Stack Software Developer Intern"),
      dateLine("Calgary, AB   \u2022   May 2024 \u2013 April 2025"),
      ...LL_BULLETS.map(b => bullet(b)),

      sectionHeader("PROJECTS"),

      projectHeader(PROJECT_1.name, PROJECT_1.tech),
      bullet(PROJECT_1.b1),
      bullet(PROJECT_1.b2),

      projectHeader(PROJECT_2.name, PROJECT_2.tech),
      bullet(PROJECT_2.b1),
      bullet(PROJECT_2.b2),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.mkdirSync(require('path').dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, buf);
  console.log("Written:", OUTPUT_PATH);
});
