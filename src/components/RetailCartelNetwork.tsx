import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
  Layers,
  Info,
  ShieldAlert,
  Building2,
  Store,
  Package,
  Network,
  X,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  FileText,
  DollarSign,
  PieChart,
  Eye,
  Maximize2
} from 'lucide-react';

// Node Types and Interfaces
export type NodeType = 'parent' | 'banner' | 'captain' | 'mechanism';

export interface NetworkNode {
  id: string;
  label: string;
  type: NodeType;
  subtext?: string;
  marketShare?: string;
  revenue?: string;
  description: string;
  antiCompetitivePractices: string[];
  keyBrandsOrSubsidiaries?: string[];
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  radius?: number;
  color?: string;
}

export interface NetworkLink {
  source: string;
  target: string;
  label?: string;
  type?: 'ownership' | 'dominance' | 'leverage' | 'cartel';
  strength?: number;
}

// Initial Data Set
const INITIAL_NODES: NetworkNode[] = [
  // Parent Conglomerates
  {
    id: 'kroger-albertsons',
    label: 'Kroger - Albertsons Mega-Entity',
    type: 'parent',
    subtext: 'Merged Parent Giant',
    marketShare: '~22% US Grocery Market',
    revenue: '$210B Combined',
    description: 'Proposed $24.6B merger creating a duopoly competitor to Walmart, controlling over 4,900 stores and 66 distribution centers nationwide.',
    antiCompetitivePractices: [
      'Buyer Monopsony over regional farmers and producers',
      'Unified dynamic algorithmic pricing engines across competing banners',
      'Elimination of union competition in overlapping metropolitan areas',
      'Joint Retail Media Network data monetization'
    ],
    keyBrandsOrSubsidiaries: ['Ralphs', 'Safeway', 'Vons', 'Harris Teeter', 'Fred Meyer', 'Jewel-Osco', 'King Soopers']
  },
  {
    id: 'walmart',
    label: 'Walmart Inc.',
    type: 'parent',
    subtext: 'Dominant Monopsonist',
    marketShare: '28.5% US Grocery Market',
    revenue: '$600B+ Global ($420B US Grocery/Retail)',
    description: 'The single largest food retailer in the United States, dictating wholesale terms, supplier margins, and nationwide price benchmarks.',
    antiCompetitivePractices: [
      'OTIF (On-Time In-Full) penalty fees driving smaller brands out of stock',
      'Predatory below-cost price positioning subsidized by general merchandise',
      'Monopsonistic wage suppression in rural labor markets',
      'Dominant slotting leverage preventing craft brand exposure'
    ],
    keyBrandsOrSubsidiaries: ['Walmart Supercenter', 'Sam\'s Club', 'Walmart Neighborhood Market']
  },
  {
    id: 'ahold-delhaize',
    label: 'Ahold Delhaize',
    type: 'parent',
    subtext: 'Transatlantic Giant',
    marketShare: '~6.5% US Grocery Market',
    revenue: '$88B (US Operations)',
    description: 'Dutch-Belgian multinational dominating the US East Coast grocery corridor through consolidated regional monopolies.',
    antiCompetitivePractices: [
      'Joint purchasing alliances leveraging global volume against regional suppliers',
      'Direct Store Delivery (DSD) access restrictions',
      'Zone-based price discrimination in non-competitive zip codes'
    ],
    keyBrandsOrSubsidiaries: ['Food Lion', 'Stop & Shop', 'Giant Food', 'Hannaford', 'Peapod']
  },
  {
    id: 'amazon',
    label: 'Amazon.com / Whole Foods',
    type: 'parent',
    subtext: 'Tech-Retail Monopoly',
    marketShare: '~4.2% US Grocery (Growing Fast)',
    revenue: '$520B Total ($35B US Grocery)',
    description: 'Combines physical grocery infrastructure (Whole Foods, Fresh) with unmatched algorithmic consumer surveillance and Prime lock-in.',
    antiCompetitivePractices: [
      'Self-preferencing Amazon 365 private label over third-party sellers',
      'Biometric & algorithmic customer data tracking to extract maximum price elasticity',
      'Cross-subsidizing retail grocery losses through AWS cloud monopoly profits'
    ],
    keyBrandsOrSubsidiaries: ['Whole Foods Market', 'Amazon Fresh', 'Amazon Go']
  },

  // Regional Banners
  {
    id: 'ralphs',
    label: 'Ralphs',
    type: 'banner',
    subtext: 'SoCal Division (Kroger)',
    description: 'Dominant supermarket chain in Southern California operating as a Kroger subsidiary.',
    antiCompetitivePractices: ['Shared regional distribution coordination', 'High private-label margin extraction']
  },
  {
    id: 'safeway',
    label: 'Safeway',
    type: 'banner',
    subtext: 'NorCal & West (Albertsons)',
    description: 'Major Pacific & Mountain banner under Albertsons umbrella.',
    antiCompetitivePractices: ['Dynamic ESL (Electronic Shelf Label) price testing', 'Exclusive local supplier lock-in']
  },
  {
    id: 'harris-teeter',
    label: 'Harris Teeter',
    type: 'banner',
    subtext: 'Mid-Atlantic (Kroger)',
    description: 'Upscale regional banner acquired by Kroger to dominate suburban Mid-Atlantic demographics.',
    antiCompetitivePractices: ['Precision targeted pricing via VIP loyalty profiling']
  },
  {
    id: 'food-lion',
    label: 'Food Lion',
    type: 'banner',
    subtext: 'Southeast Corridor (Ahold)',
    description: 'Value-focused banner dominating low-to-middle income Southeast regions.',
    antiCompetitivePractices: ['Concentrated regional grocery desert footprint control']
  },

  // CPG Category Captains
  {
    id: 'pepsico',
    label: 'PepsiCo Inc.',
    type: 'captain',
    subtext: 'Snack & Beverage Oligopoly',
    marketShare: '64% Salty Snacks (Frito-Lay)',
    revenue: '$91B Global',
    description: 'Acts as the official "Category Captain" for snacks and soft drinks in major chains, dictating competitor shelf placement and pricing.',
    antiCompetitivePractices: [
      'Category Captain conflict of interest: managing shelf layout to downgrade competitors',
      'Tying arrangements: forcing retailers to take low-margin drinks to get high-demand chips',
      'Direct Store Delivery (DSD) control of prime eye-level shelf real estate'
    ],
    keyBrandsOrSubsidiaries: ['Frito-Lay', 'Lay\'s', 'Doritos', 'Quaker Oats', 'Gatorade', 'Tropicana']
  },
  {
    id: 'nestle',
    label: 'Nestlé S.A.',
    type: 'captain',
    subtext: 'Global Food Conglomerate',
    marketShare: 'Top 3 in Frozen & Pet Care',
    revenue: '$102B Global',
    description: 'World\'s largest CPG entity leveraging unmatched portfolio scale to dictate slotting allowances and endcap displays.',
    antiCompetitivePractices: [
      'Slotting fee inflation to price out independent natural food producers',
      'Parallel pricing coordination with competitors during inflationary cycles',
      'Shrinkflation margin protection strategies'
    ],
    keyBrandsOrSubsidiaries: ['Stouffer\'s', 'DiGiorno', 'Gerber', 'Purina', 'Nespresso', 'Toll House']
  },
  {
    id: 'pg',
    label: 'Procter & Gamble',
    type: 'captain',
    subtext: 'Household & Hygiene Monopoly',
    marketShare: '50%+ Laundry & Paper Products',
    revenue: '$82B Global',
    description: ' Dominates non-perishable grocery aisles, leveraging indispensable brands like Tide to enforce minimum resale price agreements.',
    antiCompetitivePractices: [
      'Must-carry brand leverage blocking regional eco-brands',
      'Category management advisory bias',
      'Predatory trade promotion spend'
    ],
    keyBrandsOrSubsidiaries: ['Tide', 'Pampers', 'Gillette', 'Bounty', 'Crest', 'Charmin']
  },
  {
    id: 'kraft-heinz',
    label: 'Kraft Heinz Co.',
    type: 'captain',
    subtext: 'Packaged Foods Giant',
    marketShare: '60%+ Ketchup & Packaged Meals',
    revenue: '$26B Global',
    description: 'Controlled by 3G Capital and Berkshire Hathaway; pioneer in financialized zero-based budgeting driving market consolidation.',
    antiCompetitivePractices: [
      'Coordinated list-price hikes exceeding cost inflation',
      'Shelf-space volume bundling across disparate grocery categories'
    ],
    keyBrandsOrSubsidiaries: ['Kraft Mac & Cheese', 'Heinz', 'Oscar Mayer', 'Lunchables', 'Velveeta']
  },

  // Monopoly Mechanisms & Anti-Competitive Vectors
  {
    id: 'mech-category-captaincy',
    label: 'Category Captaincy System',
    type: 'mechanism',
    subtext: 'Structural Conflict of Interest',
    description: 'Retailers outsource aisle layout and inventory planning to the top manufacturer (e.g. PepsiCo), giving the CPG direct power to hide competitors.',
    antiCompetitivePractices: [
      'Algorithmic disadvantage to independent brands',
      'Biased planogram design favoring captain products',
      'Opaque trade spend rebates'
    ]
  },
  {
    id: 'mech-slotting-fees',
    label: 'Pay-to-Play Slotting Fees',
    type: 'mechanism',
    subtext: 'Entry Barrier Tolls',
    description: 'Upfront fees charged by grocers ($10,000 - $100,000 per SKU per region) simply to place new items on store shelves.',
    antiCompetitivePractices: [
      'Capital gatekeeping excluding artisanal/local producers',
      'Risk transference from retailer to small supplier',
      'Artificially high capital requirements for market entry'
    ]
  },
  {
    id: 'mech-dynamic-pricing',
    label: 'ESL & Dynamic Price Surge',
    type: 'mechanism',
    subtext: 'Algorithmic Price Extraction',
    description: 'Electronic Shelf Labels connected to AI tools (e.g., Revionics) allowing real-time price surges based on weather, demand, and income demographic.',
    antiCompetitivePractices: [
      'Price gouging during extreme weather or supply pinches',
      'Personalized customer pricing via loyalty data',
      'Tacit collusion across competing banners using shared software'
    ]
  },
  {
    id: 'mech-retail-media',
    label: 'Retail Media Networks (RMN)',
    type: 'mechanism',
    subtext: 'Surveillance Monetization',
    description: 'Retailers charging CPGs billions for digital & in-store targeted advertising, effectively creating a secondary extortion funnel.',
    antiCompetitivePractices: [
      'Pay-for-search placement in grocery apps',
      'Monetization of consumer purchasing history without compensation',
      'Margin extraction disguised as marketing services'
    ]
  }
];

