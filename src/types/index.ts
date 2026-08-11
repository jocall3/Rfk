export interface Question {
  id: string;
  text: string;
  category: 'initial' | 'follow-up' | 'research';
  phase: 1 | 2;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Answer {
  questionId: string;
  markdownFilePath: string;
  summary: string;
  content: string;
  answeredAt: string;
  author?: string;
  keyTakeaways: string[];
  nextSteps?: string[];
}

export interface Ingredient {
  id: string;
  name: string;
  type: 'data_point' | 'variable' | 'resource' | 'physical' | 'metric' | 'concept';
  description: string;
  sourceUrl?: string;
  reliabilityScore: number; // Scale of 1-5
  associatedQuestionIds?: string[];
}

export interface ResearchProgress {
  phase1Completed: boolean;
  phase2Completed: boolean;
  answeredQuestionIds: string[];
  pendingQuestionIds: string[];
  totalQuestionsCount: number;
  completionPercentage: number;
  lastUpdated: string;
  notes?: string;
}

export interface DataField {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'markdown';
  required: boolean;
  description?: string;
}

export interface DataGatheringTemplate {
  id: string;
  title: string;
  description: string;
  fields: DataField[];
  targetSourceType: 'academic' | 'web' | 'interview' | 'experimental' | 'database';
  version: string;
}

export interface ResourceDirectoryItem {
  id: string;
  title: string;
  url?: string;
  type: 'book' | 'article' | 'website' | 'dataset' | 'tool' | 'other';
  description: string;
  associatedQuestionIds?: string[];
  tags?: string[];
  accessDate?: string;
}