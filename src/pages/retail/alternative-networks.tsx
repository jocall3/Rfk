import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Users,
  ShoppingBag,
  Leaf,
  Filter,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Heart,
  Share2,
  BookOpen,
  Plus,
  X,
  ChevronDown,
  Sparkles,
  Award,
  Compass,
  Building2,
  Truck,
  DollarSign
} from 'lucide-react';

// Types
interface NetworkEntity {
  id: string;
  name: string;
  type: 'CSA' | 'Co-op' | 'Farmers Market' | 'Buying Club' | 'Regenerative Farm';
  description: string;
  location: string;
  distanceMiles: number;
  tags: string[];
  membershipFee: string;
  pickupDays: string;
  contactEmail: string;
  website: string;
  impactScore: number;
  acceptsEBT: boolean;
  organicCertified: boolean;
}

interface ResearchQuestion {
  id: number;
  category: string;
  question: string;
  status: 'answered' | 'open_research';
  summary?: string;
  actionPrompt: string;
}

const MOCK_NETWORKS: NetworkEntity[] = [
  {
    id: '1',
    name: 'Valley Roots Community Agriculture (CSA)',
    type: 'CSA',
    description: 'A multi-farm CSA delivering seasonal organic produce, pastured eggs, and artisanal grains directly from 14 local regenerative farms.',
    location: 'Eastside Hub & 6 Neighborhood Drop Spots',
    distanceMiles: 2.4,
    tags: ['Organic', 'Multi-Farm', 'Weekly Box', 'Pesticide Free'],
    membershipFee: '$32 / week',
    pickupDays: 'Thursdays & Saturdays',
    contactEmail: 'connect@valleyroots.org',
    website: 'https://example.org/valleyroots',
    impactScore: 98,
    acceptsEBT: true,
    organicCertified: true
  },
  {
    id: '2',
    name: 'People\'s Food Co-operative & Grocery',
    type: 'Co-op',
    description: 'Worker-community owned grocery dedicated to local sovereignty, equitable food access, and democratic governance.',
    location: '742 Commerce St, Central District',
    distanceMiles: 1.1,
    tags: ['Worker-Owned', 'Bulk Goods', 'Zero Waste', 'Local Produce'],
    membershipFee: '$100 Lifetime (Equity Share)',
    pickupDays: 'Open Daily 8am - 9pm',
    contactEmail: 'info@peoplesfoodcoop.net',
    website: 'https://example.org/peoplescoop',
    impactScore: 95,
    acceptsEBT: true,
    organicCertified: true
  },
  {
    id: '3',
    name: 'Cascadia Collective Farmers Market',
    type: 'Farmers Market',
    description: 'Year-round direct producer market featuring independent growers, micro-bakeries, and urban agroecology initiatives.',
    location: 'Pioneer Square Pavilion',
    distanceMiles: 3.8,
    tags: ['Year-Round', 'Direct Producer', 'Artisanal', 'Family Farm'],
    membershipFee: 'Free Access',
    pickupDays: 'Sundays 9am - 2pm',
    contactEmail: 'marketmanager@cascadiamarkets.org',
    website: 'https://example.org/cascadiamarket',
    impactScore: 91,
    acceptsEBT: true,
    organicCertified: false
  },
  {
    id: '4',
    name: 'Neighborhood Buying Club Network',
    type: 'Buying Club',
    description: 'Hyper-local purchasing group aggregating bulk orders from regional sustainable food distributors to cut costs by 30%.',
    location: 'Northside Distribution Garage',
    distanceMiles: 4.5,
    tags: ['Bulk Wholesale', 'Affordable', 'Volunteer Run', 'Community Direct'],
    membershipFee: '$15 / year',
    pickupDays: 'Bi-weekly Tuesdays',
    contactEmail: 'organizer@neighborhoodbuying.org',
    website: 'https://example.org/buyingclub',
    impactScore: 88,
    acceptsEBT: false,
    organicCertified: true
  },
  {
    id: '5',
    name: 'Terra Madre Regenerative Orchard',
    type: 'Regenerative Farm',
    description: 'No-till permaculture orchard offering u-pick, direct fruit subscriptions, and soil health education workshops.',
    location: 'Green Valley County Road 12',
    distanceMiles: 11.2,
    tags: ['Soil Restoration', 'U-Pick', 'Fruit & Honey', 'Education'],
    membershipFee: 'Seasonal Tiered',
    pickupDays: 'Saturdays 10am - 4pm',
    contactEmail: 'hello@terramadrefarm.com',
    website: 'https://example.org/terramadre',
    impactScore: 97,
    acceptsEBT: false,
    organicCertified: true
  }
];

