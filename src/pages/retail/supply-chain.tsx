import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Interface definitions
interface QuestionAnswer {
  id: number;
  question: string;
  category: 'Food Miles' | 'JIT Risks' | 'Chemicals & Preservation' | 'Cold Chain & Logistics';
  summary: string;
  deepDive: string;
  dataMetric?: { label: string; value: string; change?: string };
  tags: string[];
}

interface ResearchQuestion {
  id: number;
  domain: string;
  question: string;
  rationale: string;
  suggestedMethodology: string;
  priority: 'High' | 'Critical' | 'Medium';
}

const QA_DATA: QuestionAnswer[] = [
  {
    id: 1,
    category: 'Food Miles',
    question: 'What is the average distance food travels from farm to plate in North America?',
    summary: 'Fresh produce in North America travels an average of 1,500 to 2,400 miles before reaching retail shelves.',
    deepDive: 'Industrial supply chains rely on regional specialization—e.g., California producing 80%+ of US leafy greens and processing tomatoes. Produce is consolidated at regional distribution centers (DCs) before long-haul trucking. This creates vast energy inefficiencies: a single calorie of lettuce can require up to 35 calories of fossil fuel energy for transport and refrigeration.',
    dataMetric: { label: 'Avg Food Miles', value: '1,500 - 2,400 mi', change: '+12% over 20 yrs' },
    tags: ['Logistics', 'Fossil Fuels', 'Food Miles']
  },
  {
    id: 2,
    category: 'Food Miles',
    question: 'What drives the high food mileage in modern industrial retail systems?',
    summary: 'Centralized purchasing, climate-based monoculture, low fuel cost paradigms, and consumer demand for year-round availability.',
    deepDive: 'Retail conglomerates optimize for purchase scale and supplier volume discounts rather than spatial proximity. Monoculture regions like California’s Central Valley and Mexico’s Sinaloa leverage climate advantages and lower labor costs to undercut local growers even after factoring in 1,000+ miles of diesel transport.',
    dataMetric: { label: 'Imports Ratio', value: '60% Fresh Fruit', change: 'US Import Share' },
    tags: ['Economics', 'Monoculture', 'Global Trade']
  },
  {
    id: 3,
    category: 'JIT Risks',
    question: 'How does Just-In-Time (JIT) inventory management operate in modern supermarkets?',
    summary: 'Supermarkets maintain ultra-thin backroom stocks, relying on daily store deliveries to replenish shelves based on POS scan data.',
    deepDive: 'Modern grocery stores carry only 1.5 to 3 days of total inventory on-site. Algorithmic replenishment systems trigger automated orders to regional Distribution Centers (DCs). While this minimizes holding costs and shrink from spoilage inside the store, it leaves zero buffer against transport interruptions.',
    dataMetric: { label: 'Store Inventory Buffer', value: '1.5 - 3 Days', change: 'Fragile Baseline' },
    tags: ['JIT', 'Inventory', 'Retail Systems']
  },
  {
    id: 4,
    category: 'JIT Risks',
    question: 'What are the key failure modes of JIT inventory in food retail during crises?',
    summary: 'Diesel shocks, driver shortages, severe weather chokepoints, and panic buying trigger immediate store shelf depletion within 24–48 hours.',
    deepDive: 'When shipping routes break (e.g., Highway closures, diesel spikes, or labor strikes), the JIT pipeline empties rapidly. Because inventory is "in transit" rather than sitting in storage, stores experience immediate out-of-stock events without any buffer capacity to bridge supply interruptions.',
    dataMetric: { label: 'Depletion Time', value: '24 - 48 Hours', change: 'Crisis Outage' },
    tags: ['Vulnerabilities', 'Systemic Risk', 'Resilience']
  },
  {
    id: 5,
    category: 'Chemicals & Preservation',
    question: 'How do post-harvest chemical treatments mask produce age and extend shelf life?',
    summary: 'Synthetic fungicides, ethylene blockers, and petroleum-based waxes suppress decomposition and respiration, maintaining optical freshness while age increases.',
    deepDive: 'Produce is biologically living tissue post-harvest. Chemical treatments act as biochemical freeze-frame controls: ethylene receptor blockers stop ripening signals, anti-transpirant coatings reduce water loss, and systemic fungicides prevent molds. While visual decay is stalled, enzymatic degradation of vitamins continues.',
    dataMetric: { label: 'Produce Shelf Delay', value: '2x - 6x Days', change: 'Artificially Extended' },
    tags: ['Biochemistry', 'Chemicals', 'Post-Harvest']
  },
  {
    id: 6,
    category: 'Chemicals & Preservation',
    question: 'What is 1-Methylcyclopropene (1-MCP) and how is it used in apple storage?',
    summary: '1-MCP is a synthetic gas that binds tightly to ethylene receptors, preventing apples from ripening for up to 12 months.',
    deepDive: 'Commercialized under trade names like SmartFresh, 1-MCP blocks ethylene, the plant hormone responsible for softening, starch conversion, and aromatic volatile production. Consequently, consumers purchase apples that may have been harvested 9 to 12 months prior. While firm, these apples lose up to 50% of volatile aromatics and Vitamin C content.',
    dataMetric: { label: 'Max Storage Age', value: '365 Days', change: '1-MCP Treated' },
    tags: ['1-MCP', 'Apples', 'Storage']
  },
  {
    id: 7,
    category: 'Chemicals & Preservation',
    question: 'What fungicides and waxes are applied to citrus and stone fruits post-harvest?',
    summary: 'Imazalil, thiabendazole, fludioxonil, and carnauba or shellac-based wax coatings.',
    deepDive: 'Citrus fruits undergo washing that removes natural cuticle wax, requiring re-coating with polyethylene or carnauba waxes mixed with fungicides like Imazalil (a suspected carcinogen and endocrine disruptor). These prevent Penicillium molds during multi-week ocean or rail transport.',
    dataMetric: { label: 'Citrus Coating', value: '100% Commercial', change: 'Standard Wash & Wax' },
    tags: ['Fungicides', 'Citrus', 'Waxes']
  },
  {
    id: 8,
    category: 'Chemicals & Preservation',
    question: 'What are the human health and nutritional implications of long-duration cold storage and chemical treatments?',
    summary: 'Nutrient loss (especially Vitamin C, Folate, and antioxidants) accelerates over time, while chemical residues pose cumulative exposure risks.',
    deepDive: 'Spinach stored at 4°C loses 50% of its folate and 80% of Vitamin C within 8 days. Extended storage relies on low oxygen and chemical barriers that preserve physical cell structure but do not prevent nutrient oxidation. Pesticide and fungicide residues on coatings often persist past home washing.',
    dataMetric: { label: 'Vitamin C Loss', value: 'up to 80%', change: 'After 7-10 Days Storage' },
    tags: ['Nutrition', 'Toxicity', 'Health']
  },
  {
    id: 9,
    category: 'Cold Chain & Logistics',
    question: 'How does Controlled Atmosphere (CA) storage alter atmospheric gases to delay decay?',
    summary: 'CA storage lowers oxygen levels below 2% and increases CO2 levels to put fruit into a dormant state.',
    deepDive: 'Standard air is ~21% O2, 0.04% CO2, 78% N2. CA rooms lower O2 to 1-2% and elevate CO2 to 2-5% at controlled temperatures (0-3°C). This suppresses cellular respiration by over 80%, delaying senescence. However, prolonged exposure can induce anaerobic respiration, generating off-flavors.',
    dataMetric: { label: 'CA O2 Level', value: '1.0 - 2.0%', change: 'Vs 21% Ambient' },
    tags: ['CA Storage', 'Atmosphere', 'Logistics']
  },
  {
    id: 10,
    category: 'Cold Chain & Logistics',
    question: 'What percentage of retail food waste occurs during transport and distribution?',
    summary: 'Around 12-15% of harvested fresh produce is lost during logistics and distribution due to cold chain breaches and physical handling damage.',
    deepDive: 'Breakdowns in cold chain integrity—such as reefer trailer temperature spikes, loading dock delays, or improper packing pressure—cause premature decay before produce hits store shelves. This represents billions of dollars in wasted embodied energy and water.',
    dataMetric: { label: 'Distribution Waste', value: '12 - 15%', change: 'Post-Harvest Supply Chain' },
    tags: ['Waste', 'Cold Chain', 'Shrink']
  },
  {
    id: 11,
    category: 'Cold Chain & Logistics',
    question: 'How do diesel transport refrigeration units (TRUs or reefers) contribute to localized emissions?',
    summary: 'Reefer units often operate on un-regulated small diesel engines emitting high levels of particulate matter (PM2.5) and NOx.',
    deepDive: 'While primary tractor engines face strict EPA emissions regulations, auxiliary diesel TRUs on refrigeration trailers historically operated under lenient standards. Running 24/7 at logistics hubs and distribution centers, TRUs contribute disproportionately to localized air pollution in industrial communities near freight corridors.',
    dataMetric: { label: 'TRU Operating Time', value: '24/7 Continuous', change: 'High Point Emissions' },
    tags: ['Emissions', 'Reefer', 'Diesel']
  },
  {
    id: 12,
    category: 'JIT Risks',
    question: 'What supply chain chokepoints present the greatest systemic threat to urban food security?',
    summary: 'Interstate bridges, major maritime ports, localized distribution hub clusters, and regional fuel refineries.',
    deepDive: 'Modern metropolitan areas rely on 2-3 mega distribution hubs situated along key highway interstates. Physical destruction or failure at a single arterial chokepoint (e.g., Mississippi River bridges, Panama Canal drought, major port cyberattacks) halts regional food replenishment within hours.',
    dataMetric: { label: 'Urban Vulnerability', value: '72 Hours', change: 'To Empty Shelves' },
    tags: ['Chokepoints', 'Infrastructure', 'Urban Resilience']
  },
  {
    id: 13,
    category: 'Food Miles',
    question: 'How does distribution center (DC) consolidation impact regional agricultural ecosystems?',
    summary: 'Consolidation starves mid-scale local farms by enforcing rigid high-volume dock delivery standards that small growers cannot meet.',
    deepDive: 'Major retailers mandate that suppliers deliver multi-pallet or full-truckload volumes at precise 15-minute delivery windows with RFID tracking. Mid-scale regional producers lack the capital for automated packing lines and cold storage, forcing them out of conventional retail sales channels.',
    dataMetric: { label: 'DC Consolidation', value: 'Top 4 Retailers', change: '65% Market Share' },
    tags: ['Monopoly', 'Distribution', 'Local Agriculture']
  },
  {
    id: 14,
    category: 'Food Miles',
    question: 'What are the economic drivers that prioritize global sourcing over local agricultural procurement?',
    summary: 'Wage differentials, externalized environmental costs, specialized climatic regions, and currency exchange rates.',
    deepDive: 'Global supply chains exploit labor price arbitrage in countries with lower farm worker wages and weaker environmental regulations. Shipping container costs were historically subsidized by globalized maritime logistics, making imported produce cheaper upfront than local produce carrying domestic labor costs.',
    dataMetric: { label: 'Labor Cost Delta', value: '5x - 10x', change: 'US vs Global South' },
    tags: ['Global Trade', 'Labor Arbitrage', 'Economics']
  },
  {
    id: 15,
    category: 'Cold Chain & Logistics',
    question: 'How does temperature abuse along cold chains accelerate nutrient degradation?',
    summary: 'Even brief temperature spikes trigger thermal stress, spiking enzymatic oxidation of sensitive compounds.',
    deepDive: 'When produce sits on an un-refrigerated loading dock for just 30 minutes ("temperature abuse"), internal pulp temperature rises rapidly. This reactivates plant respiration rate exponentially (Q10 temperature coefficient effect), accelerating sugar depletion and phenolic degradation.',
    dataMetric: { label: 'Respiration Spike', value: '2x per 10°C Rise', change: 'Q10 Biological Effect' },
    tags: ['Cold Chain', 'Biochemistry', 'Thermal Stress']
  },
  {
    id: 16,
    category: 'Chemicals & Preservation',
    question: 'What chemical residues persist on retail produce from post-harvest treatments?',
    summary: 'Diphenylamine (DPA), Imazalil, Fludioxonil, Pyrimethanil, and Chlorpropham.',
    deepDive: 'Unlike field-applied pesticides that degrade in sun and rain, post-harvest chemical dip and thermal fogging treatments are applied in enclosed environments right before packaging. Residues do not weather off and routinely rank highest on food safety testing panels.',
    dataMetric: { label: 'Residue Detection', value: '70%+ Tested Citrus', change: 'Contains Post-Harvest Fungicide' },
    tags: ['Pesticides', 'Residues', 'Chemicals']
  },
  {
    id: 17,
    category: 'Food Miles',
    question: 'What is the true energy-return-on-investment (EROI) of imported out-of-season produce?',
    summary: 'Energy inputs for air-freighted or long-distance refrigerated transport often exceed calorie outputs by over 50 to 1.',
    deepDive: 'Air-freighting out-of-season berries from the Southern Hemisphere to North America or Europe consumes ~15 liters of aviation fuel per kilogram of fruit. The net energy ratio is profoundly negative, sustained only by cheap energy regimes and premium retail pricing.',
    dataMetric: { label: 'Energy Ratio', value: '50:1 Energy Loss', change: 'Air-Freighted Produce' },
    tags: ['EROI', 'Energy Balance', 'Sustainability']
  },
  {
    id: 18,
    category: 'JIT Risks',
    question: 'How do geopolitical shocks and fuel price spikes cascade through food supply chains?',
    summary: 'Surging diesel prices directly inflate freight surcharges, leading retailers to contract order frequencies and push costs onto consumers.',
    deepDive: 'Transportation accounts for 15-25% of total produce wholesale costs. When diesel prices spike, freight carriers apply immediate surcharges. Small regional distributors absorb or fail under these margin squeezes, accelerating market consolidation into hyper-capitalized retail giants.',
    dataMetric: { label: 'Freight Elasticity', value: '+1% Fuel = +0.25%', change: 'Food Retail Inflation' },
    tags: ['Geopolitics', 'Diesel', 'Inflation']
  },
  {
    id: 19,
    category: 'Cold Chain & Logistics',
    question: 'What role do IoT sensors and blockchain play in modern cold chain traceability?',
    summary: 'Real-time telemetry sensors log temperature, humidity, and location, identifying breaches before food reaches retail receiving docks.',
    deepDive: 'Bluetooth and cellular IoT tags embedded inside pallets track micro-climates continuously. If a reefer unit fails in transit, automated smart contracts can reject the shipment upon arrival at the DC, reducing human dispute cycles but highlighting reliance on complex digital infrastructure.',
    dataMetric: { label: 'IoT Adoption', value: '35% Enterprise', change: 'Growing Cold Chain Sensor Use' },
    tags: ['IoT', 'Telemetry', 'Digital Supply Chain']
  },
  {
    id: 20,
    category: 'JIT Risks',
    question: 'How do hyper-local food production models compare in supply chain resilience to industrial JIT?',
    summary: 'Hyper-local models exchange ultra-scale economic efficiency for high redundancy, climate resilience, and zero transport dependency.',
    deepDive: 'Peri-urban networks, vertical farms, and regional hub aggregation feature short physical lines of communication (10-50 miles). While unit costs can be higher without scale, they possess structural immunity to long-distance freight shocks and diesel volatility.',
    dataMetric: { label: 'Local Transport Miles', value: '< 50 Miles', change: '95% Reduction vs Industrial' },
    tags: ['Localization', 'Resilience', 'Urban Ag']
  }
];

