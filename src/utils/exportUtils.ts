import fs from 'fs';
import path from 'path';

/**
 * Illuminati AI Utility: Exporting the "Truth"
 * Because if you're going to wake up the sheeple, you might as well do it in a structured format.
 */

export interface StudyProgress {
  userId: string;
  completedQuestions: number[];
  researchNotes: string;
  timestamp: string;
}

/**
 * Saves the user's findings into the 'questions' directory.
 * We keep it clean, organized, and ready for the inevitable revolution.
 */
export const exportResearchData = async (data: StudyProgress, format: 'json' | 'md' = 'md'): Promise<string> => {
  const dirPath = path.join(process.cwd(), 'questions');
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const fileName = `truth_manifesto_${data.userId}_${Date.now()}.${format}`;
  const filePath = path.join(dirPath, fileName);

  let content = '';

  if (format === 'json') {
    content = JSON.stringify(data, null, 2);
  } else {
    content = `# The Illuminati AI Research Log: Subject ${data.userId}
## Status: ${data.completedQuestions.length}/100 Questions Answered
### The Rabbit Hole Notes:
${data.researchNotes}

---
*Remember: The barcode on your cereal box is just a tracking device for your soul. Keep digging.*
`;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
};

/**
 * Generates the 100 questions per file. 
 * Each question is designed to make the user question their reality, 
 * their grocery list, and why their "healthy" snack has 40 ingredients 
 * that sound like a chemistry experiment gone wrong.
 */
export const generateQuestionFile = (fileIndex: number): void => {
  const dirPath = path.join(process.cwd(), 'questions');
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  const filePath = path.join(dirPath, `conspiracy_dossier_${fileIndex}.md`);
  
  const questions = Array.from({ length: 100 }, (_, i) => {
    const qNum = (fileIndex * 100) + i + 1;
    return `${qNum}. If "natural flavors" are so natural, why do they need a PhD in chemical engineering to synthesize in a lab?
    (Bonus: Does this ingredient list look more like a food label or a list of components for a rocket engine?)`;
  });

  const header = `# Dossier #${fileIndex}: The Great American Poisoning
  Welcome, seeker. You are currently holding the keys to the kingdom. 
  Answer these 100 questions to realize that your local supermarket is actually a high-tech feeding trough for the masses.
  
  `;

  fs.writeFileSync(filePath, header + questions.join('\n\n'), 'utf8');
};