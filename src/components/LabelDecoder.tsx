import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Tag, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  Filter, 
  ArrowRight, 
  ShieldAlert, 
  Copy, 
  Check, 
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FileText
} from 'lucide-react';

export interface LabelEntry {
  id: string;
  term: string;
  category: 'food' | 'tech' | 'sustainability' | 'finance' | 'research';
  marketingClaim: string;
  realMeaning: string;
  impactLevel: 'high' | 'medium' | 'low';
  redFlags: string[];
  whatToLookFor: string;
  researchQuestions: string[];
}

const PRESET_LABELS: LabelEntry[] = [
  {
    id: 'food-all-natural',
    term: 'All Natural',
    category: 'food',
    marketingClaim: 'Pure, unprocessed food straight from nature without synthetic ingredients.',
    realMeaning: 'Legally unregulated by the FDA for most foods. Products can contain high fructose corn syrup, synthetic pesticides, natural flavor extracts, and heavy processing.',
    impactLevel: 'high',
    redFlags: ['High Fructose Corn Syrup', 'Natural Flavorings', 'Extensive processing'],
    whatToLookFor: 'Look for USDA Certified Organic or check the ingredient list for whole, recognizable foods.',
    researchQuestions: [
      'What is the legal difference between "Natural" and "Organic"?',
      'How are "Natural Flavors" chemically synthesized?'
    ]
  },
  {
    id: 'food-multigrain',
    term: 'Made with Whole Grains / Made with Multigrain',
    category: 'food',
    marketingClaim: 'Packed with dense nutrient-rich whole grains and fiber.',
    realMeaning: 'The primary ingredient is often refined white flour (bleached enriched wheat flour). "Multigrain" simply means multiple types of refined grains were used.',
    impactLevel: 'medium',
    redFlags: ['"Enriched Wheat Flour" listed first', 'Caramel color added to mimic whole wheat'],
    whatToLookFor: 'Ensure "100% Whole Wheat" or "100% Whole Grain" is the very first item on the ingredient list.',
    researchQuestions: [
      'Why does refining grain strip away essential nutrients?',
      'How does grain processing affect glycemic index?'
    ]
  },
  {
    id: 'tech-free-tier',
    term: 'Free Forever Plan',
    category: 'tech',
    marketingClaim: 'You will never have to pay a single penny for access to this tool.',
    realMeaning: 'Your personal data, usage telemetry, and generated content are monetized, trained upon by AI models, or key features will be progressively throttled behind paywalls.',
    impactLevel: 'high',
    redFlags: ['Vague privacy policy', 'Mandatory account creation with broad data sharing terms'],
    whatToLookFor: 'Check data export policies, data retention terms, and privacy settings.',
    researchQuestions: [
      'How do "free" tech services convert user interactions into data assets?',
      'What are the hidden infrastructure costs passed onto free users?'
    ]
  },
  {
    id: 'tech-end-to-end',
    term: 'End-to-End Encrypted (E2EE)',
    category: 'tech',
    marketingClaim: 'Nobody, not even us, can read your messages or access your files.',
    realMeaning: 'While message content may be encrypted, metadata (who you talked to, when, IP address, device specs) is often unencrypted and collected for analysis or compliance.',
    impactLevel: 'medium',
    redFlags: ['Cloud backups enabled by default without encryption key ownership', 'Proprietary non-audited crypto libraries'],
    whatToLookFor: 'Open-source code audits, zero-knowledge architecture, and local key management options.',
    researchQuestions: [
      'What metadata can be extracted even when message payloads are encrypted?',
      'What is zero-knowledge architecture vs standard encryption?'
    ]
  },
  {
    id: 'sust-eco-friendly',
    term: 'Eco-Friendly / Environmentally Friendly',
    category: 'sustainability',
    marketingClaim: 'Purchasing this product directly helps the planet and reduces climate impact.',
    realMeaning: 'A broad, unregulated buzzword ("greenwashing"). Lacks specific measurement standards or third-party verification.',
    impactLevel: 'high',
    redFlags: ['Green leaves on packaging with zero certification logos', 'Vague statements like "Better for Earth"'],
    whatToLookFor: 'Third-party certifications like Cradle to Cradle, Fair Trade, EPEAT, or FSC Certified.',
    researchQuestions: [
      'What criteria are required for third-party eco-certifications?',
      'How does greenwashing impact consumer behavior and regulatory policy?'
    ]
  },
  {
    id: 'sust-net-zero',
    term: 'Net Zero / Carbon Neutral',
    category: 'sustainability',
    marketingClaim: 'This company produces zero net greenhouse gas emissions into the atmosphere.',
    realMeaning: 'Often relies heavily on buying cheap carbon offsets (e.g., tree planting schemes) rather than actually reducing operational emissions.',
    impactLevel: 'high',
    redFlags: ['No distinction between Scope 1, 2, and 3 emissions', 'Heavy reliance on unverified offset credits'],
    whatToLookFor: 'Science Based Targets initiative (SBTi) validation and transparent Scope 1-3 disclosures.',
    researchQuestions: [
      'How are carbon offset credits audited and calculated?',
      'What is the difference between direct emission reduction and carbon offsetting?'
    ]
  },
  {
    id: 'fin-zero-apr',
    term: '0% APR Intro Rate',
    category: 'finance',
    marketingClaim: 'Borrow money completely interest-free with no catch!',
    realMeaning: 'If the balance is not paid off in full before the promo period ends, deferred interest rates (often 25-30%+) may retroactively apply to the original balance.',
    impactLevel: 'high',
    redFlags: ['"Deferred Interest" clause in fine print', 'High balance transfer fees (3-5%)'],
    whatToLookFor: 'Check if interest is waived or merely deferred, and mark the exact promotional expiry date.',
    researchQuestions: [
      'How does deferred interest work mathematically vs true zero-interest grace periods?',
      'What percentage of promotional APR users end up paying interest?'
    ]
  },
  {
    id: 'res-statistically-significant',
    term: 'Statistically Significant Difference',
    category: 'research',
    marketingClaim: 'Proven scientifically beyond doubt to cause a major real-world improvement.',
    realMeaning: 'The outcome p-value was < 0.05, meaning the result likely wasn\'t random chance. However, the actual real-world effect size might be tiny or practically irrelevant.',
    impactLevel: 'medium',
    redFlags: ['P-hacking', 'Small sample size (N < 30)', 'Confounding variables omitted'],
    whatToLookFor: 'Effect size metrics (e.g., Cohen\'s d, relative risk reduction vs absolute risk reduction) and sample sizes.',
    researchQuestions: [
      'Why is effect size often more meaningful than statistical significance?',
      'What is the replication crisis in scientific research?'
    ]
  },
  {
    id: 'res-peer-reviewed',
    term: 'Peer-Reviewed Study Shows...',
    category: 'research',
    marketingClaim: 'Irrefutable consensus fact verified by top global scientists.',
    realMeaning: 'Two or three peer reviewers reviewed the manuscript. It doesn\'t guarantee the study has been replicated, nor does it represent scientific consensus.',
    impactLevel: 'medium',
    redFlags: ['Predatory journals', 'Conflicts of interest/funding disclosures missing', 'Single study generalized to human populations'],
    whatToLookFor: 'Meta-analyses, systematic reviews, journal impact factor, and independent replication studies.',
    researchQuestions: [
      'How can you evaluate the credibility of a academic journal?',
      'What is the difference between a single clinical trial and a systematic review?'
    ]
  }
];

