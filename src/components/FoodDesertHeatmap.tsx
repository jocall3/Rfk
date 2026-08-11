import React, { useState, useMemo } from 'react';
import {
  Layers,
  Filter,
  AlertTriangle,
  Info,
  ZoomIn,
  ZoomOut,
  Maximize2,
  DollarSign,
  ShoppingCart,
  ShieldAlert,
  Search,
  MapPin,
  TrendingUp,
  BarChart2,
  Users,
  Compass,
  RefreshCw,
  X
} from 'lucide-react';

// --- Data Types ---
export type ZoneType = 'urban' | 'rural';

export interface FoodDesertZone {
  id: string;
  name: string;
  regionId: string;
  type: ZoneType;
  severity: number; // 1 to 10
  population: number;
  medianIncome: number;
  vehicleAccessPct: number;
  avgDistanceGroceryMiles: number;
  dollarStoreCount: number;
  supermarketCount: number;
  path: string; // SVG path d attribute
  center: { x: number; y: number };
}

export interface DollarStoreHotspot {
  id: string;
  name: string;
  brand: 'Dollar General' | 'Dollar Tree' | 'Family Dollar' | 'Independent Discount';
  x: number;
  y: number;
  densityScore: number; // 0.1 to 1.0 for heatmap rendering
  openedYear: number;
}

export interface RedliningBoundary {
  id: string;
  code: string;
  areaName: string;
  grade: 'A' | 'B' | 'C' | 'D'; // D = Historically Redlined
  historicalPolicy: string;
  supermarketClosuresPast20Yrs: number;
  loanDenialRatePct: number;
  path: string;
  center: { x: number; y: number };
}

export interface RegionOption {
  id: string;
  name: string;
  state: string;
  type: ZoneType;
  description: string;
  desertCount: number;
  redliningImpactIndex: number;
}

// --- Mock Datasets ---
const REGIONS: RegionOption[] = [
  {
    id: 'detroit-mi',
    name: 'Detroit Metropolitan Area',
    state: 'MI',
    type: 'urban',
    description: 'High concentration of historical supermarket disinvestment and hyper-dense discount store proliferation.',
    desertCount: 14,
    redliningImpactIndex: 8.7,
  },
  {
    id: 'delta-ms',
    name: 'Mississippi Delta Region',
    state: 'MS',
    type: 'rural',
    description: 'Extremely high physical distance to full-service fresh food, compounded by sparse public transit.',
    desertCount: 22,
    redliningImpactIndex: 6.4,
  },
  {
    id: 'chicago-south',
    name: 'South & West Chicago',
    state: 'IL',
    type: 'urban',
    description: 'Severe structural redlining overlaying grocery chain exits and high dollar store saturation.',
    desertCount: 18,
    redliningImpactIndex: 9.2,
  },
];

