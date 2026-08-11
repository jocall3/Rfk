import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  FileText,
  Filter,
  Sparkles,
  BookOpen,
  Copy,
  Save,
  ChevronRight,
  ChevronDown,
  Check,
  BarChart3,
  Database,
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw,
  Info,
  HelpCircle,
  Zap,
  ArrowRight
} from 'lucide-react';

export type QuestionStatus = 'not_started' | 'in_progress' | 'data_gathered' | 'completed';
export type QuestionCategory = 'Market & Demographics' | 'Technical Architecture' | 'Financial & Business Model' | 'Operations & Compliance' | 'Product & Strategy';

export interface Source {
  id: string;
  title: string;
  url: string;
  type: 'Primary Data' | 'Secondary Report' | 'Interview' | 'Benchmark' | 'Academic Paper' | 'Other';
  credibility: 'High' | 'Medium' | 'Low';
}

export interface ResearchNote {
  questionId: number;
  hypothesis: string;
  findings: string;
  quantitativeData: string;
  sources: Source[];
  confidenceScore: number; // 1 to 5
  keyTakeaways: string[];
  actionItems: string[];
  lastUpdated: string;
  status: QuestionStatus;
}

export interface ResearchQuestion {
  id: number;
  title: string;
  question: string;
  category: QuestionCategory;
  description: string;
  suggestedMethods: string[];
}

