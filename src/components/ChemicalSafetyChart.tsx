import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Info,
  Search,
  Filter,
  FlaskConical,
  FileText,
  BarChart2,
  Scale,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ExternalLink,
  BookOpen,
  X,
  Layers,
  ArrowRightLeft
} from 'lucide-react';

export interface ChemicalAdditive {
  id: string;
  name: string;
  eNumber?: string;
  category: string;
  usStatus: 'Allowed (GRAS)' | 'Allowed with limits' | 'Phase-out / Restricted' | 'Banned';
  euStatus: 'Banned' | 'Restricted / Warning Required' | 'Authorized with limits' | 'Under Re-evaluation';
  usThresholdNumeric: number; // Normalized index 0-100 for visual bar comparison (100 = high allowance/unlimited)
  euThresholdNumeric: number; // Normalized index 0-100
  usLimitText: string;
  euLimitText: string;
  discrepancyLevel: 'Extreme' | 'High' | 'Moderate' | 'Low';
  primaryConcerns: string[];
  description: string;
  fdaRationale: string;
  efsaRationale: string;
  researchQuestions: string[];
  commonFoods: string[];
}

const ADDITIVES_DATA: ChemicalAdditive[] = [
  {
    id: 'titanium-dioxide',
    name: 'Titanium Dioxide',
    eNumber: 'E171',
    category: 'Color Additive',
    usStatus: 'Allowed (GRAS)',
    euStatus: 'Banned',
    usThresholdNumeric: 90,
    euThresholdNumeric: 0,
    usLimitText: 'Up to 1.0% by weight of food without specific label warnings.',
    euLimitText: 'Completely banned in human food products since August 2022.',
    discrepancyLevel: 'Extreme',
    primaryConcerns: ['Genotoxicity', 'DNA Damage', 'Nanoparticle Accumulation', 'Gut Microbiome Alteration'],
    description: 'Used as a whitening agent and opacity enhancer in candies, salad dressings, coffee creamers, and baked goods.',
    fdaRationale: 'FDA maintains approval asserting available science does not demonstrate a safety hazard under intended use levels (21 CFR 73.575).',
    efsaRationale: 'EFSA concluded in 2021 that E171 can no longer be considered safe due to uncertainties regarding genotoxicity and particle accumulation in tissues.',
    researchQuestions: [
      'What are the chronic bioaccumulation rates of food-grade TiO2 nanoparticles in human hepatic tissue?',
      'How does the particle size distribution of US commercial food colorants compare to tested European isolates?'
    ],
    commonFoods: ['Candies', 'Coffee Creamers', 'Frosting', 'Salad Dressings', 'Chewing Gum']
  },
  {
    id: 'potassium-bromate',
    name: 'Potassium Bromate',
    eNumber: 'E924',
    category: 'Dough Conditioner',
    usStatus: 'Allowed with limits',
    euStatus: 'Banned',
    usThresholdNumeric: 65,
    euThresholdNumeric: 0,
    usLimitText: '50 ppm in flour; FDA urges voluntary reduction but remains legal.',
    euLimitText: 'Banned in food production since 1990.',
    discrepancyLevel: 'Extreme',
    primaryConcerns: ['Carcinogenicity', 'Renal Toxicity', 'Thyroid Tumorigenesis'],
    description: 'Strengthens dough and promotes high rising in commercial bread production.',
    fdaRationale: 'FDA permits use assuming baking converts bromate to harmless bromide, though residual levels remain detectable in finished products.',
    efsaRationale: 'Classified as a Group 2B carcinogen by IARC; EFSA enforces zero-tolerance policy in food supply.',
    researchQuestions: [
      'What percentage of commercial baked goods in the US contain residual bromate above detection limits?',
      'What are the health differences in long-term exposure populations using potassium iodate alternatives versus potassium bromate?'
    ],
    commonFoods: ['Commercial White Bread', 'Rolls', 'Pizza Crusts', 'Bagels']
  },
  {
    id: 'bvo',
    name: 'Brominated Vegetable Oil (BVO)',
    eNumber: 'E443',
    category: 'Emulsifier / Stabilizer',
    usStatus: 'Phase-out / Restricted',
    euStatus: 'Banned',
    usThresholdNumeric: 25,
    euThresholdNumeric: 0,
    usLimitText: 'FDA proposed revocation in late 2023; state-level bans active.',
    euLimitText: 'Banned across EU and UK since 2008.',
    discrepancyLevel: 'High',
    primaryConcerns: ['Organ Bromine Accumulation', 'Cardiotoxicity', 'Neurological Effects', 'Endocrine Disruption'],
    description: 'Keeps citrus flavoring agents suspended in carbonated sports and fruit drinks.',
    fdaRationale: 'Historically allowed up to 15 ppm while safety studies were reviewed. FDA initiated formal steps to ban in 2023 based on recent toxicology reports.',
    efsaRationale: 'Banned due to lipid accumulation in heart tissues and bioaccumulation of toxic inorganic bromine.',
    researchQuestions: [
      'What is the tissue half-life of bromine compounds derived from beverage emulsifiers in serum lipid fractions?',
      'How do alternative emulsifiers like SAIB (Sucrose Acetate Isobutyrate) compare in metabolic safety clearance?'
    ],
    commonFoods: ['Citrus Soft Drinks', 'Sports Beverages', 'Flavored Waters']
  },
  {
    id: 'red-40',
    name: 'Red 40 (Allura Red AC)',
    eNumber: 'E129',
    category: 'Synthetic Dye',
    usStatus: 'Allowed (GRAS)',
    euStatus: 'Restricted / Warning Required',
    usThresholdNumeric: 85,
    euThresholdNumeric: 30,
    usLimitText: 'Broadly approved in foods and drugs with minimal dosage ceilings.',
    euLimitText: 'Authorized but mandatory label: "May have an adverse effect on activity and attention in children."',
    discrepancyLevel: 'Moderate',
    primaryConcerns: ['Hyperactivity in Children (ADHD link)', 'Allergic Reactions', 'Gut Mucosa Inflammation'],
    description: 'Petroleum-derived red synthetic azo dye widely used in snacks, beverages, and cereals.',
    fdaRationale: 'FDA concluded no definitive causal link between Red 40 and child behavioral disorders in general non-sensitive populations.',
    efsaRationale: 'Based on the Southampton Study, EU mandates warning labels for azo dyes to warn consumers about potential neurobehavioral impacts in children.',
    researchQuestions: [
      'What genetic markers predispose sub-populations of children to neurobehavioral reactions from synthetic azo dyes?',
      'Does chronic dietary intake of Allura Red alter low-grade mucosal inflammatory markers in the human colon?'
    ],
    commonFoods: ['Cereals', 'Candy', 'Fruit Snacks', 'Sodas', 'Pediatric Medications']
  },
  {
    id: 'yellow-5',
    name: 'Yellow 5 (Tartrazine)',
    eNumber: 'E102',
    category: 'Synthetic Dye',
    usStatus: 'Allowed (GRAS)',
    euStatus: 'Restricted / Warning Required',
    usThresholdNumeric: 85,
    euThresholdNumeric: 30,
    usLimitText: 'Allowed in food and cosmetics; ingredient declaration required.',
    euLimitText: 'Authorized with mandatory child hyperactivity safety warning label.',
    discrepancyLevel: 'Moderate',
    primaryConcerns: ['Histamine Release', 'Asthma Exacerbation', 'Child Behavioral Changes'],
    description: 'Azo dye adding yellow color to processed foods, condiments, and pharmaceuticals.',
    fdaRationale: 'Requires ingredient labeling due to known allergic sensitivity in a small percentage of individuals, but considered non-toxic overall.',
    efsaRationale: 'Retained lower Acceptable Daily Intake (ADI) and warning label requirement to inform parents of hyperactivity risk.',
    researchQuestions: [
      'Is there a synergistic neuroactive impact when Tartrazine is consumed alongside sodium benzoate?',
      'What are the cross-reactivity mechanisms between Tartrazine sensitivity and aspirin-induced asthma?'
    ],
    commonFoods: ['Macaroni & Cheese', 'Chips', 'Pickles', 'Soft Drinks', 'Puddings']
  },
  {
    id: 'propylparaben',
    name: 'Propylparaben',
    eNumber: 'E216',
    category: 'Preservative',
    usStatus: 'Allowed (GRAS)',
    euStatus: 'Banned',
    usThresholdNumeric: 50,
    euThresholdNumeric: 0,
    usLimitText: 'Allowed up to 0.1% concentration in direct food applications.',
    euLimitText: 'Banned as a food additive in the EU since 2006.',
    discrepancyLevel: 'High',
    primaryConcerns: ['Endocrine Disruption', 'Sperm Count Reduction', 'Estrogen Receptor Binding'],
    description: 'Antimicrobial agent used to extend shelf-life in tortillas, pastries, and food coatings.',
    fdaRationale: 'Maintains GRAS status under historic evaluations, though under increased public scrutiny and state-level regulation.',
    efsaRationale: 'EFSA removed its ADI and banned it from food because it disrupts hormone function and reproductive parameters at low doses.',
    researchQuestions: [
      'What is the additive endocrine-disrupting effect of dietary parabens combined with cosmetic exposures?',
      'How do metabolic breakdown products of propylparaben interact with nuclear hormone receptors in vivo?'
    ],
    commonFoods: ['Packaged Tortillas', 'Pre-made Pastries', 'Muffins', 'Food Glazes']
  },
  {
    id: 'azodicarbonamide',
    name: 'Azodicarbonamide (ADA)',
    eNumber: 'E927a',
    category: 'Dough Conditioner / Bleaching Agent',
    usStatus: 'Allowed with limits',
    euStatus: 'Banned',
    usThresholdNumeric: 60,
    euThresholdNumeric: 0,
    usLimitText: 'Allowed up to 45 ppm in flour for bread baking.',
    euLimitText: 'Prohibited in food contact materials and food additives.',
    discrepancyLevel: 'Extreme',
    primaryConcerns: ['Urethane Formation (Carcinogen)', 'Respiratory Sensitivity', 'Asthma Risk'],
    description: 'Chemical blowing agent used in yoga mats and shoe soles, as well as a dough improver in fast-food bread.',
    fdaRationale: 'FDA approves use at low levels, asserting breakdown products like semicarbazide are below toxic threshold levels during consumption.',
    efsaRationale: 'EFSA banned ADA due to concerns over semicarbazide (a breakdown product during baking) causing tumor risks in laboratory studies.',
    researchQuestions: [
      'What is the precise quantitative spectrum of semicarbazide formation across varying bread baking temperatures?',
      'Are food production workers exposed to airborne ADA at elevated risk for occupational respiratory illness?'
    ],
    commonFoods: ['Fast Food Buns', 'Commercial Bread Mixes', 'Processed Pastries']
  },
  {
    id: 'bha-bht',
    name: 'BHA & BHT',
    eNumber: 'E320 / E321',
    category: 'Antioxidant Preservative',
    usStatus: 'Allowed (GRAS)',
    euStatus: 'Restricted / Warning Required',
    usThresholdNumeric: 75,
    euThresholdNumeric: 25,
    usLimitText: 'Allowed up to 0.02% of total fat/oil content in food items.',
    euLimitText: 'Strictly limited ADI; BHA classified as under active review for endocrine disruption.',
    discrepancyLevel: 'High',
    primaryConcerns: ['Endocrine Disruption', 'Potential Carcinogen (BHA)', 'Organ System Toxicity'],
    description: 'Synthetic antioxidants used to prevent oxidation and rancidity in fats, oils, and cereals.',
    fdaRationale: 'Deemed GRAS at current dietary exposure levels; classified as generally safe antioxidant.',
    efsaRationale: 'EFSA lowered the ADI significantly and subjected BHA to potential restriction due to endocrine and thyroid tumor concerns.',
    researchQuestions: [
      'Does long-term low-dose BHA intake impact human thyroid hormone homeostasis over multi-year periods?',
      'How do natural preservatives (e.g., rosemary extract, tocopherols) compare in cost and efficacy for extended shelf-life?'
    ],
    commonFoods: ['Cereals', 'Vegetable Oils', 'Potato Chips', 'Processed Meats', 'Chewing Gum']
  },
  {
    id: 'rbst',
    name: 'rBST / rBGH (Bovine Growth Hormone)',
    eNumber: 'N/A',
    category: 'Agricultural Hormone',
    usStatus: 'Allowed with limits',
    euStatus: 'Banned',
    usThresholdNumeric: 80,
    euThresholdNumeric: 0,
    usLimitText: 'Approved for dairy cows; special label rules for non-treated milk.',
    euLimitText: 'Banned since 1999 on animal welfare and human growth factor concerns.',
    discrepancyLevel: 'Extreme',
    primaryConcerns: ['Elevated IGF-1 Levels', 'Antibiotic Resistance', 'Animal Welfare (Mastitis)'],
    description: 'Synthetic hormone injected into dairy cows to boost milk production.',
    fdaRationale: 'FDA concluded no significant difference between milk from rBST-treated and non-treated cows, claiming IGF-1 levels fall within natural ranges.',
    efsaRationale: 'Banned in the EU primarily due to mastitis and animal distress, alongside concerns over elevated IGF-1 link to prostate/breast cancers.',
    researchQuestions: [
      'What are the measurable serum IGF-1 differences in human populations consuming non-organic vs rBST-free milk?',
      'How does secondary antibiotic usage in rBST-treated herds contribute to environmental antimicrobial resistance?'
    ],
    commonFoods: ['Conventional Dairy Milk', 'Butter', 'Cheese', 'Yogurt (US Conventional)']
  },
  {
    id: 'red-3',
    name: 'Red 3 (Erythrosine)',
    eNumber: 'E127',
    category: 'Synthetic Dye',
    usStatus: 'Phase-out / Restricted',
    euStatus: 'Restricted / Warning Required',
    usThresholdNumeric: 70,
    euThresholdNumeric: 15,
    usLimitText: 'Banned in cosmetics (1990); banned in CA (2027); FDA under active phase-out petition.',
    euLimitText: 'Banned in general food; allowed ONLY in specific cocktail cherries (Maraschino).',
    discrepancyLevel: 'High',
    primaryConcerns: ['Thyroid Tumors in Animal Models', 'Hyperactivity', 'Genotoxicity'],
    description: 'Cherry-red synthetic fluorone dye used in candies, baked goods, and maraschino cherries.',
    fdaRationale: 'FDA acknowledged animal thyroid cancer data in 1990 for cosmetics, but delayed action on general food items until state-level legislation forced nationwide review.',
    efsaRationale: 'Restricted exclusively to cocktail and candied cherries where dietary exposure is negligible.',
    researchQuestions: [
      'What is the pharmacokinetic pathway of Erythrosine on thyroid peroxidase activity in humans?',
      'Why did regulatory timelines diverge for 3+ decades between cosmetic topical safety and oral food intake?'
    ],
    commonFoods: ['Maraschino Cherries', 'Halloween Candies', 'Sausage Casings', 'Cake Decorations']
  }
];

