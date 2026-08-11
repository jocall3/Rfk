import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Types
interface QuestionItem {
  id: number;
  question: string;
  category: 'Mechanism' | 'Case Study' | 'Economic Impact' | 'Policy & Reform' | 'Emerging Tech';
  status: 'Answered' | 'Follow-Up Needed' | 'In Research';
  summary: string;
  detailedFindings?: string[];
  keyTakeaway?: string;
  relatedQuestions?: number[];
}

interface CaseStudy {
  title: string;
  sector: string;
  agency: string;
  mechanism: string;
  impact: string;
  severity: 'High' | 'Critical' | 'Medium';
}

// Data Sets
const ANSWERED_QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    question: "What is the baseline economic definition of regulatory capture?",
    category: "Mechanism",
    status: "Answered",
    summary: "Regulatory capture occurs when a regulatory agency, created to act in the public interest, instead advances the commercial or special interests of dominant interest groups in the industry.",
    keyTakeaway: "Capture converts public protection mechanisms into private economic moats.",
    detailedFindings: [
      "Pioneered by George Stigler (1971) in 'The Theory of Economic Regulation'.",
      "Differs from simple bribery; it operates through cognitive bias, asymmetric information, and revolving door incentives.",
      "Creates artificial barriers to entry that disproportionately hurt startups and consumers."
    ],
    relatedQuestions: [2, 5, 21]
  },
  {
    id: 2,
    question: "How does the 'Revolving Door' phenomenon accelerate agency capture?",
    category: "Mechanism",
    status: "Answered",
    summary: "The movement of personnel between regulatory roles and private industry creates implicit alignment of interests and cultural proximity.",
    keyTakeaway: "Personal career incentives often eclipse public mandate enforcement.",
    detailedFindings: [
      "Regulators anticipate lucrative private sector employment upon leaving public office.",
      "Creates 'cognitive capture' where regulators perceive industry challenges as identical to public risk.",
      "Reduces willingness to enforce aggressive fines or revocations."
    ],
    relatedQuestions: [1, 7, 24]
  },
  {
    id: 3,
    question: "In what ways do incumbent telecom providers use regulatory bodies to deter new entrants?",
    category: "Case Study",
    status: "Answered",
    summary: "Telecom incumbents leverage spectrum licensing, right-of-way permissions, and high compliance burdens to block municipal and startup broadband access.",
    keyTakeaway: "Capital-intensive compliance regimes serve as anti-competitive barriers.",
    detailedFindings: [
      "Over-engineered safety and utility access requirements stall competitor rollout.",
      "Lobbying spend directly correlates with regulatory delay of competitor broadband grants."
    ],
    relatedQuestions: [8, 12, 28]
  },
  {
    id: 4,
    question: "How does information asymmetry prevent effective regulatory oversight?",
    category: "Mechanism",
    status: "Answered",
    summary: "Regulators depend heavily on data provided by the regulated firms themselves, enabling firms to selectively disclose risk profiles.",
    keyTakeaway: "He who controls the data controls the scope of regulation.",
    detailedFindings: [
      "Agencies lack internal budget to conduct independent technical audits.",
      "Proprietary algorithms and closed datasets leave regulators reliant on corporate self-reporting."
    ],
    relatedQuestions: [9, 15, 31]
  },
  {
    id: 5,
    question: "What role do 'Notice and Comment' rulemakings play in favor of well-funded corporations?",
    category: "Policy & Reform",
    status: "Answered",
    summary: "Public comment periods are overwhelmingly dominated by corporate legal teams producing thousands of pages of technical filings, swamping public interest groups.",
    keyTakeaway: "Administrative procedural volume favours well-resourced legal teams.",
    detailedFindings: [
      "Studies show 80%+ of substantive rulemaking comments originate from industry stakeholders.",
      "Public interest representation is underfunded and structurally limited in technical depth."
    ],
    relatedQuestions: [10, 18, 33]
  },
  {
    id: 6,
    question: "How did financial derivatives regulation pre-2008 exemplify cognitive capture?",
    category: "Case Study",
    status: "Answered",
    summary: "Regulators internalized the Wall Street belief that financial innovation inherently dispersed risk, leading to deregulation of OTC swaps.",
    keyTakeaway: "Shared intellectual paradigms between regulator and regulated create catastrophic blind spots.",
    detailedFindings: [
      "Commodity Futures Modernization Act of 2000 explicitly exempted OTC derivatives.",
      "Regulators viewed complex quantitative models through industry-provided lenses."
    ],
    relatedQuestions: [2, 11, 22]
  },
  {
    id: 7,
    question: "What is 'Cultural Capture' and how does it differ from material corruption?",
    category: "Mechanism",
    status: "Answered",
    summary: "Cultural capture happens when regulators adopt the worldview, values, and status metrics of the industry leaders they oversee without financial bribes.",
    keyTakeaway: "Regulators come to view industry success as synonymous with public welfare.",
    detailedFindings: [
      "Social mixing at industry conferences fosters strong in-group affinity.",
      "Public regulators seek respect and recognition from industry technical peers."
    ],
    relatedQuestions: [2, 14, 25]
  },
  {
    id: 8,
    question: "How do pharmaceutical user fees (PDUFA) alter FDA regulatory incentives?",
    category: "Case Study",
    status: "Answered",
    summary: "The Prescription Drug User Fee Act made drug manufacturers the primary funders of FDA approval reviews, shifting agency focus to speed over safety.",
    keyTakeaway: "Direct agency funding by regulated entities creates conflict of interest.",
    detailedFindings: [
      "Over 70% of the FDA's drug evaluation budget is funded by pharmaceutical industry fees.",
      "Approval timelines compressed significantly, accompanied by higher post-market warnings."
    ],
    relatedQuestions: [3, 13, 30]
  },
  {
    id: 9,
    question: "What impact does regulatory complexity have on small vs. large enterprises?",
    category: "Economic Impact",
    status: "Answered",
    summary: "Complex regulations impose fixed compliance costs that large firms easily absorb but crush smaller competitors and new entrants.",
    keyTakeaway: "Excessive complexity functions as a regressive tax on market competition.",
    detailedFindings: [
      "Compliance costs per employee are up to 60% higher for small businesses than enterprise firms.",
      "Large corporations frequently lobby FOR complex regulations to seal market share."
    ],
    relatedQuestions: [1, 4, 29]
  },
  {
    id: 10,
    question: "How can independent sunset provisions reduce long-term capture?",
    category: "Policy & Reform",
    status: "Answered",
    summary: "Mandatory legislative expiration dates force periodic re-evaluation of rules before captured norms become permanently entrenched.",
    keyTakeaway: "Temporal limits force re-justification of regulatory authority.",
    detailedFindings: [
      "Sunset clauses prevent outdated rules from protecting legacy industry monopolies.",
      "Requires active congressional re-authorization, exposing rules to fresh public debate."
    ],
    relatedQuestions: [5, 19, 35]
  },
  {
    id: 11,
    question: "What is 'astroturfing' and how is it used to manipulate public regulatory input?",
    category: "Mechanism",
    status: "Answered",
    summary: "Corporate-funded PR campaigns masquerade as grassroots citizen movements to influence regulatory commission public hearings.",
    keyTakeaway: "Manufactured public consensus distorts democratic regulatory oversight.",
    detailedFindings: [
      "Front groups mask corporate sponsorship under consumer advocacy titles.",
      "Automated and AI-generated public comment submissions flood agency portals."
    ],
    relatedQuestions: [5, 16, 26]
  },
  {
    id: 12,
    question: "How does the FAA's Organization Designation Authorization (ODA) demonstrate safety capture?",
    category: "Case Study",
    status: "Answered",
    summary: "The FAA delegated safety certification responsibilities directly to Boeing engineers, leading to compromised oversight on the 737 MAX.",
    keyTakeaway: "Self-certification models under resource pressure lead to severe safety failures.",
    detailedFindings: [
      "Agency staff overruled internal engineers in favor of manufacturer delivery schedules.",
      "Severe budget stagnation drove excessive reliance on manufacturer self-audits."
    ],
    relatedQuestions: [3, 8, 23]
  },
  {
    id: 13,
    question: "What is the net economic cost of regulatory capture to GDP growth?",
    category: "Economic Impact",
    status: "Answered",
    summary: "Studies estimate that regulatory capture reduces productivity growth by 0.5% to 1.2% annually due to misallocated capital and stifled innovation.",
    keyTakeaway: "Entrenched monopoly protections act as a major macroeconomic drag.",
    detailedFindings: [
      "Reduces aggregate R&D expenditure by protecting non-innovative market leaders.",
      "Distorts consumer price indices by maintaining artificially high price floors."
    ],
    relatedQuestions: [9, 17, 34]
  },
  {
    id: 14,
    question: "How do state-level occupational licensing boards exemplify localized capture?",
    category: "Case Study",
    status: "Answered",
    summary: "Licensing boards composed of active industry practitioners use stringent licensing to restrict the supply of new competitors.",
    keyTakeaway: "Practitioner-controlled boards act as legal cartels.",
    detailedFindings: [
      "Occupational licensing grew from 5% of US workforce in 1950s to over 25% today.",
      "Licensing requirements for low-risk professions (hair braiders, florists) serve no safety function."
    ],
    relatedQuestions: [7, 9, 36]
  },
  {
    id: 15,
    question: "How does algorithmic auditing risk being captured by AI tech giants?",
    category: "Emerging Tech",
    status: "Answered",
    summary: "Big Tech companies fund AI ethics institutes and shape AI safety standards to draft rules that only hyper-scalers can satisfy.",
    keyTakeaway: "Early mover regulatory influence locks out open-source AI models.",
    detailedFindings: [
      "Proposals requiring compute caps or massive safety licensing favor incumbent cloud giants.",
      "Open-source software developer communities are excluded from closed door policy summits."
    ],
    relatedQuestions: [4, 18, 37]
  },
  {
    id: 16,
    question: "What is the role of judicial review and deference doctrines (e.g., Chevron) in capture?",
    category: "Policy & Reform",
    status: "Answered",
    summary: "Broad judicial deference gives captured agencies statutory flexibility to reinterpret laws in favor of industry interest without congressional updates.",
    keyTakeaway: "Unchecked administrative interpretation amplifies capture vulnerability.",
    detailedFindings: [
      "Courts historically deferred to agency technical expertise, assuming neutral public interest.",
      "Recent shifts in administrative law aim to re-assert judicial oversight on major policy questions."
    ],
    relatedQuestions: [5, 10, 38]
  },
  {
    id: 17,
    question: "How do incumbent energy utilities slow down renewable grid interconnection?",
    category: "Case Study",
    status: "Answered",
    summary: "Monopoly utilities control interconnection queues and standards, delaying independent solar/wind projects under technical pretexts.",
    keyTakeaway: "Grid control allows utility incumbents to sabotage clean energy competition.",
    detailedFindings: [
      "Interconnection queue delays stretch beyond 4-5 years in major regional markets.",
      "Utilities impose excessive upgrade fees on independent power producers."
    ],
    relatedQuestions: [3, 13, 27]
  },
  {
    id: 18,
    question: "How do private standards-setting organizations (SSOs) get captured?",
    category: "Mechanism",
    status: "Answered",
    summary: "Large corporations flood standards committees with engineers to mandate their proprietary patents as global industry standards.",
    keyTakeaway: "Standardization processes can become stealth anti-competitive tools.",
    detailedFindings: [
      "FRAND (Fair, Reasonable, and Non-Discriminatory) commitments are frequently litigated.",
      "Small firms lack the budget to send representatives to global standards working groups."
    ],
    relatedQuestions: [5, 15, 39]
  },
  {
    id: 19,
    question: "What structural reforms effectively insulate regulatory boards from capture?",
    category: "Policy & Reform",
    status: "Answered",
    summary: "Mandatory revolving door cooling-off periods, public funding mechanisms, transparent public record logs, and independent advocate offices.",
    keyTakeaway: "Institutional design must assume capture will occur unless actively counterweighted.",
    detailedFindings: [
      "5-year post-employment lobbying bans significantly reduce regulatory favouritism.",
      "Creating an independent Consumer Advocate office within agencies changes decision dynamics."
    ],
    relatedQuestions: [10, 20, 40]
  },
  {
    id: 20,
    question: "How does regulatory capture impact consumer pricing and product safety?",
    category: "Economic Impact",
    status: "Answered",
    summary: "Captured agencies suppress competition, allowing monopolies to inflate prices while ignoring systemic product hazards until crises erupt.",
    keyTakeaway: "Consumers pay a double price: higher costs and degraded safety.",
    detailedFindings: [
      "Captured markets show price premiums of 15% to 40% over competitive baselines.",
      "Safety enforcement drops significantly right before major industrial failures."
    ],
    relatedQuestions: [1, 13, 19]
  }
];