const FOOD_DESERTS: FoodDesertZone[] = [
  {
    id: 'fd-1',
    name: 'North Detroit Central',
    regionId: 'detroit-mi',
    type: 'urban',
    severity: 9,
    population: 42500,
    medianIncome: 24100,
    vehicleAccessPct: 48,
    avgDistanceGroceryMiles: 3.4,
    dollarStoreCount: 19,
    supermarketCount: 1,
    center: { x: 280, y: 180 },
    path: 'M 210,130 Q 290,110 350,160 Q 340,240 270,230 Q 200,210 210,130 Z',
  },
  {
    id: 'fd-2',
    name: 'Eastside Industrial Belt',
    regionId: 'detroit-mi',
    type: 'urban',
    severity: 8,
    population: 31200,
    medianIncome: 27800,
    vehicleAccessPct: 54,
    avgDistanceGroceryMiles: 2.8,
    dollarStoreCount: 14,
    supermarketCount: 0,
    center: { x: 480, y: 220 },
    path: 'M 400,160 Q 540,150 550,260 Q 460,300 420,250 Q 380,210 400,160 Z',
  },
  {
    id: 'fd-3',
    name: 'Southwest Corridor',
    regionId: 'detroit-mi',
    type: 'urban',
    severity: 6,
    population: 38900,
    medianIncome: 31500,
    vehicleAccessPct: 62,
    avgDistanceGroceryMiles: 2.1,
    dollarStoreCount: 8,
    supermarketCount: 2,
    center: { x: 220, y: 340 },
    path: 'M 140,280 Q 260,270 280,360 Q 220,420 150,390 Q 120,330 140,280 Z',
  },
  {
    id: 'fd-4',
    name: 'Sunflower County Core',
    regionId: 'delta-ms',
    type: 'rural',
    severity: 10,
    population: 24800,
    medianIncome: 21300,
    vehicleAccessPct: 71,
    avgDistanceGroceryMiles: 14.2,
    dollarStoreCount: 26,
    supermarketCount: 1,
    center: { x: 320, y: 240 },
    path: 'M 180,120 Q 420,100 440,320 Q 310,380 200,340 Q 140,220 180,120 Z',
  },
  {
    id: 'fd-5',
    name: 'Leflore Rural Border',
    regionId: 'delta-ms',
    type: 'rural',
    severity: 7,
    population: 18200,
    medianIncome: 25400,
    vehicleAccessPct: 78,
    avgDistanceGroceryMiles: 11.5,
    dollarStoreCount: 15,
    supermarketCount: 2,
    center: { x: 550, y: 310 },
    path: 'M 460,220 Q 620,200 640,380 Q 520,420 450,350 Q 440,280 460,220 Z',
  },
  {
    id: 'fd-6',
    name: 'Englewood & Washington Park',
    regionId: 'chicago-south',
    type: 'urban',
    severity: 9,
    population: 51000,
    medianIncome: 22800,
    vehicleAccessPct: 42,
    avgDistanceGroceryMiles: 2.9,
    dollarStoreCount: 22,
    supermarketCount: 1,
    center: { x: 300, y: 280 },
    path: 'M 220,180 Q 380,170 390,340 Q 300,400 210,350 Q 180,260 220,180 Z',
  },
];

const DOLLAR_STORES: DollarStoreHotspot[] = [
  { id: 'ds-1', name: 'Dollar General #1042', brand: 'Dollar General', x: 260, y: 160, densityScore: 0.9, openedYear: 2011 },
  { id: 'ds-2', name: 'Dollar Tree #882', brand: 'Dollar Tree', x: 290, y: 190, densityScore: 0.85, openedYear: 2014 },
  { id: 'ds-3', name: 'Family Dollar #410', brand: 'Family Dollar', x: 310, y: 150, densityScore: 0.95, openedYear: 2009 },
  { id: 'ds-4', name: 'Dollar General #3319', brand: 'Dollar General', x: 470, y: 210, densityScore: 0.8, openedYear: 2017 },
  { id: 'ds-5', name: 'Dollar Tree #1192', brand: 'Dollar Tree', x: 490, y: 240, densityScore: 0.75, openedYear: 2019 },
  { id: 'ds-6', name: 'Dollar General #9910', brand: 'Dollar General', x: 230, y: 330, densityScore: 0.6, openedYear: 2015 },
  { id: 'ds-7', name: 'Family Dollar #8821', brand: 'Family Dollar', x: 310, y: 230, densityScore: 0.98, openedYear: 2008 },
  { id: 'ds-8', name: 'Dollar General #5002', brand: 'Dollar General', x: 340, y: 260, densityScore: 0.92, openedYear: 2012 },
  { id: 'ds-9', name: 'Dollar General #7721', brand: 'Dollar General', x: 530, y: 290, densityScore: 0.7, openedYear: 2018 },
  { id: 'ds-10', name: 'Dollar Tree #3091', brand: 'Dollar Tree', x: 280, y: 260, densityScore: 0.88, openedYear: 2016 },
  { id: 'ds-11', name: 'Family Dollar #1102', brand: 'Family Dollar', x: 320, y: 310, densityScore: 0.91, openedYear: 2013 },
];

const REDLINING_BOUNDARIES: RedliningBoundary[] = [
  {
    id: 'red-1',
    code: 'D-4',
    areaName: 'District 4 - Historic Disinvestment Sector',
    grade: 'D',
    historicalPolicy: '1938 HOLC Hazardous Classification (Grade D - Red). Refused federal mortgage guarantees.',
    supermarketClosuresPast20Yrs: 6,
    loanDenialRatePct: 41.2,
    center: { x: 290, y: 175 },
    path: 'M 220,140 L 340,120 L 360,220 L 250,240 Z',
  },
  {
    id: 'red-2',
    code: 'D-9',
    areaName: 'District 9 - Industrial Buffer Corridor',
    grade: 'D',
    historicalPolicy: '1940 HOLC Hazardous Rating due to racial composition and industrial proximity.',
    supermarketClosuresPast20Yrs: 4,
    loanDenialRatePct: 38.7,
    center: { x: 470, y: 230 },
    path: 'M 410,170 L 530,160 L 540,280 L 430,280 Z',
  },
  {
    id: 'red-3',
    code: 'C-2',
    areaName: 'District 2 - Declining Transition Zone',
    grade: 'C',
    historicalPolicy: '1938 HOLC Definitely Declining Rating. Capital disinvestment trends accelerated post-1970.',
    supermarketClosuresPast20Yrs: 2,
    loanDenialRatePct: 24.5,
    center: { x: 220, y: 330 },
    path: 'M 150,290 L 270,280 L 260,380 L 140,370 Z',
  },
  {
    id: 'red-4',
    code: 'D-12',
    areaName: 'South Englewood Historic Redlining Zone',
    grade: 'D',
    historicalPolicy: '1940 HOLC Grade D. Complete commercial mortgage freeze leading to modern grocery flight.',
    supermarketClosuresPast20Yrs: 7,
    loanDenialRatePct: 46.8,
    center: { x: 300, y: 280 },
    path: 'M 230,190 L 370,180 L 380,330 L 220,330 Z',
  },
];

