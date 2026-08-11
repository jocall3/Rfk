import React from 'react';

interface ResearchStats {
  answeredCount: number;
  totalQuestions: number;
  pendingResearch: number;
  exposureLevel: number; // 0 to 100
}

interface ResearchProgressTrackerProps {
  stats: ResearchStats;
}

const ResearchProgressTracker: React.FC<ResearchProgressTrackerProps> = ({ stats }) => {
  const progressPercentage = (stats.answeredCount / stats.totalQuestions) * 100;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Research Progress</h2>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Completion</span>
          <span className="font-semibold">{stats.answeredCount} / {stats.totalQuestions}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-blue-600 uppercase font-bold">Pending</p>
          <p className="text-2xl font-bold text-blue-900">{stats.pendingResearch}</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <p className="text-xs text-red-600 uppercase font-bold">Exposure</p>
          <p className="text-2xl font-bold text-red-900">{stats.exposureLevel}%</p>
        </div>
      </div>

      <div className="text-xs text-gray-400 italic">
        {stats.pendingResearch > 0 
          ? "Continue research to reduce pending queue." 
          : "All research phases complete."}
      </div>
    </div>
  );
};

export default ResearchProgressTracker;