export const LabelDecoder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLabel, setSelectedLabel] = useState<LabelEntry | null>(PRESET_LABELS[0]);
  
  // Custom analysis generator state
  const [customInput, setCustomInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customAnalysis, setCustomAnalysis] = useState<LabelEntry | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Labels' },
    { id: 'food', label: 'Food & Health' },
    { id: 'tech', label: 'Tech & Privacy' },
    { id: 'sustainability', label: 'Sustainability' },
    { id: 'finance', label: 'Finance & Legal' },
    { id: 'research', label: 'Academic & Research' }
  ];

  const filteredLabels = useMemo(() => {
    return PRESET_LABELS.filter((item) => {
      const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.marketingClaim.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.realMeaning.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCategory]);

  const handleCustomAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    setIsAnalyzing(true);
    setCustomAnalysis(null);

    // Simulate real-time contextual analysis decoding engine
    setTimeout(() => {
      const termLower = customInput.toLowerCase();
      let matchedCategory: LabelEntry['category'] = 'tech';
      
      if (termLower.includes('organic') || termLower.includes('sugar') || termLower.includes('fat') || termLower.includes('keto')) {
        matchedCategory = 'food';
      } else if (termLower.includes('eco') || termLower.includes('recycle') || termLower.includes('green') || termLower.includes('clean')) {
        matchedCategory = 'sustainability';
      } else if (termLower.includes('rate') || termLower.includes('fee') || termLower.includes('bank') || termLower.includes('guarantee')) {
        matchedCategory = 'finance';
      } else if (termLower.includes('study') || termLower.includes('proven') || termLower.includes('trial') || termLower.includes('data')) {
        matchedCategory = 'research';
      }

      const generatedResult: LabelEntry = {
        id: `custom-${Date.now()}`,
        term: customInput,
        category: matchedCategory,
        marketingClaim: `Implies a premium, safe, or standardized quality regarding "${customInput}".`,
        realMeaning: `The term "${customInput}" often serves as a marketing anchor designed to leverage cognitive biases. Unless verified by specific regulatory frameworks, it may hide trade-offs, fine print caveats, or omissions.`,
        impactLevel: 'medium',
        redFlags: [
          `Lack of clear regulatory definitions for "${customInput}"`,
          'Absence of third-party audit credentials',
          'Vague framing without quantifiable metrics'
        ],
        whatToLookFor: `Investigate specific standardized metrics, explicit disclosures, and external peer or regulatory validation behind "${customInput}".`,
        researchQuestions: [
          `What exact standard or law governs the usage of the term "${customInput}"?`,
          `What hidden operational trade-offs or secondary costs exist behind "${customInput}"?`
        ]
      };

      setCustomAnalysis(generatedResult);
      setSelectedLabel(generatedResult);
      setIsAnalyzing(false);
    }, 600);
  };

  const handleCopyQuestions = (questions: string[], labelId: string) => {
    const textToCopy = `Research Questions for "${selectedLabel?.term}":\n` + questions.map((q, idx) => `${idx + 1}. ${q}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(labelId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getImpactBadge = (level: LabelEntry['impactLevel']) => {
    switch (level) {
      case 'high':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"><AlertTriangle className="w-3 h-3" /> High Discrepancy</span>;
      case 'medium':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20"><ShieldAlert className="w-3 h-3" /> Moderate Caution</span>;
      case 'low':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"><Info className="w-3 h-3" /> Standard Term</span>;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header Banner */}
      <header className="border-b border-slate-800 pb-6 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                Label & Term Decoder
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Translate marketing jargon, ambiguous labels, and fine print into real-world meaning and actionable research.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Database: <strong>{PRESET_LABELS.length} Core Terms</strong></span>
          </div>
        </div>
      </header>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Custom Term + Library Browser */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Custom Term Input Box */}
          <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            <h2 className="text-base font-semibold text-indigo-300 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Custom Label Analyzer
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Type any term, label, or claim to generate a real-meaning translation & research breakdown.
            </p>
            <form onSubmit={handleCustomAnalyze} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 'Gluten Free', 'Zero Trust', 'Biodegradable'..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition"
              />
              <button
                type="submit"
                disabled={isAnalyzing || !customInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Decode</span>
                )}
              </button>
            </form>
          </div>

          {/* Search & Category Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search database of common terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-slate-600 transition"
              />
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Label Selector List */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-3 max-h-[420px] overflow-y-auto space-y-2">
            {filteredLabels.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No matching terms found. Try analyzing a custom term above.
              </div>
            ) : (
              filteredLabels.map((item) => {
                const isSelected = selectedLabel?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedLabel(item)}
                    className={`p-3.5 rounded-xl cursor-pointer border transition flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-slate-800/90 border-indigo-500/50 shadow-md'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-indigo-400" />
                        <h3 className="text-sm font-semibold text-slate-100">{item.term}</h3>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{item.marketingClaim}</p>
                    </div>
                    <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-indigo-400 translate-x-0.5' : 'text-slate-600'}`} />
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column: Detailed Decoding & Research Panel */}
        <div className="lg:col-span-7">
          {selectedLabel ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl relative">
              
              {/* Card Header */}
              <div className="border-b border-slate-800 pb-5 space-y-3">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                      Category: {selectedLabel.category}
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      {selectedLabel.term}
                    </h2>
                  </div>
                  {getImpactBadge(selectedLabel.impactLevel)}
                </div>
              </div>

              {/* Translation Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Surface Marketing Claim */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                    <HelpCircle className="w-4 h-4" />
                    <span>Marketing / Surface Claim</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    "{selectedLabel.marketingClaim}"
                  </p>
                </div>

                {/* Real Meaning */}
                <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span>Decoded Real Meaning</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {selectedLabel.realMeaning}
                  </p>
                </div>
              </div>

              {/* Red Flags & Fine Print */}
              <div className="space-y-3 bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" /> Fine Print Red Flags
                </h3>
                <ul className="space-y-2">
                  {selectedLabel.redFlags.map((flag, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Smart Consumer / Researcher Advice */}
              <div className="space-y-2 bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" /> What To Look For / Verification Standard
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedLabel.whatToLookFor}
                </p>
              </div>

              {/* Follow-up Research Questions Section */}
              <div className="border-t border-slate-800 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-semibold text-white">
                      Research & Investigation Prompts
                    </h3>
                  </div>
                  <button
                    onClick={() => handleCopyQuestions(selectedLabel.researchQuestions, selectedLabel.id)}
                    className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg transition"
                  >
                    {copiedId === selectedLabel.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Prompts</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2">
                  {selectedLabel.researchQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-xs text-slate-300 flex items-start gap-3"
                    >
                      <span className="font-mono text-indigo-400 font-bold text-xs">{idx + 1}.</span>
                      <p className="flex-1 leading-normal">{q}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3 min-h-[400px]">
              <HelpCircle className="w-10 h-10 text-slate-600" />
              <p className="text-sm">Select a label from the list or enter a term above to decode its meaning.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LabelDecoder;