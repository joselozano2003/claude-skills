/**
 * BASE COVER LETTER SCRIPT — Jose Lozano
 *
 * HOW TO USE:
 * 1. Copy this file to a temp location (e.g. /tmp/generate_[company]_cover.js)
 * 2. Replace OUTPUT_PATH with the actual destination
 * 3. Replace all CONTENT strings (date, salutation, paragraphs)
 *    — change ONLY text strings, never touch spacing/color/font values
 * 4. Run: cd /tmp && node generate_[company]_cover.js
 * 5. Validate: python [docx-skill-path]/scripts/office/validate.py [output]
 *
 * CRITICAL RULES:
 * - Do NOT change any spacing, margin, color, or font values
 * - Do NOT use em dashes (—) anywhere in content strings
 * - Smart quotes in JS strings: \u2018 \u2019 \u201C \u201D
 * - Apostrophes: \u2019 (e.g. didn\u2019t, I\u2019ve)
 * - docx package: npm install docx (if not present)
 * - Header is LEFT-aligned (not centered like resume)
 */

const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } = require('docx');
const fs = require('fs');

const NAVY  = "1F4E79";
const DGREY = "555555";
const BLACK = "000000";
const F     = "Calibri";

// ── helper (do not modify) ─────────────────────────────────────────────────

function bodyPara(text, spacingAfter = 200) {
  return new Paragraph({
    spacing: { before: 0, after: spacingAfter },
    alignment: AlignmentType.LEFT,
    children: [new TextRun({ text, font: F, bold: false, italic: false, color: BLACK, size: 22 })]
  });
}

// ── CONTENT — replace these strings ───────────────────────────────────────

const DATE        = "March 26, 2026";
const SALUTATION  = "Dear Hiring Team,";

// Body paragraphs — write as many as needed (typically 4-5)
// No em dashes. Smart quotes only. Short sentences land hard.
const P1 = "Replace this with paragraph 1.";
const P2 = "Replace this with paragraph 2.";
const P3 = "Replace this with paragraph 3.";
const P4 = "Replace this with paragraph 4.";

// ── OUTPUT PATH — replace this ─────────────────────────────────────────────

const OUTPUT_PATH = "/REPLACE/WITH/ACTUAL/PATH/Jose_Lozano_Cover_Letter.docx";

// ── document (do not modify below this line) ───────────────────────────────

const doc = new Document({
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
        alignment: AlignmentType.LEFT,
        children: [new TextRun({ text: "JOSE LOZANO", font: F, bold: true, color: NAVY, size: 32 })]
      }),

      new Paragraph({
        spacing: { before: 0, after: 20 },
        alignment: AlignmentType.LEFT,
        children: [new TextRun({
          text: "Calgary, AB   \u2022   +1 825 365 1552   \u2022   josecamilolozano2003@gmail.com",
          font: F, bold: false, italic: false, color: DGREY, size: 22
        })]
      }),

      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: NAVY, space: 2 } },
        spacing: { before: 60, after: 260 },
        children: []
      }),

      bodyPara(DATE, 200),
      bodyPara(SALUTATION, 220),

      bodyPara(P1, 200),
      bodyPara(P2, 200),
      bodyPara(P3, 200),
      bodyPara(P4, 260),

      bodyPara("Thank you for your time.", 260),
      bodyPara("Sincerely,", 60),

      new Paragraph({
        spacing: { before: 0, after: 0 },
        alignment: AlignmentType.LEFT,
        children: [new TextRun({ text: "Jose Lozano", font: F, bold: true, color: BLACK, size: 22 })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.mkdirSync(require('path').dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, buf);
  console.log("Written:", OUTPUT_PATH);
});