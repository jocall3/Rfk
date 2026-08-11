export interface RegionalBanner {
  name: string;
  regions: string[];
  acquiredYear?: number;
}

export interface Conglomerate {
  id: string;
  name: string;
  headquarters: string;
  marketSharePercentage: number;
  revenueBillions: number;
  regionalBanners: RegionalBanner[];
  dominanceNotes: string;
}

export interface LayoutTactic {
  id: string;
  tacticName: string;
  locationInStore: string;
  psychologicalGoal: string;
  description: string;
}

export const GROCERY_CONGLOMERATES: Conglomerate[] = [
  {
    id: "walmart",
    name: "Walmart Inc.",
    headquarters: "Bentonville, Arkansas",
    marketSharePercentage: 25.2,
    revenueBillions: 611.3,
    regionalBanners: [
      { name: "Walmart Supercenter", regions: ["National"] },
      { name: "Walmart Neighborhood Market", regions: ["National"] },
      { name: "Sam's Club", regions: ["National"] }
    ],
    dominanceNotes: "Maintains massive market dominance through economies of scale, aggressive supply chain optimization, and loss-leader pricing strategies that undercut regional competitors."
  },
  {
    id: "kroger",
    name: "The Kroger Co.",
    headquarters: "Cincinnati, Ohio",
    marketSharePercentage: 10.1,
    revenueBillions: 148.3,
    regionalBanners: [
      { name: "Kroger", regions: ["Midwest", "South"] },
      { name: "Ralphs", regions: ["Southern California"], acquiredYear: 1998 },
      { name: "Fred Meyer", regions: ["Pacific Northwest"], acquiredYear: 1998 },
      { name: "King Soopers", regions: ["Rocky Mountains"], acquiredYear: 1999 },
      { name: "Harris Teeter", regions: ["South Atlantic"], acquiredYear: 2014 }
    ],
    dominanceNotes: "Grew primarily through aggressive acquisitions of established regional chains, maintaining local banner names to preserve consumer loyalty while centralizing logistics and data analytics (84.51°)."
  },
  {
    id: "albertsons",
    name: "Albertsons Companies, Inc.",
    headquarters: "Boise, Idaho",
    marketSharePercentage: 5.7,
    revenueBillions: 77.6,
    regionalBanners: [
      { name: "Albertsons", regions: ["West", "Southwest"] },
      { name: "Safeway", regions: ["West", "Mid-Atlantic"], acquiredYear: 2015 },
      { name: "Vons", regions: ["Southern California", "Nevada"], acquiredYear: 2015 },
      { name: "Jewel-Osco", regions: ["Greater Chicago"], acquiredYear: 1999 },
      { name: "Shaw's", regions: ["New England"], acquiredYear: 2004 }
    ],
    dominanceNotes: "Backed by private equity (Cerberus Capital Management) for years, Albertsons consolidated numerous struggling regional chains. Currently involved in a highly scrutinized proposed merger with Kroger."
  },
  {
    id: "ahold-delhaize",
    name: "Ahold Delhaize",
    headquarters: "Zaandam, Netherlands",
    marketSharePercentage: 4.8,
    revenueBillions: 93.0,
    regionalBanners: [
      { name: "Food Lion", regions: ["Mid-Atlantic", "Southeast"] },
      { name: "Stop & Shop", regions: ["Northeast"] },
      { name: "Giant Food", regions: ["Mid-Atlantic"] },
      { name: "Hannaford", regions: ["New England"] }
    ],
    dominanceNotes: "A European conglomerate that holds a massive footprint on the US East Coast, utilizing highly localized supply chains and distinct regional branding to mask its international corporate ownership."
  }
];

export const STORE_LAYOUT_TACTICS: LayoutTactic[] = [
  {
    id: "tactic-gruen",
    tacticName: "The Gruen Effect",
    locationInStore: "Storewide / Entrance",
    psychologicalGoal: "Disorientation and sensory overload to induce impulse buying.",
    description: "Named after architect Victor Gruen, this tactic involves designing the store layout to intentionally confuse consumers slightly, slowing them down and exposing them to more merchandise than they intended to see."
  },
  {
    id: "tactic-decompression",
    tacticName: "Decompression Zone",
    locationInStore: "Immediate Entrance",
    psychologicalGoal: "Transitioning the shopper's mindset from the outside world to the shopping environment.",
    description: "The first 10-15 feet of the store where nothing of high value is placed. It allows shoppers to adjust to the lighting, temperature, and sounds of the store, preparing them to start making purchasing decisions."
  },
  {
    id: "tactic-sensory-fresh",
    tacticName: "Sensory Priming (Produce/Floral)",
    locationInStore: "Front of Store",
    psychologicalGoal: "Establishing a perception of freshness, health, and high quality.",
    description: "Placing brightly colored produce, fresh flowers, and sometimes the bakery at the entrance triggers salivary glands and puts shoppers in a positive, 'fresh' mindset, making them more likely to spend more throughout the store."
  },
  {
    id: "tactic-essentials-back",
    tacticName: "Essentials in the Perimeter/Back",
    locationInStore: "Back of Store (Dairy, Meat)",
    psychologicalGoal: "Maximizing store penetration and exposure to non-essential items.",
    description: "By placing high-frequency staple items like milk, eggs, and meat at the furthest points from the entrance, shoppers are forced to navigate through aisles of processed foods and impulse items to get what they need."
  },
  {
    id: "tactic-eye-level",
    tacticName: "Eye-Level is Buy-Level",
    locationInStore: "Aisle Shelving",
    psychologicalGoal: "Maximizing profit margins on specific items.",
    description: "The most profitable, highest-margin items (or brands that paid slotting fees) are placed at adult eye level (about 4 to 5 feet high). Cheaper generic brands are placed on the bottom shelves, while kid-targeted items (sugary cereals) are placed at children's eye level."
  },
  {
    id: "tactic-endcaps",
    tacticName: "Endcap Displays",
    locationInStore: "Ends of Aisles",
    psychologicalGoal: "Creating a false sense of urgency and perceived discounts.",
    description: "Products placed at the end of aisles are perceived by consumers as being on sale or featured, even if they are sold at full price. Brands pay premium slotting fees for this highly visible real estate."
  },
  {
    id: "tactic-checkout-impulse",
    tacticName: "Checkout Line Traps",
    locationInStore: "Point of Sale / Registers",
    psychologicalGoal: "Capitalizing on decision fatigue.",
    description: "After making dozens of micro-decisions throughout the store, shoppers experience 'decision fatigue' and depleted willpower by the time they reach the register, making them highly susceptible to buying candy, magazines, and cold beverages."
  }
];

/**
 * Retrieves all grocery conglomerates.
 * @returns {Conglomerate[]} Array of conglomerate data.
 */
export function getAllConglomerates(): Conglomerate[] {
  return GROCERY_CONGLOMERATES;
}

/**
 * Retrieves a specific conglomerate by its ID.
 * @param {string} id - The ID of the conglomerate.
 * @returns {Conglomerate | undefined} The conglomerate object or undefined if not found.
 */
export function getConglomerateById(id: string): Conglomerate | undefined {
  return GROCERY_CONGLOMERATES.find(c => c.id === id);
}

/**
 * Retrieves all store layout manipulation tactics.
 * @returns {LayoutTactic[]} Array of layout tactics.
 */
export function getAllLayoutTactics(): LayoutTactic[] {
  return STORE_LAYOUT_TACTICS;
}

/**
 * Searches for regional banners across all conglomerates by region name.
 * @param {string} region - The region to search for (e.g., "West", "Midwest").
 * @returns {Array<{conglomerate: string, banner: RegionalBanner}>} List of banners operating in the specified region.
 */
export function getBannersByRegion(region: string): Array<{conglomerate: string, banner: RegionalBanner}> {
  const results: Array<{conglomerate: string, banner: RegionalBanner}> = [];
  
  GROCERY_CONGLOMERATES.forEach(conglomerate => {
    conglomerate.regionalBanners.forEach(banner => {
      if (banner.regions.some(r => r.toLowerCase().includes(region.toLowerCase()))) {
        results.push({
          conglomerate: conglomerate.name,
          banner
        });
      }
    });
  });
  
  return results;
}

/**
 * Calculates the total market share of the top conglomerates listed in the database.
 * @returns {number} Total market share percentage.
 */
export function getCombinedMarketShare(): number {
  return GROCERY_CONGLOMERATES.reduce((total, current) => total + current.marketSharePercentage, 0);
}