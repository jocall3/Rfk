import React, { useState, useMemo } from 'react';

// --- TYPES & INTERFACES ---

export type DomainType = 'all' | 'slotting' | 'consolidation' | 'supply_chain' | 'snap_capture';

export interface KeyMetric {
  id: string;
  domain: DomainType;
  title: string;
  value: string;
  subtext: string;
  change: string;
  isPositive: boolean; // positive impact or trend direction
  benchmark: string;
  status: 'Critical' | 'Warning' | 'Stable' | 'Optimal';
}

export interface RetailerMatrixEntry {
  retailer: string;
  marketShare: string;
  avgSlottingFeePerSKU: string;
  avgSupplyChainMiles: number;
  snapCaptureVolume: string; // e.g. "$8.4B"
  snapSharePercent: number;
  cr4Contribution: string;
  riskLevel: 'High' | 'Moderate' | 'Low';
}

export interface PolicyInsight {
  id: string;
  domain: DomainType;
  title: string;
  description: string;
  statHighlight: string;
  actionItem: string;
}

// --- MOCK DATA ---

const METRICS: KeyMetric[] = [
  {
    id: 'm1',
    domain: 'slotting',
    title: 'Avg Slotting Fee per SKU',
    value: '$48,500',
    subtext: 'National Supermarket Chains',
    change: '+14.2% YoY',
    isPositive: false,
    benchmark: '2019 Avg: $32,000',
    status: 'Critical',
  },
  {
    id: 'm2',
    domain: 'consolidation',
    title: 'Grocery CR4 Index',
    value: '68.4%',
    subtext: 'Top 4 Retailers Market Share',
    change: '+3.1% YoY',
    isPositive: false,
    benchmark: 'FTC Moderate Threshold: < 40%',
    status: 'Critical',
  },
  {
    id: 'm3',
    domain: 'supply_chain',
    title: 'Avg Supply Chain Miles',
    value: '1,640 mi',
    subtext: 'Farm-to-Shelf Transit Distance',
    change: '-2.4% YoY',
    isPositive: true,
    benchmark: 'Regional Target: < 500 mi',
    status: 'Warning',
  },
  {
    id: 'm4',
    domain: 'snap_capture',
    title: 'SNAP Dollars to Top 4 Chains',
    value: '$52.8B',
    subtext: '56% of Total Annual SNAP Allocations',
    change: '+8.7% YoY',
    isPositive: false,
    benchmark: '2018 Level: 44%',
    status: 'Warning',
  },
];

const MATRIX_DATA: RetailerMatrixEntry[] = [
  {
    retailer: 'MegaMart Global (Corp A)',
    marketShare: '28.5%',
    avgSlottingFeePerSKU: '$75,000',
    avgSupplyChainMiles: 1850,
    snapCaptureVolume: '$24.2B',
    snapSharePercent: 25.8,
    cr4Contribution: 'Primary Driver',
    riskLevel: 'High',
  },
  {
    retailer: 'Apex Retail Alliance (Corp B)',
    marketShare: '16.2%',
    avgSlottingFeePerSKU: '$52,000',
    avgSupplyChainMiles: 1620,
    snapCaptureVolume: '$13.1B',
    snapSharePercent: 14.0,
    cr4Contribution: 'Major Driver',
    riskLevel: 'High',
  },
  {
    retailer: 'National Food Stores (Corp C)',
    marketShare: '12.8%',
    avgSlottingFeePerSKU: '$41,000',
    avgSupplyChainMiles: 1490,
    snapCaptureVolume: '$9.4B',
    snapSharePercent: 10.0,
    cr4Contribution: 'Major Driver',
    riskLevel: 'High',
  },
  {
    retailer: 'Urban Fresh Holdings (Corp D)',
    marketShare: '10.9%',
    avgSlottingFeePerSKU: '$38,500',
    avgSupplyChainMiles: 1210,
    snapCaptureVolume: '$6.1B',
    snapSharePercent: 6.5,
    cr4Contribution: 'Core Contributor',
    riskLevel: 'Moderate',
  },
  {
    retailer: 'Regional Independent Co-Op Network',
    marketShare: '18.4%',
    avgSlottingFeePerSKU: '$8,200',
    avgSupplyChainMiles: 480,
    snapCaptureVolume: '$14.2B',
    snapSharePercent: 15.1,
    cr4Contribution: 'Non-CR4 Fragmented',
    riskLevel: 'Low',
  },
  {
    retailer: 'Discount Super Value Inc.',
    marketShare: '13.2%',
    avgSlottingFeePerSKU: '$18,000',
    avgSupplyChainMiles: 2100,
    snapCaptureVolume: '$26.8B',
    snapSharePercent: 28.6,
    cr4Contribution: 'Non-CR4 Top Alternative',
    riskLevel: 'Moderate',
  },
];

