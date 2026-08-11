export interface Ingredient {
  id: string;
  name: string;
  glycemicIndex: number;
  insulinIndex: number;
  fiberContent: number; // grams per 100g
  proteinContent: number; // grams per 100g
  fatContent: number; // grams per 100g
  netCarbs: number; // grams per 100g
}

/**
 * Calculates the Metabolic Impact Score (MIS) for a given ingredient.
 * The score is a weighted representation of how an ingredient affects blood glucose and insulin.
 * 
 * Formula: (GI * 0.4) + (II * 0.4) - (Fiber * 2) - (Protein * 0.5)
 * Lower scores indicate a more stable metabolic response.
 */
export function calculateMetabolicImpact(ingredient: Ingredient): number {
  const giWeight = 0.4;
  const iiWeight = 0.4;
  const fiberMitigation = 2.0;
  const proteinMitigation = 0.5;

  const score = 
    (ingredient.glycemicIndex * giWeight) + 
    (ingredient.insulinIndex * iiWeight) - 
    (ingredient.fiberContent * fiberMitigation) - 
    (ingredient.proteinContent * proteinMitigation);

  return Math.max(0, parseFloat(score.toFixed(2)));
}

/**
 * Calculates the total metabolic load for a recipe or meal.
 * Weighted by the quantity of each ingredient.
 */
export function calculateMealMetabolicLoad(
  ingredients: { ingredient: Ingredient; weightInGrams: number }[]
): number {
  return ingredients.reduce((total, item) => {
    const impactPerGram = calculateMetabolicImpact(item.ingredient) / 100;
    return total + (impactPerGram * item.weightInGrams);
  }, 0);
}

/**
 * Determines the metabolic category of an ingredient based on its MIS.
 */
export function getMetabolicCategory(score: number): 'Optimal' | 'Moderate' | 'High' {
  if (score < 10) return 'Optimal';
  if (score < 25) return 'Moderate';
  return 'High';
}

/**
 * Estimates the net glycemic load of an ingredient.
 */
export function estimateGlycemicLoad(ingredient: Ingredient, servingSizeGrams: number): number {
  const netCarbsPerServing = (ingredient.netCarbs * servingSizeGrams) / 100;
  return (netCarbsPerServing * ingredient.glycemicIndex) / 100;
}