import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface QuestionData {
  id: string;
  question: string;
  answer: string;
  tags: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { q } = req.query;
  const searchQuery = typeof q === 'string' ? q.toLowerCase() : '';

  try {
    const postsDirectory = path.join(process.cwd(), 'content/questions');
    const fileNames = fs.readdirSync(postsDirectory);

    const allQuestions: QuestionData[] = fileNames.map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        id: fileName.replace(/\.md$/, ''),
        question: data.question || '',
        answer: content,
        tags: data.tags || [],
      };
    });

    if (!searchQuery) {
      return res.status(200).json(allQuestions);
    }

    const filteredQuestions = allQuestions.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery) ||
        item.answer.toLowerCase().includes(searchQuery) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
    );

    return res.status(200).json(filteredQuestions);
  } catch (error) {
    console.error('Error searching questions:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}