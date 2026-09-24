import { describe, it } from 'vitest';
import { RecipePreview } from './recipe-preview.ng';

describe(RecipePreview.name, () => {
  it.todo('asks which weekday, then assigns it', () => {
    // Arrange `canAdd` true for Shakshuka.
    // Mount `RecipePreview` with Shakshuka.
    // Choose "Add to meal plan".
    // Assert the weekday picker is open.
    // Confirm Wednesday.
    // Assert `assign({ weekday: 'wednesday', recipeId: shakshukaId })` ran.
  });

  it.todo('leaves the plan unchanged when the picker is dismissed', () => {
    // Arrange `canAdd` true.
    // Mount `RecipePreview` with Shakshuka.
    // Open "Add to meal plan", then dismiss the picker.
    // Assert `assign` was not called.
  });

  it.todo('hides add to meal plan unless wip is set', () => {
    // Arrange `canAdd` true and the `wip` flag unset.
    // Mount `RecipePreview` with Shakshuka.
    // Assert "Add to meal plan" is not shown.
    // Set the `wip` flag.
    // Assert "Add to meal plan" is shown.
  });

  it.todo('disables add when the recipe is already planned', () => {
    // Arrange `canAdd({ recipeId: shakshukaId })` false.
    // Mount `RecipePreview` with Shakshuka.
    // Assert "Add to meal plan" is disabled.
    // Assert the weekday picker does not open.
  });
});
