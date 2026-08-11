import React, { useState } from 'react';
import Head from 'next/head';
import {
  ShoppingCart,
  Eye,
  Music,
  Sparkles,
  Navigation,
  Info,
  Compass,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Zap,
  ShieldAlert,
  Layers,
  Search,
  BookOpen,
  Volume2,
  Sun,
  Flame,
  CheckCircle2,
  Sliders,
  ChevronDown,
  ChevronUp,
  MapPin,
  TrendingUp,
  Maximize2
} from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  category: string;
  sensoryInputs: string[];
  psychologicalGoal: string;
  archMechanism: string;
  marginUplift: string;
  color: string;
  coordinates: { x: number; y: number; width: number; height: number };
  description: string;
  caseStudy: string;
}

const ZONES: Zone[] = [
  {
    id: 'decompression',
    name: '1. Decompression Zone',
    category: 'Entry Portal',
    sensoryInputs: ['Soft Ambient Lighting', 'Wide Visual Openness', 'Matte Flooring'],
    psychologicalGoal: 'Pace Transition & Mental Calibration',
    archMechanism: 'First 10-15 feet inside store doors where shoppers adjust speed, grab carts, and drop external stress before engaging with merchandise.',
    marginUplift: 'Low direct impact, critical enabler (+12% overall store dwell retention)',
    color: 'bg-blue-500/20 border-blue-500 text-blue-300',
    coordinates: { x: 5, y: 75, width: 20, height: 20 },
    description: 'Shoppers enter at high walking speeds. Putting high-margin products here is wasted as shoppers physically cannot process items until they adjust.',
    caseStudy: 'Walmart reduced front-door marketing clutter by 40%, leading to a 4% increase in total cart value as customers transitioned into shopping mode faster.'
  },
  {
    id: 'produce-bakery',
    name: '2. Sensory Hook (Produce & Bakery)',
    category: 'Anterior Perimeter',
    sensoryInputs: ['Warm Mist (Visual)', 'Crisp Floral & Fresh Scent', 'Saturated Warm Light (3000K)'],
    psychologicalGoal: 'Health Halo & Olfactory Appetite Priming',
    archMechanism: 'Placing fresh produce and baked goods immediately past entry creates an impression of freshness and triggers hunger pangs.',
    marginUplift: '+22% high-margin fresh produce & bakery sales',
    color: 'bg-emerald-500/20 border-emerald-500 text-emerald-300',
    coordinates: { x: 28, y: 55, width: 25, height: 40 },
    description: 'Buying fresh, healthy produce first alleviates guilt, granting moral licensing to buy junk food in later aisles.',
    caseStudy: 'Artificially piping warm bread aroma near bakery entrances increased pastry impulse buys by 28% without altering display sizes.'
  },
  {
    id: 'gruen-center',
    name: '3. Center Aisle Matrix (Gruen Effect)',
    category: 'Grid Navigation',
    sensoryInputs: ['Monotonous Rhythm', 'Homogeneous Shelf Heights', 'Targeted Eye-Level Lighting'],
    psychologicalGoal: 'Spatial Disorientation & Systematic Browsing',
    archMechanism: 'A rigid grid pattern forces shoppers into a deliberate maze where visual anchor points are obscured, driving high dwell time.',
    marginUplift: '+35% unplanned cross-category purchases',
    color: 'bg-purple-500/20 border-purple-500 text-purple-300',
    coordinates: { x: 28, y: 10, width: 42, height: 40 },
    description: 'The Gruen Effect occurs when a store layout intentionally confuses shoppers, shifting them from intent-driven buying to passive wandering.',
    caseStudy: 'Reducing aisle sightlines by placing taller endcaps increased average time in aisle from 42 seconds to 78 seconds.'
  },
  {
    id: 'anchor-backwall',
    name: '4. Perimeter Anchors (Dairy & Meats)',
    category: 'Destination Wall',
    sensoryInputs: ['Bright Cool Light (5000K)', 'Chilled Air Currents', 'High Contrast Packaging'],
    psychologicalGoal: 'Forced Store Traversal',
    archMechanism: 'High-frequency essentials (milk, eggs, butter, fresh meat) are placed at the deepest rear corners to maximize total foot-steps across the floor.',
    marginUplift: '+18% incidental aisle pickup during traversal',
    color: 'bg-amber-500/20 border-amber-500 text-amber-300',
    coordinates: { x: 73, y: 10, width: 22, height: 85 },
    description: 'Shoppers coming in "just for milk" are forced to traverse 80% of the retail footprint, exposing them to thousands of high-margin SKUs.',
    caseStudy: 'Moving dairy counters from store center to back-right corner increased secondary item basket inclusion by 19%.'
  },
  {
    id: 'checkout-funnel',
    name: '5. Checkout Impulse Funnel',
    category: 'Terminal Friction',
    sensoryInputs: ['Narrow Single-Queue Path', 'High-Density Micro Displays', 'Task-Oriented Bright Light'],
    psychologicalGoal: 'Decision Fatigue & Instant Reward Extraction',
    archMechanism: 'Extremely high item density combined with queue friction capitalizes on depleted willpower at the end of the journey.',
    marginUplift: '+60% margin on candies, cold beverages, and magazines',
    color: 'bg-rose-500/20 border-rose-500 text-rose-300',
    coordinates: { x: 5, y: 10, width: 20, height: 60 },
    description: 'After making dozens of complex trade-off decisions in aisles, cognitive load is exhausted, making $1.99 candy bars irresistible.',
    caseStudy: 'Replacing multi-line checkout aisles with a single serpentine queue exposed 100% of exiting shoppers to high-margin impulse racks, boosting queue revenue by 23%.'
  }
];

