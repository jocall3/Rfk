export type StoreType = 
  | 'supermarket'
  | 'hypermarket'
  | 'convenience'
  | 'specialty'
  | 'discount'
  | 'department'
  | 'warehouse_club';

export type ShelfPosition = 
  | 'top_shelf'
  | 'eye_level'
  | 'touch_level'
  | 'bottom_shelf'
  | 'endcap'
  | 'checkout_queue'
  | 'island_display'
  | 'freestanding';

export interface Retailer {
  id: string;
  name: string;
  code: string;
  headquartersAddress: string;
  storeCount: number;
  primaryStoreTypes: StoreType[];
  createdAt: string;
  updatedAt: string;
}

export interface RetailStore {
  id: string;
  retailerId: string;
  storeNumber: string;
  name: string;
  type: StoreType;
  squareFootage: number;
  sellingAreaSquareFootage: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  isActive: boolean;
  openedDate: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  code: string;
  parentCategoryId?: string;
  department: string;
  isPerishable: boolean;
  requiresRefrigeration: boolean;
  targetMarginPercentage: number;
}

export interface RetailProduct {
  id: string;
  upc: string;
  sku: string;
  brandName: string;
  productName: string;
  categoryId: string;
  unitSize: string;
  wholesaleCost: number;
  msrp: number;
  currentRetailPrice: number;
  isPrivateLabel: boolean;
  dimensions: {
    widthInches: number;
    heightInches: number;
    depthInches: number;
    weightPounds: number;
  };
  storageRequirements: 'ambient' | 'chilled' | 'frozen';
}

export type SlottingFeeType = 
  | 'introductory'
  | 'promotional'
  | 'shelf_placement'
  | 'endcap_premium'
  | 'annual_renewal'
  | 'discontinuance_penalty';

export type PaymentFrequency = 'one_time' | 'monthly' | 'quarterly' | 'annually';

export interface SlottingFeeStructure {
  id: string;
  agreementId: string;
  productId: string;
  retailerId: string;
  feeType: SlottingFeeType;
  amountUSD: number;
  paymentFrequency: PaymentFrequency;
  shelfPosition: ShelfPosition;
  facingsCount: number;
  storeScopeCount: number;
  startDate: string;
  endDate: string;
  isGuaranteedPlacement: boolean;
  performanceRebateTerms?: {
    salesVolumeThresholdUnits: number;
    rebatePercentage: number;
  };
  penaltyTerms?: {
    underperformanceThresholdUnits: number;
    delistingGracePeriodDays: number;
  };
}

export interface LightingConfig {
  lumens: number;
  colorTemperatureKelvin: number;
  cri: number; // Color Rendering Index
  accentSpotlightRatio: number;
  dimmingCapable: boolean;
}

export interface OlfactoryConfig {
  scentIdentifier?: string;
  diffusionIntensityLevel: number; // 1 to 10
  diffusionSchedule: string;
  targetDepartment: string;
}

export interface AudioConfig {
  playlistGenre: string;
  tempoBPM: number;
  decibelLevelAverage: number;
  announcementFrequencyMinutes: number;
}

export interface SpatialDensity {
  aisleWidthFeet: number;
  fixtureHeightFeet: number;
  sightlineDistanceFeet: number;
  maxCapacityShoppersPerSqFt: number;
  occupancyRateAverage: number;
}

export interface VisualMerchandising {
  primaryColorPalette: string[];
  signageReadabilityDistanceFeet: number;
  digitalSignagePresent: boolean;
  mirrorPlacementCount: number;
  interactiveDisplayCount: number;
}

export interface StoreLayoutSensoryParameters {
  id: string;
  storeId: string;
  zoneName: string; // e.g., "Produce", "Bakery", "Electronics"
  lighting: LightingConfig;
  olfactory?: OlfactoryConfig;
  audio: AudioConfig;
  spatialDensity: SpatialDensity;
  visualMerchandising: VisualMerchandising;
  evaluatedAt: string;
  perceivedDwellTimeMinutes: number;
  impulsePurchaseIndex: number; // Normalized 0-100 score
}

export type TransitStatus = 
  | 'pending'
  | 'in_transit'
  | 'at_port'
  | 'customs_cleared'
  | 'out_for_delivery'
  | 'delivered'
  | 'exception_delayed'
  | 'rejected';

export interface TemperatureMonitoring {
  isTemperatureControlled: boolean;
  targetTemperatureCelsius: number;
  minAllowedTemperatureCelsius: number;
  maxAllowedTemperatureCelsius: number;
  recordedExcursionsCount: number;
  dataLoggerActive: boolean;
}

export interface LeadTimeBreakdown {
  orderProcessingDays: number;
  supplierFulfillmentDays: number;
  transitDays: number;
  customsClearanceDays: number;
  dcReceivingDays: number;
  totalLeadTimeDays: number;
}

export interface OnTimeInFullMetric {
  onTimePercentage: number;
  inFullPercentage: number;
  otifCombinedPercentage: number;
  damagedUnitsCount: number;
  shippedUnitsCount: number;
}

export interface SupplyChainTransitMetrics {
  id: string;
  shipmentId: string;
  originLocationId: string;
  destinationLocationId: string;
  carrierCode: string;
  status: TransitStatus;
  leadTime: LeadTimeBreakdown;
  temperatureControl: TemperatureMonitoring;
  otifPerformance: OnTimeInFullMetric;
  carbonFootprintKgCO2e: number;
  dispatchedAt: string;
  estimatedArrivalAt: string;
  actualArrivalAt?: string;
  routeDistanceMiles: number;
}

export interface FreshFoodAvailability {
  freshProduceSKUCount: number;
  freshMeatFishSKUCount: number;
  dairyOrganicSKUCount: number;
  averageProduceFreshnessScore: number; // 1 to 10 scale
  stockoutRateFreshItems: number; // Percentage 0-100
}

export interface StoreDensity {
  groceryStoresWithin1Mile: number;
  supermarketsWithin3Miles: number;
  convenienceStoresWithin1Mile: number;
  fastFoodRestaurantsWithin1Mile: number;
}

export interface DemographicProfile {
  medianHouseholdIncomeUSD: number;
  povertyRatePercentage: number;
  snapBenefitRecipientPercentage: number;
  zeroVehicleHouseholdsPercentage: number;
  publicTransitAccessibilityScore: number; // 0-100
}

export interface SocioeconomicFactors {
  unemploymentRate: number;
  medianAge: number;
  populationDensityPerSqMile: number;
  housingBurdenRate: number; // Percentage spending >30% income on housing
}

export interface AccessibilityScore {
  walkabilityIndex: number; // 0-100
  transitScore: number; // 0-100
  averageTravelTimeMinutesToGrocery: {
    walking: number;
    publicTransit: number;
    driving: number;
  };
}

export interface FoodDesertIndicators {
  id: string;
  censusTractId: string;
  zipCode: string;
  isUSDAClassifiedFoodDesert: boolean;
  lowIncomeLowAccessStatus: 'LILA_1_and_10' | 'LILA_half_and_10' | 'LILA_1_and_20' | 'none';
  distanceToNearestSupermarketMiles: number;
  demographics: DemographicProfile;
  socioeconomic: SocioeconomicFactors;
  storeDensity: StoreDensity;
  freshFoodAvailability: FreshFoodAvailability;
  accessibility: AccessibilityScore;
  foodInsecurityIndexScore: number; // Composite index 0-100
  assessedDate: string;
}