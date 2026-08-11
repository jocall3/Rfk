export type TransportMode =
  | 'air'
  | 'truck_diesel'
  | 'truck_electric'
  | 'rail'
  | 'sea_container'
  | 'cargo_ship';

export type FoodCategory =
  | 'leafy_greens'
  | 'berries'
  | 'stone_fruit'
  | 'citrus'
  | 'root_vegetables'
  | 'grains'
  | 'dairy'
  | 'meat_fresh'
  | 'seafood_fresh'
  | 'canned_processed';

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface SupplyChainLeg {
  id: string;
  name: string;
  origin: GeoCoordinates;
  destination: GeoCoordinates;
  transportMode: TransportMode;
  isRefrigerated: boolean;
  transitTimeDays: number;
  customDistanceKm?: number;
}

export interface FoodTravelSummary {
  totalDistanceKm: number;
  totalDistanceMiles: number;
  totalTransitDays: number;
  legsBreakdown: {
    legId: string;
    name: string;
    distanceKm: number;
    transportMode: TransportMode;
  }[];
}

export interface CarbonEmissionsSummary {
  totalEmissionsKgCO2e: number;
  emissionsPerKgFood: number;
  transportEmissionsKgCO2e: number;
  refrigerationEmissionsKgCO2e: number;
  emissionsByLeg: {
    legId: string;
    emissionsKgCO2e: number;
    mode: TransportMode;
  }[];
}

export interface JITVulnerabilityInput {
  leadTimeDays: number;
  bufferInventoryDays: number;
  singleSupplierDependency: boolean;
  supplierConcentrationScore: number; // 0 (diversified) to 1 (monopoly)
  averageTransitDelayDays: number;
  weatherRiskFactor: number; // 0 (stable) to 1 (extreme weather prone)
  shelfLifeDays: number;
  transportModeDiversityCount: number;
}

export interface JITVulnerabilityResult {
  vulnerabilityScore: number; // 0 to 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  vulnerabilityFactors: {
    jitRatioScore: number; // Lead time vs buffer ratio
    supplierConcentrationScore: number;
    transitDisruptionRiskScore: number;
    perishabilityRiskScore: number;
  };
  recommendations: string[];
}

export interface NutrientDepletionInput {
  category: FoodCategory;
  storageDays: number;
  temperatureCelsius: number;
  isLightExposed?: boolean;
  relativeHumidityPercent?: number;
}

export interface NutrientDepletionResult {
  category: FoodCategory;
  storageDays: number;
  remainingVitaminCPercent: number;
  remainingGeneralNutrientsPercent: number;
  overallNutrientRetentionPercent: number;
  qualityGrade: 'PRISTINE' | 'GOOD' | 'DEGRADED' | 'EXPIRED';
  estimatedHalfLifeDays: number;
}

// Emission Factors in grams CO2e per kg-km (g CO2e / kg * km)
const EMISSION_FACTORS: Record<TransportMode, number> = {
  air: 1.13, // High emissions for air freight
  truck_diesel: 0.16, // Standard diesel freight truck
  truck_electric: 0.04, // Grid average electric truck
  rail: 0.023, // Rail freight
  sea_container: 0.012, // Container ship
  cargo_ship: 0.015, // Bulk cargo ship
};

// Refrigeration multiplier factor relative to base transport emissions
const REFRIGERATION_EMISSION_FACTOR_PER_DAY_KG = 0.018; // kg CO2e / kg food / day

// Half-lives (in days) at standard refrigerated storage (~4°C)
const BASE_NUTRIENT_HALF_LIFE_DAYS: Record<FoodCategory, { vitaminC: number; general: number }> = {
  leafy_greens: { vitaminC: 3.5, general: 7.0 },
  berries: { vitaminC: 5.0, general: 8.0 },
  stone_fruit: { vitaminC: 8.0, general: 14.0 },
  citrus: { vitaminC: 30.0, general: 45.0 },
  root_vegetables: { vitaminC: 45.0, general: 90.0 },
  grains: { vitaminC: 180.0, general: 365.0 },
  dairy: { vitaminC: 7.0, general: 14.0 },
  meat_fresh: { vitaminC: 4.0, general: 10.0 },
  seafood_fresh: { vitaminC: 2.0, general: 5.0 },
  canned_processed: { vitaminC: 120.0, general: 300.0 },
};

/**
 * Calculates the Haversine distance between two geographical coordinates in kilometers.
 */
