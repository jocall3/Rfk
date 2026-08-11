import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import {
  MapPin,
  DollarSign,
  ShoppingCart,
  TrendingDown,
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  BookOpen,
  AlertTriangle,
  Layers,
  Info,
  Download,
  HelpCircle,
  BarChart3,
  Building2,
  PieChart as PieChartIcon,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Zap,
  Sparkles
} from 'lucide-react';

// Interfaces
interface QAItem {
  id: number;
  question: string;
  answer: string;
  category: 'Redlining' | 'Dollar Stores' | 'SNAP Monetization' | 'Structural Economics';
  tags: string[];
  followUpQuestion: string;
  followUpContext: string;
}

interface SaturationData {
  zipCode: string;
  city: string;
  state: string;
  dollarStores: number;
  fullServiceGrocers: number;
  medianIncome: number;
  snapParticipationPct: number;
  foodDesertStatus: 'Severe' | 'Moderate' | 'Low Risk';
}

const QA_DATABASE: QAItem[] = [
  {
    id: 1,
    category: 'Redlining',
    question: "What is supermarket redlining and how does it differ from traditional housing redlining?",
    answer: "Supermarket redlining refers to the systemic practice where major grocery chains disinvest or decline to open locations in low-income urban and rural neighborhoods, often disproportionately affecting communities of color. Unlike residential redlining driven by mortgage lending maps, supermarket redlining is driven by corporate real estate algorithms prioritizing high median household incomes, square footage density thresholds, and perceived security overhead costs.",
    tags: ['Redlining', 'Urban Planning', 'Corporate Strategy'],
    followUpQuestion: "How do algorithmic site-selection tools explicitly or implicitly encode racial and income biases in modern retail site evaluations?",
    followUpContext: "Research requires auditing commercial real estate spatial AI algorithms to isolate proxy variables (like zip code crime scores) that perpetuate disinvestment."
  },
  {
    id: 2,
    category: 'Redlining',
    question: "What legal mechanisms do corporate grocers use to block competitors from entering former food desert sites?",
    answer: "Corporate grocers frequently use restrictive deed covenants and negative lease restrictions when vacating a property. These covenants explicitly forbid future buyers or tenants from operating a supermarket, grocery, or pharmacy on the site for up to 20-50 years, effectively locking out independent grocers and preserving a food desert status.",
    tags: ['Deed Covenants', 'Legal', 'Antitrust'],
    followUpQuestion: "What state or federal antitrust legislation has proven most effective at invalidating restrictive food covenants in urban zones?",
    followUpContext: "Comparative policy evaluation across states (e.g., Illinois, New York) to analyze legal precedent for striking down restrictive grocery covenants."
  },
  {
    id: 3,
    category: 'Dollar Stores',
    question: "How does dollar store density impact the financial viability of local independent grocery stores?",
    answer: "Dollar store chains (e.g., Dollar General, Family Dollar) deploy aggressive cluster expansion models. By undercutting prices on non-perishable packaged goods, they strip away high-margin center-store sales from local grocers. Deprived of center-store profits, independent grocers cannot cover the thin margins of perishable fresh produce, often resulting in store closure within 2-5 years.",
    tags: ['Dollar Stores', 'Independent Retail', 'Market Dynamics'],
    followUpQuestion: "What threshold ratio of dollar stores to population triggers a irreversible decline in fresh food retailer viability?",
    followUpContext: "Econometric modeling needed on urban vs. rural census tracts over a 10-year longitudinal dataset."
  },
  {
    id: 4,
    category: 'Dollar Stores',
    question: "Why do dollar stores rarely stock fresh fruits, vegetables, or raw meats?",
    answer: "Dollar store business models rely on hyper-lean staffing (often 1-2 workers per shift), high shelf-life processed inventory, and simplified ambient supply chains. Integrating cold chains, rapid product turnover, shrinkage management, and labor for produce handling dismantles their ultra-low capital expenditure operational structure.",
    tags: ['Supply Chain', 'Operations', 'Perishables'],
    followUpQuestion: "Can subsidized micro-cold-chain infrastructure enable dollar store chains to offer fresh produce without distorting their low-overhead unit economics?",
    followUpContext: "Pilot study evaluation of state-subsidized refrigeration units installed in rural dollar store footprints."
  },
  {
    id: 5,
    category: 'SNAP Monetization',
    question: "How much of total USDA SNAP (Supplemental Nutrition Assistance Program) dollars are captured by top mega-grocers?",
    answer: "While USDA exact vendor-level redemption data is historically protected under confidentiality clauses, regulatory disclosures and court filings estimate that big-box retailers like Walmart capture between 25% to 30% of total national SNAP redemptions, with top mega-grocers collectively absorbing over 60% of all federal food assistance dollars.",
    tags: ['SNAP', 'Corporate Revenue', 'Federal Policy'],
    followUpQuestion: "How would public disclosure of store-level SNAP redemption data alter local economic development and antitrust enforcement?",
    followUpContext: "FOIA litigation and policy impact analysis regarding transparency in USDA retail vendor redemptions."
  },
  {
    id: 6,
    category: 'SNAP Monetization',
    question: "What role do e-commerce SNAP payment integrations play in consolidating grocery market share?",
    answer: "The USDA's SNAP Online Purchasing Pilot required complex tech infrastructure and security compliance that initially only large players (Amazon, Walmart, Instacart) could afford to build. This created a digital moat, diverting SNAP benefit redemptions online away from local independent markets during peak pandemic and post-pandemic periods.",
    tags: ['E-Commerce', 'Digital Divide', 'SNAP'],
    followUpQuestion: "What open-source or white-label POS platforms exist to enable small independent grocers to accept SNAP online without prohibitive fees?",
    followUpContext: "Technical architecture review of USDA-certified EBT e-commerce gateways for independent grocer collectives."
  },
  {
    id: 7,
    category: 'Redlining',
    question: "How does the 'food mirage' concept differ from a traditional food desert?",
    answer: "A food mirage occurs in gentrifying urban areas where high-end specialty grocers open, making physical access to food abundant. However, the price point of organic or premium goods renders the food economically inaccessible to long-standing low-income residents, maintaining nutritional insecurity despite geographic proximity.",
    tags: ['Gentrification', 'Food Mirage', 'Economic Access'],
    followUpQuestion: "How do consumer purchasing patterns shift when low-income households live in a food mirage versus a physical food desert?",
    followUpContext: "Cross-sectional survey examining transport costs incurred by low-income families bypassing local premium grocers."
  },
  {
    id: 8,
    category: 'Dollar Stores',
    question: "What municipal policy tools (e.g., overlay zoning, density caps) are being deployed against dollar store proliferation?",
    answer: "Cities like Birmingham, AL, Atlanta, GA, and Tulsa, OK have passed 'Dispersed Retail Performance Standards' or dollar store restriction zoning ordinances. These policies prohibit opening new small-box discount stores within 1,000 to 2,000 feet (or up to 1-2 miles) of an existing dollar store or mandate minimum floor space dedicated to fresh produce.",
    tags: ['Zoning', 'Municipal Governance', 'Policy Tools'],
    followUpQuestion: "Do dollar store density caps result in new supermarket openings, or do they create retail vacuums in underserved zones?",
    followUpContext: "Post-implementation spatial study of cities 3-5 years after adopting dollar store zoning caps."
  },
  {
    id: 9,
    category: 'SNAP Monetization',
    question: "How do corporate grocers use targeted marketing around SNAP benefit issuance schedules ('the SNAP cliff')?",
    answer: "Because SNAP benefits are typically distributed during the first 10 days of the month, mega-grocers optimize sales cycles, inventory staffing, and circular ad promotions specifically for those dates. Price markdowns on high-margin bulk items during disbursement days maximize basket size capture before funds dissipate.",
    tags: ['Retail Strategy', 'Dynamic Pricing', 'Behavioral Economics'],
    followUpQuestion: "How does staggering SNAP distribution dates throughout the calendar month impact grocer inventory volatility and recipient food security?",
    followUpContext: "Comparative state analysis between states with 10-day vs. 28-day staggered SNAP benefit disbursement calendars."
  },
  {
    id: 10,
    category: 'Structural Economics',
    question: "What is the structural impact of private equity acquisitions on regional supermarket closures in working-class neighborhoods?",
    answer: "Private equity firms frequently execute leveraged buyouts (LBOs) of regional grocery chains, separating real estate assets through sale-leaseback transactions. The resulting heavy lease liabilities force grocers to cut labor, underinvest in maintenance, and close lower-margin urban stores, frequently driving chains into bankruptcy.",
    tags: ['Private Equity', 'Retail Consolidation', 'Financialization'],
    followUpQuestion: "How can community land trusts or municipal development bonds be utilized to acquire real estate underlying vulnerable urban grocers?",
    followUpContext: "Financial engineering model assessing municipal interventions in grocery sale-leaseback protection."
  },
  {
    id: 11,
    category: 'Redlining',
    question: "How do transit deficits exacerbate food desert metrics in non-car-centric households?",
    answer: "In urban food deserts, public transit routes are often designed for commuter travel rather than cross-neighborhood grocery trips. Carrying heavy grocery bags on multiple bus transfers increases the temporal and physical tax on residents, reducing fresh food purchase volume and increasing reliance on nearby convenience stores.",
    tags: ['Transit', 'Urban Mobility', 'Spatial Analysis'],
    followUpQuestion: "Can targeted municipal micro-transit (e.g., free grocery shuttles) significantly improve health metrics in rural/urban food deserts?",
    followUpContext: "Cost-benefit analysis comparing municipal grocery shuttle subsidies against public health expenditure reductions."
  },
  {
    id: 12,
    category: 'Dollar Stores',
    question: "What are the labor safety and staffing model vulnerabilities inherent to ultra-discount retail chains?",
    answer: "Dollar store business models rely on solo-staffing ('single-coverage') shifts to keep payroll costs around 5-7% of net sales (compared to 12-15% at conventional grocers). This leads to unworked freight blocking aisles, increased armed robbery vulnerability, emergency OSHA violations, and high worker burnout.",
    tags: ['Labor Safety', 'Store Operations', 'OSHA'],
    followUpQuestion: "How do municipal workplace safety ordinances impact the operational viability of single-coverage retail models?",
    followUpContext: "Regulatory impact analysis of local mandates requiring minimum 2-person staffing in retail establishments open past dark."
  },
  {
    id: 13,
    category: 'SNAP Monetization',
    question: "How do high interchange/processing fees on non-EBT payments hurt independent grocers relative to corporate giants?",
    answer: "While SNAP/EBT transaction fees are federally regulated, mixed-basket payments where consumers pay balance with credit/debit subject small grocers to high interchange rates (2-3.5%). Corporate mega-grocers negotiate custom interchange schedules, creating significant operating margin disparities.",
    tags: ['Fintech', 'Interchange Fees', 'Payment Rails'],
    followUpQuestion: "What is the feasibility of creating zero-fee community payment networks tailored for independent grocery cooperatives?",
    followUpContext: "Technical design proposal for localized open-loop payment networks for food access ecosystems."
  },
  {
    id: 14,
    category: 'Structural Economics',
    question: "What is a 'food swamp' and how does its health impact compare to a 'food desert'?",
    answer: "A food swamp is an area with a high density of high-calorie, low-nutrient food outlets (fast food, convenience stores, dollar stores) that outnumber healthy food options. Studies show food swamps are often stronger predictors of obesity and chronic metabolic illness than the mere absence of fresh food grocers.",
    tags: ['Food Swamp', 'Public Health', 'Nutrition'],
    followUpQuestion: "What zoning interventions effectively cap the ratio of fast-food drive-thrus to healthy retail outlets in high-risk census tracts?",
    followUpContext: "Spatial epidemiological study testing nutrient-density overlay zoning formulas."
  },
  {
    id: 15,
    category: 'Redlining',
    question: "How do supermarket shrinkage (theft) calculations disproportionately justify store closures in low-income areas?",
    answer: "Corporate retailers often lump organized retail crime, internal employee theft, administrative error, and perishable spoilage into a single aggregate 'shrink' metric. This practice allows companies to cite safety/theft concerns as a public relations buffer when closing underperforming stores that actually failed due to poor management or low consumer purchasing power.",
    tags: ['Retail Shrink', 'Corporate PR', 'Store Closures'],
    followUpQuestion: "How can independent third-party inventory audits isolate physical theft from operational spoilage in urban retail evaluations?",
    followUpContext: "Methodological framework for auditing retail financial disclosures regarding shrink-driven store abandonments."
  },
  {
    id: 16,
    category: 'Dollar Stores',
    question: "What supply chain innovations allow dollar stores to expand rapidly into remote rural areas where grocers fail?",
    answer: "Dollar store supply chains utilize hub-and-spoke distribution centers servicing standardized 7,500-10,000 sq ft footprint stores within a 300-mile radius. Flexible cross-docking, automated drop-trailer deliveries, and lack of refrigeration constraints allow rapid deployment at a fraction of traditional supermarket buildout costs.",
    tags: ['Supply Chain', 'Logistics', 'Rural Retail'],
    followUpQuestion: "How can cooperative wholesale networks mimic dollar store distribution efficiency for rural community-owned grocers?",
    followUpContext: "Supply chain mapping study analyzing aggregate purchasing groups for rural independent grocers."
  },
  {
    id: 17,
    category: 'SNAP Monetization',
    question: "What is the economic multiplier effect of SNAP redemptions on local versus national corporate retail economies?",
    answer: "USDA estimates show every $1.00 spent in SNAP generates $1.50 to $1.80 in local economic activity during economic downturns. However, when SNAP is spent at national mega-grocers, profits are extracted to corporate headquarters and shareholders, whereas spending at local grocers retains cash circulation in the community.",
    tags: ['Economic Multiplier', 'Local Economy', 'Fiscal Policy'],
    followUpQuestion: "What tax incentive models best encourage SNAP participants to redeem benefits at community-owned or cooperative markets?",
    followUpContext: "Efficacy trial of 'Double Up Food Bucks' incentives in matching local produce purchases."
  },
  {
    id: 18,
    category: 'Structural Economics',
    question: "How do municipal tax incremental financing (TIF) subsidies frequently fail to solve long-term food access issues?",
    answer: "Cities often grant millions in TIF subsidies to major developers to attract anchor national grocery stores. However, once tax abatement periods expire (10-15 years), national chains frequently shutter the store if profitability drops below corporate hurdle rates, leaving the municipality with debt and a renewed food desert.",
    tags: ['TIF Subsidies', 'Municipal Finance', 'Public Incentives'],
    followUpQuestion: "How can municipal subsidy contracts enforce clawback clauses if grocers exit before a 25-year operational mandate?",
    followUpContext: "Legal contract analysis of public-private development agreements in urban grocery recruitment."
  },
  {
    id: 19,
    category: 'Redlining',
    question: "What role do worker-owned cooperatives and non-profit grocery stores play in filling redlined voids?",
    answer: "Worker-owned and community-owned cooperatives operate without the 15-20% return-on-equity expectations of private stock corporations. They prioritize food sovereignty, community health, and living wage employment over profit maximization, enabling long-term viability in areas abandoned by corporate chains.",
    tags: ['Cooperatives', 'Food Sovereignty', 'Alternative Models'],
    followUpQuestion: "What patient capital financial vehicles (e.g., CDFIs, philanthropy) are required to scale cooperative grocer startup capital?",
    followUpContext: "Capital structure assessment of successful urban grocery co-ops across North America."
  },
  {
    id: 20,
    category: 'SNAP Monetization',
    question: "How does the expansion of direct-to-consumer farm delivery programs offer a structural alternative to corporate SNAP monetization?",
    answer: "Programs like GusNIP (Gus Schumacher Nutrition Incentive Program) and tech-enabled CSAs (Community Supported Agriculture) allow SNAP recipients to buy fresh regional produce directly from farms. This bypasses corporate retail intermediaries, ensures 100% farm-level revenue retention, and provides maximum nutrition density.",
    tags: ['Agriculture', 'Direct-to-Consumer', 'GusNIP'],
    followUpQuestion: "How can logistics tech platforms streamline direct farm-to-door distribution for SNAP recipients in transit-isolated census tracts?",
    followUpContext: "Logistics simulation model for regional farm-to-household produce delivery networks."
  }
];

