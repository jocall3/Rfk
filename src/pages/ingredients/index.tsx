import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Helper SVG Icons to ensure zero external dependency issues
const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const ShieldAlertIcon = () => (
  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6 text-gray-500 hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export type HazardLevel = 'Low' | 'Moderate' | 'High' | 'Variable';

export interface RelatedQuestion {
  id: string;
  title: string;
  type: 'answered' | 'research';
}

export interface Ingredient {
  id: string;
  name: string;
  casNumber: string;
  synonyms: string[];
  category: string;
  ewgScore: number; // 1-10 scale
  hazardLevel: HazardLevel;
  summary: string;
  functions: string[];
  regulatoryStatus: {
    fda: string;
    eu: string;
    caProp65: boolean;
    reachStatus: string;
  };
  safetyDetails: {
    irritationPotential: string;
    bioaccumulation: string;
    carcinogenicity: string;
    environmentalImpact: string;
  };
  relatedQuestions: RelatedQuestion[];
}

const INGREDIENTS_DATA: Ingredient[] = [
  {
    id: 'niacinamide',
    name: 'Niacinamide (Vitamin B3)',
    casNumber: '98-92-0',
    synonyms: ['Nicotinamide', '3-Pyridinecarboxamide', 'Vitamin B3'],
    category: 'Active / Skin Conditioning',
    ewgScore: 1,
    hazardLevel: 'Low',
    summary: 'Water-soluble vitamin that works with natural skin substances to visibly improve enlarged pores, uneven skin tone, fine lines, and dullness.',
    functions: ['Skin Conditioning', 'Anti-Inflammatory', 'Barrier Repair', 'Sebum Control'],
    regulatoryStatus: {
      fda: 'GRAS (Generally Recognized as Safe) in foods, approved for cosmetics',
      eu: 'Allowed without specific concentration limits in cosmetics',
      caProp65: false,
      reachStatus: 'Registered under REACH'
    },
    safetyDetails: {
      irritationPotential: 'Very low at standard cosmetic concentrations (2-10%)',
      bioaccumulation: 'Low potential, rapidly metabolized',
      carcinogenicity: 'Not classified as carcinogenic',
      environmentalImpact: 'Biodegradable, minimal aquatic toxicity'
    },
    relatedQuestions: [
      { id: 'q01', title: 'How does Niacinamide influence epidermal barrier lipid synthesis?', type: 'answered' },
      { id: 'q21', title: 'What are the synergistic effects of Niacinamide with Zinc PCA on sebum secretion?', type: 'research' }
    ]
  },
  {
    id: 'salicylic-acid',
    name: 'Salicylic Acid',
    casNumber: '69-72-7',
    synonyms: ['2-Hydroxybenzoic acid', 'BHA'],
    category: 'Beta Hydroxy Acid (BHA) / Exfoliant',
    ewgScore: 3,
    hazardLevel: 'Moderate',
    summary: 'Lipophilic beta-hydroxy acid that penetrates oil-clogged pores to exfoliate dead skin cells and clear acne.',
    functions: ['Exfoliant', 'Anti-Acne Agent', 'Keratolytic', 'Preservative'],
    regulatoryStatus: {
      fda: 'OTC monograph allowed up to 2.0% for acne treatments',
      eu: 'Max 2.0% in leave-on cosmetics; prohibited in products for children under 3',
      caProp65: false,
      reachStatus: 'Substance of evaluation for suspected endocrine disruption'
    },
    safetyDetails: {
      irritationPotential: 'Moderate skin and ocular irritant at elevated concentrations',
      bioaccumulation: 'Low bioaccumulation potential',
      carcinogenicity: 'No evidence of carcinogenicity; may increase photosensitivity',
      environmentalImpact: 'Moderate acute aquatic toxicity'
    },
    relatedQuestions: [
      { id: 'q02', title: 'What is the comparative efficacy of Salicylic Acid vs Glycolic Acid in stratum corneum exfoliation?', type: 'answered' },
      { id: 'q22', title: 'Does long-term topical Salicylic Acid exposure disrupt cutaneous microbiome diversity?', type: 'research' }
    ]
  },
  {
    id: 'titanium-dioxide',
    name: 'Titanium Dioxide',
    casNumber: '13463-67-7',
    synonyms: ['CI 77891', 'Titania', 'Titanium(IV) oxide'],
    category: 'UV Filter / Colorant',
    ewgScore: 2,
    hazardLevel: 'Variable',
    summary: 'Inorganic physical mineral UV filter reflecting UVA and UVB radiation; widely used in sunscreen and pigment formulations.',
    functions: ['UV Absorber/Filter', 'Opacifying Agent', 'Colorant'],
    regulatoryStatus: {
      fda: 'Approved active sunscreen ingredient up to 25%',
      eu: 'Banned as food additive (E171) in 2022; allowed in cosmetics up to 25% (nano rules apply)',
      caProp65: true, // Inhalable airborne particles of respirable size
      reachStatus: 'Classified as suspected carcinogen by inhalation (Category 2)'
    },
    safetyDetails: {
      irritationPotential: 'Inert on intact skin; non-irritating',
      bioaccumulation: 'Low systemic absorption through dermal barrier',
      carcinogenicity: 'Classified IARC Group 2B (inhalation of respirable powder)',
      environmentalImpact: 'Nanoparticle forms exhibit potential bioaccumulation in aquatic life'
    },
    relatedQuestions: [
      { id: 'q03', title: 'How do micronized vs nano Titanium Dioxide formulations differ in ROS generation under solar light?', type: 'answered' },
      { id: 'q23', title: 'What is the chronic ecological impacts of Titanium Dioxide nanoparticles on marine corals?', type: 'research' }
    ]
  },
  {
    id: 'phenoxyethanol',
    name: 'Phenoxyethanol',
    casNumber: '122-99-6',
    synonyms: ['2-Phenoxyethanol', 'Ethylene glycol Monophenyl Ether'],
    category: 'Preservative',
    ewgScore: 4,
    hazardLevel: 'Moderate',
    summary: 'A broad-spectrum aromatic ether preservative widely substituted for parabens in cosmetic and personal care products.',
    functions: ['Preservative', 'Antimicrobial Agent', 'Fixative for Perfumes'],
    regulatoryStatus: {
      fda: 'Permitted as cosmetic preservative; restricted in infant products',
      eu: 'Restricted to maximum 1.0% concentration in ready-for-use preparations',
      caProp65: false,
      reachStatus: 'Registered under REACH with restrictions'
    },
    safetyDetails: {
      irritationPotential: 'Mild skin and eye irritant; risk of contact dermatitis',
      bioaccumulation: 'Low potential for bioaccumulation',
      carcinogenicity: 'Not classified as a carcinogen',
      environmentalImpact: 'Moderate aquatic toxicity; readily biodegradable'
    },
    relatedQuestions: [
      { id: 'q04', title: 'Is Phenoxyethanol a safer alternative to Parabens in personal care preservation?', type: 'answered' },
      { id: 'q24', title: 'What are the synergetic antimicrobial limits when combining Phenoxyethanol with Ethylhexylglycerin?', type: 'research' }
    ]
  },
  {
    id: 'retinol',
    name: 'Retinol (Vitamin A)',
    casNumber: '68-26-8',
    synonyms: ['Vitamin A1', 'All-trans-Retinol'],
    category: 'Active / Anti-Aging',
    ewgScore: 6,
    hazardLevel: 'High',
    summary: 'A potent vitamin A derivative that stimulates cellular turnover and collagen synthesis, widely used for anti-aging and acne control.',
    functions: ['Skin Conditioning', 'Anti-Aging', 'Cell Renewal Agent'],
    regulatoryStatus: {
      fda: 'OTC ingredient; prescription required for higher potency retinoids like tretinoin',
      eu: 'Capped at 0.3% in leave-on body/face cosmetics under SCCS 2023 regulations',
      caProp65: true, // Developmental toxicity at high oral doses
      reachStatus: 'Registered under REACH; high scrutiny regarding reproductive toxicity'
    },
    safetyDetails: {
      irritationPotential: 'High risk of retinization (dryness, redness, peeling)',
      bioaccumulation: 'Can accumulate in liver tissues upon systemic exposure',
      carcinogenicity: 'Photocarcinogenicity potential under direct sunlight exposure',
      environmentalImpact: 'Toxic to aquatic organisms with long-lasting effects'
    },
    relatedQuestions: [
      { id: 'q05', title: 'What are the molecular mechanisms of Retinol conversion to Retinoic Acid in keratinocytes?', type: 'answered' },
      { id: 'q25', title: 'How does liposomal encapsulation of Retinol alter transdermal bioavailability and irritation profile?', type: 'research' }
    ]
  },
  {
    id: 'oxybenzone',
    name: 'Oxybenzone (Benzophenone-3)',
    casNumber: '131-57-7',
    synonyms: ['BP-3', '2-Hydroxy-4-methoxybenzophenone'],
    category: 'Chemical UV Filter',
    ewgScore: 8,
    hazardLevel: 'High',
    summary: 'Organic compound absorbing UVA and UVB radiation, controversial due to potential endocrine disruption and coral bleaching.',
    functions: ['UV Absorber', 'Light Stabilizer'],
    regulatoryStatus: {
      fda: 'Approved up to 6%; undergoing re-evaluation under FDA Sunscreen Innovation Act',
      eu: 'Max 6% limit in body cosmetics; restricted warning required',
      caProp65: false,
      reachStatus: 'Under review as Endocrine Disrupting Chemical (EDC)'
    },
    safetyDetails: {
      irritationPotential: 'Known photoallergen and skin sensitizer',
      bioaccumulation: 'High systemic absorption detected in human blood, urine, and breast milk',
      carcinogenicity: 'Equivocal evidence of carcinogenic activity',
      environmentalImpact: 'Severe coral bleaching catalyst; banned in Hawaii and Key West'
    },
    relatedQuestions: [
      { id: 'q06', title: 'What is the toxicological evidence for Oxybenzone as an endocrine disrupting chemical?', type: 'answered' },
      { id: 'q26', title: 'What photo-degradation products stem from Oxybenzone in chlorinated swimming pools?', type: 'research' }
    ]
  },
  {
    id: 'methylparaben',
    name: 'Methylparaben',
    casNumber: '99-76-3',
    synonyms: ['Methyl 4-hydroxybenzoate', 'E218'],
    category: 'Preservative',
    ewgScore: 4,
    hazardLevel: 'Moderate',
    summary: 'Short-chain ester of p-hydroxybenzoic acid used as an antifungal and preservative in cosmetics, food, and pharmaceuticals.',
    functions: ['Preservative', 'Antifungal Agent'],
    regulatoryStatus: {
      fda: 'GRAS status in food; approved in cosmetics up to 0.4% individual limit',
      eu: 'Maximum allowed 0.4% concentration for single ester',
      caProp65: false,
      reachStatus: 'Evaluated for weak estrogenic activity'
    },
    safetyDetails: {
      irritationPotential: 'Low dermal irritation risk; potential contact allergen',
      bioaccumulation: 'Low; rapidly metabolized and excreted in urine',
      carcinogenicity: 'Weak estrogenic potency; no direct mutagenic proof',
      environmentalImpact: 'Detected in urban wastewater streams; moderate aquatic toxicity'
    },
    relatedQuestions: [
      { id: 'q07', title: 'Do short-chain parabens exert measurable endocrine activity at human usage levels?', type: 'answered' },
      { id: 'q27', title: 'What are the metabolic kinetics of Parabens across stratum corneum barrier intactness?', type: 'research' }
    ]
  },
  {
    id: 'pfas-pfoa',
    name: 'Perfluorooctanoic Acid (PFOA / PFAS)',
    casNumber: '335-67-1',
    synonyms: ['PFOA', 'Perfluorooctanoate', 'Forever Chemicals'],
    category: 'Fluorosurfactant / Impurity',
    ewgScore: 10,
    hazardLevel: 'High',
    summary: 'Synthetic organofluorine compound notorious for extreme environmental persistence and systemic human health hazards.',
    functions: ['Water Repellent', 'Surfactant', 'Emulsifier'],
    regulatoryStatus: {
      fda: 'Phased out from food contact substances; restricted in cosmetics',
      eu: 'Banned under Stockholm Convention and REACH Annex XVII',
      caProp65: true, // Carcinogen and reproductive toxin
      reachStatus: 'Substance of Very High Concern (SVHC) - Restricted'
    },
    safetyDetails: {
      irritationPotential: 'Corrosive in pure form; systemic toxicity main hazard',
      bioaccumulation: 'Extremely high half-life in human body (3-5 years)',
      carcinogenicity: 'Classified as Carcinogenic to humans (IARC Group 1)',
      environmentalImpact: 'Non-biodegradable; extreme global bioaccumulation'
    },
    relatedQuestions: [
      { id: 'q08', title: 'What are the physiological persistence rates and bioaccumulation factors of PFAS compounds?', type: 'answered' },
      { id: 'q28', title: 'What novel remediation technologies effectively degrade short-chain vs long-chain PFAS in soil?', type: 'research' }
    ]
  },
  {
    id: 'sodium-lauryl-sulfate',
    name: 'Sodium Lauryl Sulfate (SLS)',
    casNumber: '151-21-3',
    synonyms: ['SLS', 'Sodium Dodecyl Sulfate', 'SDS'],
    category: 'Anionic Surfactant',
    ewgScore: 3,
    hazardLevel: 'Moderate',
    summary: 'Potent anionic surfactant used for foaming and cleansing, frequently used as positive control standard for skin irritation studies.',
    functions: ['Surfactant', 'Foaming Agent', 'Emulsifier'],
    regulatoryStatus: {
      fda: 'Approved indirect food additive; safe in cosmetic rinse-off formulas',
      eu: 'Allowed without specific limit; wash-off applications recommended',
      caProp65: false,
      reachStatus: 'Registered under REACH'
    },
    safetyDetails: {
      irritationPotential: 'High skin and eye irritant in leave-on concentrations >1%',
      bioaccumulation: 'Low potential for bioaccumulation',
      carcinogenicity: 'Not carcinogenic; frequently confused with SLES containing 1,4-dioxane',
      environmentalImpact: 'Toxic to aquatic organisms in untreated effluent'
    },
    relatedQuestions: [
      { id: 'q09', title: 'How does Sodium Lauryl Sulfate disrupt lipid bilayer integrity in keratinocyte membranes?', type: 'answered' },
      { id: 'q29', title: 'Can alkyl polyglucosides completely replace sulfated surfactants without sacrificing detergent power?', type: 'research' }
    ]
  },
  {
    id: 'ascorbic-acid',
    name: 'L-Ascorbic Acid (Vitamin C)',
    casNumber: '50-81-7',
    synonyms: ['Ascorbic Acid', 'Vitamin C', 'L-Ascorbate'],
    category: 'Active / Antioxidant',
    ewgScore: 1,
    hazardLevel: 'Low',
    summary: 'Potent water-soluble antioxidant that neutralizes free radicals, boosts collagen synthesis, and brightens hyperpigmentation.',
    functions: ['Antioxidant', 'Skin Brightener', 'Collagen Booster'],
    regulatoryStatus: {
      fda: 'GRAS dietary supplement and food preservative; cosmetic safe',
      eu: 'Approved for cosmetic and food applications without restricted caps',
      caProp65: false,
      reachStatus: 'Registered under REACH'
    },
    safetyDetails: {
      irritationPotential: 'Low pH required (pH < 3.5) may cause mild stinging',
      bioaccumulation: 'Zero bioaccumulation; excess excreted via urinary tract',
      carcinogenicity: 'Anticarcinogenic properties via ROS scavenging',
      environmentalImpact: 'Eco-friendly and rapidly biodegradable'
    },
    relatedQuestions: [
      { id: 'q10', title: 'What is the optimal pH and stabilization strategy for L-Ascorbic Acid topical delivery?', type: 'answered' },
      { id: 'q30', title: 'How does Ferulic Acid and Tocopherol co-formulation alter Vitamin C photodegradation half-life?', type: 'research' }
    ]
  }
];

export default function IngredientDictionary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHazard, setSelectedHazard] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    INGREDIENTS_DATA.forEach(item => set.add(item.category));
    return ['All', ...Array.from(set)];
  }, []);

  // Filter logic
  const filteredIngredients = useMemo(() => {
    return INGREDIENTS_DATA.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.casNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.synonyms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesHazard = selectedHazard === 'All' || item.hazardLevel === selectedHazard;
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

      return matchesSearch && matchesHazard && matchesCategory;
    });
  }, [searchTerm, selectedHazard, selectedCategory]);

  const getEwgBadgeColor = (score: number) => {
    if (score <= 2) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (score <= 6) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  const getHazardBadgeColor = (level: HazardLevel) => {
    switch (level) {
      case 'Low': return 'bg-green-50 text-green-700 border-green-200';
      case 'Moderate': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'High': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <>
      <Head>
        <title>Chemical Ingredient Dictionary | Research Portal</title>
        <meta name="description" content="Chemical safety profiles, regulatory status (FDA, EU, REACH, Prop 65), and related research questions for ingredients in cosmetics and toxicology." />
      </Head>

      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
        {/* Navigation Top Bar */}
        <header className="bg-slate-900 text-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <nav className="text-xs text-slate-400 mb-1">
                  <Link href="/" className="hover:text-slate-200 transition">Home</Link> / 
                  <span className="text-slate-200 font-medium ml-1">Ingredient Dictionary</span>
                </nav>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Chemical & Ingredient Dictionary
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Comprehensive toxicology metrics, regulatory status, and scientific research mapping.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
              <div className="p-3 rounded-lg bg-blue-50 mr-4">
                <InfoIcon />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">{INGREDIENTS_DATA.length}</div>
                <div className="text-xs text-slate-500 font-medium">Indexed Chemicals</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
              <div className="p-3 rounded-lg bg-emerald-50 mr-4">
                <ShieldCheckIcon />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-700">
                  {INGREDIENTS_DATA.filter(i => i.hazardLevel === 'Low').length}
                </div>
                <div className="text-xs text-slate-500 font-medium">Low Hazard / Safe</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
              <div className="p-3 rounded-lg bg-amber-50 mr-4">
                <ShieldAlertIcon />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-700">
                  {INGREDIENTS_DATA.filter(i => i.hazardLevel === 'Moderate').length}
                </div>
                <div className="text-xs text-slate-500 font-medium">Moderate Caution</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
              <div className="p-3 rounded-lg bg-rose-50 mr-4">
                <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-rose-700">
                  {INGREDIENTS_DATA.filter(i => i.hazardLevel === 'High').length}
                </div>
                <div className="text-xs text-slate-500 font-medium">High Hazard / Restricted</div>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by ingredient name, CAS number, synonym..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2 text-sm text-slate-600 font-medium">
                  <FilterIcon />
                  <span>Filters:</span>
                </div>

                {/* Hazard Level Dropdown */}
                <select
                  value={selectedHazard}
                  onChange={(e) => setSelectedHazard(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All">All Hazard Levels</option>
                  <option value="Low">Low Hazard</option>
                  <option value="Moderate">Moderate Hazard</option>
                  <option value="High">High Hazard</option>
                </select>

                {/* Category Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'All' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>

                {(searchTerm || selectedHazard !== 'All' || selectedCategory !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedHazard('All');
                      setSelectedCategory('All');
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Ingredient Grid */}
          {filteredIngredients.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center my-8">
              <p className="text-slate-500 text-base font-medium">No ingredients match your current filter criteria.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedHazard('All'); setSelectedCategory('All'); }}
                className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIngredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5">
                    {/* Header with name & EWG Score */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 leading-snug">
                          {ingredient.name}
                        </h2>
                        <span className="text-xs font-mono text-slate-500">
                          CAS: {ingredient.casNumber}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getEwgBadgeColor(ingredient.ewgScore)}`}>
                          EWG: {ingredient.ewgScore}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 my-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getHazardBadgeColor(ingredient.hazardLevel)}`}>
                        {ingredient.hazardLevel} Risk
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {ingredient.category}
                      </span>
                      {ingredient.regulatoryStatus.caProp65 && (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          CA Prop 65
                        </span>
                      )}
                    </div>

                    {/* Summary */}
                    <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                      {ingredient.summary}
                    </p>

                    {/* Function Badges */}
                    <div className="mb-4">
                      <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1">Functions</div>
                      <div className="flex flex-wrap gap-1">
                        {ingredient.functions.map((fn, idx) => (
                          <span key={idx} className="text-[11px] px-2 py-0.5 bg-slate-50 text-slate-600 rounded border border-slate-200">
                            {fn}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      {ingredient.relatedQuestions.length} Related Question(s)
                    </span>
                    <button
                      onClick={() => setSelectedIngredient(ingredient)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition inline-flex items-center"
                    >
                      View Full Dossier →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Ingredient Detail Modal / Modal Drawer */}
        {selectedIngredient && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
            <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
              
              {/* Modal Header */}
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${selectedIngredient.hazardLevel === 'Low' ? 'bg-emerald-500' : selectedIngredient.hazardLevel === 'Moderate' ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                    <h2 className="text-xl font-bold text-slate-900">{selectedIngredient.name}</h2>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">CAS Registry: {selectedIngredient.casNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedIngredient(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 transition"
                  aria-label="Close details"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                
                {/* Synonyms & Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Synonyms</span>
                    <span className="text-xs font-medium text-slate-700">{selectedIngredient.synonyms.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">EWG Safety Rating</span>
                    <span className="text-sm font-bold text-slate-800">{selectedIngredient.ewgScore} / 10</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Hazard Profile</span>
                    <span className="text-sm font-bold text-slate-800">{selectedIngredient.hazardLevel}</span>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Description & Overview</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedIngredient.summary}</p>
                </div>

                {/* Regulatory Status */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Regulatory Status & Directives</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-800 mb-1">FDA Status (USA)</div>
                      <div className="text-slate-600">{selectedIngredient.regulatoryStatus.fda}</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-800 mb-1">EU Cosmetic Regulation</div>
                      <div className="text-slate-600">{selectedIngredient.regulatoryStatus.eu}</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-800 mb-1">REACH Registration</div>
                      <div className="text-slate-600">{selectedIngredient.regulatoryStatus.reachStatus}</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-800 mb-1">California Prop 65 Listed</div>
                      <div className={selectedIngredient.regulatoryStatus.caProp65 ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                        {selectedIngredient.regulatoryStatus.caProp65 ? 'Yes - Specific Safe Harbor Warnings Apply' : 'No Listed Warning Required'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Safety Details */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Toxicology & Safety Profile</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                      <span className="font-semibold text-slate-700">Irritation / Sensitization:</span>
                      <span className="text-slate-600">{selectedIngredient.safetyDetails.irritationPotential}</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                      <span className="font-semibold text-slate-700">Bioaccumulation Potential:</span>
                      <span className="text-slate-600">{selectedIngredient.safetyDetails.bioaccumulation}</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                      <span className="font-semibold text-slate-700">Carcinogenicity / Mutagenicity:</span>
                      <span className="text-slate-600">{selectedIngredient.safetyDetails.carcinogenicity}</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                      <span className="font-semibold text-slate-700">Environmental Ecotoxicity:</span>
                      <span className="text-slate-600">{selectedIngredient.safetyDetails.environmentalImpact}</span>
                    </div>
                  </div>
                </div>

                {/* Related Questions */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Cross-Referenced Research Questions
                  </h3>
                  <div className="space-y-2">
                    {selectedIngredient.relatedQuestions.map((q) => (
                      <div
                        key={q.id}
                        className="p-3 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between transition"
                      >
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${q.type === 'answered' ? 'bg-indigo-600 text-white' : 'bg-purple-600 text-white'}`}>
                            {q.type === 'answered' ? 'Answered Question' : 'Research Proposal'}
                          </span>
                          <span className="text-xs font-medium text-slate-800">{q.title}</span>
                        </div>
                        <Link
                          href={`/questions#${q.id}`}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-900 whitespace-nowrap ml-2"
                        >
                          View Question <ExternalLinkIcon />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setSelectedIngredient(null)}
                  className="px-4 py-2 bg-slate-800 text-white text-xs font-medium rounded-lg hover:bg-slate-700 transition"
                >
                  Close Dossier
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );
}