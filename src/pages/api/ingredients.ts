import { NextApiRequest, NextApiResponse } from 'next';

/**
 * API route to fetch the ingredient dictionary and safety profiles.
 * In a production environment, this would interface with a database or a CMS.
 * For this implementation, we provide a structured response format.
 */

export interface Ingredient {
  id: string;
  name: string;
  safetyRating: 'safe' | 'caution' | 'avoid';
  description: string;
  researchNotes: string[];
}

const ingredientDatabase: Ingredient[] = [
  {
    id: '1',
    name: 'Water',
    safetyRating: 'safe',
    description: 'Solvent used to dissolve other ingredients.',
    researchNotes: ['Generally recognized as safe.', 'Standard in almost all formulations.']
  },
  {
    id: '2',
    name: 'Parabens',
    safetyRating: 'avoid',
    description: 'Preservatives used to prevent microbial growth.',
    researchNotes: ['Linked to potential endocrine disruption.', 'Often replaced by phenoxyethanol.']
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Simulate fetching data
    res.status(200).json({
      success: true,
      data: ingredientDatabase,
      meta: {
        total: ingredientDatabase.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch ingredient data' 
    });
  }
}