import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Search,
  Tag,
  FileText,
  Check,
  AlertTriangle,
  Info,
  HelpCircle,
  ArrowRight,
  Download,
  Copy,
  Layers,
  BookOpen,
  Filter,
  Sparkles,
  ShieldAlert,
  Database,
  ExternalLink,
  Code,
  CheckCircle2,
  ListFilter
} from 'lucide-react';

// Types
interface DecodedSegment {
  key: string;
  value: string;
  label: string;
  description: string;
  badgeColor?: string;
  status?: 'success' | 'warning' | 'danger' | 'info';
}

interface LabelResult {
  code: string;
  title: string;
  category: string;
  summary: string;
  confidence: number;
  segments: DecodedSegment[];
  relatedQuestions: { id: string; title: string; type: 'answered' | 'future' }[];
  researchNotes: string[];
  safetyOrPriorityLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface PresetLabel {
  code: string;
  label: string;
  category: string;
  description: string;
}

// Preset samples for quick testing
const PRESETS: PresetLabel[] = [
  {
    code: 'RES-2025-Q04-METHOD-P1',
    label: 'Research Tag: Methodology Question 4',
    category: 'Research Taxonomy',
    description: 'Decodes research question metadata, priority level, and domain target.'
  },
  {
    code: 'E300',
    label: 'E300 - Ascorbic Acid',
    category: 'Food Additive / E-Number',
    description: 'Decodes regulatory status, antioxidant function, and safety synthesis.'
  },
  {
    code: 'GHS07-H315',
    label: 'GHS07 / H315 - Skin Irritation',
    category: 'Hazard & Safety Tag',
    description: 'Decodes GHS classification, hazard statement, and handling protocol.'
  },
  {
    code: 'Q-ANS-12',
    label: 'Question Matrix: Answered #12',
    category: '20+20 Question Matrix',
    description: 'Direct link to primary batch research question #12.'
  },
  {
    code: 'Q-RES-07',
    label: 'Question Matrix: Future Research #7',
    category: '20+20 Question Matrix',
    description: 'Direct link to secondary investigation question #7.'
  }
];

// E-Number database lookup
const E_NUMBERS: Record<string, { name: string; type: string; status: string; desc: string; safety: 'Low' | 'Medium' | 'High' | 'Critical'; questions: string[] }> = {
  'E100': { name: 'Curcumin', type: 'Colorant (Natural)', status: 'Approved (EU/FDA)', desc: 'Natural yellow dye extracted from turmeric root.', safety: 'Low', questions: ['Q-ANS-03', 'Q-RES-11'] },
  'E211': { name: 'Sodium Benzoate', type: 'Preservative', status: 'Approved with limits', desc: 'Antifungal agent used in acidic foods and carbonated drinks.', safety: 'Medium', questions: ['Q-ANS-08', 'Q-RES-04'] },
  'E300': { name: 'Ascorbic Acid (Vitamin C)', type: 'Antioxidant / Acidity Regulator', status: 'Generally Recognized as Safe (GRAS)', desc: 'Essential nutrient used to prevent oxidation and color fading.', safety: 'Low', questions: ['Q-ANS-01', 'Q-RES-02'] },
  'E407': { name: 'Carrageenan', type: 'Thickener / Stabilizer', status: 'Approved (Under Active Study)', desc: 'Polysaccharide derived from red seaweed used in dairy alternatives.', safety: 'Medium', questions: ['Q-ANS-14', 'Q-RES-15'] },
  'E621': { name: 'Monosodium Glutamate (MSG)', type: 'Flavor Enhancer', status: 'Approved', desc: 'Sodium salt of glutamic acid delivering umami taste profile.', safety: 'Low', questions: ['Q-ANS-05', 'Q-RES-09'] },
  'E951': { name: 'Aspartame', type: 'Artificial Sweetener', status: 'Approved (EFSA/FDA Re-evaluated)', desc: 'Low-calorie artificial sweetener 200x sweeter than sucrose.', safety: 'High', questions: ['Q-ANS-19', 'Q-RES-20'] }
};

// Hazard database lookup
const HAZARD_CODES: Record<string, { title: string; category: string; description: string; safety: 'Low' | 'Medium' | 'High' | 'Critical' }> = {
  'H300': { title: 'Fatal if swallowed', category: 'Acute Toxicity (Oral)', description: 'High acute hazard upon oral exposure.', safety: 'Critical' },
  'H315': { title: 'Causes skin irritation', category: 'Skin Corrosion/Irritation', description: 'Reversible skin damage following exposure.', safety: 'Medium' },
  'H319': { title: 'Causes serious eye irritation', category: 'Serious Eye Damage', description: 'Irritation that persists for >24 hours.', safety: 'Medium' },
  'H410': { title: 'Very toxic to aquatic life with long lasting effects', category: 'Environmental Hazard', description: 'Chronic toxicity to aquatic ecosystems.', safety: 'High' }
};

// Standard Question Matrix (20 Answered + 20 Future Research)
const ANSWERED_QUESTIONS = Array.from({ length: 20 }, (_, i) => ({
  id: `Q-ANS-${String(i + 1).padStart(2, '0')}`,
  num: i + 1,
  title: [
    'Primary Literature Scope & Synthesis',
    'Core Conceptual Foundations & Definitions',
    'Chemical Properties & Structural Analysis',
    'Methodological Rigor & Data Collection',
    'Comparative Toxicity & Biological Impact',
    'Regulatory Frameworks & Global Standards',
    'Analytical Detection Techniques',
    'Preservative Synergies & Compound Interactions',
    'Consumer Risk Perception & Behavioral Impact',
    'Environmental Degradation Pathways',
    'Bioavailability & Metabolic Kinetics',
    'Manufacturing Quality & Impurity Profiles',
    'Economic Impact & Supply Chain Dependencies',
    'Alternative Natural Compounds Evaluation',
    'Long-Term Stability under Stress Conditions',
    'Dosage Limits & Acceptable Daily Intake (ADI)',
    'Special Population Vulnerabilities',
    'Packaging Material Interaction Analysis',
    'Synergistic Health Outcomes in Meta-Analysis',
    'Summary Synthesis of First-Phase Evidence'
  ][i] || `Answered Research Question #${i + 1}`,
  type: 'answered' as const
}));

const FUTURE_QUESTIONS = Array.from({ length: 20 }, (_, i) => ({
  id: `Q-RES-${String(i + 1).padStart(2, '0')}`,
  num: i + 1,
  title: [
    'Longitudinal Health Effects in Diverse Cohorts',
    'Advanced Spectroscopic Identification at Scale',
    'Microbiome Interaction & Metabolic Alteration',
    'Machine Learning Models for Hazard Prediction',
    'Novel Biopolymer Replacement Candidates',
    'Global Harmonization Bottlenecks in Policy',
    'Cellular Oxidative Stress Biomarkers',
    'Waste Stream Processing & Aquatic Accumulation',
    'Genomic Susceptibility & Polymorphisms',
    'Real-time In-line Quality Sensing Systems',
    'High-Throughput Bioassay Screening Validation',
    'Synergistic Cocktail Effects in Urban Runoff',
    'Lifecycle Carbon Footprint of Synthetic Labels',
    'Consumer Transparency Tools & Digital Twin Tags',
    'Epigenetic Modifications from Chronic Intake',
    'Nano-encapsulation Delivery Performance',
    'Standardized Extraction Protocols for Mass Specs',
    'Cross-Continental Regulatory Drift Trends',
    'Artificial Intelligence in E-Number Substitution',
    'Ultimate Multi-Omics Research Integration Plan'
  ][i] || `Future Deep Research Question #${i + 1}`,
  type: 'future' as const
}));

export default function LabelDecoderPage() {
  const [inputCode, setInputCode] = useState<string>('RES-2025-Q04-METHOD-P1');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'decoder' | 'matrix' | 'about'>('decoder');
  const [filterType, setFilterType] = useState<'all' | 'answered' | 'future'>('all');
  const [matrixSearch, setMatrixSearch] = useState<string>('');

  // Core Decoding Logic
  const decodedResult = useMemo<LabelResult>(() => {
    const raw = inputCode.trim().toUpperCase();

    // 1. Check custom Research Taxonomy pattern: RES-YYYY-QXX-DOMAIN-PX
    const resTaxonomyRegex = /^RES-(\d{4})-Q(\d{1,2})-([A-Z]+)-P([1-4])$/;
    const resMatch = raw.match(resTaxonomyRegex);

    if (resMatch) {
      const [_, year, qNumStr, domainCode, priorityStr] = resMatch;
      const qNum = parseInt(qNumStr, 10);
      const priority = parseInt(priorityStr, 10);

      const domainMap: Record<string, string> = {
        METHOD: 'Methodology & Experimental Design',
        DATA: 'Data Analysis & Empirical Gathering',
        CHEM: 'Chemical & Biochemical Analysis',
        TOX: 'Toxicity & Safety Evaluation',
        REG: 'Regulatory Policy & Standards',
        ENV: 'Environmental & Ecological Impact'
      };

      const matchedAnswered = ANSWERED_QUESTIONS.find((q) => q.num === qNum);
      const matchedFuture = FUTURE_QUESTIONS.find((q) => q.num === qNum);

      const related = [];
      if (matchedAnswered) related.push(matchedAnswered);
      if (matchedFuture) related.push(matchedFuture);

      return {
        code: raw,
        title: `Research Question ${qNum} Tag (${year})`,
        category: 'Structured Research Tag',
        summary: `Decoded research metadata tag belonging to domain '${domainMap[domainCode] || domainCode}' targeted for research cycle ${year}.`,
        confidence: 0.98,
        safetyOrPriorityLevel: priority === 1 ? 'Critical' : priority === 2 ? 'High' : priority === 3 ? 'Medium' : 'Low',
        segments: [
          { key: 'Prefix', value: 'RES', label: 'Research Object', description: 'Identifies standard internal research taxonomy entity.', badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300' },
          { key: 'Year', value: year, label: 'Research Cycle', description: `Target publication / review year: ${year}.`, badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
          { key: 'Question Number', value: `Q${qNumStr}`, label: 'Matrix Pointer', description: `Points to question slot #${qNum} in the 20+20 research matrix.`, badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' },
          { key: 'Domain', value: domainCode, label: 'Research Discipline', description: domainMap[domainCode] || 'Custom Domain Module', badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' },
          { key: 'Priority Level', value: `P${priority}`, label: 'Execution Urgency', description: `Priority Tier ${priority} (${priority === 1 ? 'Immediate Focus' : 'Scheduled Follow-up'}).`, badgeColor: priority === 1 ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' }
        ],
        relatedQuestions: related,
        researchNotes: [
          `Cross-reference findings with primary literature gathered in Phase 1 (${year}).`,
          `Check whether Question #${qNum} requires additional experimental validation before filing research document.`,
          `Ensure domain boundaries (${domainMap[domainCode] || domainCode}) align with team review guidelines.`
        ]
      };
    }

    // 2. Direct E-Number Lookup
    const cleanedE = raw.replace(/\s+/g, '');
    if (E_NUMBERS[cleanedE]) {
      const item = E_NUMBERS[cleanedE];
      const related = [...ANSWERED_QUESTIONS, ...FUTURE_QUESTIONS].filter((q) => item.questions.includes(q.id));

      return {
        code: cleanedE,
        title: `${cleanedE} - ${item.name}`,
        category: 'Food Additive / Chemical Label',
        summary: `${item.desc} Functional Category: ${item.type}. Regulatory Status: ${item.status}.`,
        confidence: 0.99,
        safetyOrPriorityLevel: item.safety,
        segments: [
          { key: 'Code Prefix', value: 'E', label: 'EU/International Approved Additive', description: 'E-number prefix indicating standardized safety and regulatory review in EU/Codex Alimentarius.', badgeColor: 'bg-blue-100 text-blue-800' },
          { key: 'Additive Name', value: item.name, label: 'Substance Name', description: `Chemical/Common Name: ${item.name}`, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { key: 'Functional Class', value: item.type, label: 'Primary Function', description: item.type, badgeColor: 'bg-indigo-100 text-indigo-800' },
          { key: 'Regulatory Status', value: item.status, label: 'Global Compliance', description: item.status, badgeColor: 'bg-amber-100 text-amber-800' }
        ],
        relatedQuestions: related,
        researchNotes: [
          `Evaluate maximum dosage guidelines according to EFSA / FDA safety evaluations.`,
          `Analyze bio-accumulation and intestinal degradation pathways in human microbiome models.`,
          `Review substitute options in natural non-synthetic food processing matrices.`
        ]
      };
    }

    // 3. Question Matrix Direct Codes (e.g., Q-ANS-05 or Q-RES-12)
    const qMatrixRegex = /^Q-(ANS|RES)-(\d{1,2})$/;
    const qMatch = raw.match(qMatrixRegex);
    if (qMatch) {
      const [_, typeCode, numStr] = qMatch;
      const num = parseInt(numStr, 10);
      const isAnswered = typeCode === 'ANS';
      const targetList = isAnswered ? ANSWERED_QUESTIONS : FUTURE_QUESTIONS;
      const found = targetList.find((q) => q.num === num);

      return {
        code: raw,
        title: found ? found.title : `Question ${num} (${isAnswered ? 'Answered' : 'Future Research'})`,
        category: '20+20 Research Matrix Node',
        summary: isAnswered
          ? `Part of the foundational 20 Markdown Answered Questions set addressing core research principles.`
          : `Part of the 20 Future Research Questions targeted for post-synthesis investigation and meta-analysis.`,
        confidence: 1.0,
        safetyOrPriorityLevel: isAnswered ? 'Low' : 'High',
        segments: [
          { key: 'Schema Type', value: 'Q Matrix', label: 'Research Framework', description: 'Standard 20+20 dual-phase question mapping framework.', badgeColor: 'bg-indigo-100 text-indigo-800' },
          { key: 'Phase', value: isAnswered ? 'Phase 1 (Answered)' : 'Phase 2 (Future Research)', label: 'Research Status', description: isAnswered ? 'Completed markdown article available.' : 'Deep research scheduled.', badgeColor: isAnswered ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800' },
          { key: 'Index Number', value: `#${num}`, label: 'Question Number', description: `Position ${num} out of 20 in this track.`, badgeColor: 'bg-purple-100 text-purple-800' }
        ],
        relatedQuestions: found ? [found] : [],
        researchNotes: [
          isAnswered
            ? 'Access completed Markdown source file in the /research markdown repository.'
            : 'Gather preliminary datasets and formulate hypotheses for upcoming investigation.',
          'Cross-link with complementary questions to synthesize systemic conclusions.'
        ]
      };
    }

    // 4. GHS Hazard Code match
    if (HAZARD_CODES[raw]) {
      const hazard = HAZARD_CODES[raw];
      return {
        code: raw,
        title: `${raw}: ${hazard.title}`,
        category: 'GHS Hazard Classification Code',
        summary: `Globally Harmonized System safety label code. Hazard Class: ${hazard.category}.`,
        confidence: 0.95,
        safetyOrPriorityLevel: hazard.safety,
        segments: [
          { key: 'Standard', value: 'GHS Statement', label: 'Safety Standard', description: 'UN Globally Harmonized System of Classification and Labelling of Chemicals.', badgeColor: 'bg-rose-100 text-rose-800' },
          { key: 'Category', value: hazard.category, label: 'Hazard Type', description: hazard.category, badgeColor: 'bg-amber-100 text-amber-800' },
          { key: 'Statement', value: hazard.title, label: 'Official Description', description: hazard.description, badgeColor: 'bg-slate-100 text-slate-800' }
        ],
        relatedQuestions: [ANSWERED_QUESTIONS[4], FUTURE_QUESTIONS[3]],
        researchNotes: [
          'Verify Personal Protective Equipment (PPE) requirements prior to lab handling.',
          'Check local environmental disposal regulations for persistent environmental hazards.'
        ]
      };
    }

    // 5. Generic Fallback Heuristic Parsing
    const tokens = raw.split(/[-_\s/]+/);
    return {
      code: raw,
      title: `Decoded Generic Tag: ${raw}`,
      category: 'Unstandardized / Heuristic Label',
      summary: `Parsed ${tokens.length} token segment(s) using general taxonomy heuristics.`,
      confidence: 0.65,
      safetyOrPriorityLevel: 'Medium',
      segments: tokens.map((token, idx) => ({
        key: `Segment ${idx + 1}`,
        value: token,
        label: isNaN(Number(token)) ? 'Text Token / Identifier' : 'Numeric Index / Value',
        description: `Parsed token [${token}] at offset ${idx}.`,
        badgeColor: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      })),
      relatedQuestions: [ANSWERED_QUESTIONS[0], FUTURE_QUESTIONS[0]],
      researchNotes: [
        'Custom or unlisted label format detected.',
        'Try entering standard formats such as "RES-2025-Q01-METHOD-P1", "E300", "GHS07-H315", or "Q-ANS-01".'
      ]
    };
  }, [inputCode]);

  // Handle Copy Breakdown
  const handleCopy = () => {
    const markdownOutput = `### Label Breakdown: ${decodedResult.code}
**Title:** ${decodedResult.title}
**Category:** ${decodedResult.category}
**Summary:** ${decodedResult.summary}
**Priority/Safety Level:** ${decodedResult.safetyOrPriorityLevel}

#### Parsed Segments:
${decodedResult.segments.map((s) => `- **${s.key}** (${s.value}): ${s.description}`).join('\n')}

#### Research Notes:
${decodedResult.researchNotes.map((n) => `- ${n}`).join('\n')}
`;
    navigator.clipboard.writeText(markdownOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Matrix Filtered List
  const filteredMatrix = useMemo(() => {
    let list: { id: string; num: number; title: string; type: 'answered' | 'future' }[] = [];
    if (filterType === 'all' || filterType === 'answered') {
      list = [...list, ...ANSWERED_QUESTIONS];
    }
    if (filterType === 'all' || filterType === 'future') {
      list = [...list, ...FUTURE_QUESTIONS];
    }

    if (matrixSearch.trim()) {
      const q = matrixSearch.toLowerCase();
      list = list.filter((item) => item.id.toLowerCase().includes(q) || item.title.toLowerCase().includes(q));
    }
    return list;
  }, [filterType, matrixSearch]);

  return (
    <>
      <Head>
        <title>Label Decoder | Research Knowledge Base</title>
        <meta
          name="description"
          content="Dedicated Label Decoder tool for parsing research taxonomy, chemical E-numbers, GHS hazard tags, and the 20+20 question matrix."
        />
      </Head>

      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans">
        {/* Top Header / Navigation Bar */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-md">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">Research Hub</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Label Decoder & Matrix Terminal</p>
              </div>
            </div>

            <nav className="flex space-x-1 sm:space-x-2">
              <button
                onClick={() => setActiveTab('decoder')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
                  activeTab === 'decoder'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                <Code className="w-4 h-4" />
                <span>Label Decoder</span>
              </button>
              <button
                onClick={() => setActiveTab('matrix')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
                  activeTab === 'matrix'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>20+20 Matrix</span>
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
                  activeTab === 'about'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                <Info className="w-4 h-4" />
                <span>Documentation</span>
              </button>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Research Analytics & Taxonomy Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Label Decoder Tool
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
              Parse research question codes, E-numbers, regulatory labels, and GHS safety classifications. Connect decoded identifiers directly into the 20 primary answered and 20 future research questions.
            </p>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'decoder' && (
            <div className="space-y-8">
              {/* Input Section */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <label htmlFor="label-input" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Enter Label, Code, E-Number, or Research Tag
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    id="label-input"
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="e.g. RES-2025-Q04-METHOD-P1, E300, H315, or Q-ANS-01"
                    className="w-full pl-10 pr-24 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm sm:text-base outline-none transition"
                  />
                  {inputCode && (
                    <button
                      onClick={() => setInputCode('')}
                      className="absolute inset-y-0 right-3 px-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 my-auto h-7 rounded"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Quick Presets */}
                <div className="mt-4">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                    Preset Examples
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.code}
                        onClick={() => setInputCode(preset.code)}
                        className={`text-xs px-3 py-1.5 rounded-md border font-medium transition-all ${
                          inputCode.trim().toUpperCase() === preset.code
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                        title={preset.description}
                      >
                        {preset.code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decoded Results Display */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Columns: Breakdown & Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Summary Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                            {decodedResult.category}
                          </span>
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                              decodedResult.safetyOrPriorityLevel === 'Critical'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : decodedResult.safetyOrPriorityLevel === 'High'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : decodedResult.safetyOrPriorityLevel === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            Priority / Risk: {decodedResult.safetyOrPriorityLevel}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mt-2 text-slate-900 dark:text-white">
                          {decodedResult.title}
                        </h3>
                      </div>

                      <button
                        onClick={handleCopy}
                        className="inline-flex items-center space-x-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-500" />
                            <span>Copied Markdown</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy Report</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                      {decodedResult.summary}
                    </p>

                    {/* Breakdown Segments */}
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-indigo-500" />
                      <span>Decoded Structure & Segments</span>
                    </h4>

                    <div className="space-y-3">
                      {decodedResult.segments.map((seg, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                {seg.key}
                              </span>
                              <span className="text-slate-300 dark:text-slate-700">•</span>
                              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                {seg.label}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {seg.description}
                            </p>
                          </div>
                          <div className="self-start sm:self-center">
                            <span className="font-mono text-sm px-2.5 py-1 rounded font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-sm">
                              {seg.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Research Notes Section */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      <span>Key Research Action Items & Guidance</span>
                    </h4>
                    <ul className="space-y-2.5">
                      {decodedResult.researchNotes.map((note, idx) => (
                        <li key={idx} className="flex items-start space-x-3 text-sm text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right 1 Column: Linked Questions from 20+20 Matrix */}
                <div className="space-y-6">
                  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                        <Database className="w-4 h-4 text-indigo-500" />
                        <span>Linked 20+20 Matrix Nodes</span>
                      </h4>
                      <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
                        {decodedResult.relatedQuestions.length} Connected
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      This decoded label references or maps directly to the following target questions in our research catalog:
                    </p>

                    {decodedResult.relatedQuestions.length > 0 ? (
                      <div className="space-y-3">
                        {decodedResult.relatedQuestions.map((q) => (
                          <div
                            key={q.id}
                            className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition bg-slate-50/50 dark:bg-slate-950/50"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                {q.id}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                                  q.type === 'answered'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                }`}
                              >
                                {q.type === 'answered' ? 'Answered Question' : 'Future Research'}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                              {q.title}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center border border-dashed rounded-lg border-slate-200 dark:border-slate-800">
                        <HelpCircle className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                        <p className="text-xs text-slate-500">No direct matrix mapping found for this specific query.</p>
                      </div>
                    )}

                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => setActiveTab('matrix')}
                        className="w-full text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center justify-center space-x-1 py-1"
                      >
                        <span>Browse Full 20+20 Question Matrix</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Schema Syntax Guide */}
                  <div className="bg-indigo-900 text-white rounded-xl shadow-sm p-6">
                    <h4 className="text-sm font-semibold mb-2 flex items-center space-x-2 text-indigo-200">
                      <Code className="w-4 h-4 text-indigo-300" />
                      <span>Tag Structure Cheat Sheet</span>
                    </h4>
                    <p className="text-xs text-indigo-200 mb-4">
                      Format custom research tags using the standard internal taxonomy string:
                    </p>
                    <div className="bg-indigo-950 p-3 rounded font-mono text-xs text-indigo-300 mb-3 border border-indigo-800">
                      RES-[YEAR]-Q[NUM]-[DOMAIN]-P[1-4]
                    </div>
                    <ul className="text-xs space-y-1.5 text-indigo-200">
                      <li>• <strong>DOMAIN:</strong> METHOD, DATA, CHEM, TOX, REG, ENV</li>
                      <li>• <strong>PRIORITY:</strong> P1 (Immediate) to P4 (Low)</li>
                      <li>• <strong>E-NUMBERS:</strong> E100 – E999</li>
                      <li>• <strong>QUESTIONS:</strong> Q-ANS-01..20 or Q-RES-01..20</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Full 20+20 Question Matrix Explorer */}
          {activeTab === 'matrix' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      20+20 Question Research Matrix
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      20 Answered markdown synthesis questions alongside 20 future deep research questions.
                    </p>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[200px]">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search matrix..."
                        value={matrixSearch}
                        onChange={(e) => setMatrixSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                      <button
                        onClick={() => setFilterType('all')}
                        className={`text-xs px-3 py-1 rounded-md font-medium transition ${
                          filterType === 'all'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        All (40)
                      </button>
                      <button
                        onClick={() => setFilterType('answered')}
                        className={`text-xs px-3 py-1 rounded-md font-medium transition ${
                          filterType === 'answered'
                            ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Answered (20)
                      </button>
                      <button
                        onClick={() => setFilterType('future')}
                        className={`text-xs px-3 py-1 rounded-md font-medium transition ${
                          filterType === 'future'
                            ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Future Research (20)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Matrix Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMatrix.map((q) => (
                    <div
                      key={q.id}
                      onClick={() => {
                        setInputCode(q.id);
                        setActiveTab('decoder');
                      }}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer transition bg-slate-50/50 dark:bg-slate-950/40 hover:shadow-md group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {q.id}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            q.type === 'answered'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {q.type === 'answered' ? 'Answered' : 'Future Research'}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {q.title}
                      </h4>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                        <span>Click to decode details</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-indigo-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Documentation & Methodology */}
          {activeTab === 'about' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  About the Label Decoder Tool
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                  The Label Decoder is designed to serve as a central metadata interpreter for our comprehensive research project. The project architecture consists of <strong>20 primary markdown files answering core fundamental questions</strong>, followed by <strong>20 advanced research questions</strong> designed for subsequent gathering, meta-analysis, and field research.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-3">
                    1
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                    Taxonomy Parsing
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Breaks structured string codes (`RES-2025-Q01-METHOD-P1`) into actionable metadata properties including discipline, priority, and year.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-3">
                    2
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                    Regulatory & Hazard Lookup
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Maps food additive E-numbers and GHS hazard statements directly to clinical and environmental safety evaluations.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold mb-3">
                    3
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                    20+20 Matrix Linkage
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Connects parsed inputs directly to the 20 Phase 1 Answered Questions and 20 Phase 2 Deep Research Questions.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Version 2.4.0 • Research Label Decoder System
                </span>
                <button
                  onClick={() => setActiveTab('decoder')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition"
                >
                  Return to Decoder Terminal
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}