const INITIAL_RESEARCH_QUESTIONS: ResearchQuestion[] = [
  {
    id: 1,
    title: "Market Sizing & Segment Definition",
    question: "What is the Total Addressable Market (TAM), Serviceable Addressable Market (SAM), and target initial market share?",
    category: "Market & Demographics",
    description: "Define top-down and bottom-up market sizing metrics with explicit demographic boundaries.",
    suggestedMethods: ["Industry reports (Gartner/Statista)", "Top-down estimation", "Bottom-up ACV calculations"]
  },
  {
    id: 2,
    title: "User Persona Pain Points & Willingness to Pay",
    question: "Who are the core decision-makers, what are their urgent pain points, and what is their validated price elasticity?",
    category: "Market & Demographics",
    description: "Gather direct user interview responses regarding budgetary authorization and price sensitivity.",
    suggestedMethods: ["User interviews", "Van Westendorp Price Sensitivity survey", "Customer journey mapping"]
  },
  {
    id: 3,
    title: "Competitive Landscape & Feature Parity",
    question: "What are the top 3 direct and indirect competitors, and what specific features provide our core differentiation?",
    category: "Market & Demographics",
    description: "Map key features, pricing tiers, market positioning, and critical weaknesses of incumbents.",
    suggestedMethods: ["Feature comparison matrix", "Product tear-downs", "G2/Capterra review analysis"]
  },
  {
    id: 4,
    title: "System Architecture Scalability Constraints",
    question: "What technical architecture decisions must be made to ensure 10x scalability without engineering rewrites?",
    category: "Technical Architecture",
    description: "Evaluate database choices, stateless service boundaries, caching layers, and serverless options.",
    suggestedMethods: ["Load testing benchmarks", "Cloud cost profiling", "Architecture review sessions"]
  },
  {
    id: 5,
    title: "Data Privacy & Regulatory Compliance Requirements",
    question: "What regulatory framework (GDPR, HIPAA, SOC2, CCPA) mandates apply and what technical guardrails are needed?",
    category: "Operations & Compliance",
    description: "Document required compliance certifications, data residency constraints, and audit trail needs.",
    suggestedMethods: ["Legal review", "Compliance matrix check", "Security audit baseline"]
  },
  {
    id: 6,
    title: "Unit Economics & Financial Projections",
    question: "What are the target unit economics metrics (CAC, LTV, Payback Period, Gross Margins) over a 3-year horizon?",
    category: "Financial & Business Model",
    description: "Construct financial models validating sustainable unit margin profile at steady state.",
    suggestedMethods: ["Financial cohort modeling", "Customer Acquisition Cost simulation", "Marginal cost analysis"]
  },
  {
    id: 7,
    title: "Primary Data Gathering Protocol",
    question: "What specific primary data collection methods (surveys, telemetry, user tests) are required to test core assumptions?",
    category: "Market & Demographics",
    description: "Design structured telemetry and survey protocols to systematically test product hypotheses.",
    suggestedMethods: ["A/B test design", "In-app micro-surveys", "Beta telemetry instrumenting"]
  },
  {
    id: 8,
    title: "Secondary Data & Industry Benchmark Validation",
    question: "What third-party industry benchmarks validate our growth rates, churn expectations, and engagement metrics?",
    category: "Market & Demographics",
    description: "Gather published benchmarks for SaaS conversion rates, churn standards, and operational ratios.",
    suggestedMethods: ["OpenView SaaS benchmarks", "KeyBanc Capital reports", "Peer startup case studies"]
  },
  {
    id: 9,
    title: "90-Day Post-Launch Key Performance Indicators",
    question: "Which precise quantitative metrics (KPIs) will define success and signal greenlight for next-phase investment?",
    category: "Product & Strategy",
    description: "Define leading and lagging metrics for early activation, 30-day retention, and viral coefficient.",
    suggestedMethods: ["OKR framework creation", "Cohort retention curves", "Activation funnel audit"]
  },
  {
    id: 10,
    title: "Technical Risk Assessment & Mitigation",
    question: "What single points of technical failure, third-party API dependencies, or performance bottlenecks pose severe risks?",
    category: "Technical Architecture",
    description: "Identify key risks including vendor lock-in, API rate limits, single DB bottlenecks, and outages.",
    suggestedMethods: ["FMEA (Failure Mode Analysis)", "Vendor reliability review", "Disaster recovery testing"]
  },
  {
    id: 11,
    title: "MVP Scope vs. v2 Roadmap Boundaries",
    question: "What is the absolute strict minimum scope for launch versus items deferred to subsequent iterations?",
    category: "Product & Strategy",
    description: "Enforce MoSCoW prioritization on all proposed user stories to maintain lean execution velocity.",
    suggestedMethods: ["MoSCoW matrix", "RICE scoring", "User story mapping"]
  },
  {
    id: 12,
    title: "Go-To-Market Channel Efficiency Analysis",
    question: "Which distribution channels (SEO, outbound, programmatic, viral loops) offer the highest initial conversion ROI?",
    category: "Product & Strategy",
    description: "Test and rank initial user acquisition channels by Cost Per Acquisition (CPA) and conversion velocity.",
    suggestedMethods: ["Paid ad micro-campaigns", "SEO keyword yield analysis", "Outbound response testing"]
  },
  {
    id: 13,
    title: "Third-Party Integration Strategy",
    question: "Which ecosystem integrations or partner APIs are prerequisite requirements for enterprise customer adoption?",
    category: "Technical Architecture",
    description: "Map essential OAuth providers, CRM connectors, Webhook destinations, and data sync partners.",
    suggestedMethods: ["Integrations audit", "Partner API documentation review", "User integration request log"]
  },
  {
    id: 14,
    title: "Operational & Resource Requirements",
    question: "What operational infrastructure, human capital, and support overhead are mandatory for early operational scaling?",
    category: "Operations & Compliance",
    description: "Document support ticketing tiering, SLA commitments, headcount timeline, and tooling requirements.",
    suggestedMethods: ["Support volume forecasting", "Headcount financial plan", "Vendor stack audit"]
  },
  {
    id: 15,
    title: "User Acquisition Funnel Drop-off Diagnostic",
    question: "Where are the expected friction points in user onboarding and how will drop-offs be tracked and remedied?",
    category: "Product & Strategy",
    description: "Identify onboarding steps with high abandonment risks and design friction-reduction interventions.",
    suggestedMethods: ["Funnel analytics setup", "Session recording analysis", "Onboarding usability testing"]
  },
  {
    id: 16,
    title: "Monetization Architecture & Pricing Tiers",
    question: "What pricing packaging model (usage-based, seat-based, flat tier) maximizes LTV while mitigating buyer friction?",
    category: "Financial & Business Model",
    description: "Structure clear tier boundaries, feature flags per tier, and overage billing mechanics.",
    suggestedMethods: ["Conjoint analysis", "Competitor price mapping", "Monetization pilot testing"]
  },
  {
    id: 17,
    title: "Cybersecurity & Data Encryption Framework",
    question: "What cryptographic standards, secrets management, and access controls (RBAC) must be active from day one?",
    category: "Technical Architecture",
    description: "Specify TLS configuration, KMS database encryption, JWT refresh tokens, and RBAC permission models.",
    suggestedMethods: ["OWASP Top 10 audit", "Threat modeling diagramming", "Penetration test setup"]
  },
  {
    id: 18,
    title: "In-Product Qualitative Feedback Systems",
    question: "How will real-time user feedback, CSAT scores, and bug reports be captured seamlessly within the UI?",
    category: "Product & Strategy",
    description: "Design low-friction in-app feedback widgets, micro-prompts, and sentiment collection hooks.",
    suggestedMethods: ["NPS/CSAT widget design", "Intercom/UserVoice integration", "User feedback triage pipeline"]
  },
  {
    id: 19,
    title: "Capital Runway & Cash Burn Thresholds",
    question: "What is the targeted monthly burn rate, overall capital runway, and specific milestones for future funding rounds?",
    category: "Financial & Business Model",
    description: "Calculate runway under base, aggressive, and conservative scenarios with clear trigger thresholds.",
    suggestedMethods: ["Cash flow forecasting", "Scenario modeling", "Burn rate sensitivity matrix"]
  },
  {
    id: 20,
    title: "Defensibility Moat & Long-Term Exit Strategy",
    question: "What dynamic dynamic network effects, proprietary datasets, or switching costs form our defensible moat?",
    category: "Product & Strategy",
    description: "Articulate long-term strategic moats, IP creation opportunities, and potential strategic acquirers.",
    suggestedMethods: ["7 Powers strategic audit", "Switching cost analysis", "Strategic buyer mapping"]
  }
];

