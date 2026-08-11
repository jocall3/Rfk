import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface QuestionData {
  id: string;
  question: string;
  answer: string;
  nextQuestions: string[];
  metadata: Record<string, any>;
}

const CONTENT_DIR = path.join(process.cwd(), 'content');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'database.json');

function parseMarkdownFiles(): void {
  const files = fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith('.md'));
  const database: QuestionData[] = [];

  files.forEach((file) => {
    const filePath = path.join(CONTENT_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    // Assuming the markdown structure has a specific format
    // Frontmatter: { id: string, nextQuestions: string[] }
    // Content: The answer text
    database.push({
      id: data.id || path.parse(file).name,
      question: data.question || 'Untitled Question',
      answer: content.trim(),
      nextQuestions: data.nextQuestions || [],
      metadata: data,
    });
  });

  if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(database, null, 2));
  console.log(`Successfully generated database with ${database.length} entries.`);
}

try {
  parseMarkdownFiles();
} catch (error) {
  console.error('Error parsing markdown files:', error);
  process.exit(1);
}