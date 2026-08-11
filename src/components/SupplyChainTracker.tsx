import React, { useState, useMemo } from 'react';
import {
  Truck,
  Thermometer,
  ShieldCheck,
  Leaf,
  Sparkles,
  Clock,
  AlertTriangle,
  ChevronRight,
  Activity,
  FileText,
  Info,
  Droplet,
  Wind,
  Package,
  Calendar,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

// --- Interfaces & Types ---

export interface TreatmentDetails {
  waxCoating: {
    applied: boolean;
    type: string;
    thicknessMicrons: number;
    respirationReductionPct: number;
    applicationDate: string;
  };
  ethyleneGas: {
    applied: boolean;
    concentrationPpm: number;
    exposureHours: number;
    purpose: 'Degreening' | 'Accelerated Ripening' | 'Inhibition (1-MCP)' | 'None';
    treatmentWindow: string;
  };
  sanitization: string;
  storageAtmosphere: string; // e.g., "Controlled Atmosphere (2% O2, 5% CO2)"
}

export interface JourneyStage {
  id: string;
  name: string;
  location: string;
  timestamp: string;
  durationHours: number;
  tempCelsius: number;
  humidityPct: number;
  status: 'completed' | 'in-transit' | 'pending';
  notes: string;
  treatmentSummary?: string;
}

export interface NutrientDataPoint {
  day: number;
  stageName: string;
  vitaminC_Optimal: number; // % retained
  vitaminC_Standard: number; // % retained
  polyphenols_Optimal: number;
  polyphenols_Standard: number;
  antioxidantCapacity: number;
}

export interface BatchInfo {
  id: string;
  produceName: string;
  variety: string;
  originFarm: string;
  destination: string;
  harvestDate: string;
  expectedShelfLifeDays: number;
  currentStageIndex: number;
  overallHealthScore: number;
  treatments: TreatmentDetails;
  stages: JourneyStage[];
  nutrientCurve: NutrientDataPoint[];
  researchQuestionsRef: number[]; // Refers to the markdown questions generated in the research suite
}

// --- Mock Data ---

const BATCH_DATA: BatchInfo[] = [
  {
    id: 'BATCH-AVO-2025-09A',
    produceName: 'Hass Avocados',
    variety: 'Organic Hass',
    originFarm: 'Valle de Bravo Co-Op, Mexico',
    destination: 'Distribution Hub - Chicago, IL',
    harvestDate: '2025-05-10',
    expectedShelfLifeDays: 28,
    currentStageIndex: 3,
    overallHealthScore: 94,
    treatments: {
      waxCoating: {
        applied: true,
        type: 'Plant-derived Lipids & Carnauba Micro-emulsion',
        thicknessMicrons: 1.8,
        respirationReductionPct: 42,
        applicationDate: '2025-05-11 08:30',
      },
      ethyleneGas: {
        applied: true,
        concentrationPpm: 100,
        exposureHours: 24,
        purpose: 'Accelerated Ripening',
        treatmentWindow: 'Stage 3 (Ripening Hub)',
      },
      sanitization: 'Aqueous Ozone (2.5 ppm) Wash',
      storageAtmosphere: 'Controlled Atmosphere (3% O2, 6% CO2, 5°C)',
    },
    stages: [
      {
        id: 's1',
        name: 'Harvest & Field Pre-Cooling',
        location: 'Valle de Bravo, MX',
        timestamp: '2025-05-10 06:00',
        durationHours: 12,
        tempCelsius: 6.2,
        humidityPct: 88,
        status: 'completed',
        notes: 'Hydro-cooled to remove field heat within 4 hours of harvest.',
      },
      {
        id: 's2',
        name: 'Packhouse Waxing & Cold Storage',
        location: 'Uruapan Packhouse',
        timestamp: '2025-05-11 08:00',
        durationHours: 36,
        tempCelsius: 5.0,
        humidityPct: 90,
        status: 'completed',
        notes: 'Organic lipid coating applied to slow moisture loss and oxygen diffusion.',
      },
      {
        id: 's3',
        name: 'Refrigerated Transit (Cross-Border)',
        location: 'Laredo Border -> St. Louis',
        timestamp: '2025-05-13 02:00',
        durationHours: 64,
        tempCelsius: 5.5,
        humidityPct: 85,
        status: 'completed',
        notes: 'Continuous IoT thermal monitoring; zero temperature spikes detected.',
      },
      {
        id: 's4',
        name: 'Ethylene Conditioning Room',
        location: 'Midwest Distribution Center',
        timestamp: '2025-05-16 00:00',
        durationHours: 36,
        tempCelsius: 18.0,
        humidityPct: 92,
        status: 'in-transit',
        notes: 'Controlled ethylene dosing to trigger uniform firmness transition from Stage 2 to Stage 3.',
      },
      {
        id: 's5',
        name: 'Retail Shelf Display',
        location: 'Fresh Market Stores #104-112',
        timestamp: '2025-05-18 07:00 (Est)',
        durationHours: 96,
        tempCelsius: 12.0,
        humidityPct: 70,
        status: 'pending',
        notes: 'Expected 5-7 days optimal shelf life remaining upon placement.',
      },
    ],
    nutrientCurve: [
      { day: 0, stageName: 'Harvest', vitaminC_Optimal: 100, vitaminC_Standard: 100, polyphenols_Optimal: 100, polyphenols_Standard: 100, antioxidantCapacity: 100 },
      { day: 3, stageName: 'Packhouse', vitaminC_Optimal: 98, vitaminC_Standard: 91, polyphenols_Optimal: 99, polyphenols_Standard: 94, antioxidantCapacity: 97 },
      { day: 6, stageName: 'Transit', vitaminC_Optimal: 94, vitaminC_Standard: 80, polyphenols_Optimal: 96, polyphenols_Standard: 86, antioxidantCapacity: 93 },
      { day: 9, stageName: 'Conditioning', vitaminC_Optimal: 89, vitaminC_Standard: 68, polyphenols_Optimal: 92, polyphenols_Standard: 75, antioxidantCapacity: 88 },
      { day: 12, stageName: 'Retail Shelf', vitaminC_Optimal: 82, vitaminC_Standard: 52, polyphenols_Optimal: 87, polyphenols_Standard: 62, antioxidantCapacity: 81 },
      { day: 15, stageName: 'Consumer', vitaminC_Optimal: 74, vitaminC_Standard: 38, polyphenols_Optimal: 80, polyphenols_Standard: 48, antioxidantCapacity: 72 },
    ],
    researchQuestionsRef: [1, 4, 7, 12, 19],
  },
  {
    id: 'BATCH-APP-2025-04B',
    produceName: 'Honeycrisp Apples',
    variety: 'Honeycrisp (Washington Grade A)',
    originFarm: 'Yakima Valley Orchards, WA',
    destination: 'Regional Supermarket Hub, NY',
    harvestDate: '2025-04-01',
    expectedShelfLifeDays: 120,
    currentStageIndex: 2,
    overallHealthScore: 98,
    treatments: {
      waxCoating: {
        applied: true,
        type: 'Carnauba & Shellac Food-Grade Resin',
        thicknessMicrons: 2.4,
        respirationReductionPct: 58,
        applicationDate: '2025-04-03 14:00',
      },
      ethyleneGas: {
        applied: true,
        concentrationPpm: 1, // 1-MCP treatment is inhibitor
        exposureHours: 24,
        purpose: 'Inhibition (1-MCP)',
        treatmentWindow: 'Post-Harvest Pre-Storage',
      },
      sanitization: 'Fludioxonil & Peracetic Acid Wash',
      storageAtmosphere: 'Ultra Low Oxygen (ULO 1.2% O2, 1.0% CO2, 1.0°C)',
    },
    stages: [
      {
        id: 's1',
        name: 'Harvest & Bin Sorting',
        location: 'Yakima Valley, WA',
        timestamp: '2025-04-01 08:00',
        durationHours: 24,
        tempCelsius: 4.0,
        humidityPct: 90,
        status: 'completed',
        notes: 'Gentle mechanical harvesting with immediate field hydro-cooling.',
      },
      {
        id: 's2',
        name: '1-MCP & SmartFresh Coating',
        location: 'Yakima Central Cold Storage',
        timestamp: '2025-04-03 10:00',
        durationHours: 48,
        tempCelsius: 1.5,
        humidityPct: 92,
        status: 'completed',
        notes: '1-Methylcyclopropene (1-MCP) applied to block ethylene receptor sites.',
      },
      {
        id: 's3',
        name: 'Controlled Atmosphere Storage (ULO)',
        location: 'Yakima ULO Vault #4',
        timestamp: '2025-04-05 00:00',
        durationHours: 720,
        tempCelsius: 0.8,
        humidityPct: 94,
        status: 'in-transit',
        notes: 'Dormancy maintained under ULO atmosphere for extended shelf life retention.',
      },
      {
        id: 's4',
        name: 'Cross-Country Intermodal Transit',
        location: 'WA to NY Transit Line',
        timestamp: '2025-05-06 06:00 (Est)',
        durationHours: 96,
        tempCelsius: 2.0,
        humidityPct: 88,
        status: 'pending',
        notes: 'Refrigerated boxcar with real-time GPS and gas sensor monitoring.',
      },
      {
        id: 's5',
        name: 'Distribution & Store Delivery',
        location: 'Empire State Retail Logistics',
        timestamp: '2025-05-11 05:00 (Est)',
        durationHours: 48,
        tempCelsius: 4.0,
        humidityPct: 80,
        status: 'pending',
        notes: 'Final delivery allocation for grocery network display.',
      },
    ],
    nutrientCurve: [
      { day: 0, stageName: 'Harvest', vitaminC_Optimal: 100, vitaminC_Standard: 100, polyphenols_Optimal: 100, polyphenols_Standard: 100, antioxidantCapacity: 100 },
      { day: 10, stageName: 'ULO Vault', vitaminC_Optimal: 97, vitaminC_Standard: 88, polyphenols_Optimal: 98, polyphenols_Standard: 90, antioxidantCapacity: 98 },
      { day: 20, stageName: 'ULO Vault', vitaminC_Optimal: 94, vitaminC_Standard: 76, polyphenols_Optimal: 96, polyphenols_Standard: 81, antioxidantCapacity: 95 },
      { day: 30, stageName: 'Transit Prep', vitaminC_Optimal: 91, vitaminC_Standard: 65, polyphenols_Optimal: 94, polyphenols_Standard: 72, antioxidantCapacity: 92 },
      { day: 40, stageName: 'Retail', vitaminC_Optimal: 87, vitaminC_Standard: 51, polyphenols_Optimal: 91, polyphenols_Standard: 60, antioxidantCapacity: 88 },
    ],
    researchQuestionsRef: [2, 5, 8, 14, 20],
  },
  {
    id: 'BATCH-BAN-2025-12C',
    produceName: 'Cavendish Bananas',
    variety: 'Grand Naine Cavendish',
    originFarm: 'Sula Valley Plantation, Honduras',
    destination: 'Northeast Ripening Terminal, PA',
    harvestDate: '2025-05-02',
    expectedShelfLifeDays: 21,
    currentStageIndex: 2,
    overallHealthScore: 91,
    treatments: {
      waxCoating: {
        applied: false,
        type: 'None (Polyethylene Modified Atmosphere Bags used instead)',
        thicknessMicrons: 0,
        respirationReductionPct: 35,
        applicationDate: 'N/A',
      },
      ethyleneGas: {
        applied: true,
        concentrationPpm: 150,
        exposureHours: 24,
        purpose: 'Degreening',
        treatmentWindow: 'Stage 4 (Dest. Ripening Room)',
      },
      sanitization: 'Alum Hydroxide Crown Dip & Chlorine Wash',
      storageAtmosphere: 'Green Storage (13.5°C, Banavac Vacuum Pack)',
    },
    stages: [
      {
        id: 's1',
        name: 'Harvest & Crown De-handing',
        location: 'Sula Valley, Honduras',
        timestamp: '2025-05-02 05:00',
        durationHours: 8,
        tempCelsius: 14.0,
        humidityPct: 90,
        status: 'completed',
        notes: 'Harvested at pre-climacteric mature green stage (Stage 1 color).',
      },
      {
        id: 's2',
        name: 'Maritime Reef Shipping',
        location: 'Puerto Cortés -> Port of Wilmington',
        timestamp: '2025-05-03 12:00',
        durationHours: 144,
        tempCelsius: 13.5,
        humidityPct: 92,
        status: 'completed',
        notes: 'Strict temperature control above 13°C to prevent chilling injury (pith browning).',
      },
      {
        id: 's3',
        name: 'Port Discharge & Highway Transit',
        location: 'Wilmington Port to PA Hub',
        timestamp: '2025-05-09 14:00',
        durationHours: 18,
        tempCelsius: 13.8,
        humidityPct: 88,
        status: 'in-transit',
        notes: 'Maintained under modified atmosphere liner bags.',
      },
      {
        id: 's4',
        name: 'Pressurized Ripening Chamber',
        location: 'PA Ripening Terminal',
        timestamp: '2025-05-10 10:00 (Est)',
        durationHours: 120,
        tempCelsius: 16.5,
        humidityPct: 90,
        status: 'pending',
        notes: 'Ethylene gas injection to initiate starch-to-sugar conversion curve.',
      },
      {
        id: 's5',
        name: 'Retail Display (Color Stage 4-5)',
        location: 'East Coast Supermarket Chains',
        timestamp: '2025-05-15 06:00 (Est)',
        durationHours: 72,
        tempCelsius: 18.0,
        humidityPct: 65,
        status: 'pending',
        notes: 'Target color index 4 (yellow with green tips) at arrival.',
      },
    ],
    nutrientCurve: [
      { day: 0, stageName: 'Green Harvest', vitaminC_Optimal: 100, vitaminC_Standard: 100, polyphenols_Optimal: 100, polyphenols_Standard: 100, antioxidantCapacity: 60 },
      { day: 4, stageName: 'Maritime Transit', vitaminC_Optimal: 96, vitaminC_Standard: 90, polyphenols_Optimal: 98, polyphenols_Standard: 92, antioxidantCapacity: 68 },
      { day: 8, stageName: 'Arrival Port', vitaminC_Optimal: 92, vitaminC_Standard: 81, polyphenols_Optimal: 95, polyphenols_Standard: 83, antioxidantCapacity: 75 },
      { day: 11, stageName: 'Ripening Room', vitaminC_Optimal: 88, vitaminC_Standard: 72, polyphenols_Optimal: 90, polyphenols_Standard: 74, antioxidantCapacity: 92 },
      { day: 14, stageName: 'Yellow Retail', vitaminC_Optimal: 80, vitaminC_Standard: 58, polyphenols_Optimal: 82, polyphenols_Standard: 60, antioxidantCapacity: 98 },
      { day: 18, stageName: 'Consumer Peak', vitaminC_Optimal: 68, vitaminC_Standard: 40, polyphenols_Optimal: 70, polyphenols_Standard: 45, antioxidantCapacity: 85 },
    ],
    researchQuestionsRef: [3, 9, 11, 16, 18],
  },
];

export const SupplyChainTracker: React.FC = () => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>(BATCH_DATA[0].id);
  const [activeTab, setActiveTab] = useState<'journey' | 'treatments' | 'nutrients' | 'research'>('journey');
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

  const activeBatch = useMemo(() => {
    return BATCH_DATA.find((b) => b.id === selectedBatchId) || BATCH_DATA[0];
  }, [selectedBatchId]);

  const activeStage = useMemo(() => {
    if (!selectedStageId) return activeBatch.stages[activeBatch.currentStageIndex] || activeBatch.stages[0];
    return activeBatch.stages.find((s) => s.id === selectedStageId) || activeBatch.stages[0];
  }, [selectedStageId, activeBatch]);

  const totalTransitHours = useMemo(() => {
    return activeBatch.stages.reduce((acc, stage) => acc + stage.durationHours, 0);
  }, [activeBatch]);

  return (
    <div className="w-full bg-slate-950 text-slate-100 min-h-screen p-4 md:p-8 font-sans">
      {/* Top Header Banner */}
      <div className="max-w-7xl mx-auto mb-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" /> Post-Harvest Intelligence Systems
              </span>
              <span className="text-xs text-slate-400">Farm-to-Shelf Journey Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              AgriFlow™ Supply Chain Tracker
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time monitoring of perishables, transit thermals, post-harvest biochemical treatments, and nutrient decay curves.
            </p>
          </div>

          {/* Batch Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-2 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-400 ml-2" />
              <select
                value={selectedBatchId}
                onChange={(e) => {
                  setSelectedBatchId(e.target.value);
                  setSelectedStageId(null);
                }}
                className="bg-transparent text-sm font-medium text-slate-100 focus:outline-none pr-4 cursor-pointer"
              >
                {BATCH_DATA.map((batch) => (
                  <option key={batch.id} value={batch.id} className="bg-slate-900 text-slate-200">
                    {batch.produceName} ({batch.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl px-4 py-2 flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase font-semibold text-emerald-400/80">Batch Quality Score</div>
                <div className="text-lg font-bold text-emerald-300">{activeBatch.overallHealthScore} / 100</div>
              </div>
              <Activity className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Batch Quick Overview Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block">Variety & Commodity:</span>
            <span className="font-semibold text-slate-200 text-sm">{activeBatch.variety}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Origin Farm:</span>
            <span className="font-semibold text-slate-200 text-sm">{activeBatch.originFarm}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Destination:</span>
            <span className="font-semibold text-slate-200 text-sm">{activeBatch.destination}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Total Journey Time:</span>
            <span className="font-semibold text-slate-200 text-sm">{totalTransitHours} Hours ({Math.round(totalTransitHours/24)} Days)</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('journey')}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'journey'
                ? 'bg-slate-900 text-emerald-400 border-t border-x border-slate-800 border-b-transparent shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Truck className="w-4 h-4" /> Journey Timeline & Microclimate
          </button>
          <button
            onClick={() => setActiveTab('treatments')}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'treatments'
                ? 'bg-slate-900 text-emerald-400 border-t border-x border-slate-800 border-b-transparent shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Wax Coating & Ethylene Gas Regimen
          </button>
          <button
            onClick={() => setActiveTab('nutrients')}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'nutrients'
                ? 'bg-slate-900 text-emerald-400 border-t border-x border-slate-800 border-b-transparent shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Activity className="w-4 h-4" /> Nutrient Retention Curves
          </button>
          <button
            onClick={() => setActiveTab('research')}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'research'
                ? 'bg-slate-900 text-emerald-400 border-t border-x border-slate-800 border-b-transparent shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <FileText className="w-4 h-4" /> Research Suite References
          </button>
        </div>

        {/* TAB 1: JOURNEY TIMELINE */}
        {activeTab === 'journey' && (
          <div className="space-y-6">
            {/* Visual Stepper */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" /> Farm-to-Shelf Journey Progress
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                {activeBatch.stages.map((stage, idx) => {
                  const isCurrent = idx === activeBatch.currentStageIndex;
                  const isCompleted = stage.status === 'completed';
                  const isSelected = stage.id === activeStage.id;

                  return (
                    <div
                      key={stage.id}
                      onClick={() => setSelectedStageId(stage.id)}
                      className={`cursor-pointer rounded-xl p-4 transition-all border ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-950/50 scale-[1.02]'
                          : 'border-slate-800 bg-slate-800/30 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                          isCompleted
                            ? 'bg-emerald-500 text-slate-950'
                            : isCurrent
                            ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20'
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </span>
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                          stage.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : stage.status === 'in-transit'
                            ? 'bg-amber-500/10 text-amber-400 animate-pulse'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          {stage.status}
                        </span>
                      </div>

                      <h3 className="font-semibold text-sm text-slate-200 line-clamp-1">{stage.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{stage.location}</p>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Thermometer className="w-3.5 h-3.5 text-rose-400" /> {stage.tempCelsius}°C
                        </span>
                        <span className="flex items-center gap-1">
                          <Droplet className="w-3.5 h-3.5 text-blue-400" /> {stage.humidityPct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Stage Detail Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">Detailed Stage Inspector</span>
                    <h3 className="text-xl font-bold text-slate-100">{activeStage.name}</h3>
                  </div>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Location: {activeStage.location}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                      <Thermometer className="w-4 h-4 text-rose-400" /> Microclimate Temp
                    </div>
                    <div className="text-xl font-bold text-slate-100">{activeStage.tempCelsius}°C</div>
                    <p className="text-[10px] text-slate-500 mt-1">Optimal Target: 4.0 - 6.0°C</p>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                      <Droplet className="w-4 h-4 text-blue-400" /> Relative Humidity
                    </div>
                    <div className="text-xl font-bold text-slate-100">{activeStage.humidityPct}%</div>
                    <p className="text-[10px] text-slate-500 mt-1">Prevents Transpiration Loss</p>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                      <Clock className="w-4 h-4 text-amber-400" /> Duration
                    </div>
                    <div className="text-xl font-bold text-slate-100">{activeStage.durationHours} hrs</div>
                    <p className="text-[10px] text-slate-500 mt-1">Timestamp: {activeStage.timestamp}</p>
                  </div>
                </div>

                <div className="bg-slate-800/20 border border-slate-800 rounded-xl p-4">
                  <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-emerald-400" /> Stage Operational Log & Technical Observations
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{activeStage.notes}</p>
                </div>
              </div>

              {/* Quick Environmental & Gas Threshold Monitor */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
                    <Wind className="w-5 h-5 text-sky-400" /> Atmosphere & Gas Envelope
                  </h3>

                  <div className="space-y-4 text-xs">
                    <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-800">
                      <div className="text-slate-400 mb-1 font-semibold">Storage Atmosphere Protocol</div>
                      <div className="text-slate-200 font-medium">{activeBatch.treatments.storageAtmosphere}</div>
                    </div>

                    <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-800">
                      <div className="text-slate-400 mb-1 font-semibold">Post-Harvest Wash Sanitizer</div>
                      <div className="text-slate-200 font-medium">{activeBatch.treatments.sanitization}</div>
                    </div>

                    <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-800">
                      <div className="text-slate-400 mb-1 font-semibold">Respiration Suppression Index</div>
                      <div className="text-emerald-400 font-bold">
                        -{activeBatch.treatments.waxCoating.respirationReductionPct}% Metabolic Rate
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Batch Life Expectancy:</span>
                  <span className="font-bold text-slate-200">{activeBatch.expectedShelfLifeDays} Days Total</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WAX COATING & ETHYLENE GAS TREATMENTS */}
        {activeTab === 'treatments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wax Coating Module */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-100">Protective Wax Coating Layer</h3>
                    <p className="text-xs text-slate-400">Lipid/Resin barrier preventing desiccation & gas loss</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                  activeBatch.treatments.waxCoating.applied
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}>
                  {activeBatch.treatments.waxCoating.applied ? 'Applied' : 'Not Applied'}
                </span>
              </div>

              {activeBatch.treatments.waxCoating.applied ? (
                <div className="space-y-4 text-sm">
                  <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Coating Composition Formula</span>
                    <span className="font-semibold text-slate-200">{activeBatch.treatments.waxCoating.type}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 block mb-1">Layer Thickness</span>
                      <span className="text-xl font-bold text-emerald-400">{activeBatch.treatments.waxCoating.thicknessMicrons} μm</span>
                    </div>

                    <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 block mb-1">Respiration Reduction</span>
                      <span className="text-xl font-bold text-emerald-400">{activeBatch.treatments.waxCoating.respirationReductionPct}%</span>
                    </div>
                  </div>

                  <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Application Timestamp:</span>
                    <span className="font-mono text-slate-300">{activeBatch.treatments.waxCoating.applicationDate}</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-800/20 rounded-xl border border-dashed border-slate-800 text-slate-400">
                  <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm">No wax coating applied to this commodity batch.</p>
                  <p className="text-xs text-slate-500 mt-1">Batch relies on specialized modified atmosphere liners or natural cuticular wax.</p>
                </div>
              )}
            </div>

            {/* Ethylene Gas Regimen Module */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
                    <Wind className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-100">Ethylene Gas Regimen (C2H4)</h3>
                    <p className="text-xs text-slate-400">Phytohormone ripening trigger or receptor inhibition</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  {activeBatch.treatments.ethyleneGas.purpose}
                </span>
              </div>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Gas Concentration</span>
                    <span className="text-xl font-bold text-sky-400">{activeBatch.treatments.ethyleneGas.concentrationPpm} PPM</span>
                  </div>

                  <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Exposure Duration</span>
                    <span className="text-xl font-bold text-sky-400">{activeBatch.treatments.ethyleneGas.exposureHours} Hours</span>
                  </div>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Treatment Window Stage</span>
                  <span className="font-semibold text-slate-200">{activeBatch.treatments.ethyleneGas.treatmentWindow}</span>
                </div>

                <div className="bg-sky-950/20 border border-sky-500/20 rounded-xl p-4 text-xs text-sky-200 leading-relaxed">
                  <strong className="block mb-1 text-sky-300 font-semibold">Biochemical Action Mechanism:</strong>
                  Ethylene binds to ETR1 receptors in plant cell membranes, signaling down-stream transcription factors to accelerate chlorophyll degradation, pectin solubilization, and starch hydrolysis.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NUTRIENT RETENTION CURVES */}
        {activeTab === 'nutrients' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" /> Nutrient Preservation & Degradation Model
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Comparing optimized post-harvest cold chain & wax treatment vs standard uncontrolled ambient transit.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
                  <span className="text-slate-300">Optimized Chain (Vitamin C)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
                  <span className="text-slate-300">Standard Transit (Vitamin C)</span>
                </div>
              </div>
            </div>

            {/* Recharts Chart Component */}
            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeBatch.nutrientCurve} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOptimal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorStandard" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="stageName" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} unit="%" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                    labelStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="vitaminC_Optimal"
                    name="Vitamin C Retained (Optimized %)"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorOptimal)"
                  />
                  <Area
                    type="monotone"
                    dataKey="vitaminC_Standard"
                    name="Vitamin C Retained (Uncoated Standard %)"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#colorStandard)"
                  />
                  <Line
                    type="monotone"
                    dataKey="polyphenols_Optimal"
                    name="Polyphenols (Optimized %)"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">Ascorbic Acid (Vit C) Retention</span>
                <p className="text-slate-400">
                  Optimized cold chain and wax coating prevent oxidative degradation of L-ascorbic acid by limiting dissolved oxygen exposure.
                </p>
              </div>

              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">Polyphenol Stability</span>
                <p className="text-slate-400">
                  Controlled low temperature suppresses polyphenol oxidase (PPO) enzyme activity, preventing enzymatic browning.
                </p>
              </div>

              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">Antioxidant Index Curve</span>
                <p className="text-slate-400">
                  Antioxidant capacity peaks during climacteric ethylene ripening window before gradual decline during senescence.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RESEARCH SUITE REFERENCES */}
        {activeTab === 'research' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" /> Linked Post-Harvest Research Questions
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                These query vectors correspond directly to the 20 primary research questions and follow-up investigations in the markdown documentation suite.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeBatch.researchQuestionsRef.map((qNum) => (
                <div key={qNum} className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 hover:border-emerald-500/50 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-emerald-500/30">
                      Markdown Research Q#{qNum}
                    </span>
                    <span className="text-xs text-slate-400">Active Pipeline Topic</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200 mb-2">
                    {qNum === 1 && 'How does carnauba wax coating thickness impact respiration rate and ascorbic acid preservation in avocados?'}
                    {qNum === 2 && 'What is the optimal 1-MCP concentration window for delaying firmness loss in Honeycrisp apples under ULO conditions?'}
                    {qNum === 3 && 'What are the microclimate thermal thresholds required to avoid chilling injury during long-distance banana shipping?'}
                    {qNum === 4 && 'How does ethylene gas conditioning affect sugar-to-acid ratio during climacteric stage transitions?'}
                    {qNum === 5 && 'What is the comparative decay rate of polyphenol antioxidants in standard vs controlled atmosphere storage?'}
                    {qNum > 5 && `Detailed post-harvest metabolic research investigation vector #${qNum}.`}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    Reference markdown documentation files for complete empirical findings, chemical pathways, and gathered research outputs.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SupplyChainTracker;