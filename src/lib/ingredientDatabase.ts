export type ToxicityLevel = 'Low' | 'Moderate' | 'High' | 'Very High' | 'Unknown';

export type RegulatoryStatus = 'Approved' | 'Banned' | 'Restricted' | 'Under Review' | 'GRAS'; // GRAS = Generally Recognized As Safe

export type IngredientCategory =
  | 'Preservative'
  | 'Colorant'
  | 'Sweetener'
  | 'Flavor Enhancer'
  | 'Emulsifier'
  | 'Pesticide/Contaminant'
  | 'Texturizer'
  | 'Flour Treatment Agent'
  | 'Hormone/Antibiotic'
  | 'Other';

export interface IngredientDetails {
  id: string;
  name: string;
  aliases: string[];
  category: IngredientCategory;
  toxicityLevel: ToxicityLevel;
  fdaStatus: RegulatoryStatus;
  euStatus: RegulatoryStatus;
  description: string;
  healthRisks: string[];
  commonSources: string[];
  alternatives: string[];
  scientificReferences: string[];
}

export const ingredientDatabase: Record<string, IngredientDetails> = {
  'titanium-dioxide': {
    id: 'titanium-dioxide',
    name: 'Titanium Dioxide',
    aliases: ['E171', 'TiO2', 'Titanium(IV) oxide', 'Pigment White 6'],
    category: 'Colorant',
    toxicityLevel: 'High',
    fdaStatus: 'Approved',
    euStatus: 'Banned',
    description: 'An inorganic compound widely used as a white pigment in food, cosmetics, and paints. In food, it is used to whiten and brighten products like candies, pastries, coffee creamers, and cake decorations.',
    healthRisks: [
      'Genotoxicity (potential to damage DNA)',
      'Accumulation in tissues over time',
      'Intestinal inflammation and alterations to the gut microbiome',
      'Carcinogenicity concerns when inhaled or ingested in nanoparticle form'
    ],
    commonSources: [
      'Chewing gum',
      'White powdered sugar coatings',
      'Candies and sweets',
      'Coffee creamers',
      'Salad dressings'
    ],
    alternatives: [
      'Calcium carbonate',
      'Rice starch',
      'Natural food-grade starches'
    ],
    scientificReferences: [
      'EFSA Panel on Food Additives and Flavourings (FAF), 2021: Safety assessment of titanium dioxide (E171) as a food additive.',
      'IARC Monographs on the Evaluation of Carcinogenic Risks to Humans: Titanium Dioxide (Volume 93).'
    ]
  },
  'bha': {
    id: 'bha',
    name: 'Butylated Hydroxyanisole (BHA)',
    aliases: ['E320', 'BHA'],
    category: 'Preservative',
    toxicityLevel: 'High',
    fdaStatus: 'Approved',
    euStatus: 'Restricted',
    description: 'A synthetic antioxidant used to prevent fats and oils in food from oxidizing and becoming rancid. It is frequently paired with BHT.',
    healthRisks: [
      'Endocrine disruption (mimics estrogen)',
      'Anticipated human carcinogen (classified by NTP)',
      'Allergic reactions and skin sensitization',
      'Potential liver and kidney toxicity at high doses'
    ],
    commonSources: [
      'Potato chips and snack foods',
      'Lard and vegetable oils',
      'Cereal and grain products',
      'Chewing gum',
      'Preserved meats'
    ],
    alternatives: [
      'Tocopherols (Vitamin E)',
      'Ascorbic acid (Vitamin C)',
      'Rosemary extract'
    ],
    scientificReferences: [
      'National Toxicology Program (NTP) Report on Carcinogens: Butylated Hydroxyanisole.',
      'European Commission Endocrine Disruption Database evaluation of BHA.'
    ]
  },
  'bht': {
    id: 'bht',
    name: 'Butylated Hydroxytoluene (BHT)',
    aliases: ['E321', 'BHT'],
    category: 'Preservative',
    toxicityLevel: 'Moderate',
    fdaStatus: 'Approved',
    euStatus: 'Restricted',
    description: 'A synthetic antioxidant chemically similar to BHA, used to preserve freshness, color, and flavor in fat-containing foods.',
    healthRisks: [
      'Endocrine disruption concerns',
      'Liver and thyroid issues in animal studies',
      'Hypersensitivity and allergic reactions'
    ],
    commonSources: [
      'Breakfast cereals',
      'Shortening and vegetable oils',
      'Dehydrated potato flakes',
      'Enriched rice products',
      'Packaging materials (migrates into food)'
    ],
    alternatives: [
      'Mixed tocopherols',
      'Rosemary extract',
      'Citric acid'
    ],
    scientificReferences: [
      'Joint FAO/WHO Expert Committee on Food Additives (JECFA) evaluation of BHT.',
      'European Food Safety Authority (EFSA) scientific opinion on BHT re-evaluation.'
    ]
  },
  'glyphosate': {
    id: 'glyphosate',
    name: 'Glyphosate',
    aliases: ['Roundup', 'N-(phosphonomethyl)glycine'],
    category: 'Pesticide/Contaminant',
    toxicityLevel: 'High',
    fdaStatus: 'Approved',
    euStatus: 'Approved',
    description: 'A broad-spectrum systemic herbicide used to kill weeds, especially on genetically modified crops (Roundup Ready) and as a pre-harvest desiccant on wheat, oats, and barley.',
    healthRisks: [
      'Classified as "probably carcinogenic to humans" by IARC (Group 2A)',
      'Disruption of the gut microbiome (acts as an antimicrobial)',
      'Endocrine disruption and reproductive toxicity concerns',
      'Kidney and liver damage from chronic low-dose exposure'
    ],
    commonSources: [
      'Non-organic oat products (oatmeal, oat milk)',
      'Wheat-based foods (bread, pasta, crackers)',
      'Legumes and lentils',
      'Genetically modified soy and corn products'
    ],
    alternatives: [
      'Organic farming practices',
      'Mechanical weeding',
      'Natural bio-herbicides'
    ],
    scientificReferences: [
      'International Agency for Research on Cancer (IARC) Monograph 112: Glyphosate.',
      'EPA Glyphosate Interim Registration Review Decision.'
    ]
  },
  'potassium-bromate': {
    id: 'potassium-bromate',
    name: 'Potassium Bromate',
    aliases: ['E924', 'Bromated flour'],
    category: 'Flour Treatment Agent',
    toxicityLevel: 'Very High',
    fdaStatus: 'Approved',
    euStatus: 'Banned',
    description: 'A powerful oxidizing agent used to mature flour and strengthen dough, allowing it to rise higher and bake more uniformly. While theoretically baked out, residues can remain if not baked properly.',
    healthRisks: [
      'Classified as a Group 2B (possibly carcinogenic to humans) carcinogen',
      'Renal (kidney) damage and nephrotoxicity',
      'DNA damage and oxidative stress',
      'Thyroid dysfunction'
    ],
    commonSources: [
      'Commercial white breads',
      'Pizza crusts',
      'Buns and rolls',
      'Crackers'
    ],
    alternatives: [
      'Ascorbic acid (Vitamin C)',
      'Enzymes (amylases, hemicellulases)',
      'Longer natural fermentation times'
    ],
    scientificReferences: [
      'IARC Monograph on Potassium Bromate.',
      'CSPI (Center for Science in the Public Interest) petition to ban potassium bromate.'
    ]
  },
  'azodicarbonamide': {
    id: 'azodicarbonamide',
    name: 'Azodicarbonamide (ADA)',
    aliases: ['E927a', 'ADA', 'Yoga mat chemical'],
    category: 'Flour Treatment Agent',
    toxicityLevel: 'Moderate',
    fdaStatus: 'Approved',
    euStatus: 'Banned',
    description: 'A chemical foaming agent and dough conditioner used to bleach flour and make bread dough more elastic and resilient.',
    healthRisks: [
      'Breakdown products include semicarbazide (a known carcinogen in animals)',
      'Respiratory issues, asthma, and allergies (primarily an occupational hazard for bakers)',
      'Potential immune system sensitivity'
    ],
    commonSources: [
      'Fast food buns',
      'Packaged sliced breads',
      'Frozen pizza dough',
      'Commercial pastries'
    ],
    alternatives: [
      'Ascorbic acid',
      'Enzymatic dough conditioners',
      'Unbleached flour'
    ],
    scientificReferences: [
      'World Health Organization (WHO) Concise International Chemical Assessment Document 16: Azodicarbonamide.',
      'EFSA opinion on the presence of semicarbazide (SEM) in food.'
    ]
  },
  'aspartame': {
    id: 'aspartame',
    name: 'Aspartame',
    aliases: ['E951', 'NutraSweet', 'Equal'],
    category: 'Sweetener',
    toxicityLevel: 'Moderate',
    fdaStatus: 'Approved',
    euStatus: 'Approved',
    description: 'An artificial, non-saccharide sweetener used as a sugar substitute in low-calorie foods and beverages. It is approximately 200 times sweeter than sucrose.',
    healthRisks: [
      'Classified as "possibly carcinogenic to humans" (Group 2B) by IARC in 2023',
      'Dangerous for individuals with phenylketonuria (PKU) due to phenylalanine content',
      'Anecdotal reports of headaches, migraines, and mood alterations',
      'Potential metabolic and gut microbiome alterations'
    ],
    commonSources: [
      'Diet sodas and zero-sugar drinks',
      'Sugar-free chewing gum',
      'Tabletop sweeteners',
      'Light yogurts',
      'Sugar-free gelatin and puddings'
    ],
    alternatives: [
      'Stevia leaf extract (Rebaudioside A)',
      'Monk fruit extract',
      'Allulose',
      'Erythritol'
    ],
    scientificReferences: [
      'IARC and JECFA Joint Statement on Aspartame Hazard and Risk Assessment (2023).',
      'European Food Safety Authority (EFSA) Scientific Opinion on the re-evaluation of aspartame (2013).'
    ]
  },
  'propylparaben': {
    id: 'propylparaben',
    name: 'Propylparaben',
    aliases: ['E216', 'Propyl p-hydroxybenzoate', 'Propyl paraben'],
    category: 'Preservative',
    toxicityLevel: 'High',
    fdaStatus: 'GRAS',
    euStatus: 'Banned',
    description: 'A paraben-based preservative used to prevent the growth of mold, yeast, and bacteria in food and cosmetics. It occurs naturally in some plants but is synthetically produced for commercial use.',
    healthRisks: [
      'Endocrine disruption (weak estrogenic activity)',
      'Decreased sperm counts and reproductive toxicity in animal studies',
      'Allergic contact dermatitis'
    ],
    commonSources: [
      'Tortillas and wraps',
      'Muffins and pre-packaged baked goods',
      'Food coloring formulations',
      'Processed fillings and syrups'
    ],
    alternatives: [
      'Sorbic acid',
      'Potassium sorbate',
      'Natural fermentation/vinegar'
    ],
    scientificReferences: [
      'European Commission Scientific Committee on Consumer Products (SCCP) opinion on parabens.',
      'Environmental Working Group (EWG) analysis of parabens in food.'
    ]
  },
  'red-40': {
    id: 'red-40',
    name: 'Red 40 (Allura Red AC)',
    aliases: ['E129', 'Allura Red', 'FD&C Red No. 40'],
    category: 'Colorant',
    toxicityLevel: 'Moderate',
    fdaStatus: 'Approved',
    euStatus: 'Restricted',
    description: 'A synthetic coal-tar-derived azo dye used to impart a vibrant red color to foods, drugs, and cosmetics. It is one of the most widely used food dyes.',
    healthRisks: [
      'Hyperactivity and behavioral issues in children (requires warning label in the EU)',
      'Contamination with trace carcinogens (like benzidine)',
      'Allergic reactions, hives, and asthma flare-ups in sensitive individuals',
      'Potential DNA damage in the colon of animal models'
    ],
    commonSources: [
      'Red candies, gummies, and licorice',
      'Sports drinks and sodas',
      'Breakfast cereals',
      'Gelatin desserts',
      'Flavored milks and yogurts'
    ],
    alternatives: [
      'Beet juice concentrate',
      'Black carrot extract',
      'Carmine (cochineal)',
      'Elderberry juice'
    ],
    scientificReferences: [
      'The Southampton Study (McCann et al., 2007) on food additives and hyperactive behavior in children.',
      'FDA Food Advisory Committee review of certified food color additives and hyperactivity.'
    ]
  },
  'yellow-5': {
    id: 'yellow-5',
    name: 'Yellow 5 (Tartrazine)',
    aliases: ['E102', 'Tartrazine', 'FD&C Yellow No. 5'],
    category: 'Colorant',
    toxicityLevel: 'Moderate',
    fdaStatus: 'Approved',
    euStatus: 'Restricted',
    description: 'A synthetic azo dye used to color foods, beverages, pharmaceuticals, and cosmetics a bright yellow or green-yellow shade.',
    healthRisks: [
      'Hyperactivity and attention deficits in children (EU warning label required)',
      'Severe allergic reactions, particularly in individuals with aspirin sensitivity',
      'Hives, asthma, and nasal congestion',
      'Potential genotoxic effects at high concentrations'
    ],
    commonSources: [
      'Yellow candies and sweets',
      'Soft drinks and energy drinks',
      'Macaroni and cheese mixes',
      'Pickles and mustards',
      'Chips and savory snacks'
    ],
    alternatives: [
      'Turmeric extract (curcumin)',
      'Beta-carotene',
      'Annatto extract',
      'Saffron'
    ],
    scientificReferences: [
      'EFSA Scientific Opinion on the re-evaluation of Tartrazine (E 102).',
      'Studies on Tartrazine-induced hypersensitivity reactions.'
    ]
  },
  'sodium-benzoate': {
    id: 'sodium-benzoate',
    name: 'Sodium Benzoate',
    aliases: ['E211', 'Benzoate of soda'],
    category: 'Preservative',
    toxicityLevel: 'Moderate',
    fdaStatus: 'Approved',
    euStatus: 'Approved',
    description: 'The sodium salt of benzoic acid, widely used as a preservative in acidic foods and beverages to inhibit the growth of mold, yeast, and bacteria.',
    healthRisks: [
      'Can react with Vitamin C (ascorbic acid) to form Benzene, a known human carcinogen',
      'Linked to increased hyperactivity in children when combined with artificial food dyes',
      'Oxidative stress and cellular damage in laboratory studies'
    ],
    commonSources: [
      'Carbonated soft drinks',
      'Fruit juices and syrups',
      'Salad dressings and condiments',
      'Pickled foods',
      'Soy sauce'
    ],
    alternatives: [
      'Potassium sorbate',
      'Citric acid',
      'Pasteurization/sterile packaging'
    ],
    scientificReferences: [
      'FDA survey of benzene in soft drinks and other beverages.',
      'McCann et al. (2007) study on food additives and hyperactivity.'
    ]
  },
  'carrageenan': {
    id: 'carrageenan',
    name: 'Carrageenan',
    aliases: ['E407', 'Irish moss extract', 'Chondrus extract'],
    category: 'Emulsifier',
    toxicityLevel: 'Moderate',
    fdaStatus: 'Approved',
    euStatus: 'Restricted',
    description: 'A family of natural water-soluble polysaccharides extracted from red edible seaweeds. It is used as a thickener, gelling agent, and stabilizer in dairy and plant-based dairy alternatives.',
    healthRisks: [
      'Gastrointestinal inflammation and ulceration',
      'Degraded carrageenan (poligeenan) is a known carcinogen and inflammatory agent; concerns exist about food-grade carrageenan degrading in the stomach',
      'Glucose intolerance and insulin resistance in animal models'
    ],
    commonSources: [
      'Almond milk, soy milk, and coconut milk',
      'Ice cream and whipping cream',
      'Deli meats (used to retain water)',
      'Yogurt and cottage cheese',
      'Infant formula (banned in infant formula in the EU)'
    ],
    alternatives: [
      'Guar gum',
      'Xanthan gum',
      'Locust bean gum',
      'Gellan gum'
    ],
    scientificReferences: [
      'Tobacman, J. K. (2001). Review of harmful gastrointestinal effects of carrageenan on animal experiments.',
      'EFSA Panel on Food Additives and Nutrient Sources added to Food (ANS) re-evaluation of carrageenan (2018).'
    ]
  },
  'high-fructose-corn-syrup': {
    id: 'high-fructose-corn-syrup',
    name: 'High Fructose Corn Syrup (HFCS)',
    aliases: ['HFCS', 'Isoglucose', 'Glucose-fructose syrup'],
    category: 'Sweetener',
    toxicityLevel: 'Moderate',
    fdaStatus: 'GRAS',
    euStatus: 'Restricted',
    description: 'A liquid sweetener made from cornstarch that has undergone enzymatic processing to convert some of its glucose into fructose. It is cheaper and sweeter than sucrose.',
    healthRisks: [
      'Increased risk of obesity, type 2 diabetes, and metabolic syndrome',
      'Non-alcoholic fatty liver disease (NAFLD) due to rapid fructose metabolism in the liver',
      'Elevated triglycerides and cardiovascular disease risk',
      'Increased visceral fat accumulation'
    ],
    commonSources: [
      'Sugar-sweetened sodas and juices',
      'Store-bought breads and buns',
      'Condiments (ketchup, BBQ sauce)',
      'Canned fruits',
      'Breakfast bars and cereals'
    ],
    alternatives: [
      'Raw honey',
      'Pure maple syrup',
      'Organic cane sugar',
      'Whole fruit purees'
    ],
    scientificReferences: [
      'Stanhope, K. L., et al. (2009). Consuming fructose-sweetened beverages increases visceral adiposity and lipids.',
      'Bray, G. A., et al. (2004). Consumption of high-fructose corn syrup in beverages may play a role in the epidemic of obesity.'
    ]
  },
  'monosodium-glutamate': {
    id: 'monosodium-glutamate',
    name: 'Monosodium Glutamate (MSG)',
    aliases: ['E621', 'Sodium glutamate', 'Yeast extract', 'Hydrolyzed protein'],
    category: 'Flavor Enhancer',
    toxicityLevel: 'Low',
    fdaStatus: 'GRAS',
    euStatus: 'Approved',
    description: 'The sodium salt of glutamic acid, an abundant amino acid. It is used to impart a savory, "umami" flavor to foods.',
    healthRisks: [
      '"MSG Symptom Complex" (headaches, sweating, numbness, flushing) in highly sensitive individuals',
      'Excitotoxicity concerns at extremely high, isolated doses (though dietary absorption is highly regulated by the gut)',
      'May encourage overeating by artificially enhancing palatability'
    ],
    commonSources: [
      'Ramen noodles and instant soups',
      'Savory potato chips and snacks',
      'Fast food items',
      'Chinese-American restaurant dishes',
      'Processed meats and bouillons'
    ],
    alternatives: [
      'Sea salt',
      'Nutritional yeast',
      'Mushroom powder',
      'Naturally fermented soy sauce'
    ],
    scientificReferences: [
      'FDA Questions and Answers on Monosodium glutamate (MSG).',
      'JECFA safety evaluation of MSG (concluded no numerical ADI is necessary).'
    ]
  },
  'rbst-rbgh': {
    id: 'rbst-rbgh',
    name: 'Recombinant Bovine Somatotropin (rBST / rBGH)',
    aliases: ['rBST', 'rBGH', 'Bovine growth hormone', 'Posilac'],
    category: 'Hormone/Antibiotic',
    toxicityLevel: 'High',
    fdaStatus: 'Approved',
    euStatus: 'Banned',
    description: 'A synthetic version of a natural hormone produced by cows, injected into dairy cattle to increase milk production.',
    healthRisks: [
      'Increases levels of Insulin-like Growth Factor-1 (IGF-1) in milk, which is linked to breast, prostate, and colon cancers in humans',
      'Increases mastitis (udder infections) in cows, leading to higher antibiotic use and potential antibiotic residue in milk',
      'Allergic and endocrine disruption concerns'
    ],
    commonSources: [
      'Non-organic dairy products (milk, cheese, butter, yogurt) in the US (unless labeled "rBST-free")'
    ],
    alternatives: [
      'Organic dairy products',
      'Dairy products labeled "rBST-free" or "No artificial hormones"',
      'Plant-based milk alternatives'
    ],
    scientificReferences: [
      'European Commission Report on Public Health Aspects of the Use of rBST.',
      'American Cancer Society statement on Recombinant Bovine Growth Hormone.'
    ]
  }
};

