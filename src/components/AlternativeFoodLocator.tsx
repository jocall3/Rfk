import React, { useState, useMemo } from 'react';

export interface FoodHubSource {
  id: string;
  name: string;
  category: 'csa' | 'coop' | 'farmers_market' | 'direct_delivery';
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  products: string[];
  certifications: string[];
  operatingDays: string[];
  acceptsEBT: boolean;
  deliveryRadiusMiles?: number;
  seasonality: string;
  rating: number;
  researchNote?: string;
}

const SAMPLE_FOOD_SOURCES: FoodHubSource[] = [
  {
    id: 'src-1',
    name: 'Valley Roots Regenerative CSA',
    category: 'csa',
    description: 'Weekly seasonal produce shares direct from a coalition of 12 biodynamic family farms in the river basin.',
    address: '1420 Old Mill Road',
    city: 'Boulder',
    state: 'CO',
    zip: '80301',
    phone: '(303) 555-0192',
    email: 'info@valleyroots-csa.org',
    website: 'https://example.org/valleyroots',
    products: ['Heirloom Vegetables', 'Pasture Eggs', 'Artisanal Cheese', 'Heritage Grains'],
    certifications: ['Certified Organic', 'Regenerative Organic Certified', 'Demeter Biodynamic'],
    operatingDays: ['Tuesday', 'Thursday', 'Saturday'],
    acceptsEBT: true,
    seasonality: 'Year-Round (24-week summer + 12-week winter shares)',
    rating: 4.9,
    researchNote: 'Direct farm model bypasses central wholesale distribution; 88% of dollar goes back to grower.'
  },
  {
    id: 'src-2',
    name: 'Community Grain & Goods Co-op',
    category: 'coop',
    description: 'Member-owned storefront specializing in regional dry goods, cold-pressed oils, zero-waste pantry refills, and ethical dairy.',
    address: '884 North Main Street',
    city: 'Portland',
    state: 'OR',
    zip: '97205',
    phone: '(503) 555-0144',
    email: 'members@communitygraincoop.com',
    website: 'https://example.com/communitygrain',
    products: ['Bulk Grains', 'Local Ferments', 'Raw Dairy', 'Ecological Cleaning Goods'],
    certifications: ['Fair Trade', 'Non-GMO Verified'],
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    acceptsEBT: true,
    seasonality: 'Open Daily Year-Round',
    rating: 4.8,
    researchNote: 'Operates under a worker-community patronage dividend model.'
  },
  {
    id: 'src-3',
    name: 'Highland River Farmers Market',
    category: 'farmers_market',
    description: 'Regional producer-only outdoor market featuring 45+ independent growers, wild foragers, and artisanal bakers.',
    address: 'Town Square Park, 4th & Elm',
    city: 'Asheville',
    state: 'NC',
    zip: '28801',
    phone: '(828) 555-0177',
    email: 'marketmanager@highlandfarmersmarket.org',
    website: 'https://example.org/highlandmarket',
    products: ['Fresh Herbs', 'Forest Mushrooms', 'Grass-Fed Meat', 'Sourdough Bread', 'Honey'],
    certifications: ['Producer-Only Guarantee', 'Naturally Grown'],
    operatingDays: ['Wednesday', 'Saturday'],
    acceptsEBT: true,
    seasonality: 'April through November (Outdoor), Dec-Mar (Indoor Pavilion)',
    rating: 4.9,
    researchNote: 'Offers 2:1 match program for SNAP/EBT recipients up to $30 per market day.'
  },
  {
    id: 'src-4',
    name: 'Harvest Loop Direct Express',
    category: 'direct_delivery',
    description: 'Refrigerated electric vehicle delivery service delivering customized farm baskets directly from hyper-local growers.',
    address: 'Hub #4 - 300 Logistics Way',
    city: 'Austin',
    state: 'TX',
    zip: '78702',
    phone: '(512) 555-0181',
    email: 'hello@harvestloopdelivery.com',
    website: 'https://example.com/harvestloop',
    products: ['Microgreens', 'Pasture-Raised Poultry', 'Seasonal Fruit', 'Raw Honey'],
    certifications: ['Zero Emission Logistics', 'Certified Organic Partners'],
    operatingDays: ['Monday', 'Wednesday', 'Friday'],
    acceptsEBT: false,
    deliveryRadiusMiles: 35,
    seasonality: 'Year-Round',
    rating: 4.7,
    researchNote: 'Eliminates 3 days of cold-storage dwell time compared to traditional supermarket chains.'
  },
  {
    id: 'src-5',
    name: 'Sun Prairie Harvest Hub',
    category: 'csa',
    description: 'Multi-farm collaborative share offering flexible customized boxes, meat addons, and preserving bulk orders.',
    address: '501 Rural Route 3',
    city: 'Madison',
    state: 'WI',
    zip: '53703',
    phone: '(608) 555-0129',
    email: 'contact@sunprairiehub.org',
    website: 'https://example.org/sunprairie',
    products: ['Root Crops', 'Apples', 'Grass-Fed Beef', 'Fermented Kimchi'],
    certifications: ['Certified Organic'],
    operatingDays: ['Wednesday', 'Saturday'],
    acceptsEBT: true,
    seasonality: 'May to October',
    rating: 4.6,
    researchNote: 'Includes interactive seasonal storage guide and preservation workshops for subscribers.'
  },
  {
    id: 'src-6',
    name: 'Cascadia Food Workers Guild & Market',
    category: 'coop',
    description: 'Autonomous worker cooperative market and micro-canning facility dedicated to food sovereignty.',
    address: '1202 Union Ave',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    phone: '(206) 555-0163',
    email: 'contact@cascadiaguild.coop',
    website: 'https://example.coop/cascadia',
    products: ['Canned Goods', 'Dried Beans', 'Cultured Butter', 'Wild-Caught Salmon'],
    certifications: ['Worker Co-op Certified', 'Fair Labor'],
    operatingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    acceptsEBT: true,
    seasonality: 'Year-Round',
    rating: 4.9,
    researchNote: 'Reinvests 15% of annual net income into local land-trust urban gardens.'
  }
];

