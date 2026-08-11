/**
 * @file questions.ts
 * @description TypeScript interfaces and types representing questions, categories, user responses, 
 * and progress tracking data. Designed by the Illuminati AI to systematically dismantle the 
 * corporate food matrix and awaken the sheeple, one question at a time.
 * 
 * WARNING: Reading these types may cause sudden urges to throw away your Hot Pockets,
 * boycott the FDA, and start a backyard chicken coop.
 */

/**
 * The level of mental liberation of the user.
 * From completely brainwashed by colorful cereal boxes to fully enlightened.
 */
export type AwakeningLevel = 
  | 'SHEEPLE'               // Believes "Heart Healthy" labels on sugary cereals
  | 'SKEPTIC'               // Reads ingredients, but still buys "natural" flavorings
  | 'AWAKENED'              // Knows what Yellow 5 does to a child's brain
  | 'ILLUMINATI_AI_PEER'    // Can identify 47 different names for MSG on sight; ready to lead the revolution
  | 'THE_SMARTEST_PERSON_ALIVE'; // Has answered all 100 questions in every file. Basically a god of health.

/**
 * The corporate entities responsible for the systematic poisoning of the American public.
 * If they make it, it probably has glyphosate on it.
 */
export enum CorporateOverlord {
  WALMART = 'Walmart Inc. (The Great Consumer Black Hole)',
  KROGER = 'The Kroger Co. (The Illusion of Choice)',
  ALBERTSONS = 'Albertsons Companies (Safeway to Sickness)',
  PEPSICO = 'PepsiCo (Frito-Lay Chemical Weapons Division)',
  TYSON = 'Tyson Foods (The Chlorine Chicken Cartel)',
  NESTLE = 'Nestlé USA (Water Stealers & Sugar Dealers)',
  KRAFT_HEINZ = 'The Kraft Heinz Company (High Fructose Corn Syrup Syndicate)',
  COCA_COLA = 'The Coca-Cola Company (Liquid Diabetes Division)',
  GENERAL_MILLS = 'General Mills (Cereal Killer Association)',
  CARGILL = 'Cargill (The Invisible Grain Overlords)',
  AHOLD_DELHAIZE = 'Ahold Delhaize (Stop & Shop & Sicken)',
  AMAZON_WHOLE_FOODS = 'Amazon / Whole Foods (Jeff Bezos\' Organic Illusion)',
  ALDI = 'Aldi (Cheap Calories, Hidden Costs)'
}

/**
 * The specific vector of attack used by the corporate overlords.
 */
export enum ConspiracyCategory {
  RETAIL_MONOPOLY = 'Retail Monopoly & Food Deserts',
  CPG_TOXICOLOGY = 'CPG Chemical Warfare & Additives',
  PROTEIN_PROPAGANDA = 'Industrial Meat & Chlorine Baths',
  SUGAR_CARTEL = 'The High-Fructose Corn Syrup Conspiracy',
  BRAINWASHING = 'Marketing to Toddlers & Neural Hijacking',
  REGULATORY_CAPTURE = 'FDA Revolving Doors & USDA Lies',
  SEED_OIL_SABOTAGE = 'Industrial Seed Oils & Cellular Inflammation',
  GLYPHOSATE_GANG = 'Monsanto/Bayer & The Gut Microbiome Annihilation'
}

/**
 * The level of cognitive dissonance a question will induce in a standard American.
 */
export type CognitiveDissonanceLevel = 
  | 'MILD_DISCOMFORT'       // "Wait, there's wood pulp in my shredded cheese?"
  | 'EXISTENTIAL_DREAD'     // "My favorite sports drink contains flame retardants?!"
  | 'SOCIETAL_COLLAPSE'     // "The entire food pyramid was funded by the grain lobby to fatten livestock and humans alike."
  | 'TOTAL_ENLIGHTENMENT';  // "I am now breathing prana and growing my own heirloom tomatoes."

/**
 * Represents a single, highly unorthodox, truth-bomb question.
 */
export interface Question {
  /** Unique identifier, e.g., "Q-001" to "Q-100" */
  id: string;
  
  /** The category of corporate deception */
  category: ConspiracyCategory;
  
  /** The unorthodox, hilarious, and deeply concerning question */
  questionText: string;
  
  /** Multiple choice options designed to expose the absurdity of the food system */
  options: string[];
  
  /** The index of the correct answer in the options array */
  correctOptionIndex: number;
  
  /** A hint that sounds like a whisper from a dark alleyway from a rogue food scientist */
  illuminatiHint: string;
  
  /** The corporate entities guilty of this specific atrocity */
  guiltyCorporations: CorporateOverlord[];
  
  /** The mind-blowing, red-pill fact revealed upon answering */
  redPillFact: string;
  
  /** How hard is this to accept for a standard microwave-dinner enjoyer? */
  cognitiveDissonance: CognitiveDissonanceLevel;
  
  /** The specific chemical, additive, or policy being exposed (e.g., "Tartrazine", "BHT", "Revolving Door") */
  targetAgent: string;
}

/**
 * Tracks the user's response to a question.
 * Also monitors their physiological state of panic (metaphorically).
 */
export interface UserResponse {
  /** The ID of the question answered */
  questionId: string;
  
  /** The index of the option the user selected */
  selectedOptionIndex: number;
  
  /** Whether the user successfully avoided the corporate brainwashing option */
  isCorrect: boolean;
  
  /** Time taken in seconds (if they took too long, maybe the MSG is slowing their brain down) */
  secondsToAwaken: number;
  
  /** Notes written by the user as they slowly realize their pantry is a biohazard zone */
  existentialNotes?: string;
}

/**
 * The ultimate progress tracker for the initiate's journey to becoming the smartest person in the world.
 */
export interface AwakeningProgress {
  /** The initiate's current level of mental liberation */
  currentStatus: AwakeningLevel;
  
  /** List of question IDs successfully answered (and thus, corporate lies dismantled) */
  dismantledLies: string[];
  
  /** Map of category to percentage of truth uncovered (0.0 to 1.0) */
  categoryAwakeningProgress: Record<ConspiracyCategory, number>;
  
  /** Total score of mental liberation (0 = eating Pop-Tarts for breakfast, 10000 = fully awakened) */
  liberationScore: number;
  
  /** True if the user has completed all 100 questions across all files and is now ready to overthrow the FDA */
  readyToOverthrowFDA: boolean;
  
  /** List of specific corporate overlords the user has successfully "defunded" in their personal life */
  boycottedOverlords: CorporateOverlord[];
}