export function calculateHaversineDistance(coord1: GeoCoordinates, coord2: GeoCoordinates): number {
  const EARTH_RADIUS_KM = 6371;
  const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const lat1 = (coord1.latitude * Math.PI) / 180;
  const lat2 = (coord2.latitude * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Calculates total food travel distance and transit metrics over a multi-leg supply chain route.
 */
export function calculateFoodTravelMileage(legs: SupplyChainLeg[]): FoodTravelSummary {
  let totalDistanceKm = 0;
  let totalTransitDays = 0;

  const legsBreakdown = legs.map((leg) => {
    const distanceKm =
      leg.customDistanceKm !== undefined && leg.customDistanceKm >= 0
        ? leg.customDistanceKm
        : calculateHaversineDistance(leg.origin, leg.destination);

    totalDistanceKm += distanceKm;
    totalTransitDays += leg.transitTimeDays;

    return {
      legId: leg.id,
      name: leg.name,
      distanceKm: Math.round(distanceKm * 100) / 100,
      transportMode: leg.transportMode,
    };
  });

  const KM_TO_MILES = 0.621371;

  return {
    totalDistanceKm: Math.round(totalDistanceKm * 100) / 100,
    totalDistanceMiles: Math.round(totalDistanceKm * KM_TO_MILES * 100) / 100,
    totalTransitDays,
    legsBreakdown,
  };
}

/**
 * Computes carbon emissions (CO2e) generated during transport and cold-chain refrigeration.
 */
export function calculateCarbonIntensity(
  legs: SupplyChainLeg[],
  foodWeightKg: number
): CarbonEmissionsSummary {
  if (foodWeightKg <= 0) {
    throw new Error('Food weight must be greater than 0 kg.');
  }

  let totalTransportEmissionsKgCO2e = 0;
  let totalRefrigerationEmissionsKgCO2e = 0;

  const emissionsByLeg = legs.map((leg) => {
    const distanceKm =
      leg.customDistanceKm !== undefined && leg.customDistanceKm >= 0
        ? leg.customDistanceKm
        : calculateHaversineDistance(leg.origin, leg.destination);

    const emissionFactor = EMISSION_FACTORS[leg.transportMode] || EMISSION_FACTORS.truck_diesel;
    // g CO2e / (kg * km) * kg * km / 1000 = kg CO2e
    const transportEmissions = (emissionFactor * foodWeightKg * distanceKm) / 1000;

    let refrigerationEmissions = 0;
    if (leg.isRefrigerated) {
      refrigerationEmissions = REFRIGERATION_EMISSION_FACTOR_PER_DAY_KG * foodWeightKg * leg.transitTimeDays;
    }

    const legTotalEmissions = transportEmissions + refrigerationEmissions;
    totalTransportEmissionsKgCO2e += transportEmissions;
    totalRefrigerationEmissionsKgCO2e += refrigerationEmissions;

    return {
      legId: leg.id,
      emissionsKgCO2e: Math.round(legTotalEmissions * 1000) / 1000,
      mode: leg.transportMode,
    };
  });

  const totalEmissionsKgCO2e = totalTransportEmissionsKgCO2e + totalRefrigerationEmissionsKgCO2e;

  return {
    totalEmissionsKgCO2e: Math.round(totalEmissionsKgCO2e * 1000) / 1000,
    emissionsPerKgFood: Math.round((totalEmissionsKgCO2e / foodWeightKg) * 1000) / 1000,
    transportEmissionsKgCO2e: Math.round(totalTransportEmissionsKgCO2e * 1000) / 1000,
    refrigerationEmissionsKgCO2e: Math.round(totalRefrigerationEmissionsKgCO2e * 1000) / 1000,
    emissionsByLeg,
  };
}

/**
 * Computes a Just-In-Time (JIT) Supply Chain Vulnerability score based on buffer ratios, supplier concentration,
 * and logistics factors.
 */
export function calculateJITVulnerability(input: JITVulnerabilityInput): JITVulnerabilityResult {
  const {
    leadTimeDays,
    bufferInventoryDays,
    singleSupplierDependency,
    supplierConcentrationScore,
    averageTransitDelayDays,
    weatherRiskFactor,
    shelfLifeDays,
    transportModeDiversityCount,
  } = input;

  // 1. JIT Inventory Ratio Score (0 - 100)
  // Higher ratio of lead time to buffer indicates high risk
  const safeBufferDays = Math.max(0.1, bufferInventoryDays);
  const jitRatio = leadTimeDays / safeBufferDays;
  const jitRatioScore = Math.min(100, Math.max(0, jitRatio * 25));

  // 2. Supplier Concentration Score (0 - 100)
  let supplierScore = Math.min(1, Math.max(0, supplierConcentrationScore)) * 70;
  if (singleSupplierDependency) {
    supplierScore = Math.min(100, supplierScore + 30);
  }

  // 3. Transit Disruption Risk Score (0 - 100)
  const delayFactor = Math.min(100, (averageTransitDelayDays / Math.max(1, leadTimeDays)) * 100);
  const modeDiversityPenalty = Math.max(0, (3 - transportModeDiversityCount) * 15);
  const weatherScore = Math.min(1, Math.max(0, weatherRiskFactor)) * 40;
  const transitDisruptionRiskScore = Math.min(100, delayFactor * 0.4 + weatherScore + modeDiversityPenalty);

  // 4. Perishability Risk Score (0 - 100)
  const totalInTransitAndBuffer = leadTimeDays + bufferInventoryDays;
  const perishabilityRatio = totalInTransitAndBuffer / Math.max(1, shelfLifeDays);
  const perishabilityRiskScore = Math.min(100, Math.max(0, perishabilityRatio * 100));

  // Weighted overall vulnerability score
  const overallScore =
    jitRatioScore * 0.35 +
    supplierScore * 0.25 +
    transitDisruptionRiskScore * 0.25 +
    perishabilityRiskScore * 0.15;

  const vulnerabilityScore = Math.round(Math.min(100, Math.max(0, overallScore)));

  let riskLevel: JITVulnerabilityResult['riskLevel'] = 'LOW';
  if (vulnerabilityScore >= 75) {
    riskLevel = 'CRITICAL';
  } else if (vulnerabilityScore >= 50) {
    riskLevel = 'HIGH';
  } else if (vulnerabilityScore >= 25) {
    riskLevel = 'MEDIUM';
  }

  const recommendations: string[] = [];
  if (jitRatioScore > 50) {
    recommendations.push('Increase buffer safety stock to cushion against lead-time volatility.');
  }
  if (singleSupplierDependency || supplierScore > 60) {
    recommendations.push('Diversify supplier network to eliminate single points of failure.');
  }
  if (transitDisruptionRiskScore > 50) {
    recommendations.push('Introduce redundant transport routes or multi-modal carrier options.');
  }
  if (perishabilityRiskScore > 60) {
    recommendations.push('Shorten supply chain transit duration or optimize cold-chain logistics to prevent decay.');
  }

  return {
    vulnerabilityScore,
    riskLevel,
    vulnerabilityFactors: {
      jitRatioScore: Math.round(jitRatioScore),
      supplierConcentrationScore: Math.round(supplierScore),
      transitDisruptionRiskScore: Math.round(transitDisruptionRiskScore),
      perishabilityRiskScore: Math.round(perishabilityRiskScore),
    },
    recommendations,
  };
}

/**
 * Calculates nutrient depletion and vitamin degradation over storage duration using temperature-adjusted Arrhenius kinetics.
 */
export function calculateNutrientDepletion(input: NutrientDepletionInput): NutrientDepletionResult {
  const { category, storageDays, temperatureCelsius, isLightExposed = false, relativeHumidityPercent = 60 } = input;

  const baseHalfLives = BASE_NUTRIENT_HALF_LIFE_DAYS[category] || BASE_NUTRIENT_HALF_LIFE_DAYS.leafy_greens;

  // Temperature acceleration factor (Q10 = 2.0 for biochemical food degradation)
  // Standard baseline temperature set at 4°C (refrigerated)
  const STANDARD_TEMP_C = 4;
  const Q10 = 2.1;
  const tempDifference = temperatureCelsius - STANDARD_TEMP_C;
  const temperatureAcceleration = Math.pow(Q10, tempDifference / 10);

  // Light exposure multiplier for light-sensitive nutrients (e.g. Vitamin C, Riboflavin)
  const lightMultiplier = isLightExposed ? 1.4 : 1.0;

  // Humidity degradation multiplier (deviation from optimal ~85% RH for fresh produce)
  const humidityDeviation = Math.abs((relativeHumidityPercent - 85) / 100);
  const humidityMultiplier = 1.0 + humidityDeviation * 0.3;

  const adjustedVitCHalfLife = Math.max(0.1, baseHalfLives.vitaminC / (temperatureAcceleration * lightMultiplier * humidityMultiplier));
  const adjustedGeneralHalfLife = Math.max(0.1, baseHalfLives.general / (temperatureAcceleration * humidityMultiplier));

  // First-order reaction kinetics: N(t) = N0 * exp(-k * t) where k = ln(2) / t_half
  const vitCK = Math.LN2 / adjustedVitCHalfLife;
  const generalK = Math.LN2 / adjustedGeneralHalfLife;

  const remainingVitaminCPercent = Math.max(0, Math.min(100, 100 * Math.exp(-vitCK * storageDays)));
  const remainingGeneralNutrientsPercent = Math.max(0, Math.min(100, 100 * Math.exp(-generalK * storageDays)));

  const overallRetention = Math.round((remainingVitaminCPercent * 0.4 + remainingGeneralNutrientsPercent * 0.6) * 10) / 10;

  let qualityGrade: NutrientDepletionResult['qualityGrade'] = 'PRISTINE';
  if (overallRetention < 30) {
    qualityGrade = 'EXPIRED';
  } else if (overallRetention < 60) {
    qualityGrade = 'DEGRADED';
  } else if (overallRetention < 85) {
    qualityGrade = 'GOOD';
  }

  return {
    category,
    storageDays,
    remainingVitaminCPercent: Math.round(remainingVitaminCPercent * 10) / 10,
    remainingGeneralNutrientsPercent: Math.round(remainingGeneralNutrientsPercent * 10) / 10,
    overallNutrientRetentionPercent: overallRetention,
    qualityGrade,
    estimatedHalfLifeDays: Math.round(adjustedVitCHalfLife * 10) / 10,
  };
}