const DEFAULT_NOTE = (qId: number): ResearchNote => ({
  questionId: qId,
  hypothesis: "",
  findings: "",
  quantitativeData: "",
  sources: [],
  confidenceScore: 3,
  keyTakeaways: [],
  actionItems: [],
  lastUpdated: new Date().toISOString().split('T')[0],
  status: 'not_started'
});

export default function ResearchWorkspace() {
  const [researchNotes, setResearchNotes] = useState<Record<number, ResearchNote>>({});
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'workspace' | 'synthesis' | 'export'>('workspace');
  
  // New source form state
  const [newSourceTitle, setNewSourceTitle] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceType, setNewSourceType] = useState<Source['type']>('Secondary Report');
  const [newSourceCredibility, setNewSourceCredibility] = useState<Source['credibility']>('High');

  // Key Takeaway & Action Item temporary inputs
  const [newTakeawayInput, setNewTakeawayInput] = useState('');
  const [newActionInput, setNewActionInput] = useState('');

  // Toast / Status notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Load from local storage if available
    try {
      const saved = localStorage.getItem('research_workspace_data');
      if (saved) {
        setResearchNotes(JSON.parse(saved));
      } else {
        // Initialize default empty notes
        const initialMap: Record<number, ResearchNote> = {};
        INITIAL_RESEARCH_QUESTIONS.forEach(q => {
          initialMap[q.id] = DEFAULT_NOTE(q.id);
        });
        setResearchNotes(initialMap);
      }
    } catch (e) {
      console.error("Failed to load local storage", e);
    }
  }, []);

  const saveToLocalStorage = (data: Record<number, ResearchNote>) => {
    try {
      localStorage.setItem('research_workspace_data', JSON.stringify(data));
      showToast('Workspace changes saved successfully');
    } catch (e) {
      console.error("Failed to save data", e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentQuestion = useMemo(() => {
    return INITIAL_RESEARCH_QUESTIONS.find(q => q.id === selectedQuestionId) || INITIAL_RESEARCH_QUESTIONS[0];
  }, [selectedQuestionId]);

  const currentNote = useMemo(() => {
    return researchNotes[selectedQuestionId] || DEFAULT_NOTE(selectedQuestionId);
  }, [researchNotes, selectedQuestionId]);

  const handleNoteChange = (field: keyof ResearchNote, value: any) => {
    const updated = {
      ...researchNotes,
      [selectedQuestionId]: {
        ...currentNote,
        [field]: value,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    };
    setResearchNotes(updated);
    saveToLocalStorage(updated);
  };

  const addSource = () => {
    if (!newSourceTitle.trim()) return;
    const newSource: Source = {
      id: Date.now().toString(),
      title: newSourceTitle,
      url: newSourceUrl,
      type: newSourceType,
      credibility: newSourceCredibility
    };
    const updatedSources = [...(currentNote.sources || []), newSource];
    handleNoteChange('sources', updatedSources);
    setNewSourceTitle('');
    setNewSourceUrl('');
  };

  const removeSource = (id: string) => {
    const updatedSources = (currentNote.sources || []).filter(s => s.id !== id);
    handleNoteChange('sources', updatedSources);
  };

  const addTakeaway = () => {
    if (!newTakeawayInput.trim()) return;
    const updated = [...(currentNote.keyTakeaways || []), newTakeawayInput.trim()];
    handleNoteChange('keyTakeaways', updated);
    setNewTakeawayInput('');
  };

  const removeTakeaway = (index: number) => {
    const updated = (currentNote.keyTakeaways || []).filter((_, i) => i !== index);
    handleNoteChange('keyTakeaways', updated);
  };

  const addActionItem = () => {
    if (!newActionInput.trim()) return;
    const updated = [...(currentNote.actionItems || []), newActionInput.trim()];
    handleNoteChange('actionItems', updated);
    setNewActionInput('');
  };

  const removeActionItem = (index: number) => {
    const updated = (currentNote.actionItems || []).filter((_, i) => i !== index);
    handleNoteChange('actionItems', updated);
  };

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return INITIAL_RESEARCH_QUESTIONS.filter(q => {
      const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            q.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
      const noteStatus = researchNotes[q.id]?.status || 'not_started';
      const matchesStatus = selectedStatus === 'All' || noteStatus === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, selectedCategory, selectedStatus, researchNotes]);

  // Overall Statistics Metrics
  const stats = useMemo(() => {
    let completed = 0;
    let dataGathered = 0;
    let inProgress = 0;
    let notStarted = 0;
    let totalSources = 0;
    let avgConfidence = 0;
    let totalConfidenceSum = 0;
    let answeredCount = 0;

    INITIAL_RESEARCH_QUESTIONS.forEach(q => {
      const note = researchNotes[q.id];
      const status = note?.status || 'not_started';
      if (status === 'completed') completed++;
      else if (status === 'data_gathered') dataGathered++;
      else if (status === 'in_progress') inProgress++;
      else notStarted++;

      if (note) {
        totalSources += (note.sources?.length || 0);
        if (note.confidenceScore) {
          totalConfidenceSum += note.confidenceScore;
          answeredCount++;
        }
      }
    });

    avgConfidence = answeredCount > 0 ? Number((totalConfidenceSum / answeredCount).toFixed(1)) : 0;
    const totalProgressPercent = Math.round(((completed * 1.0 + dataGathered * 0.75 + inProgress * 0.35) / 20) * 100);

    return {
      completed,
      dataGathered,
      inProgress,
      notStarted,
      totalSources,
      avgConfidence,
      totalProgressPercent
    };
  }, [researchNotes]);

  // Compiled Report Markdown Generator
  const generateFullMarkdownReport = () => {
    let md = `# Deep Research Workspace: Comprehensive Analysis & Findings\n`;
    md += `*Generated on: ${new Date().toLocaleDateString()} | Progress: ${stats.totalProgressPercent}% Completed*\n\n`;
    md += `## Executive Progress Overview\n`;
    md += `- **Total Questions Analyzed:** 20\n`;
    md += `- **Fully Completed:** ${stats.completed} / 20\n`;
    md += `- **Data Gathered:** ${stats.dataGathered} / 20\n`;
    md += `- **In Progress:** ${stats.inProgress} / 20\n`;
    md += `- **Total Data Sources Documented:** ${stats.totalSources}\n`;
    md += `- **Average Research Confidence Score:** ${stats.avgConfidence} / 5.0\n\n`;
    md += `---\n\n`;

    INITIAL_RESEARCH_QUESTIONS.forEach(q => {
      const note = researchNotes[q.id] || DEFAULT_NOTE(q.id);
      md += `### ${q.id}. ${q.title}\n`;
      md += `**Category:** ${q.category} | **Status:** ${note.status.toUpperCase()} | **Confidence Score:** ${note.confidenceScore}/5\n\n`;
      md += `> **Core Question:** ${q.question}\n\n`;
      
      if (note.hypothesis) {
        md += `#### Core Hypothesis\n${note.hypothesis}\n\n`;
      }

      if (note.findings) {
        md += `#### Qualitative & Strategic Findings\n${note.findings}\n\n`;
      }

      if (note.quantitativeData) {
        md += `#### Quantitative Metrics & Benchmark Data\n${note.quantitativeData}\n\n`;
      }

      if (note.keyTakeaways && note.keyTakeaways.length > 0) {
        md += `#### Key Takeaways\n`;
        note.keyTakeaways.forEach(kt => {
          md += `- ${kt}\n`;
        });
        md += `\n`;
      }

      if (note.actionItems && note.actionItems.length > 0) {
        md += `#### Next Action Steps\n`;
        note.actionItems.forEach(ai => {
          md += `- [ ] ${ai}\n`;
        });
        md += `\n`;
      }

      if (note.sources && note.sources.length > 0) {
        md += `#### Sources & Primary Evidence\n`;
        note.sources.forEach(src => {
          md += `- **${src.title}** (${src.type}) - Credibility: ${src.credibility} ${src.url ? `| Link: ${src.url}` : ''}\n`;
        });
        md += `\n`;
      }

      md += `---\n\n`;
    });

    return md;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Report copied to clipboard!');
  };

  const downloadReport = () => {
    const element = document.createElement("a");
    const file = new Blob([generateFullMarkdownReport()], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `Research_Workspace_Report_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Markdown Report File downloaded!');
  };

  const resetAllData = () => {
    if (confirm("Are you sure you want to reset all research workspace notes to default? This action cannot be undone.")) {
      const initialMap: Record<number, ResearchNote> = {};
      INITIAL_RESEARCH_QUESTIONS.forEach(q => {
        initialMap[q.id] = DEFAULT_NOTE(q.id);
      });
      setResearchNotes(initialMap);
      localStorage.removeItem('research_workspace_data');
      showToast('Workspace reset to default state');
    }
  };

  return (
    <>
      <Head>
        <title>Next 20 Questions | Research Workspace & Data Gathering</title>
        <meta name="description" content="A research workspace page where users can view the 'Next 20 Questions', fill out data gathering templates, and export reports." />
      </Head>

      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-indigo-400 animate-bounce">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium text-sm">{toastMessage}</span>
          </div>
        )}

        {/* Top Header Navbar */}
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white tracking-tight">Research Workspace</h1>
                  <span className="text-xs bg-indigo-950 text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-800">
                    Phase 2: Next 20 Questions
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Deep-dive empirical data gathering, validation templates, and synthesis reports
                </p>
              </div>
            </div>

            {/* Header Global Quick Stats & Navigation */}
            <div className="flex items-center flex-wrap gap-3">
              <div className="bg-slate-800/80 rounded-lg px-3 py-1.5 border border-slate-700/80 text-xs flex items-center gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Overall Progress</span>
                  <span className="font-bold text-indigo-400">{stats.totalProgressPercent}%</span>
                </div>
                <div className="w-16 bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full" style={{ width: `${stats.totalProgressPercent}%` }}></div>
                </div>
              </div>

              <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700/80 text-xs">
                <button
                  onClick={() => setActiveTab('workspace')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'workspace' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  Workspace
                </button>
                <button
                  onClick={() => setActiveTab('synthesis')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'synthesis' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Synthesis & Stats
                </button>
                <button
                  onClick={() => setActiveTab('export')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'export' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'synthesis' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400 text-xs font-semibold uppercase">Questions Completed</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white mt-2">{stats.completed} <span className="text-xs text-slate-500 font-normal">/ 20</span></div>
                  <p className="text-xs text-slate-400 mt-1">Fully documented & validated</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400 text-xs font-semibold uppercase">Data Gathered</span>
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white mt-2">{stats.dataGathered} <span className="text-xs text-slate-500 font-normal">/ 20</span></div>
                  <p className="text-xs text-slate-400 mt-1">Evidence collected, awaiting synthesis</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400 text-xs font-semibold uppercase">Total Sources Logged</span>
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white mt-2">{stats.totalSources}</div>
                  <p className="text-xs text-slate-400 mt-1">Across primary & secondary research</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400 text-xs font-semibold uppercase">Avg Confidence Score</span>
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white mt-2">{stats.avgConfidence} <span className="text-xs text-slate-500 font-normal">/ 5.0</span></div>
                  <p className="text-xs text-slate-400 mt-1">Based on empirical strength of findings</p>
                </div>
              </div>

              {/* Status Breakdown Bar */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-base font-semibold text-white mb-4">Research Completion Health & Breakdown</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Completion Metrics</span>
                      <span>{stats.completed + stats.dataGathered} of 20 questions with verified data</span>
                    </div>
                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full" style={{ width: `${(stats.completed / 20) * 100}%` }} title={`Completed: ${stats.completed}`} />
                      <div className="bg-blue-500 h-full" style={{ width: `${(stats.dataGathered / 20) * 100}%` }} title={`Data Gathered: ${stats.dataGathered}`} />
                      <div className="bg-amber-500 h-full" style={{ width: `${(stats.inProgress / 20) * 100}%` }} title={`In Progress: ${stats.inProgress}`} />
                      <div className="bg-slate-700 h-full" style={{ width: `${(stats.notStarted / 20) * 100}%` }} title={`Not Started: ${stats.notStarted}`} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                      <span>Completed ({stats.completed})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      <span>Data Gathered ({stats.dataGathered})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      <span>In Progress ({stats.inProgress})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-slate-700"></span>
                      <span>Not Started ({stats.notStarted})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Methodology Guidance */}
              <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-800/50 p-6 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-600/30 rounded-xl text-indigo-300 border border-indigo-500/30">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">How to execute Phase 2 Research</h3>
                    <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                      This workspace is designed to transform qualitative assumptions into empirically backed insights. For each question in the 
                      <strong> Next 20 Questions</strong> framework:
                    </p>
                    <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Formulate a verifiable test hypothesis.
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Attach at least 2 credible data sources or customer interview benchmarks.
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Assign a confidence score from 1 (unvalidated) to 5 (empirical certainty).
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Derive actionable next steps before marking as Completed.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Export Complete Research Deliverable</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Export your gathered findings, structured sources, confidence ratings, and key takeaways as a clean Markdown report or copy to clipboard.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => copyToClipboard(generateFullMarkdownReport())}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Markdown
                  </button>
                  <button
                    onClick={downloadReport}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download .MD File
                  </button>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <span className="text-xs font-mono text-slate-400 uppercase font-semibold">Live Markdown Preview</span>
                  <span className="text-xs text-slate-500">{generateFullMarkdownReport().length} characters</span>
                </div>
                <pre className="bg-slate-950 p-4 rounded-xl text-slate-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-[600px] border border-slate-800/80 leading-relaxed">
                  {generateFullMarkdownReport()}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Filterable Question Navigation List (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search 20 research questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  {/* Filter Selects */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-slate-300 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="All">All Categories</option>
                        <option value="Market & Demographics">Market & Demographics</option>
                        <option value="Technical Architecture">Technical Architecture</option>
                        <option value="Financial & Business Model">Financial & Business Model</option>
                        <option value="Operations & Compliance">Operations & Compliance</option>
                        <option value="Product & Strategy">Product & Strategy</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Status Filter</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-slate-300 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="All">All Statuses</option>
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="data_gathered">Data Gathered</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Questions Scrollable List */}
                <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                  {filteredQuestions.length === 0 ? (
                    <div className="text-center py-8 bg-slate-900 border border-slate-800 rounded-2xl p-4">
                      <HelpCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-300">No questions match filter</p>
                      <p className="text-xs text-slate-500 mt-1">Try clearing your search query or filters.</p>
                    </div>
                  ) : (
                    filteredQuestions.map((q) => {
                      const note = researchNotes[q.id] || DEFAULT_NOTE(q.id);
                      const isSelected = q.id === selectedQuestionId;

                      let statusBadge = (
                        <span className="bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Not Started
                        </span>
                      );

                      if (note.status === 'completed') {
                        statusBadge = (
                          <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        );
                      } else if (note.status === 'data_gathered') {
                        statusBadge = (
                          <span className="bg-blue-950/80 text-blue-400 border border-blue-800/80 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Database className="w-3 h-3" /> Data Gathered
                          </span>
                        );
                      } else if (note.status === 'in_progress') {
                        statusBadge = (
                          <span className="bg-amber-950/80 text-amber-400 border border-amber-800/80 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" /> In Progress
                          </span>
                        );
                      }

                      return (
                        <div
                          key={q.id}
                          onClick={() => setSelectedQuestionId(q.id)}
                          className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between gap-2 ${
                            isSelected
                              ? 'bg-slate-900 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/50'
                              : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Q{q.id} • {q.category}
                            </span>
                            {statusBadge}
                          </div>

                          <h4 className={`text-xs font-semibold line-clamp-2 ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                            {q.question}
                          </h4>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-800/50 text-[10px] text-slate-400">
                            <span>Sources: {note.sources?.length || 0}</span>
                            <span className="flex items-center gap-1">
                              Confidence: <strong className="text-amber-400">{note.confidenceScore}/5</strong>
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
                  <button onClick={resetAllData} className="hover:text-red-400 transition flex items-center gap-1 text-[11px]">
                    <Trash2 className="w-3.5 h-3.5" /> Reset All Workspace Data
                  </button>
                  <span>Showing {filteredQuestions.length} of 20</span>
                </div>
              </div>

              {/* Right Column: Detailed Data Gathering Form & Template (7 cols) */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                {/* Active Question Header */}
                <div className="border-b border-slate-800 pb-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide bg-indigo-950/60 border border-indigo-800/60 px-2.5 py-1 rounded-lg">
                      Question #{currentQuestion.id} • {currentQuestion.category}
                    </span>

                    {/* Status Select Box */}
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-400">Status:</label>
                      <select
                        value={currentNote.status}
                        onChange={(e) => handleNoteChange('status', e.target.value as QuestionStatus)}
                        className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="data_gathered">Data Gathered</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-white leading-snug">{currentQuestion.question}</h2>
                  <p className="text-xs text-slate-400 leading-relaxed">{currentQuestion.description}</p>

                  {/* Suggested Research Methods */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-500 self-center mr-1 font-semibold">Suggested Methods:</span>
                    {currentQuestion.suggestedMethods.map((method, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700/60 px-2 py-0.5 rounded-md">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Form Inputs: Hypothesis & Quantitative Findings */}
                <div className="space-y-4">
                  {/* Hypothesis / Target Objective */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                      <span>Research Target or Test Hypothesis</span>
                      <span className="text-[10px] text-slate-500 font-normal">What is your initial assumption to test?</span>
                    </label>
                    <textarea
                      rows={2}
                      value={currentNote.hypothesis}
                      onChange={(e) => handleNoteChange('hypothesis', e.target.value)}
                      placeholder="e.g., We hypothesize that target SaaS customers spend $500/mo on existing sub-optimal tools and will convert at 12%..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  {/* Qualitative & Strategic Findings */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                      <span>Qualitative Findings & Detailed Analysis</span>
                      <span className="text-[10px] text-slate-500 font-normal">Markdown text supported</span>
                    </label>
                    <textarea
                      rows={4}
                      value={currentNote.findings}
                      onChange={(e) => handleNoteChange('findings', e.target.value)}
                      placeholder="Document qualitative user responses, key themes, market dynamics, and operational barriers discovered..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition leading-relaxed"
                    />
                  </div>

                  {/* Quantitative Metrics & Hard Data */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Quantitative Metrics, Benchmarks & Financial Data
                    </label>
                    <textarea
                      rows={2}
                      value={currentNote.quantitativeData}
                      onChange={(e) => handleNoteChange('quantitativeData', e.target.value)}
                      placeholder="e.g., TAM: $4.2B, Average ACV: $12,500, Expected LTV/CAC ratio: 4.2x, Projected Year 1 Revenue: $850k..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  {/* Confidence Score Selector */}
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-slate-200 block">Research Confidence Score</span>
                      <span className="text-[10px] text-slate-400">Based on data clarity, sample size, and source credibility</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => handleNoteChange('confidenceScore', score)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                            currentNote.confidenceScore === score
                              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Sources List */}
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Data Sources & Evidence Base ({currentNote.sources?.length || 0})
                    </label>

                    {/* Source List */}
                    {currentNote.sources && currentNote.sources.length > 0 && (
                      <div className="space-y-2">
                        {currentNote.sources.map((src) => (
                          <div key={src.id} className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between text-xs">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-indigo-300">{src.title}</span>
                                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                                  {src.type}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                  src.credibility === 'High' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-300'
                                }`}>
                                  {src.credibility} Credibility
                                </span>
                              </div>
                              {src.url && (
                                <a href={src.url} target="_blank" rel="noreferrer" className="text-[11px] text-slate-400 hover:text-indigo-400 flex items-center gap-1">
                                  {src.url} <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                            <button
                              onClick={() => removeSource(src.id)}
                              className="text-slate-500 hover:text-red-400 p-1.5 transition"
                              title="Delete source"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Source Input Bar */}
                    <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl space-y-2">
                      <span className="text-[11px] text-slate-400 font-medium block">Add Data Source / Reference</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Source Title / Author / Report Name"
                          value={newSourceTitle}
                          onChange={(e) => setNewSourceTitle(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          placeholder="URL (optional)"
                          value={newSourceUrl}
                          onChange={(e) => setNewSourceUrl(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex gap-2 text-xs">
                          <select
                            value={newSourceType}
                            onChange={(e) => setNewSourceType(e.target.value as any)}
                            className="bg-slate-900 border border-slate-800 text-[11px] text-slate-300 rounded-lg px-2 py-1 focus:outline-none"
                          >
                            <option value="Secondary Report">Secondary Report</option>
                            <option value="Primary Data">Primary Data</option>
                            <option value="Interview">Interview</option>
                            <option value="Benchmark">Benchmark</option>
                            <option value="Academic Paper">Academic Paper</option>
                            <option value="Other">Other</option>
                          </select>

                          <select
                            value={newSourceCredibility}
                            onChange={(e) => setNewSourceCredibility(e.target.value as any)}
                            className="bg-slate-900 border border-slate-800 text-[11px] text-slate-300 rounded-lg px-2 py-1 focus:outline-none"
                          >
                            <option value="High">High Credibility</option>
                            <option value="Medium">Medium Credibility</option>
                            <option value="Low">Low Credibility</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={addSource}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Source
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Key Takeaways & Action Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Key Takeaways */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Key Strategic Takeaways
                      </label>
                      <div className="flex gap-1.5 mb-2">
                        <input
                          type="text"
                          placeholder="Add core conclusion..."
                          value={newTakeawayInput}
                          onChange={(e) => setNewTakeawayInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTakeaway())}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={addTakeaway}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                        >
                          Add
                        </button>
                      </div>
                      <ul className="space-y-1 max-h-32 overflow-y-auto">
                        {currentNote.keyTakeaways?.map((kt, i) => (
                          <li key={i} className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex justify-between items-center gap-2">
                            <span>• {kt}</span>
                            <button onClick={() => removeTakeaway(i)} className="text-slate-500 hover:text-red-400">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Steps */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Follow-up Action Items
                      </label>
                      <div className="flex gap-1.5 mb-2">
                        <input
                          type="text"
                          placeholder="Add next step..."
                          value={newActionInput}
                          onChange={(e) => setNewActionInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addActionItem())}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={addActionItem}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                        >
                          Add
                        </button>
                      </div>
                      <ul className="space-y-1 max-h-32 overflow-y-auto">
                        {currentNote.actionItems?.map((ai, i) => (
                          <li key={i} className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex justify-between items-center gap-2">
                            <span>- [ ] {ai}</span>
                            <button onClick={() => removeActionItem(i)} className="text-slate-500 hover:text-red-400">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar Controls */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Last updated: {currentNote.lastUpdated}</span>
                  <button
                    onClick={() => saveToLocalStorage(researchNotes)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition"
                  >
                    <Save className="w-4 h-4" /> Save Question Research
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}