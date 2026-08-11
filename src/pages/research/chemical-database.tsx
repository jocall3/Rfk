import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Search,
  Filter,
  ShieldAlert,
  FlaskConical,
  Download,
  Info,
  X,
  ExternalLink,
  Grid,
  List,
  BookOpen,
  FileText,
  AlertTriangle,
  Activity,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';

interface ChemicalRecord {
  id: string;
  name: string;
  casNumber: string;
  formula: string;
  category: 'Heavy Metals' | 'Solvents' | 'PFAS' | 'Pesticides' | 'Endocrine Disruptors' | 'Industrial Hazards' | 'Plastics & Additives';
  toxicityScore: number; // 1 to 10
  toxicityClass: 'Low' | 'Moderate' | 'High' | 'Severe';
  ld50: string; // e.g. "50 mg/kg (oral, rat)"
  primaryHazards: string[];
  regulatoryStatus: 'Banned' | 'Restricted' | 'Monitored' | 'Permitted';
  targetOrgans: string[];
  relatedResearchQuestionId?: number; // Linking back to research framework
  description: string;
  environmentalPersistence: 'Low' | 'Medium' | 'High' | 'Extremely Persistent';
  bioaccumulation: 'Low' | 'Moderate' | 'High';
}

const CHEMICAL_DATABASE: ChemicalRecord[] = [
  {
    id: 'chem-001',
    name: 'Perfluorooctanoic Acid (PFOA)',
    casNumber: '335-67-1',
    formula: 'C8HF15O2',
    category: 'PFAS',
    toxicityScore: 9.2,
    toxicityClass: 'Severe',
    ld50: '250 mg/kg (oral, rat)',
    primaryHazards: ['Carcinogenic', 'Hepatotoxicity', 'Immunotoxicity', 'Developmental Toxicity'],
    regulatoryStatus: 'Restricted',
    targetOrgans: ['Liver', 'Kidneys', 'Immune System', 'Thyroid'],
    relatedResearchQuestionId: 1,
    description: 'Synthetic fluorinated compound known as a "forever chemical." Highly persistent with bioaccumulative properties in food chains.',
    environmentalPersistence: 'Extremely Persistent',
    bioaccumulation: 'High'
  },
  {
    id: 'chem-002',
    name: 'Bisphenol A (BPA)',
    casNumber: '80-05-7',
    formula: 'C15H16O2',
    category: 'Endocrine Disruptors',
    toxicityScore: 6.8,
    toxicityClass: 'Moderate',
    ld50: '3250 mg/kg (oral, rat)',
    primaryHazards: ['Endocrine Disruption', 'Reproductive Toxicity', 'Behavioral Toxicity'],
    regulatoryStatus: 'Restricted',
    targetOrgans: ['Endocrine System', 'Reproductive Tract', 'Brain'],
    relatedResearchQuestionId: 3,
    description: 'Industrial monomer used primarily in polycarbonate plastics and epoxy resins. Mimics estrogen receptor signaling.',
    environmentalPersistence: 'Medium',
    bioaccumulation: 'Moderate'
  },
  {
    id: 'chem-003',
    name: 'Lead (Pb)',
    casNumber: '7439-92-1',
    formula: 'Pb',
    category: 'Heavy Metals',
    toxicityScore: 9.8,
    toxicityClass: 'Severe',
    ld50: '160 mg/kg (intraperitoneal, rat)',
    primaryHazards: ['Neurotoxicity', 'Nephrotoxicity', 'Hematological Toxicity', 'Teratogenicity'],
    regulatoryStatus: 'Restricted',
    targetOrgans: ['Central Nervous System', 'Blood', 'Kidneys', 'Bones'],
    relatedResearchQuestionId: 5,
    description: 'Cumulative neurotoxic heavy metal without known safe exposure threshold in children.',
    environmentalPersistence: 'Extremely Persistent',
    bioaccumulation: 'High'
  },
  {
    id: 'chem-004',
    name: 'Benzene',
    casNumber: '71-43-2',
    formula: 'C6H6',
    category: 'Solvents',
    toxicityScore: 8.9,
    toxicityClass: 'High',
    ld50: '930 mg/kg (oral, rat)',
    primaryHazards: ['Group 1 Carcinogen', 'Leukemogenic', 'Bone Marrow Toxicity', 'Mutagenic'],
    regulatoryStatus: 'Restricted',
    targetOrgans: ['Bone Marrow', 'Blood System', 'Central Nervous System'],
    relatedResearchQuestionId: 7,
    description: 'Volatile aromatic hydrocarbon widespread in petrochemical industries; primary trigger for acute myeloid leukemia (AML).',
    environmentalPersistence: 'Low',
    bioaccumulation: 'Low'
  },
  {
    id: 'chem-005',
    name: 'Glyphosate',
    casNumber: '1071-83-6',
    formula: 'C3H8NO5P',
    category: 'Pesticides',
    toxicityScore: 6.2,
    toxicityClass: 'Moderate',
    ld50: '5600 mg/kg (oral, rat)',
    primaryHazards: ['Probable Carcinogen', 'Microbiome Disruption', 'Genotoxicity'],
    regulatoryStatus: 'Monitored',
    targetOrgans: ['Gastrointestinal System', 'Liver', 'Dermal'],
    relatedResearchQuestionId: 9,
    description: 'Broad-spectrum systemic herbicide. Inhibits the EPSP synthase pathway in plants and soil microflora.',
    environmentalPersistence: 'Medium',
    bioaccumulation: 'Low'
  },
  {
    id: 'chem-006',
    name: 'Methylmercury',
    casNumber: '22967-92-6',
    formula: 'CH3Hg+',
    category: 'Heavy Metals',
    toxicityScore: 9.9,
    toxicityClass: 'Severe',
    ld50: '26 mg/kg (oral, rat)',
    primaryHazards: ['Severe Neurotoxicity', 'Developmental Damage', 'Ataxia', 'Visual Field Alterations'],
    regulatoryStatus: 'Banned',
    targetOrgans: ['Brain', 'Central Nervous System', 'Fetus'],
    relatedResearchQuestionId: 2,
    description: 'Bioaccumulative organometallic cation responsible for Minamata disease. Crosses blood-brain and placental barriers effortlessly.',
    environmentalPersistence: 'Extremely Persistent',
    bioaccumulation: 'High'
  },
  {
    id: 'chem-007',
    name: 'Polychlorinated Biphenyls (PCB-126)',
    casNumber: '32598-14-4',
    formula: 'C12H4Cl6',
    category: 'Industrial Hazards',
    toxicityScore: 9.5,
    toxicityClass: 'Severe',
    ld50: '1000 mg/kg (oral, rat)',
    primaryHazards: ['Dioxin-like Toxicity', 'Carcinogen', 'Immunotoxicity', 'Endocrine Disruption'],
    regulatoryStatus: 'Banned',
    targetOrgans: ['Liver', 'Immune System', 'Skin', 'Thyroid'],
    relatedResearchQuestionId: 11,
    description: 'Organochlorine contaminant that acts via the aryl hydrocarbon receptor (AhR) signaling pathway.',
    environmentalPersistence: 'Extremely Persistent',
    bioaccumulation: 'High'
  },
  {
    id: 'chem-008',
    name: 'Formaldehyde',
    casNumber: '50-00-0',
    formula: 'CH2O',
    category: 'Industrial Hazards',
    toxicityScore: 7.9,
    toxicityClass: 'High',
    ld50: '100 mg/kg (oral, rat)',
    primaryHazards: ['Nasopharyngeal Carcinogen', 'Respiratory Sensitizer', 'Genotoxicity'],
    regulatoryStatus: 'Restricted',
    targetOrgans: ['Respiratory Tract', 'Eyes', 'Immune System'],
    relatedResearchQuestionId: 14,
    description: 'Pungent volatile organic compound (VOC) widely used in resins and fixatives; potent upper respiratory allergen.',
    environmentalPersistence: 'Low',
    bioaccumulation: 'Low'
  },
  {
    id: 'chem-009',
    name: 'Di(2-ethylhexyl) phthalate (DEHP)',
    casNumber: '117-81-7',
    formula: 'C24H38O4',
    category: 'Plastics & Additives',
    toxicityScore: 7.1,
    toxicityClass: 'High',
    ld50: '30000 mg/kg (oral, rat)',
    primaryHazards: ['Reproductive Toxicity', 'Anti-androgenic', 'Hepatotoxicity'],
    regulatoryStatus: 'Restricted',
    targetOrgans: ['Testes', 'Liver', 'Kidneys'],
    relatedResearchQuestionId: 8,
    description: 'Plasticizer added to PVC to increase flexibility. Leaches easily into food, liquids, and blood bags.',
    environmentalPersistence: 'Medium',
    bioaccumulation: 'Moderate'
  },
  {
    id: 'chem-010',
    name: 'Cadmium',
    casNumber: '7440-43-9',
    formula: 'Cd',
    category: 'Heavy Metals',
    toxicityScore: 9.1,
    toxicityClass: 'Severe',
    ld50: '233 mg/kg (oral, rat)',
    primaryHazards: ['Nephrotoxicity', 'Osteomalacia (Itai-Itai)', 'Lung Carcinogen'],
    regulatoryStatus: 'Restricted',
    targetOrgans: ['Kidneys', 'Skeletal System', 'Lungs'],
    relatedResearchQuestionId: 12,
    description: 'Toxic metal with an extraordinarily long biological half-life in humans (10-30 years), targeting renal tubules.',
    environmentalPersistence: 'Extremely Persistent',
    bioaccumulation: 'High'
  },
  {
    id: 'chem-011',
    name: 'Trichloroethylene (TCE)',
    casNumber: '79-01-6',
    formula: 'C2HCl3',
    category: 'Solvents',
    toxicityScore: 8.4,
    toxicityClass: 'High',
    ld50: '4920 mg/kg (oral, rat)',
    primaryHazards: ['Renal Cell Carcinoma', 'Cardiac Malformations', 'Neurotoxicity'],
    regulatoryStatus: 'Restricted',
    targetOrgans: ['Kidneys', 'Central Nervous System', 'Heart', 'Liver'],
    relatedResearchQuestionId: 15,
    description: 'Chlorinated solvent commonly contaminating groundwater near industrial degreasing facilities.',
    environmentalPersistence: 'Medium',
    bioaccumulation: 'Low'
  },
  {
    id: 'chem-012',
    name: 'Chlorpyrifos',
    casNumber: '2921-88-2',
    formula: 'C9H11Cl3NO3PS',
    category: 'Pesticides',
    toxicityScore: 8.8,
    toxicityClass: 'High',
    ld50: '95 mg/kg (oral, rat)',
    primaryHazards: ['Acetylcholinesterase Inhibitor', 'Developmental Neurotoxicity', 'Acute Toxicity'],
    regulatoryStatus: 'Banned',
    targetOrgans: ['Central Nervous System', 'Peripheral Nervous System'],
    relatedResearchQuestionId: 4,
    description: 'Organophosphate insecticide linked to cognitive deficits and neurodevelopmental disorders in agricultural workers\' children.',
    environmentalPersistence: 'Medium',
    bioaccumulation: 'Moderate'
  },
  {
    id: 'chem-013',
    name: 'Arsenic (Inorganic)',
    casNumber: '7440-38-2',
    formula: 'As',
    category: 'Heavy Metals',
    toxicityScore: 9.7,
    toxicityClass: 'Severe',
    ld50: '15 mg/kg (oral, rat)',
    primaryHazards: ['Skin/Lung/Bladder Cancer', 'Cardiovascular Disease', 'Arsenicosis'],
    regulatoryStatus: 'Restricted',
    targetOrgans: ['Skin', 'Lungs', 'Bladder', 'Vascular Network'],
    relatedResearchQuestionId: 18,
    description: 'Metalloid drinking-water contaminant affecting tens of millions globally through geogenic sources.',
    environmentalPersistence: 'Extremely Persistent',
    bioaccumulation: 'Moderate'
  },
  {
    id: 'chem-014',
    name: 'Atrazine',
    casNumber: '1912-24-9',
    formula: 'C8H14ClN5',
    category: 'Pesticides',
    toxicityScore: 6.9,
    toxicityClass: 'Moderate',
    ld50: '672 mg/kg (oral, rat)',
    primaryHazards: ['Endocrine Disruptor', 'Aromatase Induction', 'Amphibian Demasculinization'],
    regulatoryStatus: 'Monitored',
    targetOrgans: ['Endocrine System', 'Reproductive System'],
    relatedResearchQuestionId: 10,
    description: 'Triazine herbicide causing widespread endocrine disruption in aquatic ecosystems by upregulating estrogen synthesis.',
    environmentalPersistence: 'High',
    bioaccumulation: 'Low'
  },
  {
    id: 'chem-015',
    name: 'Vinyl Chloride',
    casNumber: '75-01-4',
    formula: 'C2H3Cl',
    category: 'Industrial Hazards',
    toxicityScore: 9.0,
    toxicityClass: 'Severe',
    ld50: '500 mg/kg (oral, rat)',
    primaryHazards: ['Hepatic Angiosarcoma', 'Genotoxic Carcinogen', 'Raynaud Phenomenon'],
    regulatoryStatus: 'Restricted',
    targetOrgans: ['Liver', 'Central Nervous System', 'Circulatory System'],
    relatedResearchQuestionId: 16,
    description: 'Colorless gas used in PVC production. Direct cause of rare hepatic angiosarcoma among exposed industrial personnel.',
    environmentalPersistence: 'Low',
    bioaccumulation: 'Low'
  }
];