const INSIGHTS: PolicyInsight[] = [
  {
    id: 'i1',
    domain: 'slotting',
    title: 'Slotting Fees Acting as Barrier to Small/BAME Agri-Producers',
    description: 'Upfront slotting fees exceeding $50k per SKU in top 3 chains create artificial market entry barriers, stifling local supply chain innovations.',
    statHighlight: '$75k max fee',
    actionItem: 'Examine FTC Section 5 enforcement against non-transparent pay-to-play shelf arrangements.',
  },
  {
    id: 'i2',
    domain: 'consolidation',
    title: 'Monopsony Power Suppressing Farm Gate Prices',
    description: 'Top 4 grocery giants control over 68% of national sales, allowing buyer monopolies to dictate razor-thin margins to food producers.',
    statHighlight: '68.4% CR4 Index',
    actionItem: 'Model regional antitrust impacts for proposed mega-mergers across Midwest corridors.',
  },
  {
    id: 'i3',
    domain: 'supply_chain',
    title: 'Food Miles & Cold Chain Vulnerability',
    description: 'Average transit distance remains over 1,600 miles due to centralized distribution hubs, driving vulnerability to diesel price shocks.',
    statHighlight: '1,640 Avg Miles',
    actionItem: 'Incentivize regional hub development within 250-mile farm radiuses via farm bill subsidies.',
  },
  {
    id: 'i4',
    domain: 'snap_capture',
    title: 'SNAP Subsidies Driving Corporate Revenue Lock-In',
    description: 'Over $52 Billion in taxpayer-funded SNAP benefits flow directly into top corporate grocers, funding shareholder buybacks while tax bases subsidize low-wage store workers.',
    statHighlight: '56% SNAP Capture',
    actionItem: 'Propose double-up food buck expansions exclusively redeemable at regional co-ops & direct farmers.',
  },
];

// --- COMPONENT ---

