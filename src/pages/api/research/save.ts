import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

type SaveResponse = {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SaveResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`,
    });
  }

  try {
    const { id, answers, followUpQuestions, researchData, progress, step } = req.body;

    const dataDir = path.join(process.cwd(), 'data', 'research');

    await fs.mkdir(dataDir, { recursive: true });

    const sanitizedId = id
      ? String(id).replace(/[^a-z0-9_-]/gi, '_')
      : 'research_session';

    const filePath = path.join(dataDir, `${sanitizedId}.json`);

    let existingData: Record<string, any> = {};
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch {
      // File does not exist yet or is empty
    }

    const updatedData = {
      ...existingData,
      id: sanitizedId,
      updatedAt: new Date().toISOString(),
      createdAt: existingData.createdAt || new Date().toISOString(),
      progress: progress !== undefined ? progress : existingData.progress || 0,
      step: step !== undefined ? step : existingData.step || 1,
      answers: answers !== undefined ? answers : existingData.answers || [],
      followUpQuestions:
        followUpQuestions !== undefined
          ? followUpQuestions
          : existingData.followUpQuestions || [],
      researchData:
        researchData !== undefined
          ? researchData
          : existingData.researchData || {},
    };

    await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf-8');

    return res.status(200).json({
      success: true,
      message: 'Research data saved successfully',
      data: updatedData,
    });
  } catch (error: any) {
    console.error('Error saving research data:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save research data',
      error: error.message || 'Internal Server Error',
    });
  }
}