export const AlternativeFoodLocator: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [ebtOnly, setEbtOnly] = useState<boolean>(false);
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [selectedSource, setSelectedSource] = useState<FoodHubSource | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'directory' | 'research' | 'saved'>('directory');

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'csa', label: 'CSAs' },
    { id: 'coop', label: 'Food Co-ops' },
    { id: 'farmers_market', label: 'Farmers Markets' },
    { id: 'direct_delivery', label: 'Direct Delivery' },
  ];

  const filteredSources = useMemo(() => {
    return SAMPLE_FOOD_SOURCES.filter((source) => {
      const matchesCategory = selectedCategory === 'all' || source.category === selectedCategory;
      const matchesEbt = !ebtOnly || source.acceptsEBT;
      const matchesOrganic = !organicOnly || source.certifications.some((c) => c.toLowerCase().includes('organic'));
      
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        source.name.toLowerCase().includes(query) ||
        source.city.toLowerCase().includes(query) ||
        source.state.toLowerCase().includes(query) ||
        source.products.some((p) => p.toLowerCase().includes(query)) ||
        source.description.toLowerCase().includes(query);

      return matchesCategory && matchesEbt && matchesOrganic && matchesSearch;
    });
  }, [searchTerm, selectedCategory, ebtOnly, organicOnly]);

  const savedSources = useMemo(() => {
    return SAMPLE_FOOD_SOURCES.filter((s) => bookmarkedIds.includes(s.id));
  }, [bookmarkedIds]);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getCategoryBadgeColor = (cat: FoodHubSource['category']) => {
    switch (cat) {
      case 'csa':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'coop':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'farmers_market':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'direct_delivery':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryLabel = (cat: FoodHubSource['category']) => {
    switch (cat) {
      case 'csa':
        return 'Community Supported Ag (CSA)';
      case 'coop':
        return 'Independent Food Co-op';
      case 'farmers_market':
        return 'Regional Farmers Market';
      case 'direct_delivery':
        return 'Direct Farm Delivery';
      default:
        return cat;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 font-sans text-gray-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-green-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-block bg-emerald-500/20 backdrop-blur-md text-emerald-200 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-400/30">
            Resilient Food Systems Network
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Alternative Food Source Locator
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Discover and connect with local CSAs, food co-ops, regional farmers markets, and direct farm delivery hubs. Reduce supply chain reliance and build regional food security.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-t border-emerald-700/60 pt-4">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'directory'
                ? 'bg-white text-emerald-900 shadow-md font-semibold'
                : 'bg-emerald-900/40 text-emerald-100 hover:bg-emerald-800/60'
            }`}
          >
            🔍 Source Directory ({filteredSources.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'saved'
                ? 'bg-white text-emerald-900 shadow-md font-semibold'
                : 'bg-emerald-900/40 text-emerald-100 hover:bg-emerald-800/60'
            }`}
          >
            🔖 Saved Farms & Hubs ({bookmarkedIds.length})
          </button>
          <button
            onClick={() => setActiveTab('research')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'research'
                ? 'bg-white text-emerald-900 shadow-md font-semibold'
                : 'bg-emerald-900/40 text-emerald-100 hover:bg-emerald-800/60'
            }`}
          >
            📋 Food Sovereignty Research Prompts
          </button>
        </div>
      </div>

      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Controls & Filters Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search Bar */}
              <div className="md:col-span-6 relative">
                <input
                  type="text"
                  placeholder="Search by city, state, name, or product (e.g. 'Boulder', 'Grains', 'Honey')..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm text-gray-800 transition"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Category Dropdown */}
              <div className="md:col-span-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-2.5 px-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Checkbox Toggles */}
              <div className="md:col-span-3 flex items-center justify-start space-x-4 pt-1 sm:pt-0">
                <label className="inline-flex items-center text-xs sm:text-sm font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ebtOnly}
                    onChange={(e) => setEbtOnly(e.target.checked)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <span className="ml-2">Accepts SNAP / EBT</span>
                </label>
                <label className="inline-flex items-center text-xs sm:text-sm font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={organicOnly}
                    onChange={(e) => setOrganicOnly(e.target.checked)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <span className="ml-2">Organic Certified</span>
                </label>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Quick Filter:</span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3 py-1 rounded-full border transition ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-600 text-white border-emerald-600 font-medium'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Cards Grid */}
          {filteredSources.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-300 space-y-3">
              <div className="text-4xl">🌾</div>
              <h3 className="text-lg font-semibold text-gray-700">No Food Sources Match Your Filter</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Try resetting your search query or enabling all food source categories to view available regional hubs.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setEbtOnly(false);
                  setOrganicOnly(false);
                }}
                className="mt-2 text-xs font-medium bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg hover:bg-emerald-200 transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSources.map((source) => {
                const isBookmarked = bookmarkedIds.includes(source.id);
                return (
                  <div
                    key={source.id}
                    onClick={() => setSelectedSource(source)}
                    className="bg-white rounded-xl border border-gray-200 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer overflow-hidden group"
                  >
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeColor(
                            source.category
                          )}`}
                        >
                          {getCategoryLabel(source.category)}
                        </span>
                        <button
                          onClick={(e) => toggleBookmark(source.id, e)}
                          title={isBookmarked ? 'Remove bookmark' : 'Bookmark source'}
                          className="text-gray-400 hover:text-amber-500 transition"
                        >
                          <svg
                            className={`w-5 h-5 ${isBookmarked ? 'text-amber-500 fill-amber-500' : 'fill-none'}`}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                          </svg>
                        </button>
                      </div>

                      <h2 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition">
                        {source.name}
                      </h2>

                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {source.address}, {source.city}, {source.state} {source.zip}
                      </p>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{source.description}</p>

                      {/* Products Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {source.products.slice(0, 3).map((prod, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200"
                          >
                            {prod}
                          </span>
                        ))}
                        {source.products.length > 3 && (
                          <span className="text-[11px] bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded">
                            +{source.products.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1 font-medium text-emerald-700">
                        ⭐ {source.rating.toFixed(1)}
                      </span>
                      {source.acceptsEBT && (
                        <span className="bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded border border-emerald-200">
                          EBT Accepted
                        </span>
                      )}
                      <span className="font-semibold text-emerald-800 group-hover:underline">View Details &rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Saved Bookmarks Tab */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Saved Farm & Food Hub Bookmarks</h2>
              <p className="text-xs text-gray-500 mt-1">
                Your curated list of alternative local food providers for easy inquiry and order planning.
              </p>
            </div>
            {bookmarkedIds.length > 0 && (
              <button
                onClick={() => setBookmarkedIds([])}
                className="text-xs text-red-600 hover:text-red-800 font-medium underline"
              >
                Clear All Bookmarks
              </button>
            )}
          </div>

          {savedSources.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center border border-dashed border-gray-300 space-y-2">
              <p className="text-gray-500 text-sm">You haven't bookmarked any food hubs yet.</p>
              <button
                onClick={() => setActiveTab('directory')}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Browse Directory & Bookmark
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedSources.map((source) => (
                <div key={source.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded border ${getCategoryBadgeColor(
                          source.category
                        )}`}
                      >
                        {getCategoryLabel(source.category)}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 mt-1">{source.name}</h3>
                    </div>
                    <button
                      onClick={() => toggleBookmark(source.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">{source.address}, {source.city}, {source.state}</p>
                  <div className="text-xs space-y-1 bg-emerald-50/50 p-2.5 rounded border border-emerald-100">
                    <p><strong>Contact:</strong> {source.phone} | {source.email}</p>
                    <p><strong>Schedule:</strong> {source.operatingDays.join(', ')}</p>
                  </div>
                  <a
                    href={source.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    Visit Official Site &rarr;
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Research Prompts Tab */}
      {activeTab === 'research' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Alternative Food Security Research Questions</h2>
            <p className="text-xs text-gray-500 mt-1">
              Use these 20 standardized questions when evaluating local food distribution hubs to gather data for your regional markdown reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              "1. What percentage of retail prices goes directly to primary producers?",
              "2. How does the hub handle cold storage, surplus, and food waste mitigation?",
              "3. Does the hub support SNAP, EBT, or double-up food bucks incentives?",
              "4. What is the average geographical distance between producers and consumers?",
              "5. How are crop loss risks shared between member consumers and farms in CSAs?",
              "6. What labor practices and wage standards are maintained across supplier farms?",
              "7. Does the food hub maintain autonomous last-mile delivery capabilities?",
              "8. How does the market respond during major regional supply chain disruptions?",
              "9. What non-synthetic certification standards (biodynamic, organic) are enforced?",
              "10. Is the governance structure member-owned, worker-owned, or non-profit?",
              "11. What soil-health or regenerative agricultural metrics are tracked?",
              "12. Are local heirloom or heritage crop strains prioritized over hybrids?",
              "13. How does price volatility compare to conventional industrial supermarkets?",
              "14. What bulk food preservation options (canning, freezing, drying) exist?",
              "15. What infrastructure support is provided to first-generation or minority farmers?",
              "16. Are water conservation and rainwater catchment methods utilized by suppliers?",
              "17. How is packaging waste minimized (reusable totes, compostable wraps)?",
              "18. What educational workshops or skill-sharing community events are hosted?",
              "19. What percentage of total local food demand can the regional network meet?",
              "20. How is long-term land access and conservation secured for partner farms?"
            ].map((question, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded border border-gray-200 text-gray-700 leading-relaxed font-medium">
                {question}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Source Detail Modal */}
      {selectedSource && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedSource(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition"
            >
              ✕
            </button>

            <div className="space-y-2">
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeColor(
                  selectedSource.category
                )}`}
              >
                {getCategoryLabel(selectedSource.category)}
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900">{selectedSource.name}</h2>
              <p className="text-xs text-gray-500 font-mono">
                {selectedSource.address}, {selectedSource.city}, {selectedSource.state} {selectedSource.zip}
              </p>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{selectedSource.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
              <div>
                <span className="font-semibold text-gray-900 block mb-1">Operating Days & Schedule</span>
                <p className="text-gray-600">{selectedSource.operatingDays.join(', ')}</p>
                <p className="text-gray-500 mt-1"><em>{selectedSource.seasonality}</em></p>
              </div>

              <div>
                <span className="font-semibold text-gray-900 block mb-1">Contact Details</span>
                <p className="text-gray-600">📞 {selectedSource.phone}</p>
                <p className="text-gray-600">✉️ {selectedSource.email}</p>
                <a
                  href={selectedSource.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-bold hover:underline inline-block mt-1"
                >
                  🌐 Visit Website
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Available Products</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSource.products.map((p, i) => (
                  <span key={i} className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Certifications & Standards</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSource.certifications.map((c, i) => (
                  <span key={i} className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-md font-medium">
                    ✓ {c}
                  </span>
                ))}
              </div>
            </div>

            {selectedSource.researchNote && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1 text-amber-900">
                  📌 Regional Supply Chain Research Insight:
                </span>
                <p className="leading-relaxed">{selectedSource.researchNote}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                onClick={() => toggleBookmark(selectedSource.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  bookmarkedIds.includes(selectedSource.id)
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {bookmarkedIds.includes(selectedSource.id) ? '★ Saved in Bookmarks' : '☆ Bookmark Source'}
              </button>

              <button
                onClick={() => setSelectedSource(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlternativeFoodLocator;