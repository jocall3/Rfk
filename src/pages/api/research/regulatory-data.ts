import type { NextApiRequest, NextApiResponse } from 'next';

export interface RegulatoryFramework {
  id: string;
  name: string;
  region: string;
  category: string;
  summary: string;
  keyRequirements: string[];
  status: 'Enacted' | 'Proposed' | 'Under Review' | 'Active';
  impactLevel: 'High' | 'Medium' | 'Low';
  lastUpdated: string;
  relatedQuestions: number[];
  sourceUrls: string[];
}

export interface RegulatoryResponse {
  success: boolean;
  total: number;
  data: RegulatoryFramework[];
  categories: string[];
  regions: string[];
  error?: string;
}

const REGULATORY_DATA: RegulatoryFramework[] = [
  {
    id: 'reg-001',
    name: 'EU Artificial Intelligence Act (EU AI Act)',
    region: 'European Union',
    category: 'AI & Machine Learning',
    summary: 'Risk-based regulatory framework governing the development, deployment, and use of AI systems within the EU market.',
    keyRequirements: [
      'Prohibition of unacceptable risk AI practices (e.g., social scoring, manipulative AI)',
      'Conformity assessments and quality management for High-Risk AI systems',
      'Transparency obligations for generative AI models and synthetic content',
      'Post-market monitoring and fundamental rights impact assessments'
    ],
    status: 'Enacted',
    impactLevel: 'High',
    lastUpdated: '2024-05-21',
    relatedQuestions: [1, 2, 5, 12, 21, 22, 25],
    sourceUrls: [
      'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52021PC0206'
    ]
  },
  {
    id: 'reg-002',
    name: 'General Data Protection Regulation (GDPR)',
    region: 'European Union',
    category: 'Data Privacy & Protection',
    summary: 'Comprehensive data privacy regulation protecting personal data of individuals in the EU and EEA.',
    keyRequirements: [
      'Lawful basis for processing personal data and explicit consent mechanisms',
      'Right to be forgotten, data portability, and access rights',
      'Data protection impact assessments (DPIA) for high-risk processing',
      'Strict 72-hour data breach notification protocol'
    ],
    status: 'Active',
    impactLevel: 'High',
    lastUpdated: '2024-01-15',
    relatedQuestions: [3, 4, 8, 14, 23, 28, 30],
    sourceUrls: [
      'https://gdpr-info.eu/'
    ]
  },
  {
    id: 'reg-003',
    name: 'US Executive Order 14110 on Safe, Secure, and Trustworthy AI',
    region: 'United States',
    category: 'AI Policy & Executive Mandates',
    summary: 'Federal directive setting safety standards, red-teaming requirements, and consumer protection guidelines for advanced AI models.',
    keyRequirements: [
      'Mandatory sharing of safety test results for dual-use foundation models',
      'NIST framework development for AI safety benchmarking',
      'Protection against AI-enabled fraud, surveillance, and bias',
      'Attracting global AI talent while guarding national security assets'
    ],
    status: 'Active',
    impactLevel: 'High',
    lastUpdated: '2023-10-30',
    relatedQuestions: [2, 6, 10, 18, 24, 32],
    sourceUrls: [
      'https://www.whitehouse.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-the-safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence/'
    ]
  },
  {
    id: 'reg-004',
    name: 'NIST AI Risk Management Framework (AI RMF 1.0)',
    region: 'United States',
    category: 'AI Governance Standards',
    summary: 'Voluntary framework designed to help organizations manage risks associated with AI technologies.',
    keyRequirements: [
      'Four core functions: Govern, Map, Measure, and Manage',
      'Documentation of trustworthy AI characteristics (validity, reliability, fairness)',
      'Continuous monitoring of deployed AI assets',
      'Stakeholder engagement across the AI system lifecycle'
    ],
    status: 'Active',
    impactLevel: 'Medium',
    lastUpdated: '2023-01-26',
    relatedQuestions: [5, 7, 11, 15, 26, 31, 35],
    sourceUrls: [
      'https://www.nist.gov/itl/ai-risk-management-framework'
    ]
  },
  {
    id: 'reg-005',
    name: 'California Consumer Privacy Act / CPRA',
    region: 'United States (California)',
    category: 'Data Privacy & Protection',
    summary: 'State-level privacy statute granting California consumers rights over personal information collected by businesses.',
    keyRequirements: [
      'Right to opt-out of the sale or sharing of personal information',
      'Right to correct inaccurate personal data and limit sensitive data usage',
      'Mandatory privacy notices at or before collection',
      'Enforcement via the California Privacy Protection Agency (CPPA)'
    ],
    status: 'Active',
    impactLevel: 'High',
    lastUpdated: '2023-07-01',
    relatedQuestions: [4, 9, 13, 27, 34],
    sourceUrls: [
      'https://cppa.ca.gov/'
    ]
  },
  {
    id: 'reg-006',
    name: 'Health Insurance Portability and Accountability Act (HIPAA) - Security Rule',
    region: 'United States',
    category: 'Healthcare & Research Data',
    summary: 'National standard protecting individually identifiable health information held or transmitted by covered entities.',
    keyRequirements: [
      'Administrative, physical, and technical safeguards for ePHI',
      'Business Associate Agreements (BAAs) for external research partners',
      'De-identification standard for research data sharing',
      'Strict audit controls and access monitoring'
    ],
    status: 'Active',
    impactLevel: 'High',
    lastUpdated: '2024-02-10',
    relatedQuestions: [8, 16, 19, 29, 38],
    sourceUrls: [
      'https://www.hhs.gov/hipaa/for-professionals/security/index.html'
    ]
  },
  {
    id: 'reg-007',
    name: 'UK AI Regulatory Framework (Pro-Innovation Approach)',
    region: 'United Kingdom',
    category: 'AI Policy & Executive Mandates',
    summary: 'Context-specific, sector-led approach to regulating AI across existing regulators rather than a single horizontal law.',
    keyRequirements: [
      'Five core principles: Safety, Transparency, Fairness, Accountability, Redress',
      'Sector regulator oversight (FCA, CMA, ICO, MHRA)',
      'Empowering research and sandbox testing environments',
      'Central coordination and monitoring unit'
    ],
    status: 'Under Review',
    impactLevel: 'Medium',
    lastUpdated: '2024-02-06',
    relatedQuestions: [1, 6, 12, 20, 33, 40],
    sourceUrls: [
      'https://www.gov.uk/government/publications/ai-regulation-a-pro-innovation-approach'
    ]
  },
  {
    id: 'reg-008',
    name: 'ISO/IEC 42001:2023 Information Technology - Artificial Intelligence Management System',
    region: 'International',
    category: 'International Standards',
    summary: 'International standard specifying requirements for establishing, implementing, maintaining, and continually improving an AI Management System (AIMS).',
    keyRequirements: [
      'AI risk assessment and impact analysis process standard',
      'Data quality control for machine learning model training',
      'Lifecycle controls from conceptualization to decommissioning',
      'Third-party certification and compliance auditing'
    ],
    status: 'Active',
    impactLevel: 'Medium',
    lastUpdated: '2023-12-18',
    relatedQuestions: [7, 10, 17, 22, 36, 39],
    sourceUrls: [
      'https://www.iso.org/standard/81230.html'
    ]
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegulatoryResponse>
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      total: 0,
      data: [],
      categories: [],
      regions: [],
      error: `Method ${req.method} Not Allowed. Use GET.`
    });
  }

  try {
    const { category, region, status, impact, question, search, id } = req.query;

    let filteredData = [...REGULATORY_DATA];

    if (id && typeof id === 'string') {
      filteredData = filteredData.filter((item) => item.id.toLowerCase() === id.toLowerCase());
    }

    if (category && typeof category === 'string') {
      filteredData = filteredData.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (region && typeof region === 'string') {
      filteredData = filteredData.filter(
        (item) => item.region.toLowerCase().includes(region.toLowerCase())
      );
    }

    if (status && typeof status === 'string') {
      filteredData = filteredData.filter(
        (item) => item.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (impact && typeof impact === 'string') {
      filteredData = filteredData.filter(
        (item) => item.impactLevel.toLowerCase() === impact.toLowerCase()
      );
    }

    if (question) {
      const qNum = parseInt(question as string, 10);
      if (!isNaN(qNum)) {
        filteredData = filteredData.filter((item) =>
          item.relatedQuestions.includes(qNum)
        );
      }
    }

    if (search && typeof search === 'string') {
      const query = search.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.keyRequirements.some((reqItem) => reqItem.toLowerCase().includes(query))
      );
    }

    const categories = Array.from(new Set(REGULATORY_DATA.map((item) => item.category)));
    const regions = Array.from(new Set(REGULATORY_DATA.map((item) => item.region)));

    return res.status(200).json({
      success: true,
      total: filteredData.length,
      data: filteredData,
      categories,
      regions
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return res.status(500).json({
      success: false,
      total: 0,
      data: [],
      categories: [],
      regions: [],
      error: `Failed to fetch regulatory data: ${errorMessage}`
    });
  }
}