const RESEARCH_QUESTIONS: ResearchQuestion[] = [
  {
    id: 1,
    category: 'Supply Chain Resilience',
    question: 'How do direct farm-to-consumer networks reduce total food system emissions compared to conventional retail?',
    status: 'answered',
    summary: 'Direct delivery and localized CSA distribution bypass multi-stage cold storage and long-haul transport, reducing carbon footprint by 40-65% per food calorie.',
    actionPrompt: 'Inquire with local CSAs about their transport logistics and farm distance.'
  },
  {
    id: 2,
    category: 'Economic Sovereignty',
    question: 'What percentage of retail expenditure remains within the local economy via food co-ops vs. national supermarkets?',
    status: 'answered',
    summary: 'Food co-operatives generate 1.6x more local economic activity than conventional chain stores, keeping $0.38 of every dollar local vs. $0.24.',
    actionPrompt: 'Calculate your monthly grocery spend redirection potential.'
  },
  {
    id: 3,
    category: 'Food Security & Accessibility',
    question: 'How do alternative networks ensure access for low-income and SNAP/EBT participants?',
    status: 'answered',
    summary: 'Leading CSAs implement sliding-scale pricing, SNAP-match programs (e.g., Double Up Food Bucks), and community-supported shares.',
    actionPrompt: 'Check if your local CSA offers sponsored solidarity shares.'
  },
  {
    id: 4,
    category: 'Regenerative Capacity',
    question: 'How can small-scale distribution hubs support transition financing for farms moving to organic practices?',
    status: 'open_research',
    actionPrompt: 'Research localized micro-grant frameworks and farm incubator programs in your county.'
  },
  {
    id: 5,
    category: 'Policy & Governance',
    question: 'What land-use zoning policies best foster hyper-local food hub creation in urban sectors?',
    status: 'open_research',
    actionPrompt: 'Gather data on local municipal zoning laws restricting urban farm stands and co-op drop points.'
  }
];

