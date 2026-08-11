import React from 'react';

export interface CategoryProgress {
  id: string;
  name: string;
  completed: number;
  total: number;
  color?: string;
}

interface ProgressBarProps {
  categories: CategoryProgress[];
  title?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  categories = [],
  title = "Analysis Progress"
}) => {
  const totalQuestions = categories.reduce((sum, cat) => sum + cat.total, 0);
  const totalCompleted = categories.reduce((sum, cat) => sum + cat.completed, 0);
  const overallPercentage = totalQuestions > 0 
    ? Math.round((totalCompleted / totalQuestions) * 100) 
    : 0;

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa',
      border: '1px solid #e9ecef',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h3 style={{ margin: 0, color: '#212529', fontSize: '1.1rem' }}>{title}</h3>
        <span style={{ 
          fontWeight: 'bold', 
          color: '#0d6efd', 
          fontSize: '1.1rem' 
        }}>{overallPercentage}%</span>
      </div>

      <div style={{
        width: '100%',
        height: '12px',
        backgroundColor: '#e9ecef',
        borderRadius: '6px',
        overflow: 'hidden',
        marginBottom: '25px'
      }}>
        <div style={{
          width: `${overallPercentage}%`,
          height: '100%',
          backgroundColor: '#0d6efd',
          transition: 'width 0.5s ease-in-out',
          borderRadius: '6px'
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {categories.map((category) => {
          const categoryPercentage = category.total > 0 
            ? Math.round((category.completed / category.total) * 100) 
            : 0;
          const barColor = category.color || '#6c757d';

          return (
            <div key={category.id} style={{ fontSize: '0.9rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '4px',
                color: '#495057'
              }}>
                <span>{category.name}</span>
                <span>{category.completed}/{category.total} ({categoryPercentage}%)</span>
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                backgroundColor: '#e9ecef',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${categoryPercentage}%`,
                  height: '100%',
                  backgroundColor: barColor,
                  transition: 'width 0.3s ease-in-out',
                  borderRadius: '3px'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;