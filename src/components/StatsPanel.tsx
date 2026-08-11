import React from 'react';

interface StatsPanelProps {
  totalQuestions?: number;
  completedQuestions?: number;
  studyTimeMinutes?: number;
  currentStreakDays?: number;
  categoryDistribution?: { category: string; count: number; completed: number }[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  totalQuestions = 100,
  completedQuestions = 0,
  studyTimeMinutes = 0,
  currentStreakDays = 0,
  categoryDistribution = [
    { category: 'Retail & Distribution Systems', count: 40, completed: 0 },
    { category: 'CPG & Food Manufacturing', count: 30, completed: 0 },
    { category: 'Regulatory & Health Standards', count: 30, completed: 0 },
  ],
}) => {
  const completionPercentage = totalQuestions > 0 
    ? Math.round((completedQuestions / totalQuestions) * 100) 
    : 0;

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      maxWidth: '800px',
      margin: '0 auto',
      color: '#1f2937'
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: '#111827' }}>
        Study Progress & Analytics
      </h2>

      {/* Grid for Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 500 }}>
            Completion Rate
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px', color: '#2563eb' }}>
            {completionPercentage}%
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
            {completedQuestions} of {totalQuestions} answered
          </div>
        </div>

        <div style={{ backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 500 }}>
            Study Time
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px', color: '#059669' }}>
            {studyTimeMinutes}m
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
            Total active learning
          </div>
        </div>

        <div style={{ backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 500 }}>
            Daily Streak
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px', color: '#d97706' }}>
            {currentStreakDays} {currentStreakDays === 1 ? 'Day' : 'Days'}
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
            Keep the momentum going!
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
          <span style={{ fontWeight: 500 }}>Overall Progress</span>
          <span style={{ color: '#4b5563' }}>{completedQuestions}/{totalQuestions} Completed</span>
        </div>
        <div style={{ width: '100%', height: '10px', backgroundColor: '#e5e7eb', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{
            width: `${completionPercentage}%`,
            height: '100%',
            backgroundColor: '#2563eb',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#374151' }}>
          Subject Breakdown
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {categoryDistribution.map((cat, index) => {
            const catPercentage = cat.count > 0 ? Math.round((cat.completed / cat.count) * 100) : 0;
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ flex: '1', color: '#4b5563' }}>{cat.category}</span>
                <div style={{ flex: '2', margin: '0 16px', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${catPercentage}%`,
                    height: '100%',
                    backgroundColor: '#4b5563',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <span style={{ width: '50px', textAlign: 'right', color: '#1f2937', fontWeight: 500 }}>
                  {cat.completed}/{cat.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;