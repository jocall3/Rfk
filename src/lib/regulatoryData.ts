import { promises as fs } from 'fs';
import path from 'path';

export interface QuestionAnswer {
  question: string;
  answer: string;
}

export interface RegulatoryDocument {
  id: string;
  filename: string;
  title: string;
  rawContent: string;
  answeredQuestions: QuestionAnswer[];
  furtherResearchQuestions: string[];
}

// Default directory for the markdown files. 
// Adjust this path based on where the files are actually generated/stored in the project.
const DEFAULT_DATA_DIR = path.join(process.cwd(), 'data', 'regulatory-research');

/**
 * Ensures the data directory exists.
 */
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Parses raw markdown content to extract answered questions and further research questions.
 * Assumes a structure where questions are headings (e.g., ### Question) or bolded,
 * and further research questions are in a list under a specific heading.
 */
export function parseMarkdownContent(content: string): {
  title: string;
  answeredQuestions: QuestionAnswer[];
  furtherResearchQuestions: string[];
} {
  const lines = content.split('\n');
  let title = 'Untitled Document';
  const answeredQuestions: QuestionAnswer[] = [];
  const furtherResearchQuestions: string[] = [];

  let currentSection: 'title' | 'qna' | 'research' = 'title';
  let currentQuestion = '';
  let currentAnswer: string[] = [];

  const saveCurrentQnA = () => {
    if (currentQuestion && currentAnswer.length > 0) {
      answeredQuestions.push({
        question: currentQuestion.trim(),
        answer: currentAnswer.join('\n').trim(),
      });
    }
    currentQuestion = '';
    currentAnswer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Extract Title (first H1)
    if (line.startsWith('# ') && currentSection === 'title') {
      title = line.replace(/^#\s+/, '').trim();
      currentSection = 'qna';
      continue;
    }

    // Detect Further Research section
    if (line.toLowerCase().includes('further research') && line.startsWith('#')) {
      saveCurrentQnA();
      currentSection = 'research';
      continue;
    }

    if (currentSection === 'qna') {
      // Detect a new question (assuming H2 or H3 for questions, or Q: prefix)
      if (line.startsWith('## ') || line.startsWith('### ') || line.startsWith('Q:')) {
        saveCurrentQnA();
        currentQuestion = line.replace(/^(#+ |Q:\s*)/, '').trim();
      } else if (currentQuestion) {
        // Accumulate answer lines
        if (line.startsWith('A:')) {
          currentAnswer.push(line.replace(/^A:\s*/, '').trim());
        } else {
          currentAnswer.push(line);
        }
      }
    } else if (currentSection === 'research') {
      // Extract list items as further research questions
      if (line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line)) {
        const researchQ = line.replace(/^(-\s|\*\s|\d+\.\s)/, '').trim();
        if (researchQ) {
          furtherResearchQuestions.push(researchQ);
        }
      }
    }
  }

  // Save the last QnA pair if file ends while in qna section
  saveCurrentQnA();

  return {
    title,
    answeredQuestions,
    furtherResearchQuestions,
  };
}

/**
 * Fetches and parses a single regulatory markdown file.
 */
export async function getRegulatoryDocument(
  filename: string,
  dataDir: string = DEFAULT_DATA_DIR
): Promise<RegulatoryDocument | null> {
  try {
    const filePath = path.join(dataDir, filename);
    const rawContent = await fs.readFile(filePath, 'utf-8');
    const parsedData = parseMarkdownContent(rawContent);

    return {
      id: filename.replace(/\.md$/, ''),
      filename,
      rawContent,
      ...parsedData,
    };
  } catch (error) {
    console.error(`Error reading regulatory document ${filename}:`, error);
    return null;
  }
}

/**
 * Fetches and processes all regulatory markdown files in the specified directory.
 */
export async function getAllRegulatoryData(
  dataDir: string = DEFAULT_DATA_DIR
): Promise<RegulatoryDocument[]> {
  await ensureDirectoryExists(dataDir);

  try {
    const files = await fs.readdir(dataDir);
    const markdownFiles = files.filter((file) => file.endsWith('.md'));

    const documents = await Promise.all(
      markdownFiles.map((file) => getRegulatoryDocument(file, dataDir))
    );

    // Filter out any nulls from failed reads
    return documents.filter((doc): doc is RegulatoryDocument => doc !== null);
  } catch (error) {
    console.error('Error fetching all regulatory data:', error);
    return [];
  }
}

/**
 * Aggregates all further research questions from all documents into a single list.
 */
export async function getAggregatedResearchQuestions(
  dataDir: string = DEFAULT_DATA_DIR
): Promise<string[]> {
  const allDocs = await getAllRegulatoryData(dataDir);
  const allQuestions = new Set<string>();

  for (const doc of allDocs) {
    for (const question of doc.furtherResearchQuestions) {
      allQuestions.add(question);
    }
  }

  return Array.from(allQuestions);
}

/**
 * Searches through all regulatory data for a specific keyword in questions or answers.
 */
export async function searchRegulatoryData(
  query: string,
  dataDir: string = DEFAULT_DATA_DIR
): Promise<RegulatoryDocument[]> {
  const allDocs = await getAllRegulatoryData(dataDir);
  const lowerQuery = query.toLowerCase();

  return allDocs.filter((doc) => {
    const inTitle = doc.title.toLowerCase().includes(lowerQuery);
    const inQnA = doc.answeredQuestions.some(
      (qa) =>
        qa.question.toLowerCase().includes(lowerQuery) ||
        qa.answer.toLowerCase().includes(lowerQuery)
    );
    return inTitle || inQnA;
  });
}