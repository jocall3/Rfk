export interface ResearchQuestion {
  id: string;
  question: string;
  answer: string;
  sourceUrls?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ResearchProject {
  id: string;
  title: string;
  initialQuestions: ResearchQuestion[];
  followUpQuestions: ResearchQuestion[];
  status: 'draft' | 'in-progress' | 'completed';
}

export interface ResearchMetadata {
  totalQuestionsAnswered: number;
  nextResearchPhase: string;
  lastUpdated: Date;
}