export const FoodDesertHeatmap: React.FC = () => {
  // --- States ---
  const [selectedRegionId, setSelectedRegionId] = useState<string>('detroit-mi');
  const [activeLayers, setActiveLayers] = useState<{
    foodDeserts: boolean;
    dollarDensity: boolean;
    redlining: boolean;
    supermarkets: boolean;
  }>({
    foodDeserts: true,
    dollarDensity: true,
    redlining: true,
    supermarkets: true,
  });

  const [minSeverity, setMinSeverity] = useState<number>(1);
  const [maxDistanceMiles, setMaxDistanceMiles] = useState<number>(20);
  const [selectedItem, setSelectedItem] = useState<{
    type: 'desert' | 'dollar' | 'redline';
    data: FoodDesertZone | DollarStoreHotspot | RedliningBoundary;
  } | null>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'map' | 'analytics' | 'methodology'>('map');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // --- Derived Calculations ---
  const currentRegion = useMemo(() => {
    return REGIONS.find((r) => r.id === selectedRegionId) || REGIONS[0];
  }, [selectedRegionId]);

  const filteredDeserts = useMemo(() => {
    return FOOD_DESERTS.filter(
      (d) =>
        d.regionId === selectedRegionId &&
        d.severity >= minSeverity &&
        d.avgDistanceGroceryMiles <= maxDistanceMiles &&
        (searchQuery === '' || d.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [selectedRegionId, minSeverity, maxDistanceMiles, searchQuery]);

  const filteredDollarStores = useMemo(() => {
    return DOLLAR_STORES.filter((ds) => searchQuery === '' || ds.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const filteredRedlineBounds = useMemo(() => {
    return REDLINING_BOUNDARIES.filter(
      (r) => searchQuery === '' || r.areaName.toLowerCase().includes(searchQuery.toLowerCase()) || r.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const aggregateStats = useMemo(() => {
    const totalPop = filteredDeserts.reduce((acc, d) => acc + d.population, 0);
    const avgDistance = filteredDeserts.length
      ? (filteredDeserts.reduce((acc, d) => acc + d.avgDistanceGroceryMiles, 0) / filteredDeserts.length).toFixed(1)
      : '0';
    const totalDollarStores = filteredDeserts.reduce((acc, d) => acc + d.dollarStoreCount, 0);
    const totalSupermarkets = filteredDeserts.reduce((acc, d) => acc + d.supermarketCount, 0);
    const dollarToGroceryRatio = totalSupermarkets > 0 ? (totalDollarStores / totalSupermarkets).toFixed(1) : totalDollarStores.toString();

    return {
      totalPop,
      avgDistance,
      totalDollarStores,
      totalSupermarkets,
      dollarToGroceryRatio,
    };
  }, [filteredDeserts]);

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Food Desert & Retail Hegemony GIS Observatory
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono font-normal">
                v2.4
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Interactive spatial analysis of supermarket redlining, dollar store density, and food access disparities.
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'map' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Map GIS Engine
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'analytics' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" /> Structural Metrics
          </button>
          <button
            onClick={() => setActiveTab('methodology')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'methodology' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Info className="w-3.5 h-3.5" /> Research Framework
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Sidebar Control Panel */}
        <aside className="w-full lg:w-96 border-r border-slate-800 bg-slate-900/60 p-5 flex flex-col gap-6 overflow-y-auto">
          {/* Region Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> Geographic Focus Area
            </label>
            <select
              value={selectedRegionId}
              onChange={(e) => {
                setSelectedRegionId(e.target.value);
                setSelectedItem(null);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500 transition-colors"
            >
              {REGIONS.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.name} ({reg.state}) — [{reg.type.toUpperCase()}]
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed bg-slate-950/50 p-2.5 rounded border border-slate-800/60">
              {currentRegion.description}
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search zone, redlining code, dollar store..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 placeholder-slate-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Layer Control Toggles */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>GIS Data Layers</span>
              <span className="text-[10px] text-slate-500 font-normal">Multi-layer Overlay</span>
            </h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80 cursor-pointer hover:border-slate-700 transition">
                <span className="flex items-center gap-2.5 text-xs text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-300 inline-block" />
                  Food Desert Severities
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.foodDeserts}
                  onChange={() => toggleLayer('foodDeserts')}
                  className="rounded border-slate-800 text-rose-600 focus:ring-rose-500 bg-slate-900"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80 cursor-pointer hover:border-slate-700 transition">
                <span className="flex items-center gap-2.5 text-xs text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-amber-400/80 border border-amber-200 inline-block shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                  Dollar Store Proliferation Hotspots
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.dollarDensity}
                  onChange={() => toggleLayer('dollarDensity')}
                  className="rounded border-slate-800 text-rose-600 focus:ring-rose-500 bg-slate-900"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80 cursor-pointer hover:border-slate-700 transition">
                <span className="flex items-center gap-2.5 text-xs text-slate-300">
                  <span className="w-3 h-3 rounded-md border-2 border-red-500 bg-red-500/20 inline-block" />
                  Supermarket Redlining Boundaries
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.redlining}
                  onChange={() => toggleLayer('redlining')}
                  className="rounded border-slate-800 text-rose-600 focus:ring-rose-500 bg-slate-900"
                />
              </label>
            </div>
          </div>

          {/* Dynamic Filter Sliders */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-rose-400" /> Filter Criteria
            </h3>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Min Severity Index:</span>
                <span className="font-mono text-rose-400 font-bold">{minSeverity} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={minSeverity}
                onChange={(e) => setMinSeverity(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-950 rounded-lg h-1.5 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Max Distance to Grocery:</span>
                <span className="font-mono text-rose-400 font-bold">{maxDistanceMiles} Miles</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={maxDistanceMiles}
                onChange={(e) => setMaxDistanceMiles(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-950 rounded-lg h-1.5 cursor-pointer"
              />
            </div>
          </div>

          {/* Region Analytics Quick Panel */}
          <div className="mt-auto pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Selected Region Metrics
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-500">Desert Population</div>
                <div className="text-sm font-mono font-bold text-slate-200 mt-0.5">
                  {aggregateStats.totalPop.toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-500">Avg Dist to Grocery</div>
                <div className="text-sm font-mono font-bold text-amber-400 mt-0.5">
                  {aggregateStats.avgDistance} mi
                </div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-500">Dollar Store Ratio</div>
                <div className="text-sm font-mono font-bold text-rose-400 mt-0.5">
                  {aggregateStats.dollarToGroceryRatio}:1 Grocery
                </div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-500">Redline Impact</div>
                <div className="text-sm font-mono font-bold text-red-400 mt-0.5">
                  {currentRegion.redliningImpactIndex} / 10
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Display Area (Map / Analytics / Methodology) */}
        <main className="flex-1 bg-slate-950 flex flex-col relative overflow-hidden">
          {activeTab === 'map' && (
            <div className="relative w-full h-full flex-1 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] flex items-center justify-center p-4">
              {/* Map Floating Controls */}
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 shadow-lg transition"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 shadow-lg transition"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(1);
                    setSelectedItem(null);
                  }}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 shadow-lg transition"
                  title="Reset View"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Interactive Vector GIS Engine */}
              <div className="w-full h-full max-w-4xl max-h-[700px] relative flex items-center justify-center">
                <svg
                  viewBox="0 0 800 500"
                  className="w-full h-full transition-transform duration-300 ease-out drop-shadow-2xl select-none"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <defs>
                    {/* Dollar Store Proliferation Radial Heat Gradient */}
                    <radialGradient id="dollarHeat" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#ef4444" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </radialGradient>

                    {/* Food Desert Severity Fill Pattern */}
                    <pattern id="desertHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="0" y2="8" stroke="#f43f5e" strokeWidth="1.5" strokeOpacity="0.3" />
                    </pattern>
                  </defs>

                  {/* Grid Reference Map Backdrop */}
                  <g className="opacity-20" stroke="#334155" strokeWidth="0.5">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <line key={`v-${i}`} x1={i * 50} y1={0} x2={i * 50} y2={500} />
                    ))}
                    {Array.from({ length: 10 }).map((_, i) => (
                      <line key={`h-${i}`} x1={0} y1={i * 50} x2={800} y2={i * 50} />
                    ))}
                  </g>

                  {/* Layer 1: Supermarket Redlining Boundaries */}
                  {activeLayers.redlining &&
                    filteredRedlineBounds.map((boundary) => (
                      <g key={boundary.id} className="cursor-pointer group" onClick={() => setSelectedItem({ type: 'redline', data: boundary })}>
                        <path
                          d={boundary.path}
                          fill="rgba(239, 68, 68, 0.12)"
                          stroke="#ef4444"
                          strokeWidth="2.5"
                          strokeDasharray="6 3"
                          className="transition-all hover:fill-red-500/25 hover:stroke-red-400"
                        />
                        <text
                          x={boundary.center.x}
                          y={boundary.center.y}
                          fill="#fca5a5"
                          fontSize="11"
                          fontWeight="bold"
                          textAnchor="middle"
                          className="pointer-events-none drop-shadow"
                        >
                          HOLC: {boundary.code}
                        </text>
                      </g>
                    ))}

                  {/* Layer 2: Food Desert Zones */}
                  {activeLayers.foodDeserts &&
                    filteredDeserts.map((desert) => (
                      <g key={desert.id} className="cursor-pointer group" onClick={() => setSelectedItem({ type: 'desert', data: desert })}>
                        <path
                          d={desert.path}
                          fill="url(#desertHatch)"
                          stroke="#f43f5e"
                          strokeWidth="2"
                          className="transition-all hover:opacity-80"
                        />
                        <path
                          d={desert.path}
                          fill={desert.severity >= 8 ? 'rgba(244, 63, 94, 0.25)' : 'rgba(251, 146, 60, 0.18)'}
                        />
                        <circle cx={desert.center.x} cy={desert.center.y} r="4" fill="#f43f5e" />
                        <text
                          x={desert.center.x}
                          y={desert.center.y - 10}
                          fill="#fecdd3"
                          fontSize="10"
                          fontWeight="600"
                          textAnchor="middle"
                          className="pointer-events-none drop-shadow"
                        >
                          {desert.name}
                        </text>
                      </g>
                    ))}

                  {/* Layer 3: Dollar Store Density Heatmap */}
                  {activeLayers.dollarDensity &&
                    filteredDollarStores.map((ds) => (
                      <g key={ds.id} className="cursor-pointer group" onClick={() => setSelectedItem({ type: 'dollar', data: ds })}>
                        {/* Density Aura */}
                        <circle
                          cx={ds.x}
                          cy={ds.y}
                          r={35 * ds.densityScore}
                          fill="url(#dollarHeat)"
                          className="animate-pulse"
                          style={{ animationDuration: `${3 / ds.densityScore}s` }}
                        />
                        {/* Store Pin */}
                        <circle
                          cx={ds.x}
                          cy={ds.y}
                          r="5"
                          fill="#fbbf24"
                          stroke="#78350f"
                          strokeWidth="1.5"
                          className="group-hover:scale-125 transition-transform"
                        />
                        <text
                          x={ds.x + 8}
                          y={ds.y + 3}
                          fill="#fef08a"
                          fontSize="8"
                          className="opacity-0 group-hover:opacity-100 transition-opacity font-mono pointer-events-none"
                        >
                          {ds.brand}
                        </text>
                      </g>
                    ))}
                </svg>

                {/* Legend Overlay */}
                <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur border border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-2">
                  <div className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1">
                    GIS Layer Legend
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-3 h-3 rounded bg-rose-500/30 border border-rose-500" />
                    <span>Food Desert Hazard Zone</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-600" />
                    <span>Dollar Store Proliferation Hotspot</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-3 h-1 border-t-2 border-dashed border-red-500" />
                    <span>Supermarket Redlining Boundary (HOLC Grade D)</span>
                  </div>
                </div>
              </div>

              {/* Selected GIS Entity Detail Modal / Drawer */}
              {selectedItem && (
                <div className="absolute bottom-4 right-4 w-80 bg-slate-900/95 backdrop-blur border border-slate-800 p-4 rounded-xl shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-start justify-between pb-2 border-b border-slate-800 mb-3">
                    <div className="flex items-center gap-2">
                      {selectedItem.type === 'desert' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                      {selectedItem.type === 'dollar' && <DollarSign className="w-4 h-4 text-amber-400" />}
                      {selectedItem.type === 'redline' && <ShieldAlert className="w-4 h-4 text-red-400" />}
                      <h3 className="text-sm font-bold text-white capitalize">
                        {selectedItem.type} Entity Detail
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Render Data Based on Selected Type */}
                  {selectedItem.type === 'desert' && (
                    <div className="space-y-2 text-xs">
                      <div className="font-semibold text-rose-300 text-sm">
                        {(selectedItem.data as FoodDesertZone).name}
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Area Classification:</span>
                        <span className="font-mono uppercase text-slate-200">
                          {(selectedItem.data as FoodDesertZone).type}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Severity Score:</span>
                        <span className="font-mono text-rose-400 font-bold">
                          {(selectedItem.data as FoodDesertZone).severity} / 10
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Population Affected:</span>
                        <span className="font-mono text-slate-200">
                          {(selectedItem.data as FoodDesertZone).population.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Median HH Income:</span>
                        <span className="font-mono text-emerald-400">
                          ${(selectedItem.data as FoodDesertZone).medianIncome.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Vehicle Access:</span>
                        <span className="font-mono text-slate-200">
                          {(selectedItem.data as FoodDesertZone).vehicleAccessPct}%
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Dollar vs Supermarket:</span>
                        <span className="font-mono text-amber-400 font-bold">
                          {(selectedItem.data as FoodDesertZone).dollarStoreCount} / {(selectedItem.data as FoodDesertZone).supermarketCount}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedItem.type === 'dollar' && (
                    <div className="space-y-2 text-xs">
                      <div className="font-semibold text-amber-300 text-sm">
                        {(selectedItem.data as DollarStoreHotspot).name}
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Retail Brand:</span>
                        <span className="font-mono text-slate-200">
                          {(selectedItem.data as DollarStoreHotspot).brand}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Establishment Year:</span>
                        <span className="font-mono text-slate-200">
                          {(selectedItem.data as DollarStoreHotspot).openedYear}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Saturation Index:</span>
                        <span className="font-mono text-amber-400 font-bold">
                          {((selectedItem.data as DollarStoreHotspot).densityScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedItem.type === 'redline' && (
                    <div className="space-y-2 text-xs">
                      <div className="font-semibold text-red-400 text-sm">
                        {(selectedItem.data as RedliningBoundary).areaName}
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">HOLC Rating:</span>
                        <span className="font-mono text-red-500 font-bold">
                          Grade {(selectedItem.data as RedliningBoundary).grade} (Hazardous)
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Supermarket Closures (20yr):</span>
                        <span className="font-mono text-slate-200">
                          {(selectedItem.data as RedliningBoundary).supermarketClosuresPast20Yrs} Outlets
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Loan Denial Rate:</span>
                        <span className="font-mono text-rose-400 font-bold">
                          {(selectedItem.data as RedliningBoundary).loanDenialRatePct}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 italic leading-tight">
                        &quot;{(selectedItem.data as RedliningBoundary).historicalPolicy}&quot;
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Analytics View Tab */}
          {activeTab === 'analytics' && (
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">Structural Food Equity & Disinvestment Metrics</h2>
                  <p className="text-xs text-slate-400">Comparative dataset breaking down spatial disparities by urban vs. rural classification.</p>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/50">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-3">Zone Name</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Severity</th>
                      <th className="p-3">Population</th>
                      <th className="p-3">Median Income</th>
                      <th className="p-3">Dist. to Grocery</th>
                      <th className="p-3">Dollar Stores</th>
                      <th className="p-3">Supermarkets</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredDeserts.map((desert) => (
                      <tr key={desert.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-semibold text-white">{desert.name}</td>
                        <td className="p-3 font-mono uppercase text-slate-400">{desert.type}</td>
                        <td className="p-3 font-mono font-bold text-rose-400">{desert.severity} / 10</td>
                        <td className="p-3 font-mono">{desert.population.toLocaleString()}</td>
                        <td className="p-3 font-mono text-emerald-400">${desert.medianIncome.toLocaleString()}</td>
                        <td className="p-3 font-mono text-amber-400">{desert.avgDistanceGroceryMiles} mi</td>
                        <td className="p-3 font-mono text-amber-300">{desert.dollarStoreCount}</td>
                        <td className="p-3 font-mono text-indigo-400">{desert.supermarketCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Research Methodology View Tab */}
          {activeTab === 'methodology' && (
            <div className="flex-1 p-8 overflow-y-auto max-w-4xl space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-rose-400" /> Theoretical Framework & Research Context
              </h2>
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <p>
                  This observational GIS portal provides structural mapping of spatial food disparities across urban core environments and rural agricultural belts. The engine correlates historical economic exclusion with present-day commercial retail density.
                </p>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <h3 className="font-bold text-rose-300 uppercase tracking-wider text-[11px]">1. Supermarket Redlining</h3>
                  <p>
                    Supermarket redlining refers to the systematic avoidance and relocation of major food retailers away from low-income, racially segregated urban areas into high-income suburban periphery.
                  </p>
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <h3 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">2. Dollar Store Proliferation Density</h3>
                  <p>
                    Discount retail chains utilize predatory location tactics targeting disinvested food deserts. While offering low-cost non-perishable goods, they rarely stock fresh produce and undercut local grocery viability.
                  </p>
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <h3 className="font-bold text-indigo-300 uppercase tracking-wider text-[11px]">3. Urban vs. Rural Distinctions</h3>
                  <p>
                    The USDA defines urban food deserts as low-income census tracts situated beyond 1 mile from a supermarket. Rural deserts are defined by distances exceeding 10 miles.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FoodDesertHeatmap;