export default function ChemicalDatabasePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [toxicityFilter, setToxicityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'toxicityScore' | 'casNumber'>('toxicityScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedChemical, setSelectedChemical] = useState<ChemicalRecord | null>(null);

  // Filter & Sort Logic
  const filteredChemicals = useMemo(() => {
    return CHEMICAL_DATABASE.filter((chem) => {
      const matchesSearch =
        chem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chem.casNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chem.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chem.primaryHazards.some(h => h.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = categoryFilter === 'All' || chem.category === categoryFilter;
      const matchesToxicity = toxicityFilter === 'All' || chem.toxicityClass === toxicityFilter;
      const matchesStatus = statusFilter === 'All' || chem.regulatoryStatus === statusFilter;

      return matchesSearch && matchesCategory && matchesToxicity && matchesStatus;
    }).sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (typeof valA === 'string') {
        const comp = (valA as string).localeCompare(valB as string);
        return sortOrder === 'asc' ? comp : -comp;
      } else {
        const comp = (valA as number) - (valB as number);
        return sortOrder === 'asc' ? comp : -comp;
      }
    });
  }, [searchTerm, categoryFilter, toxicityFilter, statusFilter, sortBy, sortOrder]);

  const toggleSort = (field: 'name' | 'toxicityScore' | 'casNumber') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getToxicityBadge = (classification: ChemicalRecord['toxicityClass']) => {
    switch (classification) {
      case 'Severe':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-300">Severe (9.0+)</span>;
      case 'High':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-300">High (7.0-8.9)</span>;
      case 'Moderate':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">Moderate (5.0-6.9)</span>;
      case 'Low':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-300">Low (&lt;5.0)</span>;
    }
  };

  const getStatusBadge = (status: ChemicalRecord['regulatoryStatus']) => {
    switch (status) {
      case 'Banned':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-rose-900 text-rose-100">Banned</span>;
      case 'Restricted':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-amber-800 text-amber-100">Restricted</span>;
      case 'Monitored':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-800 text-blue-100">Monitored</span>;
      case 'Permitted':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-emerald-800 text-emerald-100">Permitted</span>;
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setToxicityFilter('All');
    setStatusFilter('All');
  };

  return (
    <>
      <Head>
        <title>Chemical Toxicity Index | Research Database</title>
        <meta name="description" content="Searchable database for chemical toxicity, hazard classification, regulatory status, and linked research questions." />
      </Head>

      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
        {/* Header Navigation */}
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white leading-tight">Toxicology Meta-Research Hub</h1>
                <p className="text-xs text-slate-400">Chemical Toxicity Index &amp; Analysis</p>
              </div>
            </div>

            <nav className="flex items-center space-x-4 text-sm font-medium">
              <Link href="/research/answers" className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>20 Answered Questions</span>
              </Link>
              <Link href="/research/questions" className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>20 Open Research Topics</span>
              </Link>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-mono">
                Database Active
              </span>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Top Hero Section */}
          <div className="mb-8 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl">
            <div className="md:flex md:items-center md:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-mono mb-3 border border-slate-700">
                  <Activity className="w-3.5 h-3.5" /> Environmental Toxicity &amp; Risk Assessment
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  Chemical Toxicity Database
                </h2>
                <p className="mt-2 text-slate-400 text-sm md:text-base leading-relaxed">
                  Query and filter toxicity ratings, primary organ targets, environmental persistence metrics, and cross-reference records with the 20 Core Research Markdown modules.
                </p>
              </div>

              {/* Quick Metrics */}
              <div className="mt-6 md:mt-0 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-center">
                  <div className="text-2xl font-bold text-white font-mono">{CHEMICAL_DATABASE.length}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Indexed Chemicals</div>
                </div>
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-center">
                  <div className="text-2xl font-bold text-red-400 font-mono">
                    {CHEMICAL_DATABASE.filter(c => c.toxicityClass === 'Severe').length}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Severe Hazards</div>
                </div>
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-center col-span-2 sm:col-span-1">
                  <div className="text-2xl font-bold text-emerald-400 font-mono">100%</div>
                  <div className="text-xs text-slate-400 mt-0.5">Research Linked</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Controls Card */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 md:p-6 mb-8 shadow-md">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by compound name, CAS registry number, chemical formula, or hazard..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* View Toggle Buttons */}
              <div className="flex items-center space-x-2 border border-slate-800 p-1 rounded-lg bg-slate-900 self-start md:self-auto">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    viewMode === 'table' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <List className="w-3.5 h-3.5" /> Table
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    viewMode === 'grid' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" /> Grid Cards
                </button>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
              {/* Category Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Chemical Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md py-1.5 px-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Heavy Metals">Heavy Metals</option>
                  <option value="Solvents">Solvents</option>
                  <option value="PFAS">PFAS</option>
                  <option value="Pesticides">Pesticides</option>
                  <option value="Endocrine Disruptors">Endocrine Disruptors</option>
                  <option value="Industrial Hazards">Industrial Hazards</option>
                  <option value="Plastics & Additives">Plastics &amp; Additives</option>
                </select>
              </div>

              {/* Toxicity Class Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Toxicity Index
                </label>
                <select
                  value={toxicityFilter}
                  onChange={(e) => setToxicityFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md py-1.5 px-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">All Severity Levels</option>
                  <option value="Severe">Severe (&gt;9.0)</option>
                  <option value="High">High (7.0 - 8.9)</option>
                  <option value="Moderate">Moderate (5.0 - 6.9)</option>
                  <option value="Low">Low (&lt;5.0)</option>
                </select>
              </div>

              {/* Regulatory Status Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Regulatory Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md py-1.5 px-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Banned">Banned</option>
                  <option value="Restricted">Restricted</option>
                  <option value="Monitored">Monitored</option>
                  <option value="Permitted">Permitted</option>
                </select>
              </div>

              {/* Reset Filters */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs font-medium text-slate-300 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results Metadata Bar */}
          <div className="flex items-center justify-between mb-4 px-1 text-xs text-slate-400">
            <div>
              Showing <span className="font-semibold text-white">{filteredChemicals.length}</span> of{' '}
              <span className="font-semibold text-white">{CHEMICAL_DATABASE.length}</span> toxicological profiles
            </div>
            <div className="flex items-center gap-2">
              <span>Sort by:</span>
              <button
                onClick={() => toggleSort('toxicityScore')}
                className={`flex items-center gap-1 font-medium ${
                  sortBy === 'toxicityScore' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Toxicity Score {sortBy === 'toxicityScore' && (sortOrder === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
              </button>
              <span>|</span>
              <button
                onClick={() => toggleSort('name')}
                className={`flex items-center gap-1 font-medium ${
                  sortBy === 'name' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Name {sortBy === 'name' && (sortOrder === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
              </button>
            </div>
          </div>

          {/* Data Presentation: Table View */}
          {viewMode === 'table' ? (
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Compound Name</th>
                      <th className="py-3.5 px-4">CAS Number</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Toxicity Score</th>
                      <th className="py-3.5 px-4">Regulatory Status</th>
                      <th className="py-3.5 px-4">Persistence</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredChemicals.length > 0 ? (
                      filteredChemicals.map((chem) => (
                        <tr
                          key={chem.id}
                          className="hover:bg-slate-900/50 transition-colors cursor-pointer group"
                          onClick={() => setSelectedChemical(chem)}
                        >
                          <td className="py-3.5 px-4 font-medium text-slate-100">
                            <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                              {chem.name}
                            </div>
                            <div className="text-xs text-slate-500 font-mono">{chem.formula}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-300">{chem.casNumber}</td>
                          <td className="py-3.5 px-4 text-slate-300">
                            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs">
                              {chem.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-100">{chem.toxicityScore}</span>
                              {getToxicityBadge(chem.toxicityClass)}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">{getStatusBadge(chem.regulatoryStatus)}</td>
                          <td className="py-3.5 px-4 text-slate-300 text-xs">
                            {chem.environmentalPersistence}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedChemical(chem);
                              }}
                              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 rounded-lg transition-colors inline-flex items-center gap-1 text-xs"
                            >
                              <Info className="w-4 h-4" />
                              <span>Details</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          No chemical records match your filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Data Presentation: Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChemicals.length > 0 ? (
                filteredChemicals.map((chem) => (
                  <div
                    key={chem.id}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all hover:shadow-lg group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-xs font-mono text-slate-500">{chem.casNumber}</span>
                          <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                            {chem.name}
                          </h3>
                        </div>
                        <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          {chem.formula}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        {getToxicityBadge(chem.toxicityClass)}
                        {getStatusBadge(chem.regulatoryStatus)}
                      </div>

                      <p className="text-slate-400 text-xs line-clamp-2 mb-4">
                        {chem.description}
                      </p>

                      <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-900 pt-3">
                        <div className="flex justify-between">
                          <span className="text-slate-500">LD50:</span>
                          <span className="font-mono">{chem.ld50}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Persistence:</span>
                          <span>{chem.environmentalPersistence}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Target: {chem.targetOrgans.slice(0, 2).join(', ')}
                      </span>
                      <button
                        onClick={() => setSelectedChemical(chem)}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
                      >
                        View Profile <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No chemical records match your filter criteria.
                </div>
              )}
            </div>
          )}

          {/* Research Markdown Cross-Reference Note */}
          <div className="mt-12 bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Integrated 40-Topic Meta-Research Framework</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Each chemical toxicity profile in this index correlates to our 20 answered markdown questions and 20 expanded research questions for further synthesis.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/research/answers"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                Read 20 Answers
              </Link>
              <Link
                href="/research/questions"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition-colors"
              >
                Explore 20 Research Questions
              </Link>
            </div>
          </div>
        </main>

        {/* Chemical Detail Modal */}
        {selectedChemical && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div
              className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-emerald-400">{selectedChemical.casNumber}</span>
                    <span className="text-xs text-slate-500">|</span>
                    <span className="text-xs font-mono text-slate-400">{selectedChemical.formula}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{selectedChemical.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedChemical(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Chemical Overview
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-900 p-3.5 rounded-lg border border-slate-800">
                    {selectedChemical.description}
                  </p>
                </div>

                {/* Score & Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Toxicity Score</div>
                    <div className="text-xl font-bold text-white font-mono flex items-center gap-2">
                      {selectedChemical.toxicityScore} / 10
                    </div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Toxicity Class</div>
                    <div className="mt-0.5">{getToxicityBadge(selectedChemical.toxicityClass)}</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
                    <div className="text-xs text-slate-400 mb-1">Regulatory Status</div>
                    <div className="mt-0.5">{getStatusBadge(selectedChemical.regulatoryStatus)}</div>
                  </div>
                </div>

                {/* Toxicity Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/80">
                    <span className="font-semibold text-slate-300 block mb-1">LD50 Metric:</span>
                    <span className="text-slate-400 font-mono">{selectedChemical.ld50}</span>
                  </div>
                  <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/80">
                    <span className="font-semibold text-slate-300 block mb-1">Environmental Bioaccumulation:</span>
                    <span className="text-slate-400">{selectedChemical.bioaccumulation} Risk</span>
                  </div>
                </div>

                {/* Primary Hazards */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Primary Toxic Hazards
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedChemical.primaryHazards.map((hazard, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-red-950/50 text-red-300 border border-red-900/50 rounded text-xs font-medium"
                      >
                        {hazard}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Target Organs */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Target Biological Systems
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedChemical.targetOrgans.map((organ, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-slate-900 text-slate-300 border border-slate-800 rounded text-xs"
                      >
                        {organ}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Research Link */}
                {selectedChemical.relatedResearchQuestionId && (
                  <div className="bg-emerald-950/30 border border-emerald-900/40 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        Linked Research Question #{selectedChemical.relatedResearchQuestionId}
                      </div>
                      <div className="text-xs text-slate-300 mt-1">
                        Explore theoretical models &amp; empirical findings regarding this compound.
                      </div>
                    </div>
                    <Link
                      href={`/research/answers#q${selectedChemical.relatedResearchQuestionId}`}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition-colors shrink-0"
                    >
                      View Report
                    </Link>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedChemical(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-950 py-8 mt-12 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4">
            <p>Toxicology Meta-Research Hub &bull; Comprehensive 20/20 Research Framework Database</p>
            <p className="mt-1 text-slate-600">Data compiled for environmental toxicity indexing and academic meta-analysis.</p>
          </div>
        </footer>
      </div>
    </>
  );
}