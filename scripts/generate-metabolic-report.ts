import fs from 'fs';
import path from 'path';

interface QuestionItem {
  id: number;
  type: 'answered' | 'research';
  title: string;
  category: string;
  content: string;
  rawMarkdown: string;
}

interface ReportMetadata {
  title: string;
  subtitle: string;
  author: string;
  date: string;
  version: string;
  totalAnsweredQuestions: number;
  totalResearchQuestions: number;
}

const DEFAULT_METADATA: ReportMetadata = {
  title: 'Metabolic Matrix Research Findings',
  subtitle: 'Comprehensive Analysis & Future Research Roadmap',
  author: 'Metabolic Research AI System',
  date: new Date().toISOString().split('T')[0],
  version: '1.0.0',
  totalAnsweredQuestions: 20,
  totalResearchQuestions: 20,
};

/**
 * Parses markdown frontmatter and content.
 */
function parseMarkdownFile(filePath: string): { frontmatter: Record<string, string>; body: string } {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: fileContent };
  }

  const yamlLines = match[1].split('\n');
  const frontmatter: Record<string, string> = {};

  for (const line of yamlLines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim().replace(/^['"]|['"]$/g, '');
      frontmatter[key] = value;
    }
  }

  return { frontmatter, body: match[2] };
}

/**
 * Basic markdown to HTML renderer without external heavy dependencies.
 */
function renderMarkdownToHtml(markdown: string): string {
  let html = markdown;

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold & Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

  // Unordered lists
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
  // Clean double <ul> wrapping
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // Line breaks & paragraphs
  const paragraphs = html.split(/\n\r?\n/);
  html = paragraphs
    .map((p) => {
      const trimmed = p.trim();
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<pre') ||
        trimmed.startsWith('<ul') ||
        trimmed.startsWith('<blockquote')
      ) {
        return trimmed;
      }
      return trimmed ? `<p>${trimmed}</p>` : '';
    })
    .filter(Boolean)
    .join('\n');

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Scans directories for markdown files.
 */
function loadMarkdownQuestions(baseDir: string): QuestionItem[] {
  const items: QuestionItem[] = [];

  if (!fs.existsSync(baseDir)) {
    console.warn(`[Warning] Directory not found: ${baseDir}. Creating placeholder standard list.`);
    return generateFallbackQuestions();
  }

  const files = fs.readdirSync(baseDir).filter((file) => file.endsWith('.md'));

  for (const file of files) {
    const fullPath = path.join(baseDir, file);
    const { frontmatter, body } = parseMarkdownFile(fullPath);

    const id = parseInt(frontmatter.id || file.match(/\d+/)?.[0] || '0', 10);
    const type = frontmatter.type === 'research' ? 'research' : 'answered';
    const title = frontmatter.title || file.replace(/\.md$/, '').replace(/[-_]/g, ' ');
    const category = frontmatter.category || 'General Metabolism';

    items.push({
      id,
      type,
      title,
      category,
      content: renderMarkdownToHtml(body),
      rawMarkdown: body,
    });
  }

  return items.sort((a, b) => a.id - b.id);
}

/**
 * Generate fallback items if content directory is missing.
 */
function generateFallbackQuestions(): QuestionItem[] {
  const items: QuestionItem[] = [];

  for (let i = 1; i <= 20; i++) {
    items.push({
      id: i,
      type: 'answered',
      title: `Answered Metabolic Question ${i}: Primary Pathways & Flux Analysis`,
      category: i <= 5 ? 'Glycolysis & Bioenergetics' : i <= 10 ? 'Lipid Metabolism' : i <= 15 ? 'Mitochondrial Dynamics' : 'Systemic Signaling',
      content: `<p>Detailed answer evaluating key biochemical reactions, enzyme kinetics, and regulatory feedback loops for metabolic question ${i}.</p>`,
      rawMarkdown: `Detailed answer for question ${i}`,
    });
  }

  for (let i = 21; i <= 40; i++) {
    const researchNum = i - 20;
    items.push({
      id: i,
      type: 'research',
      title: `Follow-up Research Question ${researchNum}: Advanced Metabolic Interventions`,
      category: researchNum <= 5 ? 'Targeted Therapeutics' : researchNum <= 10 ? 'Nutri-Genomics' : researchNum <= 15 ? 'Metabolomic Profiling' : 'Translational Medicine',
      content: `<p>In-depth research scope, proposed methodologies, and data collection protocols to gather further insights for follow-up question ${researchNum}.</p>`,
      rawMarkdown: `Follow-up research scope for question ${researchNum}`,
    });
  }

  return items;
}

