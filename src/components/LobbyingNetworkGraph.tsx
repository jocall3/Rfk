import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Search, ZoomIn, ZoomOut, RefreshCw, Filter, Info, DollarSign, Building, User, Landmark, Layers, X, ShieldAlert } from 'lucide-react';

export type NodeType = 'lobbyist' | 'agency' | 'firm';

export interface NetworkNode {
  id: string;
  label: string;
  type: NodeType;
  category: string;
  amountSpent: number; // In USD
  connectionsCount: number;
  description: string;
  keyIssues: string[];
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  radius?: number;
}

export interface NetworkLink {
  source: string;
  target: string;
  amount: number;
  bill: string;
  year: number;
}

const INITIAL_NODES: NetworkNode[] = [
  // Government Agencies
  { id: 'dod', label: 'Dept of Defense', type: 'agency', category: 'Defense', amountSpent: 125000000, connectionsCount: 8, description: 'Executive department responsible for national security and armed forces.', keyIssues: ['Defense Procurement', 'Cybersecurity', 'Aerospace'] },
  { id: 'hhs', label: 'Dept of Health & Human Services', type: 'agency', category: 'Healthcare', amountSpent: 98000000, connectionsCount: 6, description: 'Department aiming to protect the health of all Americans.', keyIssues: ['Drug Pricing', 'Medicare/Medicaid', 'FDA Approval'] },
  { id: 'doe', label: 'Dept of Energy', type: 'agency', category: 'Energy', amountSpent: 64000000, connectionsCount: 5, description: 'Department overseeing US energy policy and nuclear safety.', keyIssues: ['Renewable Subsidies', 'Grid Infrastructure', 'Nuclear Regulatory'] },
  { id: 'sec', label: 'Securities & Exchange Commission', type: 'agency', category: 'Finance', amountSpent: 42000000, connectionsCount: 4, description: 'Regulatory body for financial markets and investor protection.', keyIssues: ['Crypto Regulation', 'ESG Reporting', 'Market Transparency'] },
  { id: 'dot', label: 'Dept of Transportation', type: 'agency', category: 'Infrastructure', amountSpent: 51000000, connectionsCount: 4, description: 'Federal department coordinating transportation policy.', keyIssues: ['EV Charging Infrastructure', 'Aviation Safety', 'Rail Freight'] },

  // Lobbying Firms / Corporations
  { id: 'apex_gov', label: 'Apex Strategies LLC', type: 'firm', category: 'Consulting', amountSpent: 45000000, connectionsCount: 5, description: 'Bipartisan government relations and strategic advocacy firm.', keyIssues: ['Defense Contracts', 'Tech Regulation'] },
  { id: 'pharma_alliance', label: 'Pharma Research Global', type: 'firm', category: 'Healthcare', amountSpent: 82000000, connectionsCount: 4, description: 'Trade association representing leading biopharmaceutical companies.', keyIssues: ['Patent Protections', 'Medicare Drug Price Negotiation'] },
  { id: 'vanguard_defense', label: 'Vanguard Aerospace Group', type: 'firm', category: 'Defense', amountSpent: 67000000, connectionsCount: 3, description: 'Major defense contractor specializing in autonomous systems.', keyIssues: ['Fighter Jet Procurement', 'AI Defense Budget'] },
  { id: 'green_grid', label: 'Clean Energy Coalition', type: 'firm', category: 'Energy', amountSpent: 38000000, connectionsCount: 3, description: 'Advocacy group promoting renewable energy tax incentives.', keyIssues: ['Solar Tax Credits', 'Battery Storage Grants'] },
  { id: 'wallst_advocates', label: 'Financial Markets Council', type: 'firm', category: 'Finance', amountSpent: 53000000, connectionsCount: 3, description: 'Coalition representing investment banks and fintech companies.', keyIssues: ['Capital Reserve Requirements', 'Digital Asset Framework'] },

  // Individual Lobbyists
  { id: 'john_smith', label: 'Johnathan Smith', type: 'lobbyist', category: 'Defense', amountSpent: 18000000, connectionsCount: 3, description: 'Former Deputy Assistant Secretary turned top defense lobbyist.', keyIssues: ['Defense Appropriations', 'DOD Software Contracting'] },
  { id: 'elena_rodriguez', label: 'Elena Rodriguez', type: 'lobbyist', category: 'Healthcare', amountSpent: 24000000, connectionsCount: 3, description: 'Healthcare policy specialist with 15+ years Hill experience.', keyIssues: ['Biotech Patents', 'FDA Fast-Track Rules'] },
  { id: 'marcus_vance', label: 'Marcus Vance', type: 'lobbyist', category: 'Energy', amountSpent: 15000000, connectionsCount: 2, description: 'Senior strategist focusing on clean technology and grid policy.', keyIssues: ['Transmission Line Permitting', 'Clean Hydrogen'] },
  { id: 'sarah_jenkins', label: 'Sarah Jenkins', type: 'lobbyist', category: 'Finance', amountSpent: 21000000, connectionsCount: 2, description: 'Financial regulatory counsel representing capital market firms.', keyIssues: ['Fintech Charter', 'Securities Oversight'] },
  { id: 'david_chen', label: 'David Chen', type: 'lobbyist', category: 'Infrastructure', amountSpent: 12000000, connectionsCount: 2, description: 'Transportation and infrastructure policy expert.', keyIssues: ['FAA Reauthorization', 'Port Automation'] }
];