const RESEARCH_HORIZON_QUESTIONS: QuestionItem[] = [
  {
    id: 21,
    question: "How does generative AI alter the cost structure of regulatory lobbying and comment flooding?",
    category: "Emerging Tech",
    status: "In Research",
    summary: "Evaluating how LLM-generated technical comments could paralyze notice-and-comment procedures through hyper-realistic synthetic submissions."
  },
  {
    id: 22,
    question: "Can decentralized autonomous organizations (DAOs) and smart contracts bypass traditional regulatory capture mechanisms?",
    category: "Emerging Tech",
    status: "In Research",
    summary: "Analyzing if programmatic protocol enforcement eliminates human regulatory bias or simply creates novel governance attack vectors."
  },
  {
    id: 23,
    question: "What is the risk profile of regulatory capture in centralized AI foundation model licensing?",
    category: "Emerging Tech",
    status: "In Research",
    summary: "Investigating whether proposed licensing frameworks for frontier models act as structural moats for incumbent tech titans."
  },
  {
    id: 24,
    question: "How do international trade agreements codify captured domestic regulations into binding international law?",
    category: "Policy & Reform",
    status: "In Research",
    summary: "Exploring Investor-State Dispute Settlement (ISDS) mechanisms as tools to freeze domestic health and safety regulations."
  },
  {
    id: 25,
    question: "What counter-capture metrics can be embedded into real-time government agency performance dashboards?",
    category: "Policy & Reform",
    status: "In Research",
    summary: "Developing quantitative KPIs (e.g., meeting balance index, regulatory burden impact on SMBs) to audit agency health continuously."
  },
  {
    id: 26,
    question: "How does ESG metric standardization create new vectors for corporate regulatory capture?",
    category: "Economic Impact",
    status: "In Research",
    summary: "Examining how enterprise ratings providers and global conglomerates shape sustainability disclosure rules to favor legacy capital."
  },
  {
    id: 27,
    question: "What role do private equity rollups play in acquiring local regulatory capture in healthcare and housing?",
    category: "Case Study",
    status: "In Research",
    summary: "Studying local zoning and health board influence by consolidated private-equity-backed regional monopolies."
  },
  {
    id: 28,
    question: "How does cognitive capture manifest in specialized biosecurity and biotechnology oversight bodies?",
    category: "Emerging Tech",
    status: "In Research",
    summary: "Assessing dual-use technology oversight where the talent pool is restricted to a small network of university and lab directors."
  },
  {
    id: 29,
    question: "Can public funding of adversarial counter-audits restore balance to financial regulation?",
    category: "Policy & Reform",
    status: "In Research",
    summary: "Proposing bounties and grant funding for independent research groups to Stress-test bank risk models independently."
  },
  {
    id: 30,
    question: "How has weaponized patent litigation at the ITC (International Trade Commission) transformed trade oversight?",
    category: "Case Study",
    status: "In Research",
    summary: "Analyzing non-practicing entities and dominant tech firms using administrative patent exclusions rather than civil courts."
  },
  {
    id: 31,
    question: "In what ways do defense procurement regulations entrench the top defense primes?",
    category: "Case Study",
    status: "In Research",
    summary: "Examining FAR (Federal Acquisition Regulation) provisions that prevent commercial tech startups from competing for military software contracts."
  },
  {
    id: 32,
    question: "What is the psychological profile of career civil servants who resist regulatory capture?",
    category: "Mechanism",
    status: "In Research",
    summary: "Synthesizing behavioral science data on whistleblowers and unyielding regulators to design better agency hiring incentives."
  },
  {
    id: 33,
    question: "How can open data standard requirements force transparency in corporate lobbying budgets?",
    category: "Policy & Reform",
    status: "In Research",
    summary: "Designing graph database schemas to map shadow lobbying, think tank funding, and regulatory meeting logs automatically."
  },
  {
    id: 34,
    question: "What impact does judicial law clerk selection have on long-term administrative law doctrine?",
    category: "Mechanism",
    status: "In Research",
    summary: "Tracking judicial clerk pipeline preferences regarding agency deference models over 30-year spans."
  },
  {
    id: 35,
    question: "How do carbon credit market regulators prevent carbon accounting fraud and capture?",
    category: "Economic Impact",
    status: "In Research",
    summary: "Evaluating offset verification agencies where certifiers are directly compensated by project developers."
  },
  {
    id: 36,
    question: "Does municipal zoning law represent the most widespread form of wealth-protecting regulatory capture?",
    category: "Economic Impact",
    status: "In Research",
    summary: "Measuring single-family zoning restrictions as regulatory moats created by property owners to suppress housing supply."
  },
  {
    id: 37,
    question: "How can zero-knowledge proofs (ZKPs) verify regulatory compliance without revealing confidential business data?",
    category: "Emerging Tech",
    status: "In Research",
    summary: "Testing cryptographic techniques that allow firms to prove safety compliance to regulators without leaking IP."
  },
  {
    id: 38,
    question: "What is the effect of revolving door restrictions on the technical competence of regulatory staff?",
    category: "Policy & Reform",
    status: "In Research",
    summary: "Analyzing whether strict post-employment bans discourage top technical talent from taking public service roles."
  },
  {
    id: 39,
    question: "How do sovereign wealth funds influence international regulatory policy for port and energy infrastructure?",
    category: "Case Study",
    status: "In Research",
    summary: "Mapping foreign investment state-backed regulatory concessions in Western critical infrastructure."
  },
  {
    id: 40,
    question: "What dynamic framework can predict agency capture before major regulatory failure events occur?",
    category: "Mechanism",
    status: "In Research",
    summary: "Constructing an early-warning composite indicator based on personnel turnover, comment ratio skew, and industry fee reliance."
  }
];

