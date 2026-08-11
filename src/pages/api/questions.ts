import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

/**
 * API route to fetch parsed questions and answers from the static JSON database.
 * Expects a JSON file located at 'data/qa_database.json'
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'qa_database.json');
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Database file not found' });
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('Error reading QA database:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error while fetching questions' 
    });
  }
}