const INITIAL_LINKS: NetworkLink[] = [
  { source: 'apex_gov', target: 'dod', amount: 18500000, bill: 'HR 4350 - National Defense Authorization Act', year: 2023 },
  { source: 'vanguard_defense', target: 'dod', amount: 28000000, bill: 'HR 4350 - National Defense Authorization Act', year: 2023 },
  { source: 'john_smith', target: 'apex_gov', amount: 6200000, bill: 'Defense Innovation Spending Bill', year: 2023 },
  { source: 'john_smith', target: 'dod', amount: 11800000, bill: 'Cybersecurity Force Modernization', year: 2024 },
  
  { source: 'pharma_alliance', target: 'hhs', amount: 34000000, bill: 'S. 3430 - Inflation Reduction Drug Provision', year: 2023 },
  { source: 'elena_rodriguez', target: 'hhs', amount: 14500000, bill: 'HR 2110 - Orphan Drug Regulatory Expansion', year: 2024 },
  { source: 'elena_rodriguez', target: 'pharma_alliance', amount: 9500000, bill: 'Healthcare Access & Innovation Act', year: 2023 },

  { source: 'green_grid', target: 'doe', amount: 22000000, bill: 'HR 3684 - Infrastructure Investment and Jobs', year: 2023 },
  { source: 'marcus_vance', target: 'doe', amount: 9800000, bill: 'Clean Hydrogen Infrastructure Subsidies', year: 2024 },
  { source: 'marcus_vance', target: 'green_grid', amount: 5200000, bill: 'Grid Modernization Mandate', year: 2023 },

  { source: 'wallst_advocates', target: 'sec', amount: 29000000, bill: 'S. 4201 - Digital Asset Regulatory Clarity', year: 2023 },
  { source: 'sarah_jenkins', target: 'sec', amount: 11000000, bill: 'Market Structure Transparency Reform', year: 2024 },
  { source: 'sarah_jenkins', target: 'wallst_advocates', amount: 10000000, bill: 'Banking Capital Requirement Adjustment', year: 2023 },

  { source: 'david_chen', target: 'dot', amount: 8400000, bill: 'HR 3935 - FAA Reauthorization Act', year: 2023 },
  { source: 'apex_gov', target: 'dot', amount: 14200000, bill: 'National EV Network Expansion Standard', year: 2024 },
  { source: 'vanguard_defense', target: 'doe', amount: 11500000, bill: 'Strategic Energy Reserve Defense Act', year: 2023 }
];

