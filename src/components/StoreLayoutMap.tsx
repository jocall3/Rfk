import React, { useState, useMemo } from 'react';
import {
  Eye,
  Volume2,
  Sparkles,
  ShoppingBag,
  Zap,
  Compass,
  Info,
  Layers,
  Filter,
  ArrowRight,
  RotateCcw,
  TrendingUp,
  ShoppingBasket,
  ShieldAlert,
  DollarSign,
  Lightbulb,
  Music,
  Maximize2,
  Target,
  Thermometer,
  Clock,
  HelpCircle,
  X,
  ChevronRight,
  Flame,
  MousePointer
} from 'lucide-react';

// --- TYPES & DATA INTERFACES ---

type ZoneCategory = 'sensory' | 'layout' | 'shelf' | 'impulse';

interface LayoutZone {
  id: string;
  name: string;
  subtitle: string;
  category: ZoneCategory;
  svgRect: { x: number; y: number; width: number; height: number; rx?: number };
  color: string;
  badgeColor: string;
  borderColor: string;
  iconName: string;
  psychologicalImpact: string;
  dwellTimeIncrease: string;
  marginCategory: 'High' | 'Very High' | 'Medium' | 'Essential';
  tactics: string[];
  sensoryTriggers: {
    scent?: string;
    audio?: string;
    visual?: string;
    lighting?: string;
  };
  shelfStrategy?: {
    eyeLevel: string;
    topShelf: string;
    bottomShelf: string;
  };
  researchQuestions: string[];
  counterStrategy: string;
}

interface CustomerTourStep {
  title: string;
  zoneId: string;
  description: string;
  psychologicalTrap: string;
}

// --- DATA DEFINITIONS ---

const STORE_ZONES: LayoutZone[] = [
  {
    id: 'decompression',
    name: '1. Decompression Zone',
    subtitle: 'Entry Threshold Buffer',
    category: 'layout',
    svgRect: { x: 42, y: 82, width: 20, height: 14, rx: 2 },
    color: 'bg-amber-500/20 text-amber-300',
    badgeColor: 'bg-amber-500/30 text-amber-200 border-amber-500/40',
    borderColor: 'stroke-amber-400',
    iconName: 'Compass',
    psychologicalImpact: 'Slows down customer speed by 30%. Shifts brain from exterior traffic stress to receptive shopping mindset.',
    dwellTimeIncrease: '+1.5 mins initial adjustment',
    marginCategory: 'Medium',
    tactics: [
      'Wide entrance open floorplan creates psychological comfort',
      'Large oversized shopping carts provided immediately (anchoring effect for buying more)',
      'Warm ambient lighting transition from parking lot',
      'Promotional circulars placed where customers rarely read them until slowed down'
    ],
    sensoryTriggers: {
      visual: 'Bright open sights, floor mats absorbing outdoor footwear noise',
      lighting: 'Warm 2700K welcoming color temperature',
      audio: 'Soft ambient transition zone'
    },
    researchQuestions: [
      'How does shopping cart size directly correlate to unit purchases per trip?',
      'What percentage of shoppers bypass promotional displays placed within the first 10 feet?'
    ],
    counterStrategy: 'Grab a basket instead of a large cart if buying fewer than 5 items. Pause intentionally at entry.'
  },
  {
    id: 'bakery_floral',
    name: '2. Floral & Fresh Bakery Zone',
    subtitle: 'Olfactory & Freshness Halo',
    category: 'sensory',
    svgRect: { x: 65, y: 72, width: 30, height: 24, rx: 3 },
    color: 'bg-rose-500/20 text-rose-300',
    badgeColor: 'bg-rose-500/30 text-rose-200 border-rose-500/40',
    borderColor: 'stroke-rose-400',
    iconName: 'Sparkles',
    psychologicalImpact: 'Triggers appetite, activates salivary response, creates a "Fresh Store Halo Effect" influencing entire basket perception.',
    dwellTimeIncrease: '+4.2 mins spent browsing',
    marginCategory: 'Very High',
    tactics: [
      'Freshly baked bread scents piped through HVAC at peak hours',
      'Vibrant flowers at entry stimulate dopamine & emotional positivity',
      'High-margin artisanal items placed at un-priced impulse displays',
      'Unpackaged goods encourage tactile interaction'
    ],
    sensoryTriggers: {
      scent: 'Warm vanilla, fresh yeast, floral blossom aromas',
      visual: 'Saturated natural colors, artisanal wood displays',
      lighting: 'Spotlight focused on warm baked crusts (3000K high CRI)'
    },
    researchQuestions: [
      'Does exposure to fresh floral scents increase spending in subsequent center aisles?',
      'How do unpriced bakery items leverage cognitive friction to increase impulse sales?'
    ],
    counterStrategy: 'Eat before shopping. Stick strictly to a list when entering high-aroma perimeter zones.'
  },
  {
    id: 'produce',
    name: '3. Produce Orchard',
    subtitle: 'Healthy Anchor & Visual Halo',
    category: 'sensory',
    svgRect: { x: 5, y: 65, width: 32, height: 31, rx: 3 },
    color: 'bg-emerald-500/20 text-emerald-300',
    badgeColor: 'bg-emerald-500/30 text-emerald-200 border-emerald-500/40',
    borderColor: 'stroke-emerald-400',
    iconName: 'Flame',
    psychologicalImpact: 'Moral Licensing Effect: Purchasing fresh produce early grants self-permission to buy junk food later in center aisles.',
    dwellTimeIncrease: '+5.8 mins',
    marginCategory: 'High',
    tactics: [
      'Mist sprayers on vegetables create visual freshness (though expedites decay)',
      'Angled mirror displays overhead double visual volume perception',
      'Organic items integrated next to conventional for contrast price anchoring',
      'Pre-cut convenience produce marked up 200-400%'
    ],
    sensoryTriggers: {
      scent: 'Crisp green leaf, citrus citrus notes',
      visual: 'Misting water droplets gleaming under crisp 4000K LED lights',
      audio: 'Periodic artificial thunder audio before water misting'
    },
    researchQuestions: [
      'How strong is the correlation between early produce basket fill and high-sugar center aisle purchases?',
      'Does water misting actually reduce shelf life while increasing immediate visual impulse?'
    ],
    counterStrategy: 'Buy whole un-cut produce. Be aware that healthy choices early in the trip trick your brain into indulgences later.'
  },
  {
    id: 'center_aisles',
    name: '4. Center Aisle Grid (Bulls-Eye)',
    subtitle: 'Shelf Height & Brand Slotting Maze',
    category: 'shelf',
    svgRect: { x: 18, y: 22, width: 62, height: 38, rx: 2 },
    color: 'bg-blue-500/20 text-blue-300',
    badgeColor: 'bg-blue-500/30 text-blue-200 border-blue-500/40',
    borderColor: 'stroke-blue-400',
    iconName: 'Layers',
    psychologicalImpact: 'Monotonous aisle flow creates hypnotic "supermarket trance". Eye-level shelf placement increases sales by up to 35%.',
    dwellTimeIncrease: '+12.0 mins total aisle navigation',
    marginCategory: 'High',
    tactics: [
      'Eye-Level is Buy-Level: Premium national brands pay slotting fees for 4ft - 5ft height',
      'Kids Eye-Level (3ft): Sugary cereals and licensed character snacks',
      'Bottom Shelf "Bargain Basement": Generic and store brands hidden low',
      'Long unbroken aisles force maximum linear distance walked'
    ],
    shelfStrategy: {
      topShelf: 'Niche, gourmet, and regional specialty brands (High margin, low volume)',
      eyeLevel: 'Bulls-Eye Zone: High-priced name brands paying slotting fees (Highest turn)',
      bottomShelf: 'Store brands, bulk items, heavy packages, budget alternatives'
    },
    sensoryTriggers: {
      audio: 'Slow tempo background music (60-70 BPM) to slow walking rhythm',
      visual: 'Repetitive vertical shelf lines inducing trance-like scan patterns'
    },
    researchQuestions: [
      'What is the price differential between eye-level brand products and floor-level store brands in the same category?',
      'How does aisle length influence basket drop-off vs completion bias?'
    ],
    counterStrategy: 'Always look at the top and bottom shelves first before picking eye-level items. Compare unit pricing per ounce/gram.'
  },
  {
    id: 'meat_seafood',
    name: '5. Meat & Seafood Perimeter',
    subtitle: 'Back Wall Destination Anchor',
    category: 'layout',
    svgRect: { x: 5, y: 5, width: 42, height: 14, rx: 2 },
    color: 'bg-red-500/20 text-red-300',
    badgeColor: 'bg-red-500/30 text-red-200 border-red-500/40',
    borderColor: 'stroke-red-400',
    iconName: 'Target',
    psychologicalImpact: 'Positions high-demand protein anchor at the absolute back to force shoppers through maximum visual exposure.',
    dwellTimeIncrease: '+3.1 mins',
    marginCategory: 'High',
    tactics: [
      'Red meat illuminated under specific red-spectrum accent lighting to look fresher',
      'Seafood displayed on crushed ice to signify same-day ocean catch',
      'Pre-marinated meats priced at steep premium over raw cuts',
      'Cross-merchandising sauces, wines, and rubs directly adjacent'
    ],
    sensoryTriggers: {
      lighting: 'Specialized pink/red LED filters enhancement (R9 color rendering)',
      visual: 'Gleaming white tile backdrops with rustic butcher-block styling'
    },
    researchQuestions: [
      'How much additional basket revenue is generated by cross-merchandising wine next to high-end steaks?',
      'Does specialized red-spectrum lighting alter consumer freshness perception threshold?'
    ],
    counterStrategy: 'Marinate your own meats. Stick to unprocessed bulk cuts and check pack dates carefully.'
  },
  {
    id: 'dairy_corner',
    name: '6. Dairy & Milk Cold Wall',
    subtitle: 'Deepest Corner Trapping Zone',
    category: 'layout',
    svgRect: { x: 55, y: 5, width: 40, height: 14, rx: 2 },
    color: 'bg-cyan-500/20 text-cyan-300',
    badgeColor: 'bg-cyan-500/30 text-cyan-200 border-cyan-500/40',
    borderColor: 'stroke-cyan-400',
    iconName: 'Thermometer',
    psychologicalImpact: 'Milk and eggs (bought by 92% of households) placed in furthest corner, guaranteeing exposure to 80% of store displays.',
    dwellTimeIncrease: '+4.5 mins transit time',
    marginCategory: 'Essential',
    tactics: [
      'Furthest corner placement forces full diagonal navigation across store',
      'Cold temperature triggers subconscious instinct to move quickly but scan adjacent grab items',
      'High-margin flavored milks, yogurts, and juices surround essential white milk',
      'Push-feed gravity racks ensure items always look full and immediate'
    ],
    sensoryTriggers: {
      lighting: 'Cool crisp white 5000K lighting emphasizing cleanliness',
      visual: 'Bright glass doors with anti-fog coatings highlighting vibrant packaging'
    },
    researchQuestions: [
      'What percentage of shoppers buying only milk end up exiting with 3+ additional impulse items?',
      'What is the average store path length required to reach the dairy section from entry?'
    ],
    counterStrategy: 'Walk with intention directly to the milk case. Resist picking up items along the diagonal path unless on your list.'
  },
  {
    id: 'endcaps',
    name: '7. Promotional Endcaps & Dump Bins',
    subtitle: 'Perceived Value Disruption Points',
    category: 'impulse',
    svgRect: { x: 82, y: 22, width: 13, height: 38, rx: 2 },
    color: 'bg-violet-500/20 text-violet-300',
    badgeColor: 'bg-violet-500/30 text-violet-200 border-violet-500/40',
    borderColor: 'stroke-violet-400',
    iconName: 'Zap',
    psychologicalImpact: 'Endcap feature placement creates false assumption of "On Sale" status. Endcaps increase item velocity by up to 400%.',
    dwellTimeIncrease: '+2.0 mins per endcap scan',
    marginCategory: 'Very High',
    tactics: [
      'Items placed on endcaps are often full price, leveraging sale location association',
      'Dump bins provoke tactile "treasure hunt" instinct and scarcity sensation',
      'Cross-merchandised seasonal themed bundles (e.g., chips + salsa + soda)',
      'Bright yellow or red discount tag psychology even without price cuts'
    ],
    sensoryTriggers: {
      visual: 'High visual contrast, stacked display geometry, bold sale signage',
      lighting: 'Focused overhead spot beams'
    },
    researchQuestions: [
      'What percentage of endcap products are actually discounted vs priced at regular MSRP?',
      'How does the unstructured arrangement of dump bins increase touch rates and purchase conversion?'
    ],
    counterStrategy: 'Never assume an endcap item is on sale. Check the home aisle shelf tag to compare real pricing.'
  },
  {
    id: 'checkout_chute',
    name: '8. Checkout Impulse Chute',
    subtitle: 'Fatigue & Scarcity Capture Zone',
    category: 'impulse',
    svgRect: { x: 5, y: 82, width: 32, height: 14, rx: 2 },
    color: 'bg-yellow-500/20 text-yellow-300',
    badgeColor: 'bg-yellow-500/30 text-yellow-200 border-yellow-500/40',
    borderColor: 'stroke-yellow-400',
    iconName: 'DollarSign',
    psychologicalImpact: 'Capitalizes on Decision Fatigue after making 50+ choices in-store. High friction narrow queue prevents turning back.',
    dwellTimeIncrease: '+3.5 mins queue wait time',
    marginCategory: 'Very High',
    tactics: [
      'Single-file serpent line forces 100% exposure to high-margin candies & cold drinks',
      'Small item size minimizes price resistance (e.g., $1.99 candy bar feels negligible)',
      'Magazines, lip balm, batteries target last-minute "did I forget?" panic',
      'Cold beverage coolers at knee-to-hand level right before register'
    ],
    sensoryTriggers: {
      visual: 'Densely packed colorful candy wrappers, shiny foil packaging',
      lighting: 'Intense overhead LED highlighting immediate gratification items'
    },
    researchQuestions: [
      'How does decision fatigue directly weaken impulse impulse inhibition at checkout?',
      'What is the profit margin comparison between a center-aisle multi-pack candy vs single checkout unit?'
    ],
    counterStrategy: 'Practice self-discipline during wait times. Put your phone out or look at your receipt to ignore display shelves.'
  }
];

const GUIDED_TOUR: CustomerTourStep[] = [
  {
    title: 'Step 1: The Entry & Decompression',
    zoneId: 'decompression',
    description: 'You grab a large shopping cart. Warm lighting and open space slow your pace.',
    psychologicalTrap: 'Large cart size subconscious anchoring makes 5 items look empty, encouraging extra fills.'
  },
  {
    title: 'Step 2: The Fresh Halo Effect',
    zoneId: 'bakery_floral',
    description: 'You are hit with smells of fresh bread and blooming lilies near the store entrance.',
    psychologicalTrap: 'Olfactory activation triggers hunger and instills belief that the entire store is ultra-fresh.'
  },
  {
    title: 'Step 3: Moral Licensing in Produce',
    zoneId: 'produce',
    description: 'You load up on fresh apples and spinach under glistening water mist.',
    psychologicalTrap: 'Buying healthy early relaxes your guilt wall, opening you up to buying sugary treats in the next aisle.'
  },
  {
    title: 'Step 4: The Meat Destination Walk',
    zoneId: 'meat_seafood',
    description: 'You head to the back wall for dinner protein, passing dozens of endcaps.',
    psychologicalTrap: 'Forcing you to walk to the perimeter back wall exposes you to hundreds of non-essential displays.'
  },
  {
    title: 'Step 5: The Deep Corner Dairy Trap',
    zoneId: 'dairy_corner',
    description: 'You reach the far opposite corner just to pick up a carton of milk and eggs.',
    psychologicalTrap: 'Essential items are placed furthest from entry to maximize total square footage traversed.'
  },
  {
    title: 'Step 6: Center Aisle Eye-Level Slotting',
    zoneId: 'center_aisles',
    description: 'Navigating cereal and snacks, brand names grab your eye at 5 feet high.',
    psychologicalTrap: 'Eye-level placement is paid for by food giants. Cheaper alternatives are intentionally hidden at your feet.'
  },
  {
    title: 'Step 7: The Endcap "Sale" Illusion',
    zoneId: 'endcaps',
    description: 'A prominent display of chips and salsa catches your attention at the end of Aisle 4.',
    psychologicalTrap: 'Promotional endcaps trick shoppers into believing items are discounted even when full price.'
  },
  {
    title: 'Step 8: Decision Fatigue at Checkout',
    zoneId: 'checkout_chute',
    description: 'Exhausted after 30 minutes of decision-making, you wait in a narrow chute lined with candy.',
    psychologicalTrap: 'Eroded willpower leads to low-friction impulse purchases right before payment.'
  }
];

// --- MAIN COMPONENT ---

export default function StoreLayoutMap() {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('decompression');
  const [activeCategories, setActiveCategories] = useState<Set<ZoneCategory>>(
    new Set(['sensory', 'layout', 'shelf', 'impulse'])
  );
  const [tourStep, setTourStep] = useState<number>(-1);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [shelfFilter, setShelfFilter] = useState<'all' | 'eye' | 'bottom' | 'top'>('all');

  const selectedZone = useMemo(() => {
    return STORE_ZONES.find((z) => z.id === selectedZoneId) || STORE_ZONES[0];
  }, [selectedZoneId]);

  const toggleCategory = (cat: ZoneCategory) => {
    const next = new Set(activeCategories);
    if (next.has(cat)) {
      if (next.size > 1) next.delete(cat);
    } else {
      next.add(cat);
    }
    setActiveCategories(next);
  };

  const handleNextTourStep = () => {
    const nextStep = tourStep + 1;
    if (nextStep < GUIDED_TOUR.length) {
      setTourStep(nextStep);
      setSelectedZoneId(GUIDED_TOUR[nextStep].zoneId);
    } else {
      setTourStep(-1);
    }
  };

  const handlePrevTourStep = () => {
    const prevStep = tourStep - 1;
    if (prevStep >= 0) {
      setTourStep(prevStep);
      setSelectedZoneId(GUIDED_TOUR[prevStep].zoneId);
    } else {
      setTourStep(-1);
    }
  };

  const getHeatmapColor = (margin: string) => {
    switch (margin) {
      case 'Very High':
        return 'fill-red-500/40 stroke-red-400';
      case 'High':
        return 'fill-orange-500/40 stroke-orange-400';
      case 'Medium':
        return 'fill-yellow-500/30 stroke-yellow-400';
      default:
        return 'fill-emerald-500/20 stroke-emerald-400';
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 font-sans">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Retail Psychology & Architecture Lab
              </span>
              <span className="text-xs text-slate-400 font-mono">MAP-REF: RETAIL-SENSORY-v4</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Supermarket Manipulation Map
            </h1>
            <p className="text-sm md:text-base text-slate-400 mt-1 max-w-3xl">
              An interactive visual analysis of retail sensory traps, floorplan routing algorithms, eye-level shelf positioning, and consumer decision-fatigue zones.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="text-center px-2">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg Dwell Increase</p>
              <p className="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-amber-400" /> +35%
              </p>
            </div>
            <div className="text-center px-2 border-x border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Impulse Lift</p>
              <p className="text-lg font-black text-rose-400 flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4 text-rose-400" /> +62%
              </p>
            </div>
            <div className="text-center px-2">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Eye-Level Markup</p>
              <p className="text-lg font-black text-emerald-400 flex items-center justify-center gap-1">
                <DollarSign className="w-4 h-4 text-emerald-400" /> 2.4x
              </p>
            </div>
          </div>
        </div>

        {/* CONTROLS & FILTER BAR */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {/* Category Filter Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Layer Filters:
            </span>
            <button
              onClick={() => toggleCategory('sensory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeCategories.has('sensory')
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm shadow-rose-950'
                  : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Sensory Triggers
            </button>
            <button
              onClick={() => toggleCategory('layout')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeCategories.has('layout')
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-950'
                  : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> Perimeter Routing
            </button>
            <button
              onClick={() => toggleCategory('shelf')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeCategories.has('shelf')
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-sm shadow-blue-950'
                  : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Shelf Placement
            </button>
            <button
              onClick={() => toggleCategory('impulse')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeCategories.has('impulse')
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-950'
                  : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> Impulse Traps
            </button>
          </div>

          {/* Mode Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                showHeatmap
                  ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-950 animate-pulse'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-red-400" />
              {showHeatmap ? 'Profit Margin Heatmap: ON' : 'Show Profit Heatmap'}
            </button>

            {tourStep === -1 ? (
              <button
                onClick={() => {
                  setTourStep(0);
                  setSelectedZoneId(GUIDED_TOUR[0].zoneId);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md flex items-center gap-1.5"
              >
                <MousePointer className="w-3.5 h-3.5" /> Start Shopper Guided Tour
              </button>
            ) : (
              <button
                onClick={() => setTourStep(-1)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Exit Tour
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TOUR BANNER IF ACTIVE */}
      {tourStep >= 0 && (
        <div className="max-w-7xl mx-auto mb-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-4 rounded-xl border border-indigo-500/40 shadow-xl flex flex-col md:flex-row items-md-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-md">
              {tourStep + 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">{GUIDED_TOUR[tourStep].title}</h3>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/30">
                  Step {tourStep + 1} of {GUIDED_TOUR.length}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{GUIDED_TOUR[tourStep].description}</p>
              <p className="text-xs text-amber-300/90 font-medium mt-1 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span className="underline">The Cognitive Trap:</span> {GUIDED_TOUR[tourStep].psychologicalTrap}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              onClick={handlePrevTourStep}
              disabled={tourStep === 0}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 disabled:opacity-40 disabled:hover:bg-slate-800"
            >
              Previous
            </button>
            <button
              onClick={handleNextTourStep}
              className="px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center gap-1 shadow-md"
            >
              {tourStep === GUIDED_TOUR.length - 1 ? 'Finish Tour' : 'Next Step'} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT CONTAINER */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INTERACTIVE STORE MAP (7 COLS) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-slate-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Interactive Floorplan Blueprint
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">Click zone for deep-dive breakdown</span>
            </div>

            {/* SVG STORE MAP FLOORPLAN */}
            <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden shadow-inner p-2">
              <svg viewBox="0 0 100 100" className="w-full h-full select-none">
                <defs>
                  {/* Grid Pattern */}
                  <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                    <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#1e293b" strokeWidth="0.3" />
                  </pattern>

                  {/* Flow Direction Arrows Pattern */}
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                  </marker>
                </defs>

                {/* Background Grid */}
                <rect width="100" height="100" fill="url(#grid)" />

                {/* Shopper Path Standard Route (Subtle Line) */}
                <path
                  d="M 52 95 Q 52 80 80 80 Q 80 40 80 12 Q 50 12 25 12 Q 20 40 50 40 Q 20 50 20 75 Q 20 95 20 95"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="0.8"
                  strokeDasharray="1.5 1.5"
                  markerEnd="url(#arrow)"
                />

                {/* MAIN ENTRANCE & EXIT ANNOTATIONS */}
                <text x="52" y="98" fill="#94a3b8" fontSize="2.2" textAnchor="middle" fontWeight="bold">
                  ENTRANCE →
                </text>
                <text x="20" y="98" fill="#94a3b8" fontSize="2.2" textAnchor="middle" fontWeight="bold">
                  ← EXIT
                </text>

                {/* ZONES RENDERING */}
                {STORE_ZONES.map((zone) => {
                  const isVisible = activeCategories.has(zone.category);
                  const isSelected = selectedZoneId === zone.id;

                  if (!isVisible) return null;

                  return (
                    <g
                      key={zone.id}
                      onClick={() => setSelectedZoneId(zone.id)}
                      className="cursor-pointer transition-all duration-200 group"
                    >
                      {/* Zone Rect */}
                      <rect
                        x={zone.svgRect.x}
                        y={zone.svgRect.y}
                        width={zone.svgRect.width}
                        height={zone.svgRect.height}
                        rx={zone.svgRect.rx || 1}
                        className={`transition-all duration-300 ${
                          showHeatmap
                            ? getHeatmapColor(zone.marginCategory)
                            : isSelected
                            ? 'fill-indigo-600/40 stroke-indigo-400 stroke-[1.2]'
                            : 'fill-slate-800/80 hover:fill-slate-700/80 stroke-slate-700 hover:stroke-slate-500 stroke-[0.5]'
                        }`}
                      />

                      {/* Animated Glow Border if Selected */}
                      {isSelected && (
                        <rect
                          x={zone.svgRect.x - 0.5}
                          y={zone.svgRect.y - 0.5}
                          width={zone.svgRect.width + 1}
                          height={zone.svgRect.height + 1}
                          rx={(zone.svgRect.rx || 1) + 0.5}
                          fill="none"
                          className="stroke-indigo-400 stroke-[0.8] animate-pulse"
                        />
                      )}

                      {/* Zone Text Label */}
                      <text
                        x={zone.svgRect.x + zone.svgRect.width / 2}
                        y={zone.svgRect.y + zone.svgRect.height / 2 - (zone.svgRect.height > 15 ? 1.5 : 0)}
                        fill={isSelected ? '#ffffff' : '#cbd5e1'}
                        fontSize={zone.svgRect.width < 20 ? '2.2' : '2.8'}
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="pointer-events-none drop-shadow-md"
                      >
                        {zone.name.split(' ')[1] || zone.name}
                      </text>

                      {/* Margin Category Indicator Tag on SVG */}
                      {showHeatmap && (
                        <text
                          x={zone.svgRect.x + zone.svgRect.width / 2}
                          y={zone.svgRect.y + zone.svgRect.height / 2 + 3}
                          fill="#f87171"
                          fontSize="2"
                          fontWeight="black"
                          textAnchor="middle"
                        >
                          {zone.marginCategory.toUpperCase()} MARGIN
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Center Aisles Internal Lines (Visual Detail) */}
                {activeCategories.has('shelf') && (
                  <g className="pointer-events-none stroke-slate-700/60 stroke-[0.4]">
                    <line x1="28" y1="26" x2="28" y2="54" />
                    <line x1="38" y1="26" x2="38" y2="54" />
                    <line x1="48" y1="26" x2="48" y2="54" />
                    <line x1="58" y1="26" x2="58" y2="54" />
                    <line x1="68" y1="26" x2="68" y2="54" />
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* MAP LEGEND */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span> Selected Zone
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-500 inline-block"></span> Active Zone
              </span>
              {showHeatmap && (
                <span className="flex items-center gap-1 text-rose-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> High Margin Trap
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 italic">Dashed line indicates default forced consumer traffic loop</span>
          </div>
        </div>

        {/* DETAILED ZONE ANALYSIS PANEL (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex-1 flex flex-col justify-between">
            <div>
              {/* Header Details */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${selectedZone.badgeColor}`}>
                      {selectedZone.category.toUpperCase()} ZONE
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Margin: {selectedZone.marginCategory}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedZone.name}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedZone.subtitle}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">Est. Time Add</span>
                  <span className="text-sm font-extrabold text-amber-400">{selectedZone.dwellTimeIncrease}</span>
                </div>
              </div>

              {/* Psychological Impact Statement */}
              <div className="mb-5 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Behavioral & Mindset Shift
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedZone.psychologicalImpact}</p>
              </div>

              {/* Key Retail Tactics */}
              <div className="mb-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-400" /> Deployed Retail Tactics
                </h4>
                <ul className="space-y-1.5">
                  {selectedZone.tactics.map((tactic, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-indigo-400 font-bold shrink-0">•</span>
                      <span>{tactic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shelf Strategy (If applicable) */}
              {selectedZone.shelfStrategy && (
                <div className="mb-5 bg-indigo-950/20 p-3.5 rounded-xl border border-indigo-900/40">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" /> Vertical Shelf Level Breakdown
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Top Shelf (6ft+):</span>
                      <span className="text-slate-300">{selectedZone.shelfStrategy.topShelf}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 bg-indigo-500/10 p-1.5 rounded border border-indigo-500/20">
                      <span className="text-[11px] font-bold text-amber-300 uppercase flex items-center gap-1">
                        <Eye className="w-3 h-3 text-amber-400" /> Bulls-Eye Zone (4ft - 5ft):
                      </span>
                      <span className="text-indigo-100 font-medium">{selectedZone.shelfStrategy.eyeLevel}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Bottom Shelf (Knee/Floor):</span>
                      <span className="text-slate-300">{selectedZone.shelfStrategy.bottomShelf}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sensory Triggers */}
              <div className="mb-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-rose-400" /> Sensory Manipulation Cues
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedZone.sensoryTriggers.scent && (
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-rose-400 font-bold block uppercase">Olfactory / Scent</span>
                      <span className="text-slate-300">{selectedZone.sensoryTriggers.scent}</span>
                    </div>
                  )}
                  {selectedZone.sensoryTriggers.lighting && (
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-amber-400 font-bold block uppercase">Lighting / Spectrum</span>
                      <span className="text-slate-300">{selectedZone.sensoryTriggers.lighting}</span>
                    </div>
                  )}
                  {selectedZone.sensoryTriggers.audio && (
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-cyan-400 font-bold block uppercase">Audio / Tempo</span>
                      <span className="text-slate-300">{selectedZone.sensoryTriggers.audio}</span>
                    </div>
                  )}
                  {selectedZone.sensoryTriggers.visual && (
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-emerald-400 font-bold block uppercase">Visual Cues</span>
                      <span className="text-slate-300">{selectedZone.sensoryTriggers.visual}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Research Questions Prompt Section */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 mb-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> Key Research Questions
                </h4>
                <ul className="space-y-1">
                  {selectedZone.researchQuestions.map((q, i) => (
                    <li key={i} className="text-xs text-slate-400 italic flex items-start gap-1.5">
                      <span className="text-cyan-400 not-italic font-bold">Q{i + 1}:</span>
                      <span>"{q}"</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Shopper Counter-Strategy Defense */}
            <div className="mt-2 pt-3 border-t border-slate-800 bg-emerald-950/20 p-3 rounded-xl border border-emerald-900/40">
              <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1">
                <ShoppingBasket className="w-3.5 h-3.5" /> Recommended Shopper Defense
              </span>
              <p className="text-xs text-emerald-200 mt-1 font-medium">{selectedZone.counterStrategy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* LOWER RESEARCH DATA SECTION */}
      <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2 text-rose-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">Sensory Priming Dynamics</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Supermarkets utilize environmental scent machines and tailored acoustics to alter physiological states. Slower music tempos (under 70 BPM) reduce walking velocity, directly increasing item interactions by up to 38%.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <Layers className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">Slotting Fees & Shelf Real Estate</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Manufacturers pay millions in "slotting allowances" to secure eye-level shelf space. Products placed at adult eye height generate 3x the volume of floor-level placement, creating a pay-to-win structural bias against cheaper generic options.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2 text-amber-400">
            <Zap className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">Decision Fatigue Exhaustion</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            After navigating over 30,000 SKUs and making dozens of micro-decisions, glucose depletion in the prefrontal cortex reduces self-control. Checkout lanes are engineered as final high-margin capture zones when willpower is at its lowest.
          </p>
        </div>
      </div>
    </div>
  );
}