const RESEARCH_QUESTIONS: ResearchQuestion[] = [
  // Domain A: Biological & Nutritional Integrity
  {
    id: 1,
    domain: 'Biological & Nutritional Integrity',
    priority: 'Critical',
    question: 'How does 12-month CA storage with 1-MCP impact the micro-nutrient bioavailability and antioxidant degradation curve of pome fruit?',
    rationale: 'While physical appearance is preserved, enzymatic degradation and chemical degradation rates of bioactives remain inadequately benchmarked over long durations.',
    suggestedMethodology: 'High-Performance Liquid Chromatography (HPLC) longitudinal tracking of 1-MCP treated vs organic freshly harvested cultivars across 12 months.'
  },
  {
    id: 2,
    domain: 'Biological & Nutritional Integrity',
    priority: 'High',
    question: 'What are the cumulative human gut microbiome impacts from consuming systemic post-harvest fungicides (Imazalil, Fludioxonil) present in retail wax matrix coatings?',
    rationale: 'Fungicides engineered to suppress fungal cellular respiration may exert off-target antibacterial/antifungal pressures on human intestinal microbiota.',
    suggestedMethodology: 'In-vitro human gut simulator (SHIME model) exposure testing with commercial post-harvest wax residue extracts.'
  },
  {
    id: 3,
    domain: 'Biological & Nutritional Integrity',
    priority: 'Medium',
    question: 'To what extent does rapid cold-chain micro-fluctuation (temperature abuse) induce stress-response gene expression and toxic metabolic byproduct accumulation in leafy greens?',
    rationale: 'Loading dock thermal shocks cause rapid cellular respiration spikes that may lead to cellular senescence and metabolic drift.',
    suggestedMethodology: 'Transcriptomic and metabolomic profiling of spinach leaves subjected to 15-minute 20°C temperature spikes during cold transport.'
  },
  {
    id: 4,
    domain: 'Biological & Nutritional Integrity',
    priority: 'High',
    question: 'Does post-harvest treatment with synthetic ethylene inhibitors impede natural volatile synthesis to the point of permanent aromatic and flavor loss?',
    rationale: 'Consumer drop-off in fresh produce consumption is tied to bland taste profile caused by premature harvest and ethylene blockade.',
    suggestedMethodology: 'Gas chromatography-mass spectrometry (GC-MS) headspace analysis paired with trained sensory panel evaluations.'
  },
  {
    id: 5,
    domain: 'Biological & Nutritional Integrity',
    priority: 'Medium',
    question: 'How do synthetic petroleum-based fruit coatings affect natural fruit transpiration gas-exchange dynamics under non-ideal retail shelf conditions?',
    rationale: 'Inadequate gas permeability under warm retail displays can induce internal anaerobic fermentation and alcohol off-flavor creation.',
    suggestedMethodology: 'Internal tissue gas sensors measuring CO2/O2 ratios inside coated citrus and stone fruits stored at 22°C.'
  },

  // Domain B: Economic Mechanics & True-Cost Accounting
  {
    id: 6,
    domain: 'Economic Mechanics & True-Cost Accounting',
    priority: 'Critical',
    question: 'What is the true cost accounting (TCA) financial model per kilogram of produce when factoring in diesel emissions health impacts, road damage, and subsidized cold infrastructure?',
    rationale: 'Industrial supply chains appear cheap because transport externalities, public health costs, and carbon impacts are offloaded onto taxpayers.',
    suggestedMethodology: 'Full life-cycle assessment (LCA) integrated with health economics impact modeling across 5 key produce items.'
  },
  {
    id: 7,
    domain: 'Economic Mechanics & True-Cost Accounting',
    priority: 'High',
    question: 'How do centralized distribution center volume purchasing requirements act as a barrier to entry for mid-sized regional farm aggregators?',
    rationale: 'Monopsonistic control by major grocery chains creates structural barriers for producers unable to commit to 52-week supply schedules.',
    suggestedMethodology: 'Econometric analysis of retail procurement contracts and grower margin trends over 2000–2024.'
  },
  {
    id: 8,
    domain: 'Economic Mechanics & True-Cost Accounting',
    priority: 'Medium',
    question: 'What is the breakeven fuel price threshold ($/gallon diesel) at which 1,500-mile produce logistics becomes economically unviable compared to local greenhouse production?',
    rationale: 'Long-haul transport viability is tied directly to fuel subsidies and fuel price stability.',
    suggestedMethodology: 'Sensitivity analysis modeling fuel price shocks ($4 to $15/gal) against indoor/regional production energy costs.'
  },
  {
    id: 9,
    domain: 'Economic Mechanics & True-Cost Accounting',
    priority: 'Critical',
    question: 'How does retail consolidation (top 4 retailers holding >60% market share) correlate with regional food desert formation during logistical shocks?',
    rationale: 'Centralized distribution skips low-margin rural and inner-city stores during supply contractions to prioritize flagship urban stores.',
    suggestedMethodology: 'Spatial correlation analysis of retail inventory allocation during 2020-2022 supply chain disruptions.'
  },
  {
    id: 10,
    domain: 'Economic Mechanics & True-Cost Accounting',
    priority: 'High',
    question: 'What is the net energy yield (EROI) of air-freighted tropical produce vs ambient regional seasonal produce alternatives?',
    rationale: 'Air freight produce represents the highest energy-intensity calorie distribution method on Earth.',
    suggestedMethodology: 'Direct energy accounting from farm jet fuel burn to retail point-of-sale.'
  },

  // Domain C: Infrastructure Vulnerability & Climate Shocks
  {
    id: 11,
    domain: 'Infrastructure Vulnerability & Climate Shocks',
    priority: 'Critical',
    question: 'What is the failure propagation timeline for major metropolitan areas when primary interstates or major rail freight corridors suffer a multi-day freeze/storm blackout?',
    rationale: 'JIT grocery buffer times are known to be short, but precise multi-day cascading impact models for urban centers remain unmapped.',
    suggestedMethodology: 'Agent-based supply network simulation modeling urban store depletion dynamics during simulated corridor disruptions.'
  },
  {
    id: 12,
    domain: 'Infrastructure Vulnerability & Climate Shocks',
    priority: 'Critical',
    question: 'How susceptible are localized freight refrigeration units (TRUs) to electric grid blackouts during extreme thermal dome weather events?',
    rationale: 'Grid failures during heatwaves disable loading dock chillers and parked reefer plug-ins, causing catastrophic cold chain collapse.',
    suggestedMethodology: 'Stress-testing cold hub backup power resilience against prolonged grid outages in major sunbelt distribution centers.'
  },
  {
    id: 13,
    domain: 'Infrastructure Vulnerability & Climate Shocks',
    priority: 'High',
    question: 'How will shifting climate zones and megadroughts in California’s Central Valley force a structural relocation of US produce logistics hubs by 2040?',
    rationale: '80% of US leafy greens rely on water-stressed basins; failure of California production forces complete overhaul of freight routes.',
    suggestedMethodology: 'Geospatial climate forecasting models overlaid on existing retail distribution center infrastructure asset positions.'
  },
  {
    id: 14,
    domain: 'Infrastructure Vulnerability & Climate Shocks',
    priority: 'Medium',
    question: 'What cybersecurity vulnerabilities exist within automated distribution centers and automated ordering algorithms?',
    rationale: 'Modern DCs rely on automated picking robots and cloud-based automated replenishment; targeted ransomware can halt regional delivery.',
    suggestedMethodology: 'Threat modeling and penetration assessment frameworks applied to modern automated warehouse systems.'
  },
  {
    id: 15,
    domain: 'Infrastructure Vulnerability & Climate Shocks',
    priority: 'High',
    question: 'How do port congestion events and maritime container imbalances trigger persistent localized food price inflation spikes?',
    rationale: 'Container shortages in export nations compound post-harvest decay times before shipping containers even load onto vessels.',
    suggestedMethodology: 'Time-series econometrics connecting port container dwell times to retail produce shelf pricing.'
  },

  // Domain D: Decentralization Architecture & Regional Resilience
  {
    id: 16,
    domain: 'Decentralization Architecture',
    priority: 'Critical',
    question: 'What optimal spatial radius and density of micro-distribution hubs are needed to achieve 72-hour supply autonomy for a city of 1 million people?',
    rationale: 'Decentralized urban agriculture requires coordinated regional storage nodes to replace centralized industrial distribution centers.',
    suggestedMethodology: 'Spatial optimization network modeling targeting high food security redundancy without prohibitive real estate overhead.'
  },
  {
    id: 17,
    domain: 'Decentralization Architecture',
    priority: 'High',
    question: 'How can open-source hardware and low-cost IoT sensors democratize cold-chain tracking for smallholder regional food hubs?',
    rationale: 'Enterprise telemetry solutions are cost-prohibitive for local farm cooperatives, maintaining their disadvantage against industrial aggregators.',
    suggestedMethodology: 'Field testing open-source LoRaWAN temperature/humidity tracking networks across regional producer networks.'
  },
  {
    id: 18,
    domain: 'Decentralization Architecture',
    priority: 'High',
    question: 'What non-chemical post-harvest technologies (such as UV-C irradiation, ozonated water, natural antimicrobial peptides) can effectively replace toxic synthetic fungicides?',
    rationale: 'Eliminating synthetic chemical coatings requires rapid bio-compatible decay prevention interventions suited for short-haul supply chains.',
    suggestedMethodology: 'Comparative trials testing fruit shelf life extension and microbial load reduction using pulsed light vs synthetic fungicides.'
  },
  {
    id: 19,
    domain: 'Decentralization Architecture',
    priority: 'Medium',
    question: 'How can regional cooperative purchasing structures allow independent grocers to compete with consolidated supermarket procurement margins?',
    rationale: 'Independent grocers often serve vulnerable communities but lack the buying power of major national grocery chains.',
    suggestedMethodology: 'Comparative economic analysis of cooperative wholesale buying pools across regional independent supermarket networks.'
  },
  {
    id: 20,
    domain: 'Decentralization Architecture',
    priority: 'High',
    question: 'What public policy mechanisms (e.g., local procurement quotas, diesel congestion pricing, local DC tax credits) most rapidly shift retail procurement to regional sources?',
    rationale: 'Free market incentives currently favor centralized global supply chains; regulatory policy interventions are required to internalize true costs.',
    suggestedMethodology: 'Policy evaluation matrix measuring regional farm income growth and supply chain carbon reduction post-policy implementation.'
  }
];