export const LobbyingNetworkGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);

  // Zoom / Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState<NetworkNode | null>(null);

  // Dynamic Graph Nodes with Coordinates
  const nodesRef = useRef<NetworkNode[]>([]);
  const linksRef = useRef<NetworkLink[]>(INITIAL_LINKS);

  // Format currency helper
  const formatUSD = (val: number) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
    if (val >= 1e3) return `$${(val / 1e3).toFixed(0)}K`;
    return `$${val}`;
  };

  // Node Color scheme
  const getNodeColor = useCallback((type: NodeType) => {
    switch (type) {
      case 'agency': return '#3b82f6';   // Blue
      case 'firm': return '#10b981';     // Emerald Green
      case 'lobbyist': return '#f59e0b'; // Amber
      default: return '#6b7280';
    }
  }, []);

  // Initialize node layout position in circular/random spread
  useEffect(() => {
    const width = 800;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;
    const radiusScale = 220;

    nodesRef.current = INITIAL_NODES.map((node, index) => {
      const angle = (index / INITIAL_NODES.length) * 2 * Math.PI;
      const r = radiusScale + (Math.random() * 60 - 30);
      const rad = Math.sqrt(node.amountSpent) / 1800 + 12; // Dynamic radius based on spend
      return {
        ...node,
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle),
        vx: 0,
        vy: 0,
        radius: Math.min(Math.max(rad, 10), 32)
      };
    });
  }, []);

  // Filter nodes based on user controls
  const filteredNodes = useMemo(() => {
    return nodesRef.current.filter((node) => {
      const matchesSearch = node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            node.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            node.keyIssues.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = selectedType === 'all' || node.type === selectedType;
      const matchesCategory = selectedCategory === 'all' || node.category === selectedCategory;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [searchTerm, selectedType, selectedCategory]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  // Force Directed Simulation loop
  useEffect(() => {
    let animationFrameId: number;

    const simulate = () => {
      const nodes = nodesRef.current;
      const links = linksRef.current;
      const k = 0.05; // Force strength
      const repulsion = 1800; // Repulsion force

      // Repulsion between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          if (!n1.x || !n1.y || !n2.x || !n2.y) continue;

          let dx = n2.x - n1.x;
          let dy = n2.y - n1.y;
          let dist = Math.sqrt(dx * dx + dy * dy) || 1;

          if (dist < 250) {
            const force = (repulsion / (dist * dist));
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            n1.vx = (n1.vx || 0) - fx;
            n1.vy = (n1.vy || 0) - fy;
            n2.vx = (n2.vx || 0) + fx;
            n2.vy = (n2.vy || 0) + fy;
          }
        }
      }

      // Link attraction forces
      links.forEach(link => {
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);

        if (source && target && source.x && source.y && target.x && target.y) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const desiredDist = 140;
          const force = (dist - desiredDist) * k;

          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          source.vx = (source.vx || 0) + fx;
          source.vy = (source.vy || 0) + fy;
          target.vx = (target.vx || 0) - fx;
          target.vy = (target.vy || 0) - fy;
        }
      });

      // Center gravity force
      const centerX = 400;
      const centerY = 300;
      nodes.forEach(node => {
        if (node === draggedNode) return; // Don't move if user is dragging it

        if (node.x && node.y) {
          node.vx = ((node.vx || 0) + (centerX - node.x) * 0.005) * 0.85; // Damping
          node.vy = ((node.vy || 0) + (centerY - node.y) * 0.005) * 0.85;

          node.x += node.vx;
          node.y += node.vy;
        }
      });

      draw();
      animationFrameId = requestAnimationFrame(simulate);
    };

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Handle DPI scaling
      const width = canvas.width;
      const height = canvas.height;

      ctx.save();
      ctx.clearRect(0, 0, width, height);

      // Background grid dots pattern
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#334155';
      const gridSize = 30;
      for (let x = (pan.x % gridSize); x < width; x += gridSize) {
        for (let y = (pan.y % gridSize); y < height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Apply Pan & Zoom transformation
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      const nodes = nodesRef.current;
      const links = linksRef.current;

      // Draw Connections (Links)
      links.forEach(link => {
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);

        if (!source || !target || !source.x || !source.y || !target.x || !target.y) return;

        const isHighlighted = (selectedNode && (selectedNode.id === source.id || selectedNode.id === target.id)) ||
                              (hoveredNode && (hoveredNode.id === source.id || hoveredNode.id === target.id));

        const isFilteredOut = !filteredNodeIds.has(source.id) || !filteredNodeIds.has(target.id);

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.lineWidth = isHighlighted ? 3 : Math.min(Math.max(link.amount / 5000000, 1), 5);
        ctx.strokeStyle = isFilteredOut
          ? 'rgba(71, 85, 105, 0.15)'
          : isHighlighted
          ? '#38bdf8'
          : 'rgba(148, 163, 184, 0.35)';
        
        if (isHighlighted) {
          ctx.setLineDash([6, 4]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Connection Label for highlighted edges
        if (isHighlighted && !isFilteredOut) {
          const midX = (source.x + target.x) / 2;
          const midY = (source.y + target.y) / 2;
          ctx.font = '10px Inter, sans-serif';
          ctx.fillStyle = '#f8fafc';
          ctx.backgroundColor = '#0f172a';
          const labelText = `${formatUSD(link.amount)}`;
          const textWidth = ctx.measureText(labelText).width;

          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.fillRect(midX - textWidth / 2 - 4, midY - 8, textWidth + 8, 16);

          ctx.fillStyle = '#38bdf8';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(labelText, midX, midY);
        }
      });

      // Draw Nodes
      nodes.forEach(node => {
        if (!node.x || !node.y || !node.radius) return;

        const isVisible = filteredNodeIds.has(node.id);
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;

        const baseColor = getNodeColor(node.type);

        // Halo / Glow effect if selected
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.2)';
          ctx.fill();
        }

        // Main Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isVisible ? baseColor : '#334155';
        ctx.globalAlpha = isVisible ? 1.0 : 0.25;
        ctx.fill();

        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255,255,255,0.4)';
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // Label
        ctx.font = `${isSelected ? 'bold 12px' : '11px'} Inter, sans-serif`;
        ctx.fillStyle = isVisible ? '#f8fafc' : '#64748b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.label, node.x, node.y + node.radius + 6);
      });

      ctx.restore();
    };

    simulate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [pan, zoom, selectedNode, hoveredNode, filteredNodeIds, draggedNode, getNodeColor]);

  // Coordinate Conversion Helper
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    
    // Convert canvas screen space to transformed world space
    const worldX = (rawX - pan.x) / zoom;
    const worldY = (rawY - pan.y) / zoom;
    return { x: worldX, y: worldY };
  };

  // Mouse Handlers for Interactivity
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    
    // Check if clicked on a node
    const clickedNode = nodesRef.current.find(node => {
      if (!node.x || !node.y || !node.radius) return false;
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= node.radius;
    });

    if (clickedNode && filteredNodeIds.has(clickedNode.id)) {
      setDraggedNode(clickedNode);
      setSelectedNode(clickedNode);
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);

    if (draggedNode) {
      draggedNode.x = x;
      draggedNode.y = y;
      return;
    }

    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      return;
    }

    // Hover state Detection
    const hover = nodesRef.current.find(node => {
      if (!node.x || !node.y || !node.radius) return false;
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= node.radius;
    });

    if (hover && filteredNodeIds.has(hover.id)) {
      setHoveredNode(hover);
    } else {
      setHoveredNode(null);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom(prevZoom => Math.min(Math.max(prevZoom * zoomFactor, 0.4), 2.5));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
    setSearchTerm('');
    setSelectedType('all');
    setSelectedCategory('all');
  };

  // Connected entities for selected node
  const nodeConnections = useMemo(() => {
    if (!selectedNode) return [];
    return INITIAL_LINKS.filter(
      link => link.source === selectedNode.id || link.target === selectedNode.id
    ).map(link => {
      const otherId = link.source === selectedNode.id ? link.target : link.source;
      const otherNode = INITIAL_NODES.find(n => n.id === otherId);
      return {
        ...link,
        connectedWith: otherNode
      };
    });
  }, [selectedNode]);

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col font-sans border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Header Bar */}
      <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700/60 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600/20 text-blue-400 p-2.5 rounded-lg border border-blue-500/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide text-white flex items-center gap-2">
              Lobbying Network & Government Influence Graph
            </h1>
            <p className="text-xs text-slate-400">
              Interactive visualization of financial connections, lobbying firms, and agency oversight
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search nodes, issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-950/70 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 w-48 transition-all"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center bg-slate-950/70 border border-slate-700 rounded-lg p-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none pr-2 py-0.5"
            >
              <option value="all" className="bg-slate-900">All Node Types</option>
              <option value="agency" className="bg-slate-900">Agencies</option>
              <option value="firm" className="bg-slate-900">Firms</option>
              <option value="lobbyist" className="bg-slate-900">Lobbyists</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center bg-slate-950/70 border border-slate-700 rounded-lg p-1">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none px-2 py-0.5"
            >
              <option value="all" className="bg-slate-900">All Sectors</option>
              <option value="Defense" className="bg-slate-900">Defense</option>
              <option value="Healthcare" className="bg-slate-900">Healthcare</option>
              <option value="Energy" className="bg-slate-900">Energy</option>
              <option value="Finance" className="bg-slate-900">Finance</option>
              <option value="Infrastructure" className="bg-slate-900">Infrastructure</option>
            </select>
          </div>

          {/* Reset Zoom / Layout */}
          <button
            onClick={resetView}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Reset Graph Position"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset View
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="relative flex-1 bg-slate-950 cursor-grab active:cursor-grabbing">
          <canvas
            ref={canvasRef}
            width={900}
            height={650}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            className="w-full h-full block"
          />

          {/* On-Canvas Zoom Overlay Controls */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-lg shadow-lg">
            <button
              onClick={() => setZoom(prev => Math.min(prev * 1.2, 2.5))}
              className="p-1.5 hover:bg-slate-800 text-slate-300 rounded transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(prev / 1.2, 0.4))}
              className="p-1.5 hover:bg-slate-800 text-slate-300 rounded transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Graph Legend */}
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur border border-slate-800/80 rounded-lg p-3 text-xs space-y-2 shadow-lg">
            <div className="font-semibold text-slate-300 border-b border-slate-800 pb-1 mb-1">
              Entity Legend
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
              <span className="text-slate-300">Gov Agency</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-slate-300">Lobbying Firm / Corp</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span className="text-slate-300">Individual Lobbyist</span>
            </div>
            <div className="pt-1 text-[10px] text-slate-500 border-t border-slate-800">
              * Line thickness represents transaction amount
            </div>
          </div>
        </div>

        {/* Selected Entity Side Drawer Detail Panel */}
        {selectedNode ? (
          <aside className="w-96 bg-slate-900 border-l border-slate-800 p-5 flex flex-col overflow-y-auto z-10 shadow-2xl transition-all">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span
                  className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${
                    selectedNode.type === 'agency'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : selectedNode.type === 'firm'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {selectedNode.type}
                </span>
                <h2 className="text-lg font-bold text-white">{selectedNode.label}</h2>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-0.5">Total Capital / Budget</span>
                <span className="text-base font-bold text-emerald-400 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  {formatUSD(selectedNode.amountSpent)}
                </span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-0.5">Primary Sector</span>
                <span className="text-sm font-semibold text-slate-200">
                  {selectedNode.category}
                </span>
              </div>
            </div>

            {/* Entity Description */}
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Overview
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded border border-slate-800/80">
                {selectedNode.description}
              </p>
            </div>

            {/* Key Legislative Issues */}
            <div className="mb-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Targeted Issues & Legislation
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.keyIssues.map((issue, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700/60"
                  >
                    {issue}
                  </span>
                ))}
              </div>
            </div>

            {/* Connections & Link Detail */}
            <div className="flex-1">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" />
                Active Influence Links ({nodeConnections.length})
              </h3>
              
              <div className="space-y-2.5">
                {nodeConnections.map((conn, index) => (
                  <div
                    key={index}
                    className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-blue-400 flex items-center gap-1">
                        {conn.connectedWith?.label}
                      </span>
                      <span className="font-bold text-emerald-400">
                        {formatUSD(conn.amount)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                      "{conn.bill}"
                    </p>
                    <div className="mt-1.5 flex justify-between items-center text-[10px] text-slate-500">
                      <span>Year: {conn.year}</span>
                      <span className="capitalize text-slate-400">Target Type: {conn.connectedWith?.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        ) : (
          <div className="hidden lg:flex w-72 bg-slate-900/60 border-l border-slate-800 p-5 flex-col justify-between text-xs text-slate-400">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-300 font-semibold border-b border-slate-800 pb-2">
                <Info className="w-4 h-4 text-blue-400" />
                <span>Graph Inspection</span>
              </div>
              <p className="leading-relaxed">
                Click on any node in the canvas to inspect entity funding, targeted bills, and key legislative lobbying relationships.
              </p>
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span className="font-medium">Data Insight</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Total direct spending across mapped entities exceeds <strong className="text-slate-200">$500,000,000</strong> in federal filings.
                </p>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 border-t border-slate-800/80 pt-3">
              Lobbying Intelligence Dashboard • Active Node Engine
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LobbyingNetworkGraph;