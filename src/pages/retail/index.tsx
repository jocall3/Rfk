import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Component interfaces
interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  subtext: string;
  icon: React.ReactNode;
}

interface QuestionItem {
  id: number;
  category: 'core' | 'research';
  question: string;
  status: 'answered' | 'in_progress' | 'pending';
  markdownFile: string;
}

export default function RetailDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'layout' | 'supply_chain' | 'food_deserts' | 'alt_networks' | 'research'>('overview');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sample data for Research / Questions module
  const initialQuestions: QuestionItem[] = [
    { id: 1, category: 'core', question: 'How do retail floor layouts impact fresh produce velocity?', status: 'answered', markdownFile: 'q01-layout-fresh-produce.md' },
    { id: 2, category: 'core', question: 'What supply chain bottlenecks most affect urban grocery access?', status: 'answered', markdownFile: 'q02-supply-chain-bottlenecks.md' },
    { id: 3, category: 'core', question: 'How are food desert metrics calculated across USDA datasets?', status: 'answered', markdownFile: 'q03-food-desert-metrics.md' },
    { id: 4, category: 'core', question: 'What alternative distribution models exist for small agricultural co-ops?', status: 'answered', markdownFile: 'q04-alt-distro-coops.md' },
    { id: 5, category: 'core', question: 'How does cold-chain telemetry reduce spoilage in transit?', status: 'answered', markdownFile: 'q05-cold-chain-telemetry.md' },
    { id: 6, category: 'research', question: 'What is the ROI of micro-fulfillment hubs in food desert margins?', status: 'in_progress', markdownFile: 'r01-roi-micro-fulfillment.md' },
    { id: 7, category: 'research', question: 'How can dynamic pricing optimize shelf-life near expiration date?', status: 'in_progress', markdownFile: 'r02-dynamic-pricing-expirations.md' },
    { id: 8, category: 'research', question: 'What municipal policy incentives foster community fridges?', status: 'pending', markdownFile: 'r03-policy-community-fridges.md' },
  ];

  const filteredQuestions = initialQuestions.filter(q => 
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    q.markdownFile.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Retail & Distribution Intelligence Dashboard</title>
        <meta name="description" content="Unified dashboard for store layout analysis, supply chain tracking, food desert research, and alternative distribution networks." />
      </Head>

      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
        {/* Top Header */}
        <header className="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-50 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-white">Retail & Distribution Hub</h1>
              <p className="text-xs text-slate-400">Layout Intelligence • Logistics Telemetry • Food Access • Alt Networks</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search metrics, reports, questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-1.5 text-sm pl-9 focus:outline-none focus:border-emerald-500 w-64 text-slate-200 placeholder-slate-500"
              />
              <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Regions</option>
              <option value="metro_north">Metro North District</option>
              <option value="urban_east">Urban East Zone (Food Desert Focus)</option>
              <option value="rural_west">Rural West Logistics Hub</option>
            </select>

            <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-emerald-900/30">
              Export Intelligence Brief
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="border-b border-slate-800 bg-slate-950 px-6 flex space-x-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Dashboard Overview' },
            { id: 'layout', label: 'Store Layout Analysis' },
            { id: 'supply_chain', label: 'Supply Chain Tracking' },
            { id: 'food_deserts', label: 'Food Desert Data' },
            { id: 'alt_networks', label: 'Alternative Networks' },
            { id: 'research', label: 'Q&A & Research Corpus (40 Files)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Avg Shelf Yield Rate"
              value="88.4%"
              change="+3.2%"
              isPositive={true}
              subtext="Optimized layout velocity"
              icon={
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              }
            />
            <StatCard
              title="Cold Chain Transit Loss"
              value="1.2%"
              change="-0.8%"
              isPositive={true}
              subtext="Spoilage down 18% QoQ"
              icon={
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
            <StatCard
              title="Food Access Index"
              value="64 / 100"
              change="+5 pts"
              isPositive={true}
              subtext="Tracts with <0.5mi grocery"
              icon={
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              }
            />
            <StatCard
              title="Alt Network Node Count"
              value="142 Nodes"
              change="+14 new"
              isPositive={true}
              subtext="Co-ops, mobile vans, fridges"
              icon={
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
            />
          </div>

          {/* Dynamic Content Views */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Store Layout & Traffic Flow Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-slate-100 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      Store Layout Efficiency
                    </h2>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">Live Heatmap</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Analysis of high-dwell aisles vs fast-grab fresh food zones. Rearranging perimeter produce increased turnover by 14%.
                  </p>
                  <div className="bg-slate-900 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Fresh Produce Perimeter</span>
                      <span className="text-emerald-400 font-semibold">94% Efficiency</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[94%]"></div>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Center Grocery Aisles</span>
                      <span className="text-amber-400 font-semibold">72% Efficiency</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[72%]"></div>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Endcap Promo Placement</span>
                      <span className="text-emerald-400 font-semibold">89% Efficiency</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full w-[89%]"></div>
                    </div>
                  </div>
                </div>
                <button onClick={() => setActiveTab('layout')} className="mt-4 text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                  View Heatmaps & Floor Plans &rarr;
                </button>
              </div>

              {/* Supply Chain Status */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-slate-100 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                      Supply Chain Telemetry
                    </h2>
                    <span className="text-xs bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/20">Active Tracking</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Real-time monitoring of refrigerated transport fleets, cold storage nodes, and regional distribution centers.
                  </p>
                  <div className="space-y-2.5 text-xs">
                    <div className="bg-slate-900 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-slate-200">Refrigerated Route #402</p>
                        <p className="text-slate-500">Temperature: 3.4°C (Target: 2-4°C)</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Optimal</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-slate-200">Regional DC Hub West</p>
                        <p className="text-slate-500">Inventory Turn Time: 18.2 hrs</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Normal</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-slate-200">Micro-Fulfillment Depot #09</p>
                        <p className="text-slate-500">Re-stock alert for organic dairy</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">Low Stock</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setActiveTab('supply_chain')} className="mt-4 text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  View Cold Chain & Fleet Data &rarr;
                </button>
              </div>

              {/* Food Deserts & Equity */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-slate-100 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      Food Access & Deserts
                    </h2>
                    <span className="text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20">USDA Data Integration</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Identifying low-income low-access (LILA) census tracts and prioritizing community partner interventions.
                  </p>
                  <div className="bg-slate-900 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Identified LILA Zones</span>
                      <span className="text-slate-200 font-bold">28 Tracts</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Mobile Food Markets Active</span>
                      <span className="text-emerald-400 font-bold">12 Routes</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Pop. Served in Target Zones</span>
                      <span className="text-slate-200 font-bold">142,500</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setActiveTab('food_deserts')} className="mt-4 text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1">
                  Explore Food Access Maps &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Detailed View: Store Layout Analysis */}
          {activeTab === 'layout' && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Store Layout & Flow Optimization</h2>
                <p className="text-xs text-slate-400">Analyzing customer navigation patterns, shelf dwell times, and placement velocity for fresh food.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-emerald-400 mb-3">Fresh Produce Layout Blueprint</h3>
                  <div className="aspect-video bg-slate-950 border border-slate-800 rounded flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-transparent to-amber-950/20"></div>
                    <p className="text-xs text-slate-500 z-10 font-mono">[ Interactive Heatmap Diagram: High Produce Dwell at Entrance Perimeter ]</p>
                  </div>
                  <div className="mt-3 text-xs text-slate-400 space-y-1">
                    <p>• Placement strategy: Produce front-loaded to leverage high impulse fresh visual cues.</p>
                    <p>• Result: +14% increase in basket size for green leaf vegetables.</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-400 mb-3">Aisle Friction Index</h3>
                  <ul className="space-y-2 text-xs">
                    <li className="p-2.5 bg-slate-950 rounded border border-slate-800 flex justify-between">
                      <span className="text-slate-300">Aisle 1 (Dairy & Refrigerated)</span>
                      <span className="text-emerald-400 font-semibold">Low Bottleneck (Friction score: 1.2)</span>
                    </li>
                    <li className="p-2.5 bg-slate-950 rounded border border-slate-800 flex justify-between">
                      <span className="text-slate-300">Aisle 3 (Canned Goods & Staples)</span>
                      <span className="text-amber-400 font-semibold">Moderate Congestion (Friction score: 3.8)</span>
                    </li>
                    <li className="p-2.5 bg-slate-950 rounded border border-slate-800 flex justify-between">
                      <span className="text-slate-300">Checkout Express Queues</span>
                      <span className="text-emerald-400 font-semibold">Optimal Flow (Friction score: 1.5)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Detailed View: Supply Chain Tracking */}
          {activeTab === 'supply_chain' && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Cold Chain & Distribution Telemetry</h2>
                <p className="text-xs text-slate-400">Monitoring humidity, GPS transit updates, and distribution hub processing speeds.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Shipment ID</th>
                      <th className="p-3">Origin Hub</th>
                      <th className="p-3">Destination Zone</th>
                      <th className="p-3">Cargo Type</th>
                      <th className="p-3">Temp Telemetry</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr>
                      <td className="p-3 font-mono text-emerald-400">SHP-9021</td>
                      <td className="p-3">Agri-Hub North</td>
                      <td className="p-3">Metro Food Pantry Depot</td>
                      <td className="p-3">Organic Produce</td>
                      <td className="p-3 text-emerald-400">3.2 °C (Stable)</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">In Transit</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-emerald-400">SHP-8843</td>
                      <td className="p-3">Central Distribution #2</td>
                      <td className="p-3">Eastside Supermarket</td>
                      <td className="p-3">Dairy & Eggs</td>
                      <td className="p-3 text-emerald-400">2.8 °C (Stable)</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Delivered</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-amber-400">SHP-7721</td>
                      <td className="p-3">Valley Organic Co-op</td>
                      <td className="p-3">Mobile Grocery Route 4</td>
                      <td className="p-3">Fresh Fruit</td>
                      <td className="p-3 text-amber-400">5.1 °C (Warning)</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">Check Temp</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Detailed View: Food Desert Data */}
          {activeTab === 'food_deserts' && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Food Desert Mapping & Equity Data</h2>
                <p className="text-xs text-slate-400">Census-tract mapping combined with low-income low-access (LILA) geographic thresholds.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase mb-2">1-Mile Urban Access Threshold</h3>
                  <p className="text-2xl font-bold text-amber-400">18.4%</p>
                  <p className="text-[11px] text-slate-500 mt-1">Residents with no vehicle living &gt;1 mile from fresh food</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase mb-2">SNAP Acceptance Rate</h3>
                  <p className="text-2xl font-bold text-emerald-400">92.1%</p>
                  <p className="text-[11px] text-slate-500 mt-1">Participating markets & mobile units in target zones</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase mb-2">Mobile Market Reach</h3>
                  <p className="text-2xl font-bold text-purple-400">24,300/wk</p>
                  <p className="text-[11px] text-slate-500 mt-1">Meals/baskets delivered directly into food deserts</p>
                </div>
              </div>
            </div>
          )}

          {/* Detailed View: Alternative Networks */}
          {activeTab === 'alt_networks' && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Alternative Distribution Networks</h2>
                <p className="text-xs text-slate-400">Direct-to-consumer farm linkages, community fridges, and decentralized food co-operatives.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex items-start gap-3">
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">Mutual Aid Community Fridges</h3>
                    <p className="text-xs text-slate-400 mt-1">48 micro-nodes equipped with IoT temperature telemetry and automatic restock notifications.</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex items-start gap-3">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5 5 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5 5 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">Local Farm Co-Op Bypass Routes</h3>
                    <p className="text-xs text-slate-400 mt-1">Direct regional farm-to-door distribution reducing traditional broker overhead by 34%.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Research & Q&A Corpus Section */}
          {(activeTab === 'research' || activeTab === 'overview') && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    20 Core Answers & 20 Research Expansion Questions
                  </h2>
                  <p className="text-xs text-slate-400">Repository of Markdown files synthesizing domain knowledge across retail, food deserts, and supply chain design.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    20 Core Answered
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                    20 Research Follow-ups
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-800/60">
                {filteredQuestions.map((q) => (
                  <div key={q.id} className="py-3 flex items-center justify-between gap-4 hover:bg-slate-900/50 px-2 rounded transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-semibold border ${
                        q.category === 'core' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                      }`}>
                        {q.category === 'core' ? 'Core Q&A' : 'Research Q'}
                      </span>
                      <div>
                        <p className="text-xs font-medium text-slate-200">{q.question}</p>
                        <p className="text-[10px] font-mono text-slate-500">{q.markdownFile}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        q.status === 'answered' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        q.status === 'in_progress' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {q.status.replace('_', ' ')}
                      </span>
                      <Link href={`/docs/${q.markdownFile.replace('.md', '')}`} className="text-xs text-emerald-400 hover:underline">
                        Read File &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function StatCard({ title, value, change, isPositive, subtext, icon }: StatCardProps) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">{icon}</div>
      </div>
      <div className="mt-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{value}</span>
          <span className={`text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {change}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">{subtext}</p>
      </div>
    </div>
  );
}