const CASE_STUDIES: CaseStudy[] = [
  {
    title: "FAA & Boeing 737 MAX Certification",
    sector: "Aviation Safety",
    agency: "Federal Aviation Administration (FAA)",
    mechanism: "Delegated Authority (ODA Program)",
    impact: "346 fatalities, complete fleet grounding, loss of regulatory trust globally.",
    severity: "Critical"
  },
  {
    title: "FDA PDUFA & Opioid Market Expansion",
    sector: "Pharmaceuticals",
    agency: "Food and Drug Administration (FDA)",
    mechanism: "User-Fee Funding Dependence & Revolving Door",
    impact: "Mass prescription abuse crisis, delayed aggressive black-box warnings.",
    severity: "Critical"
  },
  {
    title: "2008 Financial Crisis & OTC Derivatives",
    sector: "Banking / Finance",
    agency: "SEC & CFTC",
    mechanism: "Cognitive Capture & Legislative Exclusion",
    impact: "Global systemic economic breakdown, multi-trillion dollar taxpayer bailouts.",
    severity: "Critical"
  },
  {
    title: "Regional Electric Utility Solar Interconnection Delays",
    sector: "Energy & Utilities",
    agency: "State Public Utility Commissions (PUCs)",
    mechanism: "Informational & Administrative Bottlenecks",
    impact: "Stifled distributed solar growth, protected utility capital expenditure profits.",
    severity: "High"
  }
];

