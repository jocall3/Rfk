import * as fs from 'fs';
import * as path from 'path';

export interface Question {
  id: string;
  number: number;
  text: string;
  description: string;
  metadata: Record<string, any>;
}

export interface Answer {
  questionNumber: number;
  text: string;
  metadata: Record<string, any>;
  sourceFile: string;
}

export interface StructuredData {
  id: string;
  number: number;
  question: string;
  questionDescription: string;
  answer: string | null;
  metadata: Record<string, any>;
  answerSourceFile: string | null;
}

/**
 * Parses YAML-like frontmatter or simple key-value pairs from a markdown string.
 */
function parseMetadata(content: string): { metadata: Record<string, any>; cleanContent: string } {
  const metadata: Record<string, any> = {};
  let cleanContent = content;

  // 1. Try parsing standard YAML frontmatter (between --- and ---)
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
  const match = content.match(frontmatterRegex);

  if (match) {
    cleanContent = content.replace(frontmatterRegex, '');
    const lines = match[1].split('\n');
    for (const line of lines) {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join(':').trim();
        metadata[key] = parseValue(value);
      }
    }
  }

  // 2. Also look for inline metadata patterns like "Category: Ingredients" or "- Tags: safety, cpg"
  const inlineRegex = /^(?:- )?([\w-_]+):\s*(.+)$/gm;
  let inlineMatch;
  const remainingLines: string[] = [];

  for (const line of cleanContent.split('\n')) {
    inlineMatch = /^(?:- )?([\w-_]+):\s*(.+)$/.exec(line.trim());
    if (inlineMatch && !line.trim().startsWith('http') && !line.trim().startsWith('/') && line.includes(':')) {
      const key = inlineMatch[1].trim();
      const value = inlineMatch[2].trim();
      // Only treat as metadata if key is reasonably short and doesn't look like normal prose
      if (key.length < 30 && !key.includes(' ')) {
        metadata[key.toLowerCase()] = parseValue(value);
        continue;
      }
    }
    remainingLines.push(line);
  }

  cleanContent = remainingLines.join('\n').trim();
  return { metadata, cleanContent };
}

function parseValue(val: string): any {
  const lower = val.toLowerCase();
  if (lower === 'true') return true;
  if (lower === 'false') return false;
  if (!isNaN(Number(val)) && val.trim() !== '') return Number(val);
  // Handle comma-separated lists
  if (val.includes(',')) {
    return val.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
  }
  return val.replace(/^["']|["']$/g, '');
}

/**
 * Parses the seed questions file.
 */
export function parseQuestions(filePath: string): Question[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Questions file not found at path: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  // Split by markdown headers (H2 or H3) that indicate a question
  const sections = content.split(/^(?=##+ )/m);
  const questions: Question[] = [];

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    // Match headers like: "## Q1: What is..." or "### 1. What is..." or "## Question 20 - ..."
    const headerMatch = trimmed.match(/^(##+)\s*(?:Q|Question)?\s*(\d+)[.:\s-]*([^\n]+)/i);
    if (headerMatch) {
      const num = parseInt(headerMatch[2], 10);
      const text = headerMatch[3].trim();
      const body = trimmed.substring(headerMatch[0].length).trim();
      
      const { metadata, cleanContent } = parseMetadata(body);

      questions.push({
        id: `Q${num}`,
        number: num,
        text,
        description: cleanContent,
        metadata
      });
    }
  }

  return questions.sort((a, b) => a.number - b.number);
}

/**
 * Parses all answer files matching 'part*.md' in the answers directory.
 */
export function parseAnswers(answersDir: string): Answer[] {
  if (!fs.existsSync(answersDir)) {
    return [];
  }

  const files = fs.readdirSync(answersDir).filter(file => {
    const lower = file.toLowerCase();
    return lower.startsWith('part') && lower.endsWith('.md');
  });

  const answers: Answer[] = [];

  for (const file of files) {
    const filePath = path.join(answersDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Split by headers indicating an answer block, e.g., "## Answer 1", "## Q1", "### 1"
    const sections = content.split(/^(?=##+ )/m);

    for (const section of sections) {
      const trimmed = section.trim();
      if (!trimmed) continue;

      const headerMatch = trimmed.match(/^(##+)\s*(?:Answer|Q|Question)?\s*(\d+)[.:\s-]*(.*)/i);
      if (headerMatch) {
        const num = parseInt(headerMatch[2], 10);
        const body = trimmed.substring(headerMatch[0].length).trim();
        const { metadata, cleanContent } = parseMetadata(body);

        answers.push({
          questionNumber: num,
          text: cleanContent,
          metadata,
          sourceFile: path.basename(filePath)
        });
      } else {
        // If the file doesn't have explicit question headers, check if the whole file is an answer to a single question
        // derived from the filename, e.g., "part1.md" -> Question 1 (if structured that way)
        const fileNumMatch = file.match(/part[-_]?(\d+)/i);
        if (fileNumMatch && sections.length === 1) {
          const num = parseInt(fileNumMatch[1], 10);
          const { metadata, cleanContent } = parseMetadata(trimmed);
          answers.push({
            questionNumber: num,
            text: cleanContent,
            metadata,
            sourceFile: path.basename(filePath)
          });
        }
      }
    }
  }

  return answers;
}

/**
 * Combines questions and answers into a structured JSON format.
 */
export function getStructuredData(questionsPath: string, answersDir: string): StructuredData[] {
  const questions = parseQuestions(questionsPath);
  const answers = parseAnswers(answersDir);

  // Create a map of answers for quick lookup
  const answerMap = new Map<number, Answer>();
  for (const ans of answers) {
    answerMap.set(ans.questionNumber, ans);
  }

  return questions.map(q => {
    const matchedAnswer = answerMap.get(q.number);
    
    // Merge metadata, prioritizing answer metadata
    const combinedMetadata = {
      ...q.metadata,
      ...(matchedAnswer ? matchedAnswer.metadata : {})
    };

    return {
      id: q.id,
      number: q.number,
      question: q.text,
      questionDescription: q.description,
      answer: matchedAnswer ? matchedAnswer.text : null,
      metadata: combinedMetadata,
      answerSourceFile: matchedAnswer ? matchedAnswer.sourceFile : null
    };
  });
}

/**
 * Utility to execute the parser and output JSON directly or write to a file.
 */
export function exportToJson(questionsPath: string, answersDir: string, outputPath?: string): string {
  const data = getStructuredData(questionsPath, answersDir);
  const jsonString = JSON.stringify(data, null, 2);
  
  if (outputPath) {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, jsonString, 'utf-8');
  }
  
  return jsonString;
}