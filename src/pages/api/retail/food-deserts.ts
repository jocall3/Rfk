import type { NextApiRequest, NextApiResponse } from 'next';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface IncomeDemographics {
  medianHouseholdIncome: number;
  povertyRate: number; // percentage 0 - 100
  snapBenefitPercent: number; // percentage 0 - 100
  unemploymentRate: number; // percentage 0 - 100
}

export interface FoodDesertMetrics {
  isFoodDesert: boolean;
  lowAccess1Mile: boolean; // low access at 1 mile urban
  lowAccess10Miles: boolean; // low access at 10 miles rural
  avgDistanceToGroceryMiles: number;
  lowAccessPopulationPercent: number;
  vehicleAvailabilityPercent: number;
  supermarketCountWithin5Miles: number;
}

export interface DollarStoreMetrics {
  totalStoreCount: number;
  densityPer10k: number;
  primaryChains: string[];
  ratioToSupermarkets: number;
}

export interface TransitMetrics {
  transitAccessIndex: number; // 0 - 100 scale
  avgDistanceToStopMiles: number;
  busRoutesCount: number;
  railAccess: boolean;
  transitDependencyRate: number; // percentage
}

export interface CensusTractData {
  fipsCode: string;
  tractName: string;
  county: string;
  city: string;
  state: string;
  areaType: 'urban' | 'suburban' | 'rural';
  coordinates: LocationCoordinates;
  population: number;
  incomeDemographics: IncomeDemographics;
  foodDesertMetrics: FoodDesertMetrics;
  dollarStoreMetrics: DollarStoreMetrics;
  transitMetrics: TransitMetrics;
}

export interface FoodDesertsSummary {
  totalTracts: number;
  foodDesertTractsCount: number;
  foodDesertPercentage: number;
  avgMedianIncome: number;
  avgPovertyRate: number;
  avgDollarStoreDensity: number;
  avgTransitAccessIndex: number;
}

export interface FoodDesertsApiResponse {
  success: boolean;
  summary: FoodDesertsSummary;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: CensusTractData[];
  error?: string;
}