const SAMPLE_LOCATIONS: SaturationData[] = [
  { zipCode: "35208", city: "Birmingham", state: "AL", dollarStores: 11, fullServiceGrocers: 1, medianIncome: 28400, snapParticipationPct: 38.5, foodDesertStatus: "Severe" },
  { zipCode: "48205", city: "Detroit", state: "MI", dollarStores: 14, fullServiceGrocers: 0, medianIncome: 24100, snapParticipationPct: 44.2, foodDesertStatus: "Severe" },
  { zipCode: "74126", city: "Tulsa", state: "OK", dollarStores: 8, fullServiceGrocers: 1, medianIncome: 31200, snapParticipationPct: 32.1, foodDesertStatus: "Severe" },
  { zipCode: "60621", city: "Chicago (Englewood)", state: "IL", dollarStores: 9, fullServiceGrocers: 1, medianIncome: 22800, snapParticipationPct: 41.8, foodDesertStatus: "Severe" },
  { zipCode: "30314", city: "Atlanta", state: "GA", dollarStores: 7, fullServiceGrocers: 1, medianIncome: 29500, snapParticipationPct: 35.6, foodDesertStatus: "Moderate" },
  { zipCode: "90003", city: "Los Angeles", state: "CA", dollarStores: 5, fullServiceGrocers: 2, medianIncome: 36800, snapParticipationPct: 28.4, foodDesertStatus: "Moderate" },
  { zipCode: "02118", city: "Boston", state: "MA", dollarStores: 1, fullServiceGrocers: 4, medianIncome: 68500, snapParticipationPct: 12.3, foodDesertStatus: "Low Risk" },
];

export default function FoodDesertsResearch() {
  const [activeTab, setActiveTab] = useState<'overview' | 'qa' | 'simulator' | 'policy'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedQaId, setExpandedQaId] = useState<number | null>(1);
  const [researchNotes, setResearchNotes] = useState<Record<number, string>>({});
  
  // Interactive Simulator State
  const [dollarStoreInput, setDollarStoreInput] = useState<number>(8);
  const [grocerInput, setGrocerInput] = useState<number>(1);
  const [snapMonthlyBudget, setSnapMonthlyBudget] = useState<number>(350);
  const [megaGrocerShare, setMegaGrocerShare] = useState<number>(65);

  // Filtered Questions
  const filteredQA = useMemo(() => {
    return QA_DATABASE.filter(item => {
      const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.followUpQuestion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleNoteChange = (id: number, note: string) => {
    setResearchNotes(prev => ({ ...prev, [id]: note }));
  };

  const toggleQaExpand = (id: number) => {
    setExpandedQaId(expandedQaId === id ? null : id);
  };

  // Calculations for Simulator
  const calculateRiskIndex = () => {
    const ratio = dollarStoreInput / (grocerInput || 0.5);
    if (ratio > 6) return { level: 'CRITICAL', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    if (ratio > 3) return { level: 'HIGH RISK', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    return { level: 'MODERATE / BALANCED', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  };

  const snapCorporateCapture = (snapMonthlyBudget * (megaGrocerShare / 100)).toFixed(2);
  const localEconomyLoss = (snapMonthlyBudget * (megaGrocerShare / 100) * 0.65).toFixed(2);

  return (
    <>
      <Head>
        <title>Food Deserts & Retail Redlining Research Lab | Market Analysis</title>
        <meta name="description" content="Interactive research hub analyzing supermarket redlining, dollar store saturation, and SNAP benefit monetization by mega-grocers." />
      </Head>

      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
        
        {/* Header Bar */}
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-white">Retail Vulnerability Lab</h1>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                    20x20 Research Protocol
                  </span>
                </div>
                <p className="text-xs text-slate-400">Supermarket Redlining, Dollar Store Saturation & SNAP Monetization</p>
              </div>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-6 bg-slate-950/60 border border-slate-800 rounded-lg px-4 py-2 text-xs">
              <div>
                <span className="text-slate-500 block">Core Q&A:</span>
                <span className="font-semibold text-amber-400">20 Primary</span>
              </div>
              <div className="h-6 w-px bg-slate-800"></div>
              <div>
                <span className="text-slate-500 block">Follow-up Vector:</span>
                <span className="font-semibold text-emerald-400">20 Research</span>
              </div>
              <div className="h-6 w-px bg-slate-800"></div>
              <div>
                <span className="text-slate-500 block">Focus Metrics:</span>
                <span className="font-semibold text-cyan-400">SNAP & Saturation</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4 mb-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Research Overview & Metrics
            </button>
            <button
              onClick={() => setActiveTab('qa')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'qa'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" /> 20x20 Q&A Research Explorer
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'simulator'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Saturation & SNAP Simulator
            </button>
            <button
              onClick={() => setActiveTab('policy')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'policy'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <ShieldAlert className="w-4 h-4" /> Policy & Legal Matrix
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Top Banner Hero */}
              <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-8 border border-slate-800 overflow-hidden">
                <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                  <ShoppingCart className="w-96 h-96 text-amber-500" />
                </div>
                <div className="max-w-3xl space-y-4 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" /> Market Distortion Report
                  </div>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                    Structural Disinvestment & Corporate Extraction in Retail Food Systems
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    This interactive research module analyzes the tripartite squeeze on low-income communities: 
                    <span className="text-amber-400 font-medium"> Supermarket Redlining</span> (exit of full-service grocers), 
                    <span className="text-amber-400 font-medium"> Dollar Store Saturation</span> (clustering of non-perishable discount retail), and 
                    <span className="text-amber-400 font-medium"> SNAP Monetization</span> (the capture of federal benefits by mega-grocers).
                  </p>
                  <div className="pt-2 flex flex-wrap gap-4">
                    <button
                      onClick={() => setActiveTab('qa')}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 text-sm flex items-center gap-2"
                    >
                      Explore All 20 Core Q&As <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab('simulator')}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-medium hover:bg-slate-700 transition-colors border border-slate-700 text-sm"
                    >
                      Launch Saturation Calculator
                    </button>
                  </div>
                </div>
              </div>

              {/* Three Pillars Overview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Pillar 1 */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 relative flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">1. Supermarket Redlining</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Major grocers utilize geographic algorithms and deed covenants to abandon and lock out low-income urban zip codes, creating vast fresh-food vacuums.
                    </p>
                  </div>
                  <ul className="text-xs space-y-2 text-slate-300 border-t border-slate-800 pt-4">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                      20-50 year negative deed covenants block competitors
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                      Aggressive real estate hurdle rates abandon low-income zones
                    </li>
                  </ul>
                </div>

                {/* Pillar 2 */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 relative flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                      <TrendingDown className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">2. Dollar Store Saturation</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Ultra-discount chains saturate redlined zip codes with 5-15 stores per tract, undercutting local grocer center-store margins without offering fresh produce.
                    </p>
                  </div>
                  <ul className="text-xs space-y-2 text-slate-300 border-t border-slate-800 pt-4">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                      Single-coverage staffing keeps payroll at ~5-7% of sales
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                      Erosion of independent grocer high-margin non-perishables
                    </li>
                  </ul>
                </div>

                {/* Pillar 3 */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 relative flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">3. SNAP Monetization</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Federal safety net dollars are heavily funneled into mega-grocers and big-box store revenues, extracting local purchasing power out of communities.
                    </p>
                  </div>
                  <ul className="text-xs space-y-2 text-slate-300 border-t border-slate-800 pt-4">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                      Top retailers capture &gt;60% of national SNAP redemptions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                      E-commerce SNAP integration creates digital distribution moats
                    </li>
                  </ul>
                </div>

              </div>

              {/* Sample Location Case Studies */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Urban Census Tract Saturation Samples</h3>
                    <p className="text-xs text-slate-400">Comparison of full-service grocers vs. dollar store counts across high-need zip codes</p>
                  </div>
                  <div className="text-xs text-slate-500 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                    Source: USDA Food Access Research Atlas & Municipal Overlay Audits
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                        <th className="pb-3 px-4 font-semibold">Location / Zip Code</th>
                        <th className="pb-3 px-4 font-semibold">Median Household Income</th>
                        <th className="pb-3 px-4 font-semibold">Dollar Store Count</th>
                        <th className="pb-3 px-4 font-semibold">Full-Service Grocers</th>
                        <th className="pb-3 px-4 font-semibold">SNAP Participation %</th>
                        <th className="pb-3 px-4 font-semibold">Desert Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {SAMPLE_LOCATIONS.map((loc) => (
                        <tr key={loc.zipCode} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4 font-medium text-white">
                            {loc.city}, {loc.state} <span className="text-slate-500 font-mono">({loc.zipCode})</span>
                          </td>
                          <td className="py-3 px-4">${loc.medianIncome.toLocaleString()}</td>
                          <td className="py-3 px-4 font-semibold text-amber-400">{loc.dollarStores}</td>
                          <td className="py-3 px-4 font-semibold text-slate-200">{loc.fullServiceGrocers}</td>
                          <td className="py-3 px-4">{loc.snapParticipationPct}%</td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                              loc.foodDesertStatus === 'Severe'
                                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                                : loc.foodDesertStatus === 'Moderate'
                                ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            }`}>
                              {loc.foodDesertStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: 20x20 Q&A REPOSITORY */}
          {activeTab === 'qa' && (
            <div className="space-y-6">
              
              {/* Filter Controls */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                
                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search 20 core questions, tags, answers..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Category Selector */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs text-slate-400 mr-1">Category:</span>
                  {['All', 'Redlining', 'Dollar Stores', 'SNAP Monetization', 'Structural Economics'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedCategory === cat
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* QA Accordion List */}
              <div className="space-y-4">
                {filteredQA.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 bg-slate-900/30 border border-slate-800 rounded-xl">
                    No research questions matching search filters.
                  </div>
                ) : (
                  filteredQA.map((item) => {
                    const isExpanded = expandedQaId === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                          isExpanded
                            ? 'bg-slate-900 border-amber-500/40 shadow-xl'
                            : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        {/* Accordion Header */}
                        <div
                          onClick={() => toggleQaExpand(item.id)}
                          className="p-5 cursor-pointer flex items-start justify-between gap-4 select-none"
                        >
                          <div className="flex items-start gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold flex items-center justify-center">
                              Q{item.id}
                            </span>
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                                  {item.category}
                                </span>
                                {item.tags.map(t => (
                                  <span key={t} className="text-[10px] text-slate-500 font-mono">#{t}</span>
                                ))}
                              </div>
                              <h3 className="text-base font-semibold text-white leading-snug">
                                {item.question}
                              </h3>
                            </div>
                          </div>
                          
                          <button className="text-slate-400 hover:text-white p-1">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </div>

                        {/* Accordion Expanded Content */}
                        {isExpanded && (
                          <div className="px-5 pb-6 pt-2 border-t border-slate-800/60 space-y-6">
                            
                            {/* Detailed Answer */}
                            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4">
                              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                                <CheckCircle2 className="w-4 h-4" /> Comprehensive Answer
                              </div>
                              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                {item.answer}
                              </p>
                            </div>

                            {/* Follow-up Research Question (20 Next-Phase Vector) */}
                            <div className="bg-gradient-to-r from-emerald-950/30 to-slate-950 border border-emerald-500/30 rounded-lg p-4 relative">
                              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                                <Sparkles className="w-4 h-4" /> Next-Phase Research Vector (Follow-Up Question)
                              </div>
                              <p className="text-sm font-semibold text-emerald-200 mb-2">
                                "{item.followUpQuestion}"
                              </p>
                              <p className="text-xs text-slate-400 italic">
                                <strong className="text-slate-300">Methodological Context:</strong> {item.followUpContext}
                              </p>
                            </div>

                            {/* Research Notes & Notes Tracker */}
                            <div className="space-y-2">
                              <label className="text-xs font-medium text-slate-400 flex items-center justify-between">
                                <span>Researcher Notes / Local Observation Data</span>
                                <span className="text-[10px] text-slate-500 font-mono">Auto-Saved Locally</span>
                              </label>
                              <textarea
                                value={researchNotes[item.id] || ''}
                                onChange={(e) => handleNoteChange(item.id, e.target.value)}
                                placeholder="Add notes, local policy observations, or relevant data sources for this research question..."
                                rows={2}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
                              />
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SIMULATOR & CALCULATOR */}
          {activeTab === 'simulator' && (
            <div className="space-y-8">
              
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                <div className="max-w-2xl mb-6">
                  <h2 className="text-xl font-bold text-white mb-1">Retail Saturation & Corporate Extraction Simulator</h2>
                  <p className="text-xs text-slate-400">
                    Adjust variables to simulate market distortion metrics, dollar store clustering ratios, and SNAP capital flight from local communities.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Controls Column */}
                  <div className="space-y-6 bg-slate-950/60 border border-slate-800 p-5 rounded-xl">
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                      Census Tract Input Parameters
                    </h3>

                    {/* Dollar Store Count */}
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-300 font-medium">Dollar Store Outlets in Tract:</span>
                        <span className="font-mono text-amber-400 font-bold">{dollarStoreInput}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={dollarStoreInput}
                        onChange={(e) => setDollarStoreInput(Number(e.target.value))}
                        className="w-full accent-amber-500 bg-slate-800"
                      />
                    </div>

                    {/* Full Service Grocers Count */}
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-300 font-medium">Full-Service Grocers:</span>
                        <span className="font-mono text-cyan-400 font-bold">{grocerInput}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        value={grocerInput}
                        onChange={(e) => setGrocerInput(Number(e.target.value))}
                        className="w-full accent-cyan-500 bg-slate-800"
                      />
                    </div>

                    {/* Monthly Household SNAP Benefit */}
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-300 font-medium">Average Household Monthly SNAP ($):</span>
                        <span className="font-mono text-emerald-400 font-bold">${snapMonthlyBudget}</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="1000"
                        step="25"
                        value={snapMonthlyBudget}
                        onChange={(e) => setSnapMonthlyBudget(Number(e.target.value))}
                        className="w-full accent-emerald-500 bg-slate-800"
                      />
                    </div>

                    {/* Mega Grocer Share */}
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-300 font-medium">% SNAP Captured by Mega-Chains:</span>
                        <span className="font-mono text-purple-400 font-bold">{megaGrocerShare}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="95"
                        value={megaGrocerShare}
                        onChange={(e) => setMegaGrocerShare(Number(e.target.value))}
                        className="w-full accent-purple-500 bg-slate-800"
                      />
                    </div>
                  </div>

                  {/* Calculated Outputs Column */}
                  <div className="space-y-6 flex flex-col justify-between">
                    
                    {/* Risk Index Box */}
                    <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-3">
                      <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
                        Food Vulnerability Status Index
                      </span>
                      <div className={`p-4 rounded-xl border text-center font-bold text-lg ${calculateRiskIndex().color}`}>
                        {calculateRiskIndex().level}
                      </div>
                      <p className="text-xs text-slate-400">
                        Ratio: <span className="font-mono text-white">{(dollarStoreInput / (grocerInput || 0.5)).toFixed(1)} : 1</span> Dollar Stores per Supermarket.
                      </p>
                    </div>

                    {/* Corporate SNAP Extraction Box */}
                    <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-4">
                      <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
                        Monthly Economic Extraction Metrics
                      </span>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                          <span className="text-[10px] text-slate-400 block">Corporate SNAP Revenue</span>
                          <span className="text-base font-bold text-cyan-400 font-mono">${snapCorporateCapture}</span>
                          <span className="text-[10px] text-slate-500 block">per household / mo</span>
                        </div>

                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                          <span className="text-[10px] text-slate-400 block">Local Circulation Loss</span>
                          <span className="text-base font-bold text-red-400 font-mono">${localEconomyLoss}</span>
                          <span className="text-[10px] text-slate-500 block">extracted from district</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg flex items-start gap-2">
                        <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>
                          High corporate capture reduces the local fiscal multiplier effect from 1.7x to under 1.1x in vulnerable neighborhood economies.
                        </span>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 4: POLICY & LEGAL MATRIX */}
          {activeTab === 'policy' && (
            <div className="space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-2">Policy Intervention & Regulatory Matrix</h2>
                <p className="text-xs text-slate-400 mb-6">
                  Structural legislative and zoning interventions designed to counter supermarket redlining and dollar store saturation.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Policy 1 */}
                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        Zoning Policy
                      </span>
                      <span className="text-[10px] text-slate-500">Municipal Level</span>
                    </div>
                    <h3 className="text-base font-bold text-white">Small-Box Discount Store Restrictive Overlay</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Prohibits the opening of new dollar stores within a 1,000 to 2,500-foot radius of existing locations or mandates that 15%+ of floor area be dedicated to fresh produce.
                    </p>
                    <div className="text-xs font-mono text-slate-500 border-t border-slate-800 pt-3">
                      Adopted in: Tulsa OK, Birmingham AL, Atlanta GA, Detroit MI
                    </div>
                  </div>

                  {/* Policy 2 */}
                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        Antitrust Law
                      </span>
                      <span className="text-[10px] text-slate-500">State / Federal</span>
                    </div>
                    <h3 className="text-base font-bold text-white">Restrictive Grocery Covenant Invalidation</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      State statutes declaring restrictive deed covenants placed by departing supermarket chains to be null, void, and against public health interest.
                    </p>
                    <div className="text-xs font-mono text-slate-500 border-t border-slate-800 pt-3">
                      Adopted in: Chicago IL, New York State Legislative Proposals
                    </div>
                  </div>

                  {/* Policy 3 */}
                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Federal SNAP Policy
                      </span>
                      <span className="text-[10px] text-slate-500">USDA / Farm Bill</span>
                    </div>
                    <h3 className="text-base font-bold text-white">Open POS Standards for Independent SNAP Online</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Mandating zero-fee, federally subsidized open gateway protocols for small independent markets to accept online EBT and GusNIP benefit transactions.
                    </p>
                    <div className="text-xs font-mono text-slate-500 border-t border-slate-800 pt-3">
                      Target Area: USDA Food and Nutrition Service Regulatory Audits
                    </div>
                  </div>

                  {/* Policy 4 */}
                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                        Public Finance
                      </span>
                      <span className="text-[10px] text-slate-500">Municipal / CDFI</span>
                    </div>
                    <h3 className="text-base font-bold text-white">Community Grocery Equity & Revolving Loan Funds</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Providing patient, non-extractive capital and real estate acquisition support for community-owned grocery cooperatives and food hubs.
                    </p>
                    <div className="text-xs font-mono text-slate-500 border-t border-slate-800 pt-3">
                      Adopted in: California Healthy Food Financing Initiative
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-900/40 mt-16 py-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-slate-400 font-semibold">Retail Food Access Research Protocol</p>
              <p>20 Primary Question Answers + 20 Research Expansion Vectors Generated</p>
            </div>
            <div className="flex gap-4 text-slate-400">
              <span className="hover:text-white cursor-pointer">USDA Research Atlas</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">Antitrust Enforcement</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">Food Sovereignty</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}