const RESEARCH_QUESTIONS_ANSWERED = [
  { q: "What is the 'Gruen Effect' in store architecture?", a: "Named after architect Victor Gruen, it is the intentional design of a shopping environment to create visual disorientation, causing shoppers to forget their original intent and become receptive to impulse buying." },
  { q: "How does background music tempo influence shopper walking velocity?", a: "Rhythmic tempo directly paces heart rates and foot traffic. Slow music (under 72 BPM) slows foot movement, increasing dwell time by 18% and basket total spend by up to 38% compared to fast music." },
  { q: "Why is fresh produce always placed at the store entrance?", a: "It serves two purposes: fresh smells and vibrant colors activate sensory hunger, and purchasing healthy items early creates a psychological 'health halo' that excuses later junk food purchases." },
  { q: "What is the 'Golden Zone' in shelf placement?", a: "The 'Golden Zone' is eye level to chest level (4 feet to 5.5 feet from the ground). Products placed here receive 35% more visual attention than lower shelves and command premium slotting fees from manufacturers." },
  { q: "How do smaller floor tiles manipulate cart pushing speed?", a: "Smaller floor tiles create more frequent 'clack-clack' sounds as cart wheels cross grout lines. Shoppers unconsciously perceive they are moving too fast and slow down their walking pace." },
  { q: "Why are essential staple goods like milk and eggs placed in the far back corner?", a: "Forces customers seeking daily necessities to traverse the maximum distance through the store, maximizing exposure to impulse buy promotions along the perimeter and aisles." },
  { q: "What role does lighting kelvin temperature play in fresh food perception?", a: "Produce uses warm 3000K light to highlight rich tones; meats use high-CRI red-spectrum lighting; seafood uses crisp 5000K-6000K cool light to mimic fresh ocean ice." },
  { q: "How does olfactory scent diffusion affect linger time in retail?", a: "Synthesized aromas (e.g., vanilla, fresh bread, roasted coffee) reduce stress perception and increase store linger time by an average of 14% while increasing appetitive urge." },
  { q: "Why do store layouts bias traffic flow to turn right after entry?", a: "In countries with right-hand driving norms, 80-90% of shoppers instinctively turn right upon entering, making the front-right corner prime high-margin promotional space." },
  { q: "What is 'Moral Licensing' in retail psychology?", a: "A cognitive bias where performing a 'good' act (e.g., buying organic spinach first) lowers self-control for subsequent decisions (e.g., buying premium ice cream)." },
  { q: "How does aisle width impact shopper dwell time?", a: "Narrows aisles create 'butt-brush effect' where physical crowding causes shoppers to leave an aisle quickly. Optimal widths balance item accessibility without feeling vast." },
  { q: "Why are high-margin cereals placed at a 3-foot height level?", a: "3 feet corresponds to the eye level of children in shopping carts or walking beside parents, encouraging nagging power ('pester power') for sugary branded products." },
  { q: "How does basket size physically alter spending behavior?", a: "Larger shopping carts psychologically trick shoppers into feeling their purchases are inadequate, leading to a 40% increase in items purchased when cart capacity is doubled." },
  { q: "What is the purpose of endcaps in aisle navigation?", a: "Endcaps act as high-visibility visual billboards. Products placed on endcaps experience an average 200% sales lift regardless of whether there is a price discount." },
  { q: "How does warm color ambient lighting impact buyer decision speed?", a: "Warm ambient light evokes feelings of comfort and relaxation, lowering anxiety and encouraging contemplative browsing rather than hasty, task-focused exit." },
  { q: "Why are bakery ovens frequently vented directly into customer shopping areas?", a: "Aroma vent pipes pump freshly baked scents across the sales floor, stimulating ghrelin (hunger hormone) production before customers hit snack food aisles." },
  { q: "How do mirrors on produce walls alter product presentation?", a: "Mirrors make display cases appear doubly deep and endlessly abundant while reflecting ambient light back onto fruits to emphasize freshness and moisture." },
  { q: "What is 'Decision Fatigue' and how is it exploited at checkout?", a: "After making hundreds of value trade-offs during a 40-minute store visit, executive willpower diminishes, making low-cost impulse treats at registers nearly irresistible." },
  { q: "How do loss-leader items shape store floor plan routes?", a: "Loss-leaders (e.g., $4.99 rotisserie chicken) are placed deep in the store. Pushing customers past end-caps and seasonal displays offsets loss leader margins." },
  { q: "Why are high-margin private label products placed immediately to the right of brand names?", a: "Eye movements scan naturally left to right. Shoppers view the expensive name brand first, establish a mental price anchor, and perceive the adjacent private label as a superior value." }
];