export const RetailMatrixSummary: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<DomainType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'matrix' | 'insights'>('overview');

  const filteredMetrics = useMemo(() => {
    if (selectedDomain === 'all') return METRICS;
    return METRICS.filter((m) => m.domain === selectedDomain);
  }, [selectedDomain]);

  const filteredInsights = useMemo(() => {
    if (selectedDomain === 'all') return INSIGHTS;
    return INSIGHTS.filter((i) => i.domain === selectedDomain);
  }, [selectedDomain]);

  const filteredMatrix = useMemo(() => {
    if (!searchQuery) return MATRIX_DATA;
    return MATRIX_DATA.filter((row) =>
      row.retailer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const getStatusColor = (status: KeyMetric['status']) => {
    switch (status) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Warning':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Stable':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Optimal':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getRiskBadge = (risk: RetailerMatrixEntry['riskLevel']) => {
    switch (risk) {
      case 'High':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Moderate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="w-full bg-slate-900 text-slate-100 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      {/* HEADER SECTION */}
      <header className="mb-8 border-b border-slate-800 pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-indigo-900/80 text-indigo-300 border border-indigo-700">
                Executive Intelligence Brief
              </span>
              <span className="text-xs text-slate-400">Research Phase 1 Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Retail Food System Structural Analysis Matrix
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Cross-domain empirical dashboard evaluating market power, pay-to-play slotting, supply chain mileage, and taxpayer SNAP capital capture.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition flex items-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Export Report
            </button>
          </div>
        </div>

        {/* DOMAIN FILTER BAR */}
        <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800/60">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
            Focus Pillar:
          </span>
          {[
            { id: 'all', label: 'All Pillars' },
            { id: 'slotting', label: 'Slotting Fees' },
            { id: 'consolidation', label: 'Market Consolidation' },
            { id: 'supply_chain', label: 'Supply Chain Miles' },
            { id: 'snap_capture', label: 'SNAP Taxpayer Capture' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedDomain(tab.id as DomainType)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                selectedDomain === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* KPI METRIC CARDS GRID */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Macro System Indicators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredMetrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-slate-800/90 rounded-xl p-5 border border-slate-700/60 shadow-lg relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400 truncate max-w-[160px]">
                    {metric.title}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${getStatusColor(
                      metric.status
                    )}`}
                  >
                    {metric.status}
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight my-1">
                  {metric.value}
                </div>
                <p className="text-xs text-slate-400">{metric.subtext}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
                <span
                  className={`font-semibold flex items-center gap-1 ${
                    metric.isPositive ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {metric.isPositive ? '▲' : '▼'} {metric.change}
                </span>
                <span className="text-slate-500 text-[11px] truncate max-w-[120px]">
                  {metric.benchmark}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DASHBOARD TABS */}
      <div className="flex items-center gap-4 border-b border-slate-800 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-semibold transition border-b-2 ${
            activeTab === 'overview'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Executive Summary & Dynamics
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`pb-3 text-sm font-semibold transition border-b-2 ${
            activeTab === 'matrix'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Retailer Comparison Matrix
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`pb-3 text-sm font-semibold transition border-b-2 ${
            activeTab === 'insights'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Policy Risk & Regulatory Findings ({filteredInsights.length})
        </button>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Executive Overview Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SNAP vs Market Power Synthesis */}
            <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
                  SNAP Subsidy Capture vs Market Concentration
                </h3>
                <span className="text-xs text-indigo-400 font-mono">$52.8B / Yr Flow</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Federal food assistance programs (SNAP) function as a guaranteed revenue baseline for top consolidated retailers. With over 56% of SNAP funds flowing directly to the four largest grocers, taxpayer funds reinforce market consolidation rather than decentralizing agricultural resiliency.
              </p>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">MegaMart Global SNAP Share</span>
                    <span className="text-indigo-300 font-bold">25.8%</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '25.8%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Discount Super Value SNAP Share</span>
                    <span className="text-emerald-300 font-bold">28.6%</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '28.6%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Independent Retailers Total Combined</span>
                    <span className="text-amber-300 font-bold">15.1%</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '15.1%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supply Chain & Slotting Friction */}
            <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  Slotting Pay-to-Play vs Food System Vulnerability
                </h3>
                <span className="text-xs text-amber-400 font-mono">1,640 Avg Miles</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                High slotting allowances ($48.5k avg/SKU) force regional growers to endure longer supply routes to reach national aggregation points before shipping back to local distribution hubs, increasing overall transport miles and fossil fuel reliance.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/40">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Avg Top-Tier Slotting Fee</span>
                  <span className="text-xl font-bold text-red-400 mt-1 block">$75,000</span>
                  <span className="text-[10px] text-slate-500">Per SKU / Prime Placement</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/40">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Co-Op Regional Transit</span>
                  <span className="text-xl font-bold text-emerald-400 mt-1 block">480 Miles</span>
                  <span className="text-[10px] text-slate-500">70% Less Distance Traveled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Summary Matrix Stream */}
          <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/60">
            <h3 className="text-base font-bold text-white mb-3">Key Synthesis Findings for Policy Frameworks</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-800/90 rounded-lg border border-slate-700">
                <div className="text-indigo-400 font-bold mb-1">1. Anti-Competitive Tollbooths</div>
                <p className="text-slate-300 leading-normal">
                  Slotting fees function as non-refundable economic rent, effectively locking independent farmers out of tier-1 retail shelves regardless of product quality or price.
                </p>
              </div>
              <div className="p-4 bg-slate-800/90 rounded-lg border border-slate-700">
                <div className="text-amber-400 font-bold mb-1">2. Vulnerable Food Deserts</div>
                <p className="text-slate-300 leading-normal">
                  Consolidated grocers disproportionately direct SNAP funds into centralized supply lines that collapse under regional climate or logistics disruptions.
                </p>
              </div>
              <div className="p-4 bg-slate-800/90 rounded-lg border border-slate-700">
                <div className="text-emerald-400 font-bold mb-1">3. Reform Opportunities</div>
                <p className="text-slate-300 leading-normal">
                  Decentralized procurement rules in SNAP processing can redirect $15B+ directly into regional producer hubs, cutting transit miles by up to 60%.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MATRIX TABLE */}
      {activeTab === 'matrix' && (
        <div className="bg-slate-800/80 rounded-xl border border-slate-700/80 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Retailer-Level Metric Breakdown</h3>
              <p className="text-xs text-slate-400">Comparing dominant retail conglomerates against independent co-op networks</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search retailer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-md px-3 py-1.5 w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-700">
                <tr>
                  <th className="p-3.5">Retailer Entity</th>
                  <th className="p-3.5">Grocery Mkt Share</th>
                  <th className="p-3.5">Avg Slotting Fee</th>
                  <th className="p-3.5">Supply Chain Miles</th>
                  <th className="p-3.5">SNAP Capture Vol</th>
                  <th className="p-3.5">% total SNAP</th>
                  <th className="p-3.5">Systemic Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-700/30 transition">
                    <td className="p-3.5 font-medium text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                      {row.retailer}
                    </td>
                    <td className="p-3.5 font-mono">{row.marketShare}</td>
                    <td className="p-3.5 font-mono text-amber-300">{row.avgSlottingFeePerSKU}</td>
                    <td className="p-3.5 font-mono">{row.avgSupplyChainMiles} mi</td>
                    <td className="p-3.5 font-mono text-emerald-300">{row.snapCaptureVolume}</td>
                    <td className="p-3.5 font-mono">{row.snapSharePercent}%</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskBadge(
                          row.riskLevel
                        )}`}
                      >
                        {row.riskLevel} Risk
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: INSIGHTS & POLICY */}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInsights.map((insight) => (
            <div
              key={insight.id}
              className="bg-slate-800/80 rounded-xl p-6 border border-slate-700/70 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    Pillar: {insight.domain.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {insight.statHighlight}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{insight.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {insight.description}
                </p>
              </div>

              <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-700/80">
                <span className="text-[10px] font-bold uppercase text-indigo-400 tracking-wider block mb-1">
                  Recommended Legislative / Executive Intervention:
                </span>
                <p className="text-xs text-slate-200 font-medium">{insight.actionItem}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RESEARCH CONTEXT FOOTER */}
      <footer className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <span>Integrated Food Matrix Engine • Part of 40-Part System Inquiry File Set</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-300 cursor-pointer">Question Set 1–20 Complete</span>
          <span>•</span>
          <span className="hover:text-slate-300 cursor-pointer">Research Vectors 21–40 Active</span>
        </div>
      </footer>
    </div>
  );
};

export default RetailMatrixSummary;