const MOCK_CENSUS_TRACTS: CensusTractData[] = [
  {
    fipsCode: '26163500100',
    tractName: 'Census Tract 5001',
    county: 'Wayne County',
    city: 'Detroit',
    state: 'MI',
    areaType: 'urban',
    coordinates: { lat: 42.3314, lng: -83.0458 },
    population: 3420,
    incomeDemographics: {
      medianHouseholdIncome: 24500,
      povertyRate: 38.4,
      snapBenefitPercent: 42.1,
      unemploymentRate: 14.2,
    },
    foodDesertMetrics: {
      isFoodDesert: true,
      lowAccess1Mile: true,
      lowAccess10Miles: false,
      avgDistanceToGroceryMiles: 2.8,
      lowAccessPopulationPercent: 68.5,
      vehicleAvailabilityPercent: 54.2,
      supermarketCountWithin5Miles: 1,
    },
    dollarStoreMetrics: {
      totalStoreCount: 6,
      densityPer10k: 17.5,
      primaryChains: ['Dollar General', 'Family Dollar'],
      ratioToSupermarkets: 6.0,
    },
    transitMetrics: {
      transitAccessIndex: 42,
      avgDistanceToStopMiles: 0.4,
      busRoutesCount: 3,
      railAccess: false,
      transitDependencyRate: 31.8,
    },
  },
  {
    fipsCode: '13121008301',
    tractName: 'Census Tract 83.01',
    county: 'Fulton County',
    city: 'Atlanta',
    state: 'GA',
    areaType: 'urban',
    coordinates: { lat: 33.749, lng: -84.388 },
    population: 4890,
    incomeDemographics: {
      medianHouseholdIncome: 28100,
      povertyRate: 32.1,
      snapBenefitPercent: 35.6,
      unemploymentRate: 11.8,
    },
    foodDesertMetrics: {
      isFoodDesert: true,
      lowAccess1Mile: true,
      lowAccess10Miles: false,
      avgDistanceToGroceryMiles: 2.1,
      lowAccessPopulationPercent: 59.2,
      vehicleAvailabilityPercent: 61.0,
      supermarketCountWithin5Miles: 2,
    },
    dollarStoreMetrics: {
      totalStoreCount: 7,
      densityPer10k: 14.3,
      primaryChains: ['Dollar General', 'Dollar Tree'],
      ratioToSupermarkets: 3.5,
    },
    transitMetrics: {
      transitAccessIndex: 58,
      avgDistanceToStopMiles: 0.3,
      busRoutesCount: 5,
      railAccess: true,
      transitDependencyRate: 28.4,
    },
  },
  {
    fipsCode: '17031839100',
    tractName: 'Census Tract 8391',
    county: 'Cook County',
    city: 'Chicago',
    state: 'IL',
    areaType: 'urban',
    coordinates: { lat: 41.785, lng: -87.658 },
    population: 5120,
    incomeDemographics: {
      medianHouseholdIncome: 26800,
      povertyRate: 34.7,
      snapBenefitPercent: 39.0,
      unemploymentRate: 13.5,
    },
    foodDesertMetrics: {
      isFoodDesert: true,
      lowAccess1Mile: true,
      lowAccess10Miles: false,
      avgDistanceToGroceryMiles: 1.9,
      lowAccessPopulationPercent: 62.4,
      vehicleAvailabilityPercent: 52.8,
      supermarketCountWithin5Miles: 2,
    },
    dollarStoreMetrics: {
      totalStoreCount: 8,
      densityPer10k: 15.6,
      primaryChains: ['Family Dollar', 'Dollar Tree'],
      ratioToSupermarkets: 4.0,
    },
    transitMetrics: {
      transitAccessIndex: 74,
      avgDistanceToStopMiles: 0.2,
      busRoutesCount: 6,
      railAccess: true,
      transitDependencyRate: 41.2,
    },
  },
  {
    fipsCode: '48201210100',
    tractName: 'Census Tract 2101',
    county: 'Harris County',
    city: 'Houston',
    state: 'TX',
    areaType: 'urban',
    coordinates: { lat: 29.7604, lng: -95.3698 },
    population: 6210,
    incomeDemographics: {
      medianHouseholdIncome: 31200,
      povertyRate: 27.8,
      snapBenefitPercent: 29.4,
      unemploymentRate: 8.9,
    },
    foodDesertMetrics: {
      isFoodDesert: true,
      lowAccess1Mile: true,
      lowAccess10Miles: false,
      avgDistanceToGroceryMiles: 2.4,
      lowAccessPopulationPercent: 51.0,
      vehicleAvailabilityPercent: 71.5,
      supermarketCountWithin5Miles: 3,
    },
    dollarStoreMetrics: {
      totalStoreCount: 9,
      densityPer10k: 14.5,
      primaryChains: ['Dollar General', 'Family Dollar'],
      ratioToSupermarkets: 3.0,
    },
    transitMetrics: {
      transitAccessIndex: 38,
      avgDistanceToStopMiles: 0.6,
      busRoutesCount: 2,
      railAccess: false,
      transitDependencyRate: 19.8,
    },
  },
  {
    fipsCode: '28049001200',
    tractName: 'Census Tract 12',
    county: 'Hinds County',
    city: 'Jackson',
    state: 'MS',
    areaType: 'rural',
    coordinates: { lat: 32.2988, lng: -90.1848 },
    population: 2850,
    incomeDemographics: {
      medianHouseholdIncome: 21900,
      povertyRate: 41.2,
      snapBenefitPercent: 48.7,
      unemploymentRate: 15.8,
    },
    foodDesertMetrics: {
      isFoodDesert: true,
      lowAccess1Mile: true,
      lowAccess10Miles: true,
      avgDistanceToGroceryMiles: 11.4,
      lowAccessPopulationPercent: 82.1,
      vehicleAvailabilityPercent: 68.2,
      supermarketCountWithin5Miles: 0,
    },
    dollarStoreMetrics: {
      totalStoreCount: 5,
      densityPer10k: 17.5,
      primaryChains: ['Dollar General'],
      ratioToSupermarkets: 5.0,
    },
    transitMetrics: {
      transitAccessIndex: 12,
      avgDistanceToStopMiles: 2.8,
      busRoutesCount: 1,
      railAccess: false,
      transitDependencyRate: 14.2,
    },
  },
  {
    fipsCode: '06037206010',
    tractName: 'Census Tract 2060.10',
    county: 'Los Angeles County',
    city: 'Los Angeles',
    state: 'CA',
    areaType: 'urban',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    population: 4300,
    incomeDemographics: {
      medianHouseholdIncome: 35400,
      povertyRate: 24.1,
      snapBenefitPercent: 22.8,
      unemploymentRate: 7.9,
    },
    foodDesertMetrics: {
      isFoodDesert: false,
      lowAccess1Mile: false,
      lowAccess10Miles: false,
      avgDistanceToGroceryMiles: 0.6,
      lowAccessPopulationPercent: 18.2,
      vehicleAvailabilityPercent: 64.0,
      supermarketCountWithin5Miles: 7,
    },
    dollarStoreMetrics: {
      totalStoreCount: 2,
      densityPer10k: 4.65,
      primaryChains: ['Dollar Tree'],
      ratioToSupermarkets: 0.28,
    },
    transitMetrics: {
      transitAccessIndex: 82,
      avgDistanceToStopMiles: 0.15,
      busRoutesCount: 8,
      railAccess: true,
      transitDependencyRate: 38.5,
    },
  },
  {
    fipsCode: '42101000100',
    tractName: 'Census Tract 1',
    county: 'Philadelphia County',
    city: 'Philadelphia',
    state: 'PA',
    areaType: 'urban',
    coordinates: { lat: 39.9526, lng: -75.1652 },
    population: 3980,
    incomeDemographics: {
      medianHouseholdIncome: 29800,
      povertyRate: 31.0,
      snapBenefitPercent: 33.5,
      unemploymentRate: 10.4,
    },
    foodDesertMetrics: {
      isFoodDesert: true,
      lowAccess1Mile: true,
      lowAccess10Miles: false,
      avgDistanceToGroceryMiles: 1.6,
      lowAccessPopulationPercent: 54.3,
      vehicleAvailabilityPercent: 48.9,
      supermarketCountWithin5Miles: 3,
    },
    dollarStoreMetrics: {
      totalStoreCount: 5,
      densityPer10k: 12.56,
      primaryChains: ['Family Dollar', 'Dollar Tree'],
      ratioToSupermarkets: 1.67,
    },
    transitMetrics: {
      transitAccessIndex: 89,
      avgDistanceToStopMiles: 0.1,
      busRoutesCount: 9,
      railAccess: true,
      transitDependencyRate: 46.1,
    },
  },
  {
    fipsCode: '37183050100',
    tractName: 'Census Tract 501',
    county: 'Wake County',
    city: 'Raleigh',
    state: 'NC',
    areaType: 'suburban',
    coordinates: { lat: 35.7796, lng: -78.6382 },
    population: 5800,
    incomeDemographics: {
      medianHouseholdIncome: 62400,
      povertyRate: 11.2,
      snapBenefitPercent: 8.4,
      unemploymentRate: 4.1,
    },
    foodDesertMetrics: {
      isFoodDesert: false,
      lowAccess1Mile: false,
      lowAccess10Miles: false,
      avgDistanceToGroceryMiles: 0.8,
      lowAccessPopulationPercent: 12.0,
      vehicleAvailabilityPercent: 92.5,
      supermarketCountWithin5Miles: 6,
    },
    dollarStoreMetrics: {
      totalStoreCount: 1,
      densityPer10k: 1.72,
      primaryChains: ['Dollar General'],
      ratioToSupermarkets: 0.16,
    },
    transitMetrics: {
      transitAccessIndex: 35,
      avgDistanceToStopMiles: 0.8,
      busRoutesCount: 2,
      railAccess: false,
      transitDependencyRate: 6.2,
    },
  },
  {
    fipsCode: '47157002000',
    tractName: 'Census Tract 20',
    county: 'Shelby County',
    city: 'Memphis',
    state: 'TN',
    areaType: 'urban',
    coordinates: { lat: 35.1495, lng: -90.049 },
    population: 3100,
    incomeDemographics: {
      medianHouseholdIncome: 22800,
      povertyRate: 39.8,
      snapBenefitPercent: 44.2,
      unemploymentRate: 13.9,
    },
    foodDesertMetrics: {
      isFoodDesert: true,
      lowAccess1Mile: true,
      lowAccess10Miles: false,
      avgDistanceToGroceryMiles: 3.1,
      lowAccessPopulationPercent: 71.0,
      vehicleAvailabilityPercent: 51.4,
      supermarketCountWithin5Miles: 1,
    },
    dollarStoreMetrics: {
      totalStoreCount: 7,
      densityPer10k: 22.58,
      primaryChains: ['Dollar General', 'Family Dollar'],
      ratioToSupermarkets: 7.0,
    },
    transitMetrics: {
      transitAccessIndex: 31,
      avgDistanceToStopMiles: 0.7,
      busRoutesCount: 2,
      railAccess: false,
      transitDependencyRate: 29.5,
    },
  },
  {
    fipsCode: '36061000900',
    tractName: 'Census Tract 9',
    county: 'New York County',
    city: 'New York',
    state: 'NY',
    areaType: 'urban',
    coordinates: { lat: 40.7128, lng: -74.006 },
    population: 7200,
    incomeDemographics: {
      medianHouseholdIncome: 78500,
      povertyRate: 14.5,
      snapBenefitPercent: 12.1,
      unemploymentRate: 5.2,
    },
    foodDesertMetrics: {
      isFoodDesert: false,
      lowAccess1Mile: false,
      lowAccess10Miles: false,
      avgDistanceToGroceryMiles: 0.2,
      lowAccessPopulationPercent: 4.1,
      vehicleAvailabilityPercent: 22.1,
      supermarketCountWithin5Miles: 18,
    },
    dollarStoreMetrics: {
      totalStoreCount: 1,
      densityPer10k: 1.38,
      primaryChains: ['Dollar Tree'],
      ratioToSupermarkets: 0.05,
    },
    transitMetrics: {
      transitAccessIndex: 98,
      avgDistanceToStopMiles: 0.05,
      busRoutesCount: 12,
      railAccess: true,
      transitDependencyRate: 68.4,
    },
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<FoodDesertsApiResponse>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      success: false,
      summary: {
        totalTracts: 0,
        foodDesertTractsCount: 0,
        foodDesertPercentage: 0,
        avgMedianIncome: 0,
        avgPovertyRate: 0,
        avgDollarStoreDensity: 0,
        avgTransitAccessIndex: 0,
      },
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      data: [],
      error: `Method ${req.method} Not Allowed`,
    });
  }

  try {
    const {
      state,
      city,
      foodDesertOnly,
      minPovertyRate,
      maxIncome,
      areaType,
      search,
      sortBy = 'povertyRate',
      order = 'desc',
      page = '1',
      limit = '10',
    } = req.query;

    let filtered = [...MOCK_CENSUS_TRACTS];

    // Filter by State
    if (state && typeof state === 'string') {
      filtered = filtered.filter(
        (item) => item.state.toLowerCase() === state.toLowerCase()
      );
    }

    // Filter by City
    if (city && typeof city === 'string') {
      filtered = filtered.filter((item) =>
        item.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    // Filter by Food Desert Status
    if (foodDesertOnly === 'true' || foodDesertOnly === '1') {
      filtered = filtered.filter((item) => item.foodDesertMetrics.isFoodDesert);
    } else if (foodDesertOnly === 'false' || foodDesertOnly === '0') {
      filtered = filtered.filter((item) => !item.foodDesertMetrics.isFoodDesert);
    }

    // Filter by Min Poverty Rate
    if (minPovertyRate && typeof minPovertyRate === 'string') {
      const minPov = parseFloat(minPovertyRate);
      if (!isNaN(minPov)) {
        filtered = filtered.filter(
          (item) => item.incomeDemographics.povertyRate >= minPov
        );
      }
    }

    // Filter by Max Median Income
    if (maxIncome && typeof maxIncome === 'string') {
      const maxInc = parseFloat(maxIncome);
      if (!isNaN(maxInc)) {
        filtered = filtered.filter(
          (item) => item.incomeDemographics.medianHouseholdIncome <= maxInc
        );
      }
    }

    // Filter by Area Type
    if (areaType && typeof areaType === 'string') {
      filtered = filtered.filter(
        (item) => item.areaType.toLowerCase() === areaType.toLowerCase()
      );
    }

    // General Search (fipsCode, tractName, city, county, state)
    if (search && typeof search === 'string') {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.fipsCode.toLowerCase().includes(query) ||
          item.tractName.toLowerCase().includes(query) ||
          item.city.toLowerCase().includes(query) ||
          item.county.toLowerCase().includes(query) ||
          item.state.toLowerCase().includes(query)
      );
    }

    // Sorting
    const sortOrder = order === 'asc' ? 1 : -1;
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'income':
        case 'medianHouseholdIncome':
          return (
            (a.incomeDemographics.medianHouseholdIncome -
              b.incomeDemographics.medianHouseholdIncome) *
            sortOrder
          );
        case 'povertyRate':
          return (
            (a.incomeDemographics.povertyRate -
              b.incomeDemographics.povertyRate) *
            sortOrder
          );
        case 'dollarStoreDensity':
          return (
            (a.dollarStoreMetrics.densityPer10k -
              b.dollarStoreMetrics.densityPer10k) *
            sortOrder
          );
        case 'transitIndex':
        case 'transitAccessIndex':
          return (
            (a.transitMetrics.transitAccessIndex -
              b.transitMetrics.transitAccessIndex) *
            sortOrder
          );
        case 'groceryDistance':
          return (
            (a.foodDesertMetrics.avgDistanceToGroceryMiles -
              b.foodDesertMetrics.avgDistanceToGroceryMiles) *
            sortOrder
          );
        case 'population':
          return (a.population - b.population) * sortOrder;
        default:
          return (
            (a.incomeDemographics.povertyRate -
              b.incomeDemographics.povertyRate) *
            sortOrder
          );
      }
    });

    // Compute Aggregate Summary Metrics
    const totalTracts = filtered.length;
    const foodDesertTractsCount = filtered.filter(
      (t) => t.foodDesertMetrics.isFoodDesert
    ).length;
    const foodDesertPercentage =
      totalTracts > 0
        ? parseFloat(((foodDesertTractsCount / totalTracts) * 100).toFixed(1))
        : 0;

    const avgMedianIncome =
      totalTracts > 0
        ? Math.round(
            filtered.reduce(
              (acc, curr) => acc + curr.incomeDemographics.medianHouseholdIncome,
              0
            ) / totalTracts
          )
        : 0;

    const avgPovertyRate =
      totalTracts > 0
        ? parseFloat(
            (
              filtered.reduce(
                (acc, curr) => acc + curr.incomeDemographics.povertyRate,
                0
              ) / totalTracts
            ).toFixed(1)
          )
        : 0;

    const avgDollarStoreDensity =
      totalTracts > 0
        ? parseFloat(
            (
              filtered.reduce(
                (acc, curr) => acc + curr.dollarStoreMetrics.densityPer10k,
                0
              ) / totalTracts
            ).toFixed(2)
          )
        : 0;

    const avgTransitAccessIndex =
      totalTracts > 0
        ? parseFloat(
            (
              filtered.reduce(
                (acc, curr) => acc + curr.transitMetrics.transitAccessIndex,
                0
              ) / totalTracts
            ).toFixed(1)
          )
        : 0;

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 10));
    const totalPages = Math.ceil(totalTracts / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedData = filtered.slice(startIndex, startIndex + limitNum);

    return res.status(200).json({
      success: true,
      summary: {
        totalTracts,
        foodDesertTractsCount,
        foodDesertPercentage,
        avgMedianIncome,
        avgPovertyRate,
        avgDollarStoreDensity,
        avgTransitAccessIndex,
      },
      pagination: {
        total: totalTracts,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
      data: paginatedData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      summary: {
        totalTracts: 0,
        foodDesertTractsCount: 0,
        foodDesertPercentage: 0,
        avgMedianIncome: 0,
        avgPovertyRate: 0,
        avgDollarStoreDensity: 0,
        avgTransitAccessIndex: 0,
      },
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      data: [],
      error: 'Internal server error while processing request.',
    });
  }
}