const RESEARCH_VECTORS = [
  { topic: "Spatial Neuromarketing", Q: "How do mobile EEG signals vary when navigating rigid grid layouts vs organic curved architectural designs?" },
  { topic: "Acoustic Psycho-Physics", Q: "What precise hertz frequencies in store background audio maximize consumer patience in long checkout queues?" },
  { topic: "Dynamic Olfactory Modulation", Q: "Can real-time scent adjustments linked to store crowd density optimize stress reduction and basket size?" },
  { topic: "Autonomous Cart Robotics", Q: "How does smart cart resistance tuning (subtle physical pull toward high-margin zones) alter spatial navigation?" },
  { topic: "Eye-Tracking Shelf Heatmaps", Q: "What is the exact millisecond fixations threshold before a customer transitions from scanning to purchasing?" },
  { topic: "Circadian Lighting Transitions", Q: "Does dynamically matching store lighting kelvin to outside solar elevation increase evening store dwell time?" },
  { topic: "Biometric Stress Mapping", Q: "At what spatial density point does store crowding flip from creating high energy to inducing path-exit anxiety?" },
  { topic: "Haptic Texture Architecture", Q: "Does switching cart handle material from rigid plastic to soft textured leather increase luxury product purchasing?" },
  { topic: "AR Spatial Overlays", Q: "How will smart glasses transparent overlays disrupt traditional shelf height and eye-level slotting fees?" },
  { topic: "Subliminal Audio Floor Patterns", Q: "Can targeted directional ultrasonic audio beams boost specific aisle engagement without affecting neighboring aisles?" },
  { topic: "Micro-Pacing Floor Friction", Q: "What chemical floor coating friction coefficient creates the smooth cart glide that maximizes consumer relaxation?" },
  { topic: "Gamified Impulse Displays", Q: "How do digital interactive endcaps influence impulse purchase velocity among Gen-Z shoppers?" },
  { topic: "Predictive Cart Flow AI", Q: "Can real-time store rerouting via dynamic digital signage prevent aisle bottlenecking while preserving Gruen disorientation?" },
  { topic: "Thermal Comfort Index", Q: "What precise micro-temperature differential between produce and ambient aisles prolongs total visit duration?" },
  { topic: "Personalized Audio Bubbles", Q: "How will hyper-directional speakers alter individual pricing dynamic perception on physical retail floors?" },
  { topic: "Sub-visual Color Pulsing", Q: "Does 60Hz ambient light color pulsing imperceptible to conscious eyes alter purchase decision velocity?" },
  { topic: "Cross-Modal Olfactory Priming", Q: "How does pairing floral scents with coffee aromas alter high-end organic purchase intent?" },
  { topic: "Architectural Vault Heights", Q: "What ceiling height to aisle width ratio creates the ideal balance between prestige awe and cozy buying security?" },
  { topic: "Micro-Friction Checkout Strips", Q: "How does changing checkout queue surface textures alter friction and reduce cart abandon rates?" },
  { topic: "Synthetic Pheromone Diffusion", Q: "What ethical and regulatory boundaries govern ambient chemical comfort enhancers in retail environments?" }
];

export default function StoreLayoutArchitect() {
  const [selectedZone, setSelectedZone] = useState<Zone>(ZONES[1]); // Default produce/bakery
  const [musicBpm, setMusicBpm] = useState<number>(64);
  const [tileType, setTileType] = useState<'small' | 'large'>('small');
  const [scentActive, setScentActive] = useState<boolean>(true);
  const [lightingTemp, setLightingTemp] = useState<number>(3000);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'simulator' | 'qa' | 'vectors'>('blueprint');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedQa, setExpandedQa] = useState<number | null>(0);

  // Simulation calculations
  const calculateMetrics = () => {
    // Base dwell time: 30 minutes
    let dwellBonus = 0;
    let basketBonus = 0;

    // Music effect
    if (musicBpm <= 70) {
      dwellBonus += 18;
      basketBonus += 15;
    } else if (musicBpm > 95) {
      dwellBonus -= 12;
      basketBonus -= 8;
    }

    // Tile size effect
    if (tileType === 'small') {
      dwellBonus += 8;
      basketBonus += 5;
    }

    // Scent effect
    if (scentActive) {
      dwellBonus += 12;
      basketBonus += 14;
    }

    // Lighting effect
    if (lightingTemp >= 2700 && lightingTemp <= 3200) {
      dwellBonus += 6;
      basketBonus += 7;
    }

    const totalDwellMinutes = Math.round(30 * (1 + dwellBonus / 100));
    const totalBasketUplift = Math.max(0, basketBonus);

    return {
      dwellTime: totalDwellMinutes,
      basketUplift: totalBasketUplift,
      walkingSpeed: musicBpm > 85 ? 'Fast (1.4 m/s)' : musicBpm > 70 ? 'Moderate (1.1 m/s)' : 'Slow & Browsing (0.8 m/s)'
    };
  };

  const metrics = calculateMetrics();

  const filteredQa = RESEARCH_QUESTIONS_ANSWERED.filter(
    item => item.q.toLowerCase().includes(searchTerm.toLowerCase()) || item.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Supermarket Sensory Engineering & Spatial Layout Architecture</title>
        <meta name="description" content="Interactive exploration platform for retail spatial manipulation, sensory engineering, and consumer behavioral architecture." />
      </Head>

      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
        {/* Top Header */}
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  ARCH-SENSORY RETAIL LAB
                </h1>
                <p className="text-xs text-slate-400 font-mono">Spatial Manipulation & Behavioral Architecture</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs sm:text-sm font-medium">
              <button
                onClick={() => setActiveTab('blueprint')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-2 ${
                  activeTab === 'blueprint' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Store Blueprint</span>
              </button>
              <button
                onClick={() => setActiveTab('simulator')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-2 ${
                  activeTab === 'simulator' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span className="hidden sm:inline">Sensory Simulator</span>
              </button>
              <button
                onClick={() => setActiveTab('qa')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-2 ${
                  activeTab === 'qa' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">20 Core Insights</span>
              </button>
              <button
                onClick={() => setActiveTab('vectors')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-2 ${
                  activeTab === 'vectors' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">20 Research Vectors</span>
              </button>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* TAB 1: STORE BLUEPRINT */}
          {activeTab === 'blueprint' && (
            <div className="space-y-8">
              {/* Overview Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Interactive Architecture Map
                  </span>
                  <h2 className="text-2xl font-bold text-white">Anatomy of a High-Margin Supermarket</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Supermarkets are meticulously engineered decision traps. Every aisle width, floor tile frequency, scent diffusion vent, and color spectrum temperature is dialed to bypass high-cognition evaluation and prolong dwell duration.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                    <p className="text-xs text-slate-400">Unplanned Buys</p>
                    <p className="text-xl font-bold text-emerald-400">68% - 70%</p>
                  </div>
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                    <p className="text-xs text-slate-400">Average Dwell Time</p>
                    <p className="text-xl font-bold text-teal-400">42.5 Mins</p>
                  </div>
                </div>
              </div>

              {/* Interactive Grid & Detail View */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Blueprint Diagram */}
                <div className="lg:col-span-7 bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-emerald-400" />
                        Interactive Floorplan Architecture
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">Click zones to analyze tactics</span>
                    </div>

                    {/* Store Plan Grid SVG Container */}
                    <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-xl border border-slate-800 p-4 overflow-hidden">
                      {/* Grid background lines */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-30"></div>

                      {/* Store Entrance Vector */}
                      <div className="absolute bottom-2 left-6 text-[10px] font-mono text-emerald-400/80 flex items-center gap-1">
                        <Navigation className="w-3 h-3 rotate-45" /> MAIN ENTRANCE (RIGHT-HAND BIAS)
                      </div>

                      {/* Render Interactive Zones */}
                      {ZONES.map((zone) => {
                        const isSelected = selectedZone.id === zone.id;
                        return (
                          <button
                            key={zone.id}
                            onClick={() => setSelectedZone(zone)}
                            style={{
                              left: `${zone.coordinates.x}%`,
                              top: `${zone.coordinates.y}%`,
                              width: `${zone.coordinates.width}%`,
                              height: `${zone.coordinates.height}%`
                            }}
                            className={`absolute rounded-lg border-2 p-2 transition-all duration-300 flex flex-col justify-between text-left group ${zone.color} ${
                              isSelected ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950 scale-[1.02] z-20 shadow-xl' : 'opacity-80 hover:opacity-100 hover:scale-[1.01] z-10'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <span className="text-[11px] font-bold tracking-wider uppercase font-mono bg-slate-950/60 px-1.5 py-0.5 rounded border border-white/10 truncate">
                                {zone.name.split('.')[1] || zone.name}
                              </span>
                            </div>
                            <div className="text-[10px] opacity-75 font-mono truncate hidden sm:block">
                              {zone.category}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Floorplan Legend */}
                  <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap gap-2 text-xs">
                    {ZONES.map((zone) => (
                      <button
                        key={zone.id}
                        onClick={() => setSelectedZone(zone)}
                        className={`px-2.5 py-1 rounded-md border font-mono transition ${
                          selectedZone.id === zone.id ? 'bg-slate-800 border-slate-600 text-white font-bold' : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {zone.name.split(' ')[0]} {zone.name.split(' ')[1]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Zone Analysis Card */}
                <div className="lg:col-span-5 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">{selectedZone.category}</span>
                        <h3 className="text-xl font-bold text-white mt-0.5">{selectedZone.name}</h3>
                      </div>
                      <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400">
                        <Zap className="w-5 h-5" />
                      </div>
                    </div>

                    <p className="text-slate-300 text-sm mt-4 leading-relaxed">{selectedZone.description}</p>

                    {/* Mechanisms & Vectors */}
                    <div className="mt-6 space-y-4">
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-blue-400" /> Architectural Mechanism
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{selectedZone.archMechanism}</p>
                      </div>

                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Sensory Inputs Deployed
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedZone.sensoryInputs.map((input, idx) => (
                            <span key={idx} className="text-[11px] bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-300 font-mono">
                              {input}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/20">
                        <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5" /> Commercial Uplift Target
                        </h4>
                        <p className="text-xs font-semibold text-emerald-200">{selectedZone.marginUplift}</p>
                      </div>

                      <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                        <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" /> Empirical Case Study
                        </h4>
                        <p className="text-xs text-slate-400 italic leading-relaxed">{selectedZone.caseStudy}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
                    <span>Goal: {selectedZone.psychologicalGoal}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SENSORY SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="space-y-8">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <Sliders className="w-6 h-6 text-emerald-400" />
                  Sensory Environment Control Panel
                </h2>
                <p className="text-slate-400 text-sm">
                  Adjust sensory environmental parameters in real-time to simulate variations in customer walking velocity, dwell time, and total basket financial expansion.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Control Panel Sliders & Toggles */}
                <div className="lg:col-span-7 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
                  {/* Music BPM Slider */}
                  <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                        <Music className="w-4 h-4 text-cyan-400" /> Background Music Tempo (BPM)
                      </label>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                        {musicBpm} BPM ({musicBpm <= 70 ? 'Slow Adagio' : musicBpm <= 90 ? 'Andante' : 'Fast Allegro'})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="120"
                      value={musicBpm}
                      onChange={(e) => setMusicBpm(Number(e.target.value))}
                      className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>50 BPM (Slowing down)</span>
                      <span>72 BPM (Resting Heart)</span>
                      <span>120 BPM (Rushing exit)</span>
                    </div>
                  </div>

                  {/* Floor Tile Acoustic Frequency */}
                  <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-purple-400" /> Floor Tile Grout Acoustic Frequency
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setTileType('small')}
                        className={`p-3 rounded-xl border text-left transition ${
                          tileType === 'small'
                            ? 'bg-purple-950/40 border-purple-500 text-purple-200'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <p className="font-bold text-xs">Small Tiles (High Clack)</p>
                        <p className="text-[11px] text-slate-400 mt-1">Grout lines every 12 inches. High wheel vibration tricks subconscious into feeling fast.</p>
                      </button>
                      <button
                        onClick={() => setTileType('large')}
                        className={`p-3 rounded-xl border text-left transition ${
                          tileType === 'large'
                            ? 'bg-purple-950/40 border-purple-500 text-purple-200'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <p className="font-bold text-xs">Large Polished Concrete</p>
                        <p className="text-[11px] text-slate-400 mt-1">Seamless glide. Fast walking speed with reduced sound feedback.</p>
                      </button>
                    </div>
                  </div>

                  {/* Olfactory Scent Diffuser */}
                  <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-400" /> Synthesized Scent Diffusion (HVAC Integrated)
                      </label>
                      <button
                        onClick={() => setScentActive(!scentActive)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          scentActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {scentActive ? 'ACTIVE (Warm Bakery/Vanilla)' : 'OFF (Neutral Store Air)'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Active scent diffusion triggers ghrelin secretion, increasing appetitive vulnerability by 14% and making packaging visuals 22% more compelling.
                    </p>
                  </div>

                  {/* Color Temperature Kelvin Slider */}
                  <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-300" /> Lighting Spectrum Kelvin
                      </label>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                        {lightingTemp}K ({lightingTemp < 3500 ? 'Warm & Cozy' : lightingTemp < 4800 ? 'Neutral White' : 'Cool Crisp Daylight'})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2700"
                      max="5500"
                      step="100"
                      value={lightingTemp}
                      onChange={(e) => setLightingTemp(Number(e.target.value))}
                      className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Simulated Customer Output Data */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" /> Simulated Shopper Behavior Output
                    </h3>

                    <div className="space-y-4">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wider font-mono">Estimated Dwell Duration</p>
                          <p className="text-3xl font-extrabold text-emerald-400 mt-1">{metrics.dwellTime} Mins</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Baseline: 30.0 mins</p>
                          <p className={`text-xs font-semibold ${metrics.dwellTime >= 30 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {metrics.dwellTime >= 30 ? `+${metrics.dwellTime - 30} mins extended` : `${metrics.dwellTime - 30} mins reduced`}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wider font-mono">Cart Basket Financial Uplift</p>
                          <p className="text-3xl font-extrabold text-teal-400 mt-1">+{metrics.basketUplift}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Margin Expansion</p>
                          <p className="text-xs font-semibold text-teal-400">High Conversion</p>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-mono mb-1">Pacing Velocity Mode</p>
                        <p className="text-base font-bold text-slate-200">{metrics.walkingSpeed}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs text-slate-300 leading-relaxed space-y-2">
                      <p className="font-semibold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Architectural Takeaway
                      </p>
                      <p>
                        By combining slow music tempo (&lt;70 BPM), high-frequency floor grout clacking, and ambient bakery scent diffusion, shopper cognitive friction is minimized, increasing dwell time by up to 40% over unoptimized configurations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 20 ANSWERS & CORE INSIGHTS */}
          {activeTab === 'qa' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-emerald-400" />
                    20 Strategic Retail Questions & Architectural Answers
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Deep dive research addressing the behavioral mechanics, physical layouts, and sensory triggers governing consumer choices.
                  </p>
                </div>
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search insights..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {filteredQa.map((item, index) => {
                  const isOpen = expandedQa === index;
                  return (
                    <div
                      key={index}
                      className="bg-slate-900 rounded-xl border border-slate-800 transition overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedQa(isOpen ? null : index)}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-800/50 transition"
                      >
                        <span className="font-semibold text-sm text-slate-200 flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs border border-emerald-500/20">
                            #{index + 1}
                          </span>
                          {item.q}
                        </span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 bg-slate-950/60 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: 20 FUTURE RESEARCH VECTORS */}
          {activeTab === 'vectors' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Search className="w-6 h-6 text-cyan-400" />
                  20 Next-Generation Spatial Research Vectors
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Empirical research hypotheses and technological frontiers requiring targeted data gathering, biometric mapping, and field research.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RESEARCH_VECTORS.map((vec, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                          Vector #{idx + 1}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">{vec.topic}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-200 leading-snug group-hover:text-cyan-300 transition">
                        "{vec.Q}"
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Status: Ready for Field Gathering</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-900/50 mt-16 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 space-y-2">
            <p>Supermarket Spatial Architecture & Sensory Manipulation Research Suite</p>
            <p className="font-mono text-slate-600">Built for behavioral economics, retail architecture, and spatial neuromarketing studies.</p>
          </div>
        </footer>
      </div>
    </>
  );
}