export const ChemicalSafetyChart: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [discrepancyFilter, setDiscrepancyFilter] = useState<string>('All');
  const [selectedAdditive, setSelectedAdditive] = useState<ChemicalAdditive | null>(ADDITIVES_DATA[0]);
  const [activeTab, setActiveTab] = useState<'comparison' | 'matrix' | 'research'>('comparison');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Filter Categories
  const categories = useMemo(() => {
    const cats = new Set(ADDITIVES_DATA.map((item) => item.category));
    return ['All', ...Array.from(cats)];
  }, []);

  // Filter Data
  const filteredData = useMemo(() => {
    return ADDITIVES_DATA.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.eNumber && item.eNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.primaryConcerns.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesDiscrepancy = discrepancyFilter === 'All' || item.discrepancyLevel === discrepancyFilter;

      return matchesSearch && matchesCategory && matchesDiscrepancy;
    });
  }, [searchTerm, selectedCategory, discrepancyFilter]);

  // Statistics Metrics
  const stats = useMemo(() => {
    const total = ADDITIVES_DATA.length;
    const bannedInEU = ADDITIVES_DATA.filter((i) => i.euStatus === 'Banned').length;
    const warningInEU = ADDITIVES_DATA.filter((i) => i.euStatus.includes('Warning')).length;
    const extremeDiscrepancies = ADDITIVES_DATA.filter((i) => i.discrepancyLevel === 'Extreme').length;

    return { total, bannedInEU, warningInEU, extremeDiscrepancies };
  }, []);

  const getDiscrepancyBadge = (level: ChemicalAdditive['discrepancyLevel']) => {
    switch (level) {
      case 'Extreme':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">Extreme Divergence</span>;
      case 'High':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">High Discrepancy</span>;
      case 'Moderate':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">Moderate Variance</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 font-medium">Minor Variance</span>;
    }
  };

  const getStatusBadge = (status: string, region: 'US' | 'EU') => {
    if (status.includes('Banned')) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
          {status}
        </span>
      );
    }
    if (status.includes('Warning') || status.includes('Restricted') || status.includes('Phase-out')) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        {status}
      </span>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* HEADER SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold uppercase tracking-wider mb-1">
              <Scale className="w-4 h-4" />
              Transatlantic Food Safety Comparative Analysis
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              US (FDA) vs EU (EFSA) Safety Thresholds
            </h1>
            <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-3xl leading-relaxed">
              Explore regulatory divergence in common food additives, chemical thresholds, and underlying toxicological rationale between the United States Food & Drug Administration and the European Food Safety Authority.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 p-3 rounded-xl">
            <FlaskConical className="w-8 h-8 text-indigo-600 shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-indigo-950">Precautionary vs Risk-Proof</div>
              <div className="text-indigo-700">EU EFSA applies precautionary principles; US FDA requires proof of harm.</div>
            </div>
          </div>
        </div>

        {/* METRICS SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="text-xs font-medium text-slate-500">Tracked Additives</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
            <div className="text-xs text-slate-500 mt-1">Common processed additives</div>
          </div>
          <div className="bg-red-50/50 border border-red-100 rounded-xl p-4">
            <div className="text-xs font-medium text-red-700">Banned in EU / Legal in US</div>
            <div className="text-2xl font-black text-red-700 mt-1">{stats.bannedInEU}</div>
            <div className="text-xs text-red-600 mt-1">{Math.round((stats.bannedInEU / stats.total) * 100)}% of analyzed dataset</div>
          </div>
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4">
            <div className="text-xs font-medium text-amber-800">EU Warning Label Required</div>
            <div className="text-2xl font-black text-amber-800 mt-1">{stats.warningInEU}</div>
            <div className="text-xs text-amber-700 mt-1">Targeting child hyper-reactivity</div>
          </div>
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
            <div className="text-xs font-medium text-indigo-800">Extreme Divergence</div>
            <div className="text-2xl font-black text-indigo-800 mt-1">{stats.extremeDiscrepancies}</div>
            <div className="text-xs text-indigo-700 mt-1">Opposing regulatory stances</div>
          </div>
        </div>
      </div>

      {/* CONTROLS & NAVIGATION TABS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          {/* TABS */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'comparison'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              Visual Threshold Chart
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'matrix'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              Regulatory Matrix
            </button>
            <button
              onClick={() => setActiveTab('research')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'research'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Research Agenda ({ADDITIVES_DATA.reduce((acc, curr) => acc + curr.researchQuestions.length, 0)})
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search additive, E-number, health concern..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* FILTERS ROW */}
        <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            Filters:
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Discrepancy Level Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Divergence Level:</span>
            <select
              value={discrepancyFilter}
              onChange={(e) => setDiscrepancyFilter(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Levels</option>
              <option value="Extreme">Extreme</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
            </select>
          </div>

          {(selectedCategory !== 'All' || discrepancyFilter !== 'All' || searchTerm !== '') && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setDiscrepancyFilter('All');
                setSearchTerm('');
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2 ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* MAIN VIEW TAB 1: VISUAL COMPARISON CHART */}
      {activeTab === 'comparison' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Additive List & Threshold Bars (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-600" />
                Permissible Exposure Index (US vs EU)
              </h2>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-blue-600 inline-block"></span>
                  US Allowance
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-indigo-950 inline-block"></span>
                  EU Allowance
                </div>
              </div>
            </div>

            {filteredData.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Info className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                No additives found matching your active filter criteria.
              </div>
            ) : (
              <div className="space-y-5">
                {filteredData.map((item) => {
                  const isSelected = selectedAdditive?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedAdditive(item)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/30 ring-2 ring-indigo-500/20 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.name}</h3>
                            {item.eNumber && (
                              <span className="text-xs font-mono bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                                {item.eNumber}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 font-medium">{item.category}</span>
                        </div>
                        <div>{getDiscrepancyBadge(item.discrepancyLevel)}</div>
                      </div>

                      {/* Visual Bar Comparison */}
                      <div className="space-y-2 mt-3">
                        {/* US Bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-700 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                              FDA (United States)
                            </span>
                            <span className="text-slate-600 font-mono text-[11px]">{item.usStatus}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(item.usThresholdNumeric, 3)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* EU Bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-700 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-indigo-950"></span>
                              EFSA (European Union)
                            </span>
                            <span className="text-slate-600 font-mono text-[11px]">{item.euStatus}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-3 rounded-full transition-all duration-500 ${
                                item.euThresholdNumeric === 0 ? 'bg-red-500' : 'bg-indigo-950'
                              }`}
                              style={{ width: `${Math.max(item.euThresholdNumeric, 3)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <div className="truncate max-w-[80%]">
                          <span className="font-medium text-slate-700">Concerns: </span>
                          {item.primaryConcerns.join(', ')}
                        </div>
                        <span className="text-indigo-600 font-semibold text-[11px] flex items-center gap-0.5">
                          Inspect <ChevronDown className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Item Detailed Breakdown Panel (5 cols) */}
          <div className="lg:col-span-5">
            {selectedAdditive ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                      Additive Deep Dive
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mt-0.5">{selectedAdditive.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedAdditive.eNumber && (
                        <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {selectedAdditive.eNumber}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-medium">{selectedAdditive.category}</span>
                    </div>
                  </div>
                  {getDiscrepancyBadge(selectedAdditive.discrepancyLevel)}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                  "{selectedAdditive.description}"
                </p>

                {/* Status Cards Comparison */}
                <div className="grid grid-cols-1 gap-3 mb-5">
                  <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/40">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-blue-900">FDA (United States) Stance</span>
                      {getStatusBadge(selectedAdditive.usStatus, 'US')}
                    </div>
                    <p className="text-xs text-slate-700 mt-1 font-medium">{selectedAdditive.usLimitText}</p>
                    <p className="text-xs text-slate-600 mt-2 pt-2 border-t border-blue-100/60">
                      <strong className="text-blue-950 font-semibold">Regulatory Rationale:</strong> {selectedAdditive.fdaRationale}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/40">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-900">EFSA (European Union) Stance</span>
                      {getStatusBadge(selectedAdditive.euStatus, 'EU')}
                    </div>
                    <p className="text-xs text-slate-700 mt-1 font-medium">{selectedAdditive.euLimitText}</p>
                    <p className="text-xs text-slate-600 mt-2 pt-2 border-t border-amber-100/60">
                      <strong className="text-slate-900 font-semibold">Regulatory Rationale:</strong> {selectedAdditive.efsaRationale}
                    </p>
                  </div>
                </div>

                {/* Common Foods Found In */}
                <div className="mb-5">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Common U.S. Foods Containing Additive</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAdditive.commonFoods.map((food, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium border border-slate-200">
                        {food}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Health Concerns */}
                <div className="mb-5">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-red-700">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Key Health & Toxicological Concerns
                  </div>
                  <ul className="space-y-1">
                    {selectedAdditive.primaryConcerns.map((concern, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Open Questions for Further Research */}
                <div className="p-4 bg-indigo-900 text-white rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
                    <HelpCircle className="w-4 h-4 text-indigo-400" />
                    Key Open Research Questions
                  </div>
                  <ul className="space-y-2">
                    {selectedAdditive.researchQuestions.map((q, idx) => (
                      <li key={idx} className="text-xs text-indigo-100 leading-relaxed bg-indigo-950/60 p-2 rounded border border-indigo-800/50">
                        "{q}"
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center text-slate-400">
                Select an additive from the list to inspect regulatory details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN VIEW TAB 2: DETAILED REGULATORY MATRIX TABLE */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Transatlantic Regulatory Matrix</h2>
              <p className="text-xs text-slate-500 mt-0.5">Comprehensive tabular comparison of legal statuses and concentration limits</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold">
              Showing {filteredData.length} additives
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <th className="p-4">Additive & Category</th>
                  <th className="p-4">US Status (FDA)</th>
                  <th className="p-4">EU Status (EFSA)</th>
                  <th className="p-4">Divergence Level</th>
                  <th className="p-4">Primary Concerns</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item) => {
                  const isExpanded = expandedCard === item.id;
                  return (
                    <React.Fragment key={item.id}>
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {item.eNumber && <span className="font-mono text-[11px] text-slate-500">{item.eNumber}</span>}
                            <span className="text-[11px] text-slate-400">•</span>
                            <span className="text-[11px] text-slate-500">{item.category}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>{getStatusBadge(item.usStatus, 'US')}</div>
                          <div className="text-[11px] text-slate-600 mt-1 max-w-xs">{item.usLimitText}</div>
                        </td>
                        <td className="p-4">
                          <div>{getStatusBadge(item.euStatus, 'EU')}</div>
                          <div className="text-[11px] text-slate-600 mt-1 max-w-xs">{item.euLimitText}</div>
                        </td>
                        <td className="p-4">{getDiscrepancyBadge(item.discrepancyLevel)}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {item.primaryConcerns.slice(0, 2).map((c, i) => (
                              <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                                {c}
                              </span>
                            ))}
                            {item.primaryConcerns.length > 2 && (
                              <span className="text-[10px] text-slate-400 font-medium">+{item.primaryConcerns.length - 2} more</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setExpandedCard(isExpanded ? null : item.id)}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
                          >
                            {isExpanded ? 'Hide' : 'Rationale'}
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-indigo-50/30">
                          <td colSpan={6} className="p-5 border-b border-indigo-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                                <div className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                                  FDA Policy & Evidence Base
                                </div>
                                <p className="text-slate-600 leading-relaxed">{item.fdaRationale}</p>
                              </div>
                              <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                                <div className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-indigo-900"></span>
                                  EFSA Policy & Precautionary Ruling
                                </div>
                                <p className="text-slate-600 leading-relaxed">{item.efsaRationale}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MAIN VIEW TAB 3: GENERATED RESEARCH QUESTIONS & INVESTIGATION AGENDA */}
      {activeTab === 'research' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-extrabold text-slate-900">Transatlantic Research & Investigation Agenda</h2>
            </div>
            <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
              These 20 targeted research questions address the root scientific, toxicological, and policy divergences between FDA and EFSA. After answering these foundational items, research teams can synthesize comprehensive policy recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredData.map((item, idx) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                      Module #{idx + 1} • {item.name}
                    </span>
                    {getDiscrepancyBadge(item.discrepancyLevel)}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-2">{item.name} ({item.eNumber || 'US Standard'})</h3>
                  <div className="text-xs text-slate-500 mb-4">
                    <strong>Status Gap:</strong> US ({item.usStatus}) vs EU ({item.euStatus})
                  </div>

                  <div className="space-y-3 mt-4">
                    {item.researchQuestions.map((q, qIdx) => (
                      <div key={qIdx} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <FlaskConical className="w-3.5 h-3.5 text-indigo-500" />
                          Research Hypothesis Question {qIdx + 1}
                        </div>
                        <p className="text-xs font-medium text-slate-800 leading-relaxed">"{q}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Category: {item.category}</span>
                  <button
                    onClick={() => {
                      setSelectedAdditive(item);
                      setActiveTab('comparison');
                    }}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
                  >
                    View Thresholds <ArrowRightLeft className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER & METHODOLOGY NOTE */}
      <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 text-xs text-slate-500 space-y-2">
        <div className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-4 h-4 text-slate-400" />
          Methodology & Data Reference Standard
        </div>
        <p className="leading-relaxed">
          Regulatory statuses reflect authoritative guidelines from the United States Food and Drug Administration (FDA 21 CFR) and the European Food Safety Authority (EFSA) regulations as of 2024. Numerical index bars represent standardized permissible food concentration thresholds scaled relative to legal daily tolerance standards.
        </p>
      </div>
    </div>
  );
};

export default ChemicalSafetyChart;