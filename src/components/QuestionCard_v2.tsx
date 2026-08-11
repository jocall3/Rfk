import React from 'react';

export interface QuestionCardProps {
  index: number;
  question: string;
  category: string;
  ingredients: string[];
  slug: string;
}

export const QuestionCard_v2: React.FC<QuestionCardProps> = ({
  index,
  question,
  category,
  ingredients,
  slug,
}) => {
  // Determine if this is one of the first 20 answered questions or the next 20 research questions
  const isInitialBatch = index <= 20;
  
  return (
    <div className={`group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
      isInitialBatch 
        ? 'border-slate-200 bg-white hover:border-emerald-500/30 hover:shadow-emerald-500/5' 
        : 'border-slate-200 bg-slate-50/50 hover:border-indigo-500/30 hover:shadow-indigo-500/5'
    }`}>
      {/* Top Badge Row */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold tracking-wider ${
            isInitialBatch 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
              : 'bg-indigo-50 text-indigo-700 border border-indigo-200/50'
          }`}>
            Q{index.toString().padStart(2, '0')}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 border border-slate-200/40">
            <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {category}
          </span>
        </div>
        
        {/* Phase Indicator */}
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
          isInitialBatch 
            ? 'bg-emerald-100/60 text-emerald-800' 
            : 'bg-amber-100/60 text-amber-800'
        }`}>
          {isInitialBatch ? 'Core Answer' : 'Research Phase'}
        </span>
      </div>

      {/* Question Summary */}
      <div className="mb-5 flex-grow">
        <h3 className="text-base font-semibold text-slate-800 line-clamp-3 group-hover:text-slate-900 transition-colors duration-200">
          {question}
        </h3>
      </div>

      {/* Ingredients / Key Terms */}
      {ingredients && ingredients.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-slate-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span>Detected Ingredients</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ingredients.map((ingredient, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center rounded-md bg-slate-100/80 px-2 py-0.5 text-xs font-medium text-slate-600 hover:bg-slate-200/80 transition-colors duration-150"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Link */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <a 
          href={slug}
          className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 ${
            isInitialBatch 
              ? 'text-emerald-600 hover:text-emerald-700' 
              : 'text-indigo-600 hover:text-indigo-700'
          }`}
        >
          <span>{isInitialBatch ? 'View Detailed Answer' : 'Explore Research'}</span>
          <svg 
            className="h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
};