/**
 * Generates printable HTML string with modern PDF-friendly styles.
 */
function generateReportHtml(metadata: ReportMetadata, items: QuestionItem[]): string {
  const answeredItems = items.filter((item) => item.type === 'answered');
  const researchItems = items.filter((item) => item.type === 'research');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(metadata.title)}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
      @bottom-right {
        content: counter(page);
      }
    }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #1a202c;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background: #fff;
    }
    .cover-page {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 90vh;
      text-align: center;
      border-bottom: 3px solid #2b6cb0;
    }
    .cover-title {
      font-size: 32pt;
      font-weight: 800;
      color: #2b6cb0;
      margin-bottom: 10px;
    }
    .cover-subtitle {
      font-size: 18pt;
      color: #4a5568;
      margin-bottom: 40px;
    }
    .meta-box {
      margin-top: 50px;
      padding: 20px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background-color: #f7fafc;
      width: 80%;
      text-align: left;
    }
    .meta-item {
      font-size: 11pt;
      margin-bottom: 8px;
    }
    .toc {
      page-break-after: always;
      padding: 20px 0;
    }
    .toc h2 {
      border-bottom: 2px solid #2b6cb0;
      padding-bottom: 5px;
      color: #2b6cb0;
    }
    .toc-ul {
      list-style-type: none;
      padding-left: 0;
    }
    .toc-li {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px dotted #cbd5e0;
      font-size: 10pt;
    }
    .section-header {
      background-color: #2b6cb0;
      color: #ffffff;
      padding: 12px 20px;
      font-size: 16pt;
      font-weight: bold;
      border-radius: 4px;
      margin-top: 30px;
      margin-bottom: 20px;
      page-break-before: always;
    }
    .question-card {
      margin-bottom: 25px;
      padding: 18px;
      border: 1px solid #e2e8f0;
      border-left: 5px solid #3182ce;
      border-radius: 4px;
      background-color: #ffffff;
      page-break-inside: avoid;
    }
    .question-card.research {
      border-left-color: #dd6b20;
    }
    .question-title {
      font-size: 13pt;
      font-weight: bold;
      color: #2d3748;
      margin-top: 0;
      margin-bottom: 8px;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      font-size: 8pt;
      font-weight: uppercase;
      letter-spacing: 0.5px;
      border-radius: 12px;
      background: #edf2f7;
      color: #4a5568;
      margin-bottom: 10px;
    }
    .badge.research {
      background: #feebc8;
      color: #9c4221;
    }
    .question-body {
      font-size: 10.5pt;
      color: #2d3748;
    }
    blockquote {
      border-left: 3px solid #cbd5e0;
      margin-left: 0;
      padding-left: 12px;
      color: #718096;
      font-style: italic;
    }
    pre {
      background-color: #edf2f7;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 9pt;
    }
    .footer {
      text-align: center;
      font-size: 9pt;
      color: #a0aec0;
      margin-top: 40px;
    }
  </style>
