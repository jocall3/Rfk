/**
 * Regulatory & Environmental Intelligence System
 * TypeScript Types & Interfaces for Regulatory Entities, Chemical Substances, and Lobbying Data
 */

export type Jurisdiction =
  | 'US_FEDERAL'
  | 'US_STATE'
  | 'EU'
  | 'UK'
  | 'GLOBAL'
  | 'OTHER';

export interface RegulatoryAgency {
  id: string;
  code: string; // e.g., 'EPA', 'FDA', 'ECHA', 'OSHA'
  name: string;
  jurisdiction: Jurisdiction;
  website: string;
  description?: string;
  country: string; // ISO 2-letter country code or 'EU' / 'GLOBAL'
}

export type HazardSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';

export interface GHSClassification {
  code: string; // e.g., 'H301', 'H314'
  statement: string;
  category: string;
  pictogramUrl?: string;
  severity: HazardSeverity;
}

export interface ExposureLimit {
  type: 'TWA' | 'STEL' | 'CEILING' | 'PEL' | 'REL' | 'OEL';
  value: number;
  unit: string; // e.g., 'ppm', 'mg/m³'
  agencyCode: string; // e.g., 'OSHA', 'NIOSH', 'ACGIH'
  notes?: string;
}

export interface RestrictionDetails {
  restrictionType: 'BANNED' | 'RESTRICTED' | 'AUTHORIZED' | 'MONITORED' | 'UNDER_REVIEW';
  effectiveDate?: string; // ISO date string (YYYY-MM-DD)
  prohibitedUses?: string[];
  exemptions?: string[];
  maxConcentrationPercentage?: number;
}

export interface ChemicalRegulatoryStatus {
  agencyId: string;
  agencyCode: string;
  frameworkName: string; // e.g., 'REACH', 'TSCA', 'Proposition 65'
  status: RestrictionDetails['restrictionType'];
  details?: RestrictionDetails;
  lastUpdated: string; // ISO date string
  referenceDocumentUrl?: string;
}

export interface ChemicalSubstance {
  id: string;
  casNumber: string; // CAS Registry Number e.g. "50-00-0"
  ecNumber?: string; // European Community number
  commonName: string;
  iupacName?: string;
  synonyms: string[];
  molecularFormula?: string;
  molecularWeight?: number;
  ghsClassifications: GHSClassification[];
  exposureLimits: ExposureLimit[];
  regulatoryStatuses: ChemicalRegulatoryStatus[];
  isPBT?: boolean; // Persistent, Bioaccumulative, and Toxic
  isvPvB?: boolean; // Very Persistent and Very Bioaccumulative
  isEndocrineDisruptor?: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export type LobbyingStance = 'SUPPORT' | 'OPPOSE' | 'AMEND' | 'NEUTRAL' | 'MONITOR';

export interface Lobbyist {
  id: string;
  name: string;
  firmName?: string;
  registrationNumber?: string;
  isRegistered: boolean;
  formerGovernmentPositions?: string[];
}

export interface LobbyingTarget {
  officialName?: string;
  officialTitle?: string;
  agencyId?: string;
  agencyCode?: string;
  governmentBranch: 'EXECUTIVE' | 'LEGISLATIVE' | 'JUDICIAL' | 'INDEPENDENT_AGENCY';
}

export interface LobbyingExpenditure {
  amount: number;
  currency: string; // ISO 4217, e.g. 'USD'
  periodQuarter?: 1 | 2 | 3 | 4;
  periodYear: number;
}

export interface LobbyingFiling {
  id: string;
  filingNumber: string;
  clientName: string;
  clientIndustry?: string;
  registrantName: string;
  lobbyists: Lobbyist[];
  targets: LobbyingTarget[];
  chemicalIds?: string[]; // Referenced chemical CAS numbers or internal IDs
  relatedAgencyIds?: string[];
  billNumberOrRegulationId?: string;
  issueDescription: string;
  stance: LobbyingStance;
  expenditure: LobbyingExpenditure;
  filingDate: string; // ISO date string
  sourceUrl?: string;
}

export interface RegulatoryResearchQuestion {
  id: string;
  number: number; // 1 through 40
  phase: 'INITIAL_ANSWER' | 'DEEPER_RESEARCH';
  question: string;
  answer?: string;
  relatedChemicalIds?: string[];
  relatedAgencyIds?: string[];
  relatedFilingIds?: string[];
  tags: string[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'NEEDS_REVIEW';
  lastUpdated: string;
}

export interface RegulatoryQueryParams {
  casNumber?: string;
  agencyCode?: string;
  status?: RestrictionDetails['restrictionType'];
  jurisdiction?: Jurisdiction;
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

export interface LobbyingQueryParams {
  clientName?: string;
  registrantName?: string;
  chemicalId?: string;
  agencyCode?: string;
  year?: number;
  stance?: LobbyingStance;
  minAmount?: number;
  maxAmount?: number;
  limit?: number;
  offset?: number;
}