/**
 * Retrieves an ingredient by its unique ID.
 * @param id The unique identifier of the ingredient (e.g., 'titanium-dioxide').
 */
export function getIngredientById(id: string): IngredientDetails | undefined {
  return ingredientDatabase[id.toLowerCase()];
}

/**
 * Searches the database for ingredients matching a query string in their name, aliases, or description.
 * @param query The search term.
 */
export function searchIngredients(query: string): IngredientDetails[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  return Object.values(ingredientDatabase).filter((ingredient) => {
    return (
      ingredient.name.toLowerCase().includes(normalizedQuery) ||
      ingredient.aliases.some((alias) => alias.toLowerCase().includes(normalizedQuery)) ||
      ingredient.description.toLowerCase().includes(normalizedQuery)
    );
  });
}

/**
 * Filters ingredients by their toxicity level.
 * @param level The toxicity level to filter by.
 */
export function getIngredientsByToxicity(level: ToxicityLevel): IngredientDetails[] {
  return Object.values(ingredientDatabase).filter(
    (ingredient) => ingredient.toxicityLevel === level
  );
}

/**
 * Filters ingredients by their category.
 * @param category The category to filter by.
 */
export function getIngredientsByCategory(category: IngredientCategory): IngredientDetails[] {
  return Object.values(ingredientDatabase).filter(
    (ingredient) => ingredient.category === category
  );
}

/**
 * Filters ingredients that have a regulatory discrepancy (e.g., approved in FDA but banned in EU).
 */
export function getRegulatoryDiscrepancies(): IngredientDetails[] {
  return Object.values(ingredientDatabase).filter(
    (ingredient) => ingredient.fdaStatus !== ingredient.euStatus
  );
}

/**
 * Returns all ingredients in the database.
 */
export function getAllIngredients(): IngredientDetails[] {
  return Object.values(ingredientDatabase);
}