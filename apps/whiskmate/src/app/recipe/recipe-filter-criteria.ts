export interface RecipeFilterCriteria {
  keywords: string;
  maxIngredientCount: number | null;
  maxStepCount: number | null;
  favoritesOnly: boolean;
}

export function createDefaultRecipeFilterCriteria(): RecipeFilterCriteria {
  return {
    keywords: '',
    maxIngredientCount: null,
    maxStepCount: null,
    favoritesOnly: false,
  };
}

export function createRecipeFilterCriteria(
  filter: RecipeFilterCriteria,
): RecipeFilterCriteria {
  return filter;
}
