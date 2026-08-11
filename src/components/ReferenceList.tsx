import React from 'react';

interface Reference {
  id: string;
  title: string;
  organization: string;
  description: string;
  url: string;
  category: 'Journal' | 'Database' | 'Regulatory';
}

const references: Reference[] = [
  {
    id: '1',
    title: 'PubMed / MEDLINE',
    organization: 'National Center for Biotechnology Information (NCBI / NIH)',
    description: 'A comprehensive database of millions of citations for biomedical literature from MEDLINE, life science journals, and online books.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/',
    category: 'Database',
  },
  {
    id: '2',
    title: 'FoodData Central',
    organization: 'U.S. Department of Agriculture (USDA)',
    description: 'An integrated data system that provides expanded, nutrient profile data and links to sources of agricultural, food, and dietary information.',
    url: 'https://fdc.nal.usda.gov/',
    category: 'Database',
  },
  {
    id: '3',
    title: 'Nutrition, Physical Activity, and Obesity Data',
    organization: 'Centers for Disease Control and Prevention (CDC)',
    description: 'National and state-level data systems tracking nutrition, physical activity, and obesity prevalence and policies.',
    url: 'https://www.cdc.gov/nccdphp/dnpao/index.html',
    category: 'Regulatory',
  },
  {
    id: '4',
    title: 'The American Journal of Clinical Nutrition (AJCN)',
    organization: 'American Society for Nutrition',
    description: 'A peer-reviewed journal publishing primary research and reviews on human nutrition and clinical practice.',
    url: 'https://ajcn.nutrition.org/',
    category: 'Journal',
  },
  {
    id: '5',
    title: 'Food Safety and Nutrition Guidelines',
    organization: 'World Health Organization (WHO)',
    description: 'Global standards, scientific advice, and guidelines regarding food safety, healthy diets, and nutrition policy.',
    url: 'https://www.who.int/health-topics/nutrition',
    category: 'Regulatory',
  },
  {
    id: '6',
    title: 'Center for Food Safety and Applied Nutrition (CFSAN)',
    organization: 'U.S. Food and Drug Administration (FDA)',
    description: 'Regulatory information, scientific research, and safety assessments concerning cosmetics, dietary supplements, and food supply.',
    url: 'https://www.fda.gov/about-fda/office-foods-and-veterinary-medicine/center-food-safety-and-applied-nutrition-cfsan',
    category: 'Regulatory',
  }
];

export const ReferenceList: React.FC = () => {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#1a202c', marginBottom: '0.5rem' }}>
          Public Health & Nutrition Reference Library
        </h1>
        <p style={{ color: '#4a5568', fontSize: '1rem' }}>
          A curated directory of peer-reviewed journals, official regulatory bodies, and public health databases for evidence-based research.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {references.map((ref) => (
          <div 
            key={ref.id} 
            style={{ 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px', 
              padding: '1.5rem', 
              backgroundColor: '#f8fafc',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0, color: '#2d3748' }}>
                {ref.title}
              </h2>
              <span 
                style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold', 
                  textTransform: 'uppercase', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '4px',
                  backgroundColor: 
                    ref.category === 'Journal' ? '#dbeafe' : 
                    ref.category === 'Database' ? '#dcfce7' : '#fef9c3',
                  color: 
                    ref.category === 'Journal' ? '#1e40af' : 
                    ref.category === 'Database' ? '#166534' : '#854d0e',
                }}
              >
                {ref.category}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#718096', margin: '0 0 0.75rem 0', fontWeight: 500 }}>
              {ref.organization}
            </p>
            <p style={{ fontSize: '0.95rem', color: '#4a5568', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
              {ref.description}
            </p>
            <a 
              href={ref.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ 
                color: '#3182ce', 
                textDecoration: 'none', 
                fontSize: '0.9rem', 
                fontWeight: 'bold' 
              }}
            >
              Access Resource &#8594;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferenceList;