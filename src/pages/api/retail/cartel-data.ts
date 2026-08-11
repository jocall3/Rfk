import type { NextApiRequest, NextApiResponse } from 'next';

export interface MarketShareData {
  year: number;
  cr4Index: number;
  cr8Index: number;
  topRetailers: {
    name: string;
    sharePercent: number;
    revenueBillionsUSD: number;
    storeCount: number;
  }[];
}

export interface KrogerAlbertsonsMetrics {
  proposedTransactionValueBillionsUSD: number;
  combinedStoreCount: number;
  combinedRevenueBillionsUSD: number;
  plannedDivestitureStores: number;
  divestitureBuyer: string;
  combinedNationalMarketSharePercent: number;
  regionalDominanceMarkets: {
    metroArea: string;
    combinedMarketSharePercent: number;
    competingChainsCount: number;
  }[];
  regulatoryStatus: string;
  keyAntitrustConcerns: string[];
}

export interface SlottingFeeData {
  productCategory: string;
  averageFeePerSkuPerStoreUSD: number;
  nationalRolloutEstimatedCostUSD: number;
  failureRateNewProductsPercent: number;
  payToPlayImpactRating: 'Moderate' | 'High' | 'Severe';
  commonRequirements: string[];
}

export interface CorporateBannerMap {
  parentCompany: string;
  headquarters: string;
  bannerCount: number;
  banners: string[];
  estimatedUSGroceryMarketSharePercent: number;
  storeTypes: string[];
}

export interface RetailCartelResponse {
  timestamp: string;
  summary: string;
  marketShareConsolidation: MarketShareData[];
  krogerAlbertsonsMerger: KrogerAlbertsonsMetrics;
  slottingFees: SlottingFeeData[];
  corporateBanners: CorporateBannerMap[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<RetailCartelResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const data: RetailCartelResponse = {
    timestamp: new Date().toISOString(),
    summary:
      'Analysis of US grocery market consolidation, antitrust dynamics surrounding the Kroger-Albertsons merger, slotting fee extortion dynamics, and corporate banner ownership structures.',
    marketShareConsolidation: [
      {
        year: 1990,
        cr4Index: 16.2,
        cr8Index: 24.5,
        topRetailers: [
          { name: 'Kroger', sharePercent: 5.8, revenueBillionsUSD: 20.3, storeCount: 2200 },
          { name: 'American Stores', sharePercent: 4.1, revenueBillionsUSD: 14.5, storeCount: 1500 },
          { name: 'Safeway', sharePercent: 3.5, revenueBillionsUSD: 12.2, storeCount: 1100 },
          { name: 'A&P', sharePercent: 2.8, revenueBillionsUSD: 9.8, storeCount: 1200 },
        ],
      },
      {
        year: 2010,
        cr4Index: 36.4,
        cr8Index: 48.1,
        topRetailers: [
          { name: 'Walmart', sharePercent: 18.2, revenueBillionsUSD: 125.0, storeCount: 3400 },
          { name: 'Kroger', sharePercent: 8.5, revenueBillionsUSD: 82.2, storeCount: 2460 },
          { name: 'Costco', sharePercent: 5.1, revenueBillionsUSD: 48.0, storeCount: 420 },
          { name: 'Safeway', sharePercent: 4.6, revenueBillionsUSD: 41.1, storeCount: 1725 },
        ],
      },
      {
        year: 2024,
        cr4Index: 52.8,
        cr8Index: 68.3,
        topRetailers: [
          { name: 'Walmart', sharePercent: 25.2, revenueBillionsUSD: 247.0, storeCount: 4717 },
          { name: 'Kroger', sharePercent: 10.1, revenueBillionsUSD: 148.2, storeCount: 2719 },
          { name: 'Costco', sharePercent: 9.3, revenueBillionsUSD: 136.5, storeCount: 600 },
          { name: 'Albertsons', sharePercent: 8.2, revenueBillionsUSD: 78.5, storeCount: 2272 },
          { name: 'Ahold Delhaize', sharePercent: 6.4, revenueBillionsUSD: 62.1, storeCount: 2048 },
          { name: 'Publix', sharePercent: 5.5, revenueBillionsUSD: 54.0, storeCount: 1360 },
          { name: 'Target', sharePercent: 3.6, revenueBillionsUSD: 35.2, storeCount: 1950 },
          { name: 'H-E-B', sharePercent: 3.2, revenueBillionsUSD: 31.0, storeCount: 430 },
        ],
      },
    ],
    krogerAlbertsonsMerger: {
      proposedTransactionValueBillionsUSD: 24.6,
      combinedStoreCount: 4991,
      combinedRevenueBillionsUSD: 226.7,
      plannedDivestitureStores: 579,
      divestitureBuyer: 'C&S Wholesale Grocers',
      combinedNationalMarketSharePercent: 18.3,
      regionalDominanceMarkets: [
        {
          metroArea: 'Seattle-Tacoma-Bellevue, WA',
          combinedMarketSharePercent: 54.8,
          competingChainsCount: 2,
        },
        {
          metroArea: 'Denver-Aurora-Lakewood, CO',
          combinedMarketSharePercent: 51.2,
          competingChainsCount: 2,
        },
        {
          metroArea: 'Phoenix-Mesa-Chandler, AZ',
          combinedMarketSharePercent: 48.5,
          competingChainsCount: 3,
        },
        {
          metroArea: 'Los Angeles-Long Beach-Anaheim, CA',
          combinedMarketSharePercent: 42.1,
          competingChainsCount: 4,
        },
        {
          metroArea: 'Chicago-Naperville-Elgin, IL-IN-WI',
          combinedMarketSharePercent: 36.7,
          competingChainsCount: 4,
        },
      ],
      regulatoryStatus: 'Blocked by FTC preliminary injunction and state AG lawsuits (2024)',
      keyAntitrustConcerns: [
        'Monopsony leverage over agricultural suppliers and food manufacturers',
        'Reduction of union bargaining power and employee wage suppression',
        'Elimination of direct head-to-head retail price competition in 22 states',
        'Inadequacy of proposed store divestitures to C&S Wholesale Grocers (similar to Haggen/Safeway failure pattern)',
        'Increased power to enforce mandatory promotional allowances and exclusionary slotting fees',
      ],
    },
    slottingFees: [
      {
        productCategory: 'Dry Packaged Foods & Cereal',
        averageFeePerSkuPerStoreUSD: 250,
        nationalRolloutEstimatedCostUSD: 150000,
        failureRateNewProductsPercent: 82,
        payToPlayImpactRating: 'Severe',
        commonRequirements: [
          'Guaranteed shelf placement at eye level',
          'Free fill (1-2 cases per store for initial stocking)',
          'Quarterly mandatory promotional markdown subsidy',
          'Failure fees if sales velocity thresholds are missed in 120 days',
        ],
      },
      {
        productCategory: 'Frozen Foods & Ice Cream',
        averageFeePerSkuPerStoreUSD: 450,
        nationalRolloutEstimatedCostUSD: 275000,
        failureRateNewProductsPercent: 88,
        payToPlayImpactRating: 'Severe',
        commonRequirements: [
          'Endcap freeze-door placement premiums',
          'Freezer display electricity surcharge allowance',
          'Full buy-back guarantee for unsold inventory',
        ],
      },
      {
        productCategory: 'Beverages & Craft Energy Drinks',
        averageFeePerSkuPerStoreUSD: 300,
        nationalRolloutEstimatedCostUSD: 180000,
        failureRateNewProductsPercent: 79,
        payToPlayImpactRating: 'High',
        commonRequirements: [
          'Direct-Store-Delivery (DSD) access fees',
          'Cold box (refrigerated display) placement allowance',
          'Exclusivity clause prohibiting competing indie brands in same bay',
        ],
      },
      {
        productCategory: 'Specialty Organic & Natural Snacks',
        averageFeePerSkuPerStoreUSD: 175,
        nationalRolloutEstimatedCostUSD: 95000,
        failureRateNewProductsPercent: 73,
        payToPlayImpactRating: 'Moderate',
        commonRequirements: [
          'Category captain approval process',
          'Co-op advertising fee contributions',
          'Digital app coupon sponsorship mandatory budget',
        ],
      },
    ],
    corporateBanners: [
      {
        parentCompany: 'The Kroger Co.',
        headquarters: 'Cincinnati, OH',
        bannerCount: 28,
        banners: [
          'Kroger',
          'Ralphs',
          'Dillons',
          'Smiths',
          'King Soopers',
          'Fry’s',
          'QFC',
          'City Market',
          'Owen’s',
          'Jay C',
          'Pay Less',
          'Baker’s',
          'Gerbes',
          'Harris Teeter',
          'Pick ’n Save',
          'Metro Market',
          'Mariano’s',
          'Fred Meyer',
        ],
        estimatedUSGroceryMarketSharePercent: 10.1,
        storeTypes: ['Supermarket', 'Multi-department Store', 'Price Impact Store'],
      },
      {
        parentCompany: 'Albertsons Companies, Inc.',
        headquarters: 'Boise, ID',
        bannerCount: 24,
        banners: [
          'Albertsons',
          'Safeway',
          'Vons',
          'Jewel-Osco',
          'Shaw’s',
          'Acme',
          'Tom Thumb',
          'Randalls',
          'United Supermarkets',
          'Pavilions',
          'Star Market',
          'Haggen',
          'Carrs',
          'Kings Food Markets',
          'Balducci’s',
        ],
        estimatedUSGroceryMarketSharePercent: 8.2,
        storeTypes: ['Supermarket', 'Gourmet Specialty', 'Neighborhood Market'],
      },
      {
        parentCompany: 'Ahold Delhaize',
        headquarters: 'Zaandam, Netherlands / Zaandam & Salisbury, US',
        bannerCount: 5,
        banners: ['Food Lion', 'Stop & Shop', 'The Giant Company', 'Giant Food', 'Hannaford'],
        estimatedUSGroceryMarketSharePercent: 6.4,
        storeTypes: ['Supermarket', 'Regional Chain'],
      },
      {
        parentCompany: 'Walmart Inc.',
        headquarters: 'Bentonville, AR',
        bannerCount: 2,
        banners: ['Walmart Supercenter', 'Walmart Neighborhood Market'],
        estimatedUSGroceryMarketSharePercent: 25.2,
        storeTypes: ['Hypermarket', 'Discount Grocery'],
      },
    ],
  };

  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).json(data);
}