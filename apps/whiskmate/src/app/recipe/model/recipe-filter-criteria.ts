import type { Course } from '@whiskmate/shared-recipe/model';

export interface RecipeFilterCriteria {
  keywords: string;
  maxIngredientCount: number | null;
  maxStepCount: number | null;
  courses: Course[];
  favoritesOnly: boolean;
}

export function createDefaultRecipeFilterCriteria(): RecipeFilterCriteria {
  return {
    keywords: '',
    maxIngredientCount: null,
    maxStepCount: null,
    courses: [],
    favoritesOnly: false,
  };
}

export function createRecipeFilterCriteria(
  filter: RecipeFilterCriteria,
): RecipeFilterCriteria {
  return filter;
}