export default function RegulatoryCaptureResearch() {
  const [activeTab, setActiveTab] = useState<'answered' | 'horizon' | 'cases' | 'synthesis'>('answered');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<number | null>(1);

  // Filtered Questions
  const filteredAnswered = useMemo(() => {
    return ANSWERED_QUESTIONS.filter(q => {
      const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
      const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            q.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const filteredHorizon = useMemo(() => {
    return RESEARCH_HORIZON_QUESTIONS.filter(q => {
      const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
      const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            q.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const categories = ['All', 'Mechanism', 'Case Study', 'Economic Impact', 'Policy & Reform', 'Emerging Tech'];

  return (
    <>
      <Head>
        <title>Regulatory Capture Research Hub | 40-Question Investigation Matrix</title>
        <meta name="description" content="In-depth research repository on regulatory capture: 20 core questions answered and 20 follow-up horizon questions for future inquiry." />
      </Head>

      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
        
        {/* Navigation Breadcrumb */}
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm">
                Research Index
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-cyan-400 font-medium text-sm">Regulatory Capture</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                Phase 1 & 2 Active
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                40 Core Vectors
              </span>
            </div>
          </div>
        </header>

        {/* Hero Banner */}
        <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/50 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Systemic Market Integrity Project</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Regulatory Capture Findings & Investigation Matrix
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
              A comprehensive inquiry dissecting how state enforcement agencies become subservient to the industries they oversee. Featuring 20 baseline core answered questions (1–20) and 20 target research questions (21–40) designed to drive future policy reform and cryptographic mitigation strategies.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
              <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                <div className="text-2xl font-bold text-emerald-400">20 / 20</div>
                <div className="text-xs text-slate-400 mt-1">Core Questions Answered</div>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                <div className="text-2xl font-bold text-cyan-400">20 Active</div>
                <div className="text-xs text-slate-400 mt-1">Follow-Up Research Vectors</div>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                <div className="text-2xl font-bold text-indigo-400">5 Categories</div>
                <div className="text-xs text-slate-400 mt-1">Taxonomy Framework</div>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                <div className="text-2xl font-bold text-amber-400">4 Critical</div>
                <div className="text-xs text-slate-400 mt-1">Primary Case Audits</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Controls & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* View Navigation Tabs */}
            <div className="flex items-center space-x-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-sm overflow-x-auto">
              <button
                onClick={() => setActiveTab('answered')}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === 'answered'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Core Questions (1–20)
              </button>
              <button
                onClick={() => setActiveTab('horizon')}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === 'horizon'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Horizon Questions (21–40)
              </button>
              <button
                onClick={() => setActiveTab('cases')}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === 'cases'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Case Studies
              </button>
              <button
                onClick={() => setActiveTab('synthesis')}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === 'synthesis'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Synthesis & Roadmap
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search findings or questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl py-2 px-4 pl-10 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter Badges (Only relevant for question tabs) */}
          {(activeTab === 'answered' || activeTab === 'horizon') && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mr-2">Category Filter:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* TAB 1: ANSWERED CORE QUESTIONS (1-20) */}
          {activeTab === 'answered' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-white">Answered Research Questions (1 to 20)</h2>
                <span className="text-xs text-slate-400">Showing {filteredAnswered.length} of 20 items</span>
              </div>

              {filteredAnswered.map((q) => {
                const isExpanded = expandedId === q.id;
                return (
                  <div
                    key={q.id}
                    className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl transition-all overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="w-full text-left p-5 flex items-start justify-between gap-4 focus:outline-none"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-900 px-2 py-0.5 rounded">
                            Q{q.id.toString().padStart(2, '0')}
                          </span>
                          <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            {q.category}
                          </span>
                          <span className="text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-900 px-2 py-0.5 rounded">
                            {q.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-100 pt-1">
                          {q.question}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-2">
                          {q.summary}
                        </p>
                      </div>
                      <div className="text-slate-500 pt-1">
                        <svg
                          className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Accordion Expanded Detail */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-slate-900/40 space-y-4">
                        {q.keyTakeaway && (
                          <div className="p-3 bg-cyan-950/30 border-l-4 border-cyan-500 text-cyan-200 text-sm rounded-r">
                            <span className="font-bold text-cyan-400">Key Takeaway: </span>
                            {q.keyTakeaway}
                          </div>
                        )}

                        {q.detailedFindings && (
                          <div className="space-y-2">
                            <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400">Detailed Findings & Structural Proof:</h4>
                            <ul className="space-y-1.5 text-sm text-slate-300">
                              {q.detailedFindings.map((point, idx) => (
                                <li key={idx} className="flex items-start space-x-2">
                                  <span className="text-cyan-400 mt-1">•</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {q.relatedQuestions && (
                          <div className="pt-2 flex items-center space-x-2">
                            <span className="text-xs text-slate-500">Related Questions:</span>
                            <div className="flex space-x-1">
                              {q.relatedQuestions.map(rel => (
                                <span key={rel} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                                  #{rel}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: HORIZON RESEARCH QUESTIONS (21-40) */}
          {activeTab === 'horizon' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl font-bold text-white">Follow-Up Research Questions (21 to 40)</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Target questions defined for Phase 2 synthesis and field gathering.</p>
                </div>
                <span className="text-xs text-slate-400">Showing {filteredHorizon.length} of 20 items</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHorizon.map((q) => (
                  <div
                    key={q.id}
                    className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-5 rounded-xl flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-amber-400 bg-amber-950/60 border border-amber-900 px-2 py-0.5 rounded">
                          Q{q.id}
                        </span>
                        <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          {q.category}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-slate-100">
                        {q.question}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {q.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500 italic">Phase 2 Directive</span>
                      <button className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1">
                        <span>Gather Data</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CASE STUDIES */}
          {activeTab === 'cases' && (
            <div className="space-y-6">
              <div className="mb-2">
                <h2 className="text-xl font-bold text-white">Empirical Case Studies</h2>
                <p className="text-xs text-slate-400 mt-0.5">Audited real-world manifestations of regulatory capture with documented public impact.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CASE_STUDIES.map((study, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-red-500" />
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{study.sector}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-900">
                        {study.severity} Risk
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{study.title}</h3>
                    
                    <div className="space-y-2 text-sm text-slate-300 mt-4">
                      <div>
                        <span className="text-slate-500 font-medium">Target Agency: </span>
                        <span className="text-slate-200">{study.agency}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Capture Mechanism: </span>
                        <span className="text-cyan-300">{study.mechanism}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Public Impact: </span>
                        <span className="text-slate-400">{study.impact}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SYNTHESIS & ROADMAP */}
          {activeTab === 'synthesis' && (
            <div className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Research Synthesis & Next Steps</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  How the 20 answered questions assemble into a unified analytical framework, and how answering the 20 follow-up questions will lead to actionable structural policy countermeasures.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800">
                  <div className="text-cyan-400 font-bold mb-2 flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-950 flex items-center justify-center text-xs">1</span>
                    <span>Consolidate Findings</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Merge answers from Q1–Q20 into standard markdown repositories (`/markdown/q1-q20.md`) to establish baseline theoretical consensus.
                  </p>
                </div>

                <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800">
                  <div className="text-amber-400 font-bold mb-2 flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-amber-950 flex items-center justify-center text-xs">2</span>
                    <span>Execute Phase 2 Inquiry</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Conduct data gathering across Q21–Q40 with focus on emerging AI technologies, algorithmic auditing, and state-level housing/utility capture.
                  </p>
                </div>

                <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800">
                  <div className="text-emerald-400 font-bold mb-2 flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-950 flex items-center justify-center text-xs">3</span>
                    <span>Formulate Anti-Capture Design</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Synthesize full dataset of 40 vectors into open-source policy reform blueprints and decentralized verification protocol specifications.
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  Document Reference: <code className="text-slate-400">RESEARCH-REG-CAP-40-V1</code>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-lg transition-colors">
                    Download Full Markdown Zip
                  </button>
                  <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                    Export Analysis Report
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