const INITIAL_LINKS: NetworkLink[] = [
  // Parent to Banner
  { source: 'kroger-albertsons', target: 'ralphs', label: 'Owns & Operates', type: 'ownership', strength: 2 },
  { source: 'kroger-albertsons', target: 'safeway', label: 'Owns & Operates', type: 'ownership', strength: 2 },
  { source: 'kroger-albertsons', target: 'harris-teeter', label: 'Owns & Operates', type: 'ownership', strength: 2 },
  { source: 'ahold-delhaize', target: 'food-lion', label: 'Owns & Operates', type: 'ownership', strength: 2 },

  // CPG Captains to Parents
  { source: 'pepsico', target: 'walmart', label: 'Top Supplier / Direct Logistics', type: 'dominance', strength: 1.5 },
  { source: 'pepsico', target: 'kroger-albertsons', label: 'Category Captain (Snacks)', type: 'dominance', strength: 1.5 },
  { source: 'nestle', target: 'walmart', label: 'Preferred Shelf Allocation', type: 'dominance', strength: 1.5 },
  { source: 'pg', target: 'kroger-albertsons', label: 'Anchor Supplier', type: 'dominance', strength: 1.5 },
  { source: 'kraft-heinz', target: 'ahold-delhaize', label: 'Volume Rebate Lock-in', type: 'dominance', strength: 1.5 },

  // Mechanisms to Parents & Captains
  { source: 'mech-category-captaincy', target: 'pepsico', label: 'Leveraged By', type: 'cartel', strength: 1 },
  { source: 'mech-category-captaincy', target: 'pg', label: 'Leveraged By', type: 'cartel', strength: 1 },
  { source: 'mech-slotting-fees', target: 'walmart', label: 'Enforced By', type: 'cartel', strength: 1 },
  { source: 'mech-slotting-fees', target: 'kroger-albertsons', label: 'Enforced By', type: 'cartel', strength: 1 },
  { source: 'mech-dynamic-pricing', target: 'kroger-albertsons', label: 'Deployed At', type: 'cartel', strength: 1 },
  { source: 'mech-dynamic-pricing', target: 'amazon', label: 'Pioneered By', type: 'cartel', strength: 1 },
  { source: 'mech-retail-media', target: 'walmart', label: 'Walmart Luminate Engine', type: 'cartel', strength: 1 },
  { source: 'mech-retail-media', target: 'ahold-delhaize', label: 'AD Retail Media', type: 'cartel', strength: 1 }
];

export const RetailCartelNetwork: React.FC = () => {
  // State
  const [nodes, setNodes] = useState<NetworkNode[]>(INITIAL_NODES);
  const [links] = useState<NetworkLink[]>(INITIAL_LINKS);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(INITIAL_NODES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<'network' | 'matrix' | 'research'>('network');

  const containerRef = useRef<HTMLDivElement>(null);

  // Colors based on Node Type
  const getNodeColor = (type: NodeType) => {
    switch (type) {
      case 'parent':
        return { bg: '#ef4444', border: '#b91c1c', text: '#fee2e2', label: 'Corporate Parent' };
      case 'banner':
        return { bg: '#3b82f6', border: '#1d4ed8', text: '#dbeafe', label: 'Retail Banner' };
      case 'captain':
        return { bg: '#f59e0b', border: '#b45309', text: '#fef3c7', label: 'Category Captain' };
      case 'mechanism':
        return { bg: '#10b981', border: '#047857', text: '#d1fae5', label: 'Control Mechanism' };
    }
  };

  // Assign fixed circle coordinates for predictable rendering
  const positionedNodes = useMemo(() => {
    const width = 900;
    const height = 650;
    const centerX = width / 2;
    const centerY = height / 2;

    const parents = nodes.filter(n => n.type === 'parent');
    const banners = nodes.filter(n => n.type === 'banner');
    const captains = nodes.filter(n => n.type === 'captain');
    const mechanisms = nodes.filter(n => n.type === 'mechanism');

    const mapped = new Map<string, { x: number; y: number }>();

    // Inner circle: Parents
    parents.forEach((n, idx) => {
      const angle = (idx / parents.length) * 2 * Math.PI - Math.PI / 2;
      mapped.set(n.id, {
        x: centerX + Math.cos(angle) * 160,
        y: centerY + Math.sin(angle) * 140
      });
    });

    // Outer circle top/right: Captains
    captains.forEach((n, idx) => {
      const angle = (idx / captains.length) * Math.PI + Math.PI;
      mapped.set(n.id, {
        x: centerX + Math.cos(angle) * 320,
        y: centerY + Math.sin(angle) * 260
      });
    });

    // Outer circle bottom/left: Banners
    banners.forEach((n, idx) => {
      const angle = (idx / banners.length) * Math.PI;
      mapped.set(n.id, {
        x: centerX + Math.cos(angle) * 310,
        y: centerY + Math.sin(angle) * 250
      });
    });

    // Outer circle sides: Mechanisms
    mechanisms.forEach((n, idx) => {
      const angle = (idx / mechanisms.length) * 2 * Math.PI + Math.PI / 4;
      mapped.set(n.id, {
        x: centerX + Math.cos(angle) * 380,
        y: centerY + Math.sin(angle) * 280
      });
    });

    return nodes.map(node => {
      const pos = mapped.get(node.id) || { x: centerX, y: centerY };
      return {
        ...node,
        x: pos.x,
        y: pos.y
      };
    });
  }, [nodes]);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return positionedNodes.filter(node => {
      const matchesSearch = node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (node.subtext && node.subtext.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = filterType === 'all' || node.type === filterType;
      
      return matchesSearch && matchesFilter;
    });
  }, [positionedNodes, searchQuery, filterType]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  // Handle Drag / Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof SVGElement && e.target.tagName === 'svg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetTransform = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-slate-950 text-slate-100 font-sans border-slate-800 border">
      {/* Top Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-950/60 border border-red-800 rounded-lg text-red-400">
              <Network size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Grocery & Retail Cartel Network
                <span className="text-xs bg-red-900/60 text-red-300 font-mono px-2 py-0.5 rounded border border-red-700/50">
                  MONOPOLY RESEARCH
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Mapping corporate consolidation, category captain dominance, and anti-competitive dynamic pricing vectors.
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('network')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'network' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Network size={14} />
            Interactive Network
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'matrix' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieChart size={14} />
            Consolidation Matrix
          </button>
          <button
            onClick={() => setActiveTab('research')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'research' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText size={14} />
            Anti-Trust Dossier
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Toolbar & Filters */}
        <div className="w-full lg:w-80 bg-slate-900/80 border-r border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search parent, CPG, banner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-md pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Node Type Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Filter size={12} /> Filter Node Layer
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: 'all', label: 'All Network Nodes', color: 'bg-slate-800 text-slate-200' },
                { id: 'parent', label: 'Corporate Parent Conglomerates', color: 'bg-red-950/80 text-red-300 border-red-800' },
                { id: 'banner', label: 'Regional Supermarket Banners', color: 'bg-blue-950/80 text-blue-300 border-blue-800' },
                { id: 'captain', label: 'CPG Category Captains', color: 'bg-amber-950/80 text-amber-300 border-amber-800' },
                { id: 'mechanism', label: 'Anti-Competitive Mechanisms', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-3 py-2 text-xs rounded border text-left flex items-center justify-between transition-all ${
                    filterType === f.id
                      ? 'border-indigo-500 bg-indigo-950/50 text-white font-medium ring-1 ring-indigo-500'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${
                      f.id === 'parent' ? 'bg-red-500' :
                      f.id === 'banner' ? 'bg-blue-500' :
                      f.id === 'captain' ? 'bg-amber-500' :
                      f.id === 'mechanism' ? 'bg-emerald-500' : 'bg-slate-400'
                    }`} />
                    {f.label}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {f.id === 'all' ? nodes.length : nodes.filter(n => n.type === f.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Key Stats */}
          <div className="mt-auto border-t border-slate-800 pt-4 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert size={12} className="text-red-400" /> Market Control Index
            </h3>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Top 4 Retail Market Share:</span>
                <span className="font-mono text-red-400 font-bold">~65%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                Up from 23% in 1993. Higher concentration enables algorithmic price coordination and monopsony supplier leverage.
              </p>
            </div>
          </div>
        </div>

        {/* Center Canvas / Content View */}
        <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col">
          {activeTab === 'network' && (
            <>
              {/* Zoom & Pan Controls Overlay */}
              <div className="absolute top-4 right-4 z-10 flex items-center space-x-1 bg-slate-900/90 border border-slate-800 p-1 rounded-lg backdrop-blur shadow-lg">
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.2))}
                  className="p-2 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.5))}
                  className="p-2 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  onClick={resetTransform}
                  className="p-2 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
                  title="Reset View"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              {/* Network Graph Interactive SVG View */}
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden flex items-center justify-center relative"
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 900 650"
                  className="w-full h-full"
                >
                  <defs>
                    <marker
                      id="arrow"
                      viewBox="0 0 10 10"
                      refX="18"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                    </marker>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}>
                    {/* Render Links */}
                    {links.map((link, idx) => {
                      const sourceNode = positionedNodes.find(n => n.id === link.source);
                      const targetNode = positionedNodes.find(n => n.id === link.target);

                      if (!sourceNode || !targetNode) return null;

                      const isHighlighted =
                        selectedNode &&
                        (selectedNode.id === sourceNode.id || selectedNode.id === targetNode.id);

                      const sourceVisible = filteredNodeIds.has(sourceNode.id);
                      const targetVisible = filteredNodeIds.has(targetNode.id);
                      const linkOpacity = sourceVisible && targetVisible ? (isHighlighted ? 0.9 : 0.25) : 0.05;

                      return (
                        <g key={`link-${idx}`}>
                          <line
                            x1={sourceNode.x}
                            y1={sourceNode.y}
                            x2={targetNode.x}
                            y2={targetNode.y}
                            stroke={isHighlighted ? '#818cf8' : '#475569'}
                            strokeWidth={isHighlighted ? 2.5 : 1.2}
                            strokeDasharray={link.type === 'cartel' ? '4 4' : 'none'}
                            strokeOpacity={linkOpacity}
                            markerEnd="url(#arrow)"
                          />
                        </g>
                      );
                    })}

                    {/* Render Nodes */}
                    {positionedNodes.map(node => {
                      const isSelected = selectedNode?.id === node.id;
                      const isVisible = filteredNodeIds.has(node.id);
                      const colors = getNodeColor(node.type);

                      return (
                        <g
                          key={node.id}
                          transform={`translate(${node.x}, ${node.y})`}
                          onClick={() => setSelectedNode(node)}
                          className="cursor-pointer transition-transform duration-200 hover:scale-110"
                          style={{ opacity: isVisible ? 1 : 0.15 }}
                        >
                          {/* Outer Glow Halo if Selected */}
                          {isSelected && (
                            <circle
                              r={32}
                              fill="none"
                              stroke={colors.bg}
                              strokeWidth={3}
                              className="animate-pulse"
                              filter="url(#glow)"
                            />
                          )}

                          {/* Node Circle */}
                          <circle
                            r={node.type === 'parent' ? 24 : node.type === 'captain' ? 20 : 16}
                            fill={colors.bg}
                            stroke={isSelected ? '#ffffff' : colors.border}
                            strokeWidth={isSelected ? 3 : 2}
                            className="shadow-xl"
                          />

                          {/* Node Icon Indicator */}
                          <foreignObject
                            x={-10}
                            y={-10}
                            width={20}
                            height={20}
                            className="pointer-events-none"
                          >
                            <div className="w-full h-full flex items-center justify-center text-white">
                              {node.type === 'parent' && <Building2 size={12} />}
                              {node.type === 'banner' && <Store size={12} />}
                              {node.type === 'captain' && <Package size={12} />}
                              {node.type === 'mechanism' && <AlertTriangle size={12} />}
                            </div>
                          </foreignObject>

                          {/* Node Label Text */}
                          <text
                            y={node.type === 'parent' ? 36 : 28}
                            textAnchor="middle"
                            fill="#f8fafc"
                            fontSize={node.type === 'parent' ? '12px' : '10px'}
                            fontWeight={node.type === 'parent' ? 'bold' : 'normal'}
                            className="pointer-events-none font-sans drop-shadow-md"
                          >
                            {node.label}
                          </text>

                          {/* Node Subtext Label */}
                          {node.subtext && (
                            <text
                              y={node.type === 'parent' ? 48 : 40}
                              textAnchor="middle"
                              fill="#94a3b8"
                              fontSize="8px"
                              className="pointer-events-none font-mono"
                            >
                              {node.subtext}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>
                </svg>

                {/* Network Graph Key / Legend */}
                <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 p-3 rounded-lg backdrop-blur text-xs space-y-2">
                  <div className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
                    Node Categorization
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-red-500" />
                      <span className="text-slate-300">Mega-Parent Giant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-amber-500" />
                      <span className="text-slate-300">CPG Category Captain</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-blue-500" />
                      <span className="text-slate-300">Regional Banner</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-emerald-500" />
                      <span className="text-slate-300">Monopoly Mechanism</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'matrix' && (
            <div className="p-6 overflow-y-auto h-full space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <PieChart className="text-indigo-400" size={20} />
                  Corporate Market Concentration & Control Matrix
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Cross-reference showing market share, dominance vectors, and anti-competitive leverage across parent entities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nodes.filter(n => n.type === 'parent' || n.type === 'captain').map(entity => (
                  <div key={entity.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                          entity.type === 'parent'
                            ? 'bg-red-950 text-red-300 border-red-800'
                            : 'bg-amber-950 text-amber-300 border-amber-800'
                        }`}>
                          {entity.type === 'parent' ? 'Retail Conglomerate' : 'Category Monopoly Captain'}
                        </span>
                        <h3 className="text-base font-bold text-white mt-1">{entity.label}</h3>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-xs text-slate-400">Share</div>
                        <div className="text-sm font-bold text-indigo-400">{entity.marketShare || 'N/A'}</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {entity.description}
                    </p>

                    {entity.keyBrandsOrSubsidiaries && (
                      <div>
                        <div className="text-[11px] font-medium text-slate-400 mb-1">Controlled Brands / Banners:</div>
                        <div className="flex flex-wrap gap-1">
                          {entity.keyBrandsOrSubsidiaries.map((brand, bIdx) => (
                            <span key={bIdx} className="bg-slate-950 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-800">
                              {brand}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="border-t border-slate-800/80 pt-2">
                      <div className="text-[11px] font-medium text-red-400 mb-1 flex items-center gap-1">
                        <AlertTriangle size={12} /> Key Anti-Competitive Vectors
                      </div>
                      <ul className="text-xs space-y-1 text-slate-400 list-disc list-inside">
                        {entity.antiCompetitivePractices.slice(0, 3).map((practice, pIdx) => (
                          <li key={pIdx} className="text-[11px]">{practice}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'research' && (
            <div className="p-6 overflow-y-auto h-full space-y-6 max-w-4xl mx-auto">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-950 border border-red-800 rounded-lg text-red-400">
                    <ShieldAlert size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Anti-Trust & Monopoly Consolidation Analysis
                    </h2>
                    <p className="text-xs text-slate-400">
                      Investigative dossier for research questions #1 - #20
                    </p>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none text-xs text-slate-300 space-y-4 border-t border-slate-800 pt-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ChevronRight size={14} className="text-red-500" />
                    1. The Kroger-Albertsons Duopoly & Regional Lock-In
                  </h3>
                  <p className="leading-relaxed">
                    When supermarket giants merge, they do not merely increase overall nationwide market share; they create localized regional monopolies. By controlling multiple overlapping banners (e.g., Safeway, Ralphs, Vons), parent corporations gain monopsony purchasing power over local farmers and CPG suppliers while simultaneously enforcing uniform price baselines that prevent consumer price shopping.
                  </p>

                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ChevronRight size={14} className="text-red-500" />
                    2. The Hidden Power of "Category Captains"
                  </h3>
                  <p className="leading-relaxed">
                    Retailers frequently outsource aisle management to dominant brand conglomerates like PepsiCo (Snacks) or Procter & Gamble (Hygiene). These "Category Captains" draw store planograms to systematically disadvantage smaller, independent competitors by relegating them to bottom shelves or charging prohibitive slotting fees.
                  </p>

                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ChevronRight size={14} className="text-red-500" />
                    3. Dynamic Pricing & Algorithmic Collusion
                  </h3>
                  <p className="leading-relaxed">
                    The rollout of Electronic Shelf Labels (ESLs) combined with centralized pricing engines (such as Revionics) enables automated dynamic price surging. When competing supermarket networks utilize common pricing algorithms, tacit price collusion occurs without explicit behind-closed-doors agreements.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Detail Inspection Drawer (Shown on Node Click) */}
        {selectedNode && activeTab === 'network' && (
          <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 p-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border"
                    style={{
                      backgroundColor: `${getNodeColor(selectedNode.type).bg}20`,
                      borderColor: getNodeColor(selectedNode.type).border,
                      color: getNodeColor(selectedNode.type).text
                    }}
                  >
                    {getNodeColor(selectedNode.type).label}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1.5">{selectedNode.label}</h3>
                  {selectedNode.subtext && (
                    <p className="text-xs text-slate-400 font-mono">{selectedNode.subtext}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-500 hover:text-white p-1 rounded-md hover:bg-slate-800"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Stats Grid */}
              {(selectedNode.marketShare || selectedNode.revenue) && (
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  {selectedNode.marketShare && (
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Market Share</div>
                      <div className="text-xs font-bold font-mono text-indigo-400">{selectedNode.marketShare}</div>
                    </div>
                  )}
                  {selectedNode.revenue && (
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Revenue / Scale</div>
                      <div className="text-xs font-bold font-mono text-emerald-400">{selectedNode.revenue}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Info size={12} /> Overview & Dominance Pattern
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded border border-slate-800/50">
                  {selectedNode.description}
                </p>
              </div>

              {/* Key Anti-Competitive Practices */}
              <div>
                <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <ShieldAlert size={12} /> Anti-Competitive Practices
                </h4>
                <div className="space-y-1.5">
                  {selectedNode.antiCompetitivePractices.map((practice, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-red-950/20 border border-red-900/30 p-2 rounded text-xs text-red-200">
                      <AlertTriangle size={12} className="text-red-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight">{practice}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controlled Banners / Portfolio */}
              {selectedNode.keyBrandsOrSubsidiaries && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Store size={12} /> Portfolio & Banners
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.keyBrandsOrSubsidiaries.map((item, idx) => (
                      <span key={idx} className="bg-slate-950 text-slate-300 text-[11px] px-2.5 py-1 rounded border border-slate-800 font-mono">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="mt-6 border-t border-slate-800 pt-3">
              <button
                onClick={() => setActiveTab('research')}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileText size={14} />
                View Full Anti-Trust Research File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RetailCartelNetwork;