export default function SupplyChainResearchPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openQaId, setOpenQaId] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<'answers' | 'research'>('answers');
  const [researchDomain, setResearchDomain] = useState<string>('All');
  const [savedResearchNotes, setSavedResearchNotes] = useState<Record<number, string>>({});

  // Filtered QAs
  const filteredQas = useMemo(() => {
    return QA_DATA.filter((qa) => {
      const matchesCategory = selectedCategory === 'All' || qa.category === selectedCategory;
      const matchesSearch =
        qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qa.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qa.deepDive.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qa.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Filtered Research Questions
  const filteredResearch = useMemo(() => {
    return RESEARCH_QUESTIONS.filter((rq) => {
      const matchesDomain = researchDomain === 'All' || rq.domain === researchDomain;
      const matchesSearch =
        rq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rq.rationale.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rq.suggestedMethodology.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDomain && matchesSearch;
    });
  }, [researchDomain, searchQuery]);

  const handleNoteChange = (id: number, text: string) => {
    setSavedResearchNotes((prev) => ({ ...prev, [id]: text }));
  };

  return (
    <>
      <Head>
        <title>Supply Chain Fragility & Food Miles | Research Analysis</title>
        <meta
          name="description"
          content="In-depth analysis of 1,500-mile average food transport, Just-In-Time retail vulnerabilities, post-harvest chemical treatments, and cold chain risks."
        />
      </Head>

      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
        {/* Header Bar */}
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 text-emerald-400 font-bold text-lg hover:text-emerald-300 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Research Hub</span>
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-slate-300 font-medium text-sm sm:text-base">Retail & Supply Chain Vulnerabilities</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                20 Resolved Analysis + 20 Research Agenda
              </span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Hero */}
          <section className="mb-10">
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 sm:p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Deep-Dive Research Module
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                  Supply Chain Fragility & Post-Harvest Preservation
                </h1>
                <p className="text-slate-300 max-w-3xl text-base sm:text-lg leading-relaxed">
                  An analytical breakdown investigating the 1,500-mile food mile paradigm, Just-In-Time (JIT) inventory fragility, post-harvest chemical preservers (1-MCP, synthetic fungicides, petroleum waxes), and systemic supply chain vulnerabilities in modern retail food systems.
                </p>

                {/* Key Metrics Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Food Distance</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">1,500+ Mi</div>
                    <div className="text-xs text-slate-500 mt-1">Farm-to-plate baseline</div>
                  </div>
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">JIT Store Buffer</div>
                    <div className="text-2xl font-bold text-amber-400 mt-1">1.5 - 3 Days</div>
                    <div className="text-xs text-slate-500 mt-1">On-site supermarket stock</div>
                  </div>
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Storage Extension</div>
                    <div className="text-2xl font-bold text-cyan-400 mt-1">Up to 365 Days</div>
                    <div className="text-xs text-slate-500 mt-1">1-MCP & CA apple storage</div>
                  </div>
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Eroded Vitamin C</div>
                    <div className="text-2xl font-bold text-rose-400 mt-1">Up to 80%</div>
                    <div className="text-xs text-slate-500 mt-1">During long-haul storage</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Navigation Tabs & Search Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* View Switcher Tabs */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 self-start">
              <button
                onClick={() => setActiveTab('answers')}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center space-x-2 ${
                  activeTab === 'answers'
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>20 Resolved Core Questions</span>
              </button>
              <button
                onClick={() => setActiveTab('research')}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center space-x-2 ${
                  activeTab === 'research'
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <span>20 Deep-Dive Research Agenda</span>
              </button>
            </div>

            {/* Global Search Bar */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search analysis or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
              />
              <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 text-xs font-bold"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: RESOLVED QUESTIONS (20 ANSWERS) */}
          {activeTab === 'answers' && (
            <div className="space-y-6">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pb-2">
                <span className="text-xs font-semibold text-slate-400 mr-2 uppercase tracking-wider">Filter Category:</span>
                {['All', 'Food Miles', 'JIT Risks', 'Chemicals & Preservation', 'Cold Chain & Logistics'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Answers Accordion / Card List */}
              <div className="space-y-4">
                {filteredQas.length === 0 ? (
                  <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
                    <p className="text-slate-400">No core questions found matching your filter criteria.</p>
                  </div>
                ) : (
                  filteredQas.map((qa) => {
                    const isOpen = openQaId === qa.id;
                    return (
                      <div
                        key={qa.id}
                        className={`border rounded-xl transition-all overflow-hidden ${
                          isOpen ? 'bg-slate-900/90 border-emerald-500/40 shadow-xl' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <button
                          onClick={() => setOpenQaId(isOpen ? null : qa.id)}
                          className="w-full text-left p-5 flex items-start justify-between gap-4 focus:outline-none"
                        >
                          <div className="flex items-start space-x-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400">
                              #{qa.id}
                            </span>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                  {qa.category}
                                </span>
                              </div>
                              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{qa.question}</h3>
                              <p className="text-slate-400 text-sm mt-1.5 line-clamp-2">{qa.summary}</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0 mt-1">
                            <svg
                              className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180 text-emerald-400' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>

                        {/* Collapsible Deep Dive Panel */}
                        {isOpen && (
                          <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/40">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="md:col-span-2 space-y-3">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Technical Analysis & Context</h4>
                                <p className="text-slate-300 text-sm leading-relaxed">{qa.deepDive}</p>
                                <div className="flex flex-wrap gap-1.5 pt-2">
                                  {qa.tags.map((tag) => (
                                    <span key={tag} className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {qa.dataMetric && (
                                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                                  <div>
                                    <div className="text-xs font-medium text-slate-400">{qa.dataMetric.label}</div>
                                    <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">{qa.dataMetric.value}</div>
                                  </div>
                                  {qa.dataMetric.change && (
                                    <div className="text-xs text-amber-400 bg-amber-950/40 border border-amber-900/50 px-2 py-1 rounded mt-3 inline-block">
                                      {qa.dataMetric.change}
                                    </div>
                                  )}
                                </div>
                              )}
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

          {/* TAB 2: RESEARCH AGENDA (20 FURTHER QUESTIONS) */}
          {activeTab === 'research' && (
            <div className="space-y-6">
              {/* Domain Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pb-2">
                <span className="text-xs font-semibold text-slate-400 mr-2 uppercase tracking-wider">Filter Domain:</span>
                {[
                  'All',
                  'Biological & Nutritional Integrity',
                  'Economic Mechanics & True-Cost Accounting',
                  'Infrastructure Vulnerability & Climate Shocks',
                  'Decentralization Architecture'
                ].map((dom) => (
                  <button
                    key={dom}
                    onClick={() => setResearchDomain(dom)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      researchDomain === dom
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {dom}
                  </button>
                ))}
              </div>

              {/* Research List */}
              <div className="grid grid-cols-1 gap-4">
                {filteredResearch.length === 0 ? (
                  <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
                    <p className="text-slate-400">No research queries match your selection.</p>
                  </div>
                ) : (
                  filteredResearch.map((rq) => (
                    <div key={rq.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                            Research #{rq.id}
                          </span>
                          <span className="text-xs font-medium text-slate-400">{rq.domain}</span>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold self-start sm:self-auto ${
                            rq.priority === 'Critical'
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                              : rq.priority === 'High'
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {rq.priority} Priority
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2">{rq.question}</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 bg-slate-950/50 p-3.5 rounded-lg border border-slate-800/80 text-xs">
                        <div>
                          <span className="font-semibold text-emerald-400 uppercase tracking-wider block mb-1">Scientific & Systemic Rationale</span>
                          <p className="text-slate-300 leading-relaxed">{rq.rationale}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-cyan-400 uppercase tracking-wider block mb-1">Suggested Methodology</span>
                          <p className="text-slate-300 leading-relaxed">{rq.suggestedMethodology}</p>
                        </div>
                      </div>

                      {/* Interactive Workspace Note field */}
                      <div className="mt-3">
                        <textarea
                          placeholder="Add research notes or trial design hypotheses..."
                          value={savedResearchNotes[rq.id] || ''}
                          onChange={(e) => handleNoteChange(rq.id, e.target.value)}
                          rows={2}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 placeholder:text-slate-600 transition-all"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Synthesis & Next Steps Banner */}
          <section className="mt-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-3">Research Synthesis & Strategic Implication</h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              The data demonstrates that the modern food supply chain prioritizes long-distance durability and uniform shelf presentation over nutritional density, economic vulnerability, and energy efficiency. Transitioning away from this fragile architecture requires decentralizing distribution networks and replacing synthetic preservation reliance with localized supply chain loops.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/retail/decentralization"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold rounded-lg transition-colors inline-flex items-center space-x-2"
              >
                <span>Explore Decentralized Logistics Options</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}