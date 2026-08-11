import React from 'react';

interface QuestionFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const QuestionFilter: React.FC<QuestionFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <nav className="question-filter" aria-label="Question Categories">
      <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', padding: 0 }}>
        <li>
          <button
            onClick={() => onSelectCategory(null)}
            style={{
              fontWeight: selectedCategory === null ? 'bold' : 'normal',
              cursor: 'pointer',
            }}
          >
            All
          </button>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <button
              onClick={() => onSelectCategory(category)}
              style={{
                fontWeight: selectedCategory === category ? 'bold' : 'normal',
                cursor: 'pointer',
              }}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default QuestionFilter;