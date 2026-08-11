import * as fs from 'fs';
import * as path from 'path';

interface QuestionFile {
  id: number;
  type: 'primary' | 'secondary';
  filePath: string;
  filename: string;
  title: string;
  question: string;
  answer: string;
  followUpQuestions?: string[];
  wordCount: number;
}

interface ReportMetadata {
  title: string;
  generatedAt: string;
  totalPrimaryQuestions: number;
  totalSecondaryQuestions: number;
  totalWordCount: number;
  completionRate: number;
}

const PRIMARY_DIR = path.join(process.cwd(), 'docs', 'primary-questions');
const SECONDARY_DIR = path.join(process.cwd(), 'docs', 'secondary-questions');
const OUTPUT_DIR = path.join(process.cwd(), 'reports');
const REPORT_FILE_MD = path.join(OUTPUT_DIR, 'comprehensive-regulatory-report.md');
const REPORT_FILE_HTML = path.join(OUTPUT_DIR, 'comprehensive-regulatory-report.html');

function ensureDirectories(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

function parseMarkdownFile(filePath: string, type: 'primary' | 'secondary', index: number): QuestionFile {
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);

  let title = path.basename(filePath, '.md').replace(/[-_]/g, ' ');
  let question = title;
  let answer = content;
  let followUpQuestions: string[] = [];

  const titleMatch = content.match(/^#\0? (.*)$/m) || content.match(/^# (.*)$/m);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }

  const questionMatch = content.match(/## Question\n([\s\S]*?)(?=\n## |$)/i);
  if (questionMatch) {
    question = questionMatch[1].trim();
  } else if (titleMatch) {
    question = titleMatch[1].trim();
  }

  const answerMatch = content.match(/## Answer\n([\s\S]*?)(?=\n## Follow-up|\n## Secondary|\n## Next Steps|$)/i);
  if (answerMatch) {
    answer = answerMatch[1].trim();
  }

  const followUpMatch = content.match(/## (?:Follow-up Questions|Secondary Research Questions|Next Steps)\n([\s\S]*?)(?=\n## |$)/i);
  if (followUpMatch) {
    const rawFollowUps = followUpMatch[1].trim();
    followUpQuestions = rawFollowUps
      .split('\n')
      .map(line => line.replace(/^[-*\d.]+\s*/, '').trim())
      .filter(line => line.length > 0);
  }

  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;

  return {
    id: index + 1,
    type,
    filePath,
    filename,
    title,
    question,
    answer,
    followUpQuestions,
    wordCount
  };
}

function loadQuestionFiles(dirPath: string, type: 'primary' | 'secondary'): QuestionFile[] {
  if (!fs.existsSync(dirPath)) {
    console.warn(`Warning: Directory ${dirPath} does not exist. Creating it.`);
    fs.mkdirSync(dirPath, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.md'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });

  return files.map((file, idx) => parseMarkdownFile(path.join(dirPath, file), type, idx));
}

function generateMetadata(primaryFiles: QuestionFile[], secondaryFiles: QuestionFile[]): ReportMetadata {
  const totalPrimary = primaryFiles.length;
  const totalSecondary = secondaryFiles.length;
  const wordCountPrimary = primaryFiles.reduce((acc, f) => acc + f.wordCount, 0);
  const wordCountSecondary = secondaryFiles.reduce((acc, f) => acc + f.wordCount, 0);
  const totalWordCount = wordCountPrimary + wordCountSecondary;
  
  const expectedTotal = 40; // 20 primary + 20 secondary
  const currentTotal = totalPrimary + totalSecondary;
  const completionRate = Math.min(100, Math.round((currentTotal / expectedTotal) * 100));

  return {
    title: 'Comprehensive Regulatory Compliance & Deep-Dive Research Report',
    generatedAt: new Date().toISOString().split('T')[0],
    totalPrimaryQuestions: totalPrimary,
    totalSecondaryQuestions: totalSecondary,
    totalWordCount,
    completionRate
  };
}

function buildMarkdownReport(metadata: ReportMetadata, primary: QuestionFile[], secondary: QuestionFile[]): string {
  const lines: string[] = [];

  lines.push(`# ${metadata.title}`);
  lines.push('');
  lines.push(`> **Generated Date:** ${metadata.generatedAt}  `);
  lines.push(`> **Overall Completion:** ${metadata.completionRate}% (${metadata.totalPrimaryQuestions + metadata.totalSecondaryQuestions}/40 Questions)  `);
  lines.push(`> **Total Word Count:** ${metadata.totalWordCount.toLocaleString()} words`);
  lines.push('');
  lines.push('---');
  lines.push('');

  lines.push('## Table of Contents');
  lines.push('');
  lines.push('1. [Executive Summary](#executive-summary)');
  lines.push('2. [Phase 1: Primary Regulatory Questions (1-20)](#phase-1-primary-regulatory-questions)');
  primary.forEach((f, i) => {
    lines.push(`   - [Q${i + 1}: ${f.title}](#primary-q${i + 1})`);
  });
  lines.push('3. [Phase 2: Deep-Dive Follow-up Research (21-40)](#phase-2-deep-dive-follow-up-research)');
  secondary.forEach((f, i) => {
    lines.push(`   - [Q${i + 21}: ${f.title}](#secondary-q${i + 21})`);
  });
  lines.push('4. [Synthesis & Action Plan](#synthesis--action-plan)');
  lines.push('');
  lines.push('---');
  lines.push('');

  lines.push('## Executive Summary');
  lines.push('');
  lines.push('This report aggregates comprehensive research across primary regulatory domain questions and deep-dive follow-up inquiries. ');
  lines.push(`A total of **${metadata.totalPrimaryQuestions}** foundational questions and **${metadata.totalSecondaryQuestions}** extended research questions have been analyzed to provide actionable regulatory intelligence and risk mitigation strategies.`);
  lines.push('');

  lines.push('### Key Metrics Summary');
  lines.push('| Metric | Value | Target |');
  lines.push('| :--- | :--- | :--- |');
  lines.push(`| Primary Questions Addressed | ${metadata.totalPrimaryQuestions} | 20 |`);
  lines.push(`| Secondary Research Questions | ${metadata.totalSecondaryQuestions} | 20 |`);
  lines.push(`| Overall Completion | ${metadata.completionRate}% | 100% |`);
  lines.push(`| Total Analyzed Corpus Size | ${metadata.totalWordCount.toLocaleString()} words | - |`);
  lines.push('');
  lines.push('---');
  lines.push('');

  lines.push('## Phase 1: Primary Regulatory Questions');
  lines.push('');
  if (primary.length === 0) {
    lines.push('*No primary question markdown files found in `docs/primary-questions/`.*');
  } else {
    primary.forEach((item, index) => {
      const qNum = index + 1;
      lines.push(`<a name="primary-q${qNum}"></a>`);
      lines.push(`### Primary Q${qNum}: ${item.title}`);
      lines.push('');
      lines.push(`**Question:** ${item.question}`);
      lines.push('');
      lines.push('#### Findings & Analysis');
      lines.push(item.answer);
      lines.push('');
      
      if (item.followUpQuestions && item.followUpQuestions.length > 0) {
        lines.push('#### Derived Research Pathways');
        item.followUpQuestions.forEach(q => lines.push(`- ${q}`));
        lines.push('');
      }
      lines.push('---');
      lines.push('');
    });
  }

  lines.push('## Phase 2: Deep-Dive Follow-up Research');
  lines.push('');
  if (secondary.length === 0) {
    lines.push('*No secondary research markdown files found in `docs/secondary-questions/`.*');
  } else {
    secondary.forEach((item, index) => {
      const qNum = index + 21;
      lines.push(`<a name="secondary-q${qNum}"></a>`);
      lines.push(`### Secondary Q${qNum}: ${item.title}`);
      lines.push('');
      lines.push(`**Research Focus:** ${item.question}`);
      lines.push('');
      lines.push('#### Deep-Dive Findings');
      lines.push(item.answer);
      lines.push('');
      lines.push('---');
      lines.push('');
    });
  }

  lines.push('## Synthesis & Action Plan');
  lines.push('');
  lines.push('Based on the synthesis of primary regulatory assessments and secondary deep-dive technical evaluations, the following actionable measures are recommended:');
  lines.push('');
  lines.push('1. **Policy & Compliance Mapping:** Ensure all controls identified across both primary and secondary findings are mapped directly to relevant governance frameworks.');
  lines.push('2. **Continuous Monitoring:** Implement automated compliance logging for high-risk parameters discovered during secondary analysis.');
  lines.push('3. **Periodic Regulatory Review:** Re-evaluate deep-dive research pathways semi-annually as regulatory standards evolve.');
  lines.push('');

  return lines.join('\n');
}

function buildHTMLReport(markdownContent: string, metadata: ReportMetadata): string {
  const bodyContent = markdownContent
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '<br/><br/>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metadata.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 960px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #fdfdfd;
    }
    h1 { font-size: 2.2rem; color: #1a202c; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
    h2 { font-size: 1.6rem; color: #2d3748; margin-top: 30px; border-bottom: 1px solid #edf2f7; padding-bottom: 8px; }
    h3 { font-size: 1.3rem; color: #4a5568; margin-top: 24px; }
    h4 { font-size: 1.1rem; color: #718096; }
    blockquote { background: #f7fafc; border-left: 4px solid #3182ce; margin: 0; padding: 10px 15px; color: #4a5568; }
    code { background: #edf2f7; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
    hr { border: 0; height: 1px; background: #e2e8f0; margin: 30px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #cbd5e0; padding: 8px 12px; text-align: left; }
    th { background: #f7fafc; }
    @media print {
      body { max-width: 100%; padding: 0; font-size: 12pt; }
      h1, h2 { page-break-after: avoid; }
    }
  </style>
</head>
<body>
  ${bodyContent}
</body>
</html>`;
}

export async function generateReport(): Promise<void> {
  console.log('=== Regulatory Report Generator ===');
  ensureDirectories();

  console.log(`Scanning primary files from: ${PRIMARY_DIR}`);
  const primaryFiles = loadQuestionFiles(PRIMARY_DIR, 'primary');
  console.log(`Found ${primaryFiles.length} primary question files.`);

  console.log(`Scanning secondary files from: ${SECONDARY_DIR}`);
  const secondaryFiles = loadQuestionFiles(SECONDARY_DIR, 'secondary');
  console.log(`Found ${secondaryFiles.length} secondary question files.`);

  const metadata = generateMetadata(primaryFiles, secondaryFiles);

  console.log('Compiling Master Regulatory Report...');
  const markdownOutput = buildMarkdownReport(metadata, primaryFiles, secondaryFiles);
  fs.writeFileSync(REPORT_FILE_MD, markdownOutput, 'utf-8');
  console.log(`Markdown report generated at: ${REPORT_FILE_MD}`);

  const htmlOutput = buildHTMLReport(markdownOutput, metadata);
  fs.writeFileSync(REPORT_FILE_HTML, htmlOutput, 'utf-8');
  console.log(`HTML report generated at: ${REPORT_FILE_HTML}`);

  console.log('\n--- Summary ---');
  console.log(`Total Progress: ${metadata.completionRate}%`);
  console.log(`Primary Questions: ${metadata.totalPrimaryQuestions}/20`);
  console.log(`Secondary Questions: ${metadata.totalSecondaryQuestions}/20`);
  console.log(`Total Word Count: ${metadata.totalWordCount}`);
  console.log('Report generation complete.');
}

if (require.main === module) {
  generateReport().catch(err => {
    console.error('Error generating regulatory report:', err);
    process.exit(1);
  });
}