</head>
<body>

  <!-- Cover Page -->
  <div class="cover-page">
    <div class="cover-title">${escapeHtml(metadata.title)}</div>
    <div class="cover-subtitle">${escapeHtml(metadata.subtitle)}</div>
    <div class="meta-box">
      <div class="meta-item"><strong>Generated Date:</strong> ${escapeHtml(metadata.date)}</div>
      <div class="meta-item"><strong>Report Version:</strong> ${escapeHtml(metadata.version)}</div>
      <div class="meta-item"><strong>Author / System:</strong> ${escapeHtml(metadata.author)}</div>
      <div class="meta-item"><strong>Primary Questions Answered:</strong> ${metadata.totalAnsweredQuestions}</div>
      <div class="meta-item"><strong>Follow-up Research Questions:</strong> ${metadata.totalResearchQuestions}</div>
    </div>
  </div>

  <!-- Table of Contents -->
  <div class="toc">
    <h2>Table of Contents</h2>
    <div style="font-weight: bold; margin-top: 15px; color: #2b6cb0;">Part I: Primary Findings (20 Questions)</div>
    <ul class="toc-ul">
      ${answeredItems
        .map(
          (item) => `
        <li class="toc-li">
          <span>Q${item.id}. ${escapeHtml(item.title)}</span>
          <span>[${escapeHtml(item.category)}]</span>
        </li>
      `
        )
        .join('')}
    </ul>

    <div style="font-weight: bold; margin-top: 25px; color: #dd6b20;">Part II: Secondary Research Matrix (20 Questions)</div>
    <ul class="toc-ul">
      ${researchItems
        .map(
          (item) => `
        <li class="toc-li">
          <span>RQ${item.id - 20}. ${escapeHtml(item.title)}</span>
          <span>[${escapeHtml(item.category)}]</span>
        </li>
      `
        )
        .join('')}
    </ul>
  </div>

  <!-- Part I Content -->
  <div class="section-header">Part I: Primary Metabolic Findings & Answers</div>
  ${answeredItems
    .map(
      (item) => `
    <div class="question-card" id="q${item.id}">
      <span class="badge">Question ${item.id} &bull; ${escapeHtml(item.category)}</span>
      <h3 class="question-title">${escapeHtml(item.title)}</h3>
      <div class="question-body">${item.content}</div>
    </div>
  `
    )
    .join('')}

  <!-- Part II Content -->
  <div class="section-header" style="background-color: #dd6b20;">Part II: Deep-Dive Research & Next Steps</div>
  ${researchItems
    .map(
      (item) => `
    <div class="question-card research" id="rq${item.id}">
      <span class="badge research">Research Question ${item.id - 20} &bull; ${escapeHtml(item.category)}</span>
      <h3 class="question-title">${escapeHtml(item.title)}</h3>
      <div class="question-body">${item.content}</div>
    </div>
  `
    )
    .join('')}

  <div class="footer">
    End of Metabolic Matrix Findings Report &bull; Compiled automatically for PDF generation.
  </div>

</body>
</html>`;
}

/**
 * Main execution function.
 */
export async function generateMetabolicReport() {
  console.log('🚀 Starting Metabolic Matrix PDF Report Generation Script...');

  const rootDir = process.cwd();
  const inputDir = path.join(rootDir, 'data', 'markdown-questions');
  const outputDir = path.join(rootDir, 'dist');
  const htmlOutputPath = path.join(outputDir, 'metabolic-matrix-report.html');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`📁 Checking input directory: ${inputDir}`);
  const questions = loadMarkdownQuestions(inputDir);

  const answeredCount = questions.filter((q) => q.type === 'answered').length;
  const researchCount = questions.filter((q) => q.type === 'research').length;

  console.log(`📊 Found ${questions.length} total entries:`);
  console.log(`   - Answered Questions: ${answeredCount}`);
  console.log(`   - Follow-up Research Questions: ${researchCount}`);

  const metadata: ReportMetadata = {
    ...DEFAULT_METADATA,
    totalAnsweredQuestions: answeredCount,
    totalResearchQuestions: researchCount,
  };

  const htmlContent = generateReportHtml(metadata, questions);

  fs.writeFileSync(htmlOutputPath, htmlContent, 'utf-8');
  console.log(`✅ HTML Report generated successfully: ${htmlOutputPath}`);

  console.log(`
📄 PDF Export Instructions:
  1. Open ${htmlOutputPath} in Chrome/Edge/Firefox.
  2. Press Ctrl+P (or Cmd+P on macOS).
  3. Destination: 'Save as PDF'.
  4. Options: Enable 'Background graphics' and set Margins to 'Default' or 'None'.
  `);
}

if (require.main === module) {
  generateMetabolicReport().catch((err) => {
    console.error('❌ Error generating report:', err);
    process.exit(1);
  });
}