export default function AlternativeNetworksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [onlyEbt, setOnlyEbt] = useState(false);
  const [savedNetworkIds, setSavedNetworkIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'directory' | 'research' | 'take_action'>('directory');
  const [contactModalNetwork, setContactModalNetwork] = useState<NetworkEntity | null>(null);

  // Filter networks
  const filteredNetworks = useMemo(() => {
    return MOCK_NETWORKS.filter((network) => {
      const matchesSearch =
        network.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        network.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        network.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = selectedType === 'ALL' || network.type === selectedType;
      const matchesEbt = !onlyEbt || network.acceptsEBT;
      return matchesSearch && matchesType && matchesEbt;
    });
  }, [searchTerm, selectedType, onlyEbt]);

  const toggleSave = (id: string) => {
    setSavedNetworkIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Head>
        <title>Alternative Local Food Networks | Community Action Hub</title>
        <meta
          name="description"
          content="Connect directly with Community Supported Agriculture (CSA), food co-ops, buying clubs, and local producers to build a resilient food ecosystem."
        />
      </Head>

      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        {/* Navigation Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-600 text-white rounded-lg">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-800 tracking-tight">
                Localized Networks & CSAs
              </span>
            </div>

            <nav className="flex items-center space-x-1 sm:space-x-4 text-sm font-medium">
              <button
                onClick={() => setActiveTab('directory')}
                className={`px-3 py-2 rounded-md transition ${
                  activeTab === 'directory'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Network Directory
              </button>
              <button
                onClick={() => setActiveTab('research')}
                className={`px-3 py-2 rounded-md transition ${
                  activeTab === 'research'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Research & Knowledge
              </button>
              <button
                onClick={() => setActiveTab('take_action')}
                className={`px-3 py-2 rounded-md transition ${
                  activeTab === 'take_action'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Organize / Action Plan
              </button>
            </nav>
          </div>
        </header>

        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-emerald-900 via-teal-800 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-emerald-800/60 backdrop-blur border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-medium text-emerald-200">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Bypassing Industrial Supply Chains</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Community Action for Local Food Systems
            </h1>
            <p className="max-w-3xl mx-auto text-slate-200 text-base sm:text-lg leading-relaxed">
              Redirect your purchasing power. Connect directly with independent farm CSAs, food co-operatives, neighborhood buying clubs, and regenerative direct-sale networks.
            </p>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 max-w-4xl mx-auto text-left">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-emerald-300">85% +</div>
                <div className="text-xs text-slate-300">Revenue to Small Farmers</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-emerald-300">~ 45 Mi</div>
                <div className="text-xs text-slate-300">Avg. Food Miles Saved</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-emerald-300">1.6x</div>
                <div className="text-xs text-slate-300">Local Multiplier Effect</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-emerald-300">100%</div>
                <div className="text-xs text-slate-300">Community Governed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {activeTab === 'directory' && (
            <div className="space-y-8">
              {/* Filter Controls Bar */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  {/* Search Input */}
                  <div className="relative w-full md:w-96">
                    <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search CSAs, co-ops, location, or tag..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Type Filters */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {['ALL', 'CSA', 'Co-op', 'Farmers Market', 'Buying Club', 'Regenerative Farm'].map(
                      (type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                            selectedType === type
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {type === 'ALL' ? 'All Networks' : type}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Additional Toggles */}
                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-600 gap-2">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={onlyEbt}
                        onChange={(e) => setOnlyEbt(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span>Accepts SNAP / EBT</span>
                    </label>
                  </div>
                  <div>
                    Showing <span className="font-bold text-slate-900">{filteredNetworks.length}</span> verified regional networks
                  </div>
                </div>
              </div>

              {/* Network Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNetworks.map((network) => {
                  const isSaved = savedNetworkIds.includes(network.id);
                  return (
                    <div
                      key={network.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                    >
                      <div className="p-6 space-y-4">
                        {/* Top Metadata */}
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                              network.type === 'CSA'
                                ? 'bg-emerald-100 text-emerald-800'
                                : network.type === 'Co-op'
                                ? 'bg-blue-100 text-blue-800'
                                : network.type === 'Farmers Market'
                                ? 'bg-amber-100 text-amber-800'
                                : network.type === 'Buying Club'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-teal-100 text-teal-800'
                            }`}
                          >
                            {network.type}
                          </span>
                          <button
                            onClick={() => toggleSave(network.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition rounded-full hover:bg-slate-50"
                            aria-label="Save network"
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                isSaved ? 'fill-rose-500 text-rose-500' : ''
                              }`}
                            />
                          </button>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 hover:text-emerald-700 transition cursor-pointer">
                            {network.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span>{network.location}</span>
                            <span className="font-semibold text-emerald-600">
                              ({network.distanceMiles} mi away)
                            </span>
                          </p>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {network.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {network.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Details Table */}
                        <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100">
                          <div className="flex justify-between text-slate-600">
                            <span className="text-slate-400">Fee / Model:</span>
                            <span className="font-medium text-slate-800">
                              {network.membershipFee}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span className="text-slate-400">Pickup Schedule:</span>
                            <span className="font-medium text-slate-800">
                              {network.pickupDays}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span className="text-slate-400">SNAP/EBT Accepted:</span>
                            <span className="font-medium text-slate-800">
                              {network.acceptsEBT ? 'Yes (Supported)' : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs">
                        <a
                          href={network.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900 transition"
                        >
                          Website <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setContactModalNetwork(network)}
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg transition"
                        >
                          Connect <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'research' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-600 font-semibold text-sm">
                  <BookOpen className="w-5 h-5" />
                  <span>Research & Food System Questions Hub</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Alternative Network Dynamics & Inquiry Framework
                </h2>
                <p className="text-sm text-slate-600">
                  Explore core questions regarding localized supply chain economics, ecological impact, and accessibility. Use these completed insights or investigate open questions to deepen local food security.
                </p>
              </div>

              <div className="space-y-4">
                {RESEARCH_QUESTIONS.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          item.status === 'answered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status === 'answered' ? 'Answered Question' : 'Open Research Question'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{item.question}</h3>

                    {item.summary && (
                      <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                        <strong className="text-slate-800">Key Finding: </strong>
                        {item.summary}
                      </p>
                    )}

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <div className="text-emerald-700 font-medium flex items-center gap-1.5">
                        <Compass className="w-4 h-4" />
                        <span>Action Prompt: {item.actionPrompt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'take_action' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  Organize or Launch a Localized Food Node
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Can't find an existing CSA or buying club near your neighborhood? Follow this community playbook to form a buying club, establish a CSA drop spot, or partner with regional farms.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Gather 10 Households</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Form a preliminary group of neighbors willing to pool purchasing power or host a neighborhood drop site for regional farm boxes.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Connect with Producers</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Use our directory tool to reach regional smallholders seeking direct distribution partners with guaranteed weekly drop volumes.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Establish Governance</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Adopt democratic co-op protocols or simple volunteer rotation schedules for receiving, sorting, and distributing fresh shares.
                  </p>
                </div>
              </div>

              <div className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="text-xl font-bold">Download the Community Food Hub Toolkit</h3>
                <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
                  Get template contracts, logistics calculator spreadsheets, and municipal outreach guides to streamline alternative network development in your locality.
                </p>
                <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition inline-flex items-center gap-2">
                  <span>Download Starter Kit</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Contact/Connect Modal */}
        {contactModalNetwork && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 relative">
              <button
                onClick={() => setContactModalNetwork(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Direct Outreach
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Connect with {contactModalNetwork.name}
                </h3>
              </div>

              <p className="text-xs text-slate-600">
                Send a direct inquiry regarding seasonal memberships, drop-site hosting, or community collaboration.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Inquiry sent to ${contactModalNetwork.contactEmail}!`);
                  setContactModalNetwork(null);
                }}
                className="space-y-3 pt-2"
              >
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Jane Doe"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Your Email Address
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="jane@example.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Inquiry Type
                  </label>
                  <select className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Join / Subscribe to Shares</option>
                    <option>Host a Pickup Location</option>
                    <option>Volunteer or Work Opportunity</option>
                    <option>General Research Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="I am interested in signing up for the upcoming season..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setContactModalNetwork(null)}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}