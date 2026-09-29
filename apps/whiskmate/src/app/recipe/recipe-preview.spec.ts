import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { MealPlanStore } from '../meal-plan/meal-plan-store';
import { LocalStorage } from '../shared/local-storage';
import { RECIPES } from './recipe-data';
import { RecipePreview } from './recipe-preview.ng';

describe(RecipePreview.name, () => {
  it.todo('asks which weekday, then assigns it', async () => {
    const shakshuka = RECIPES.find((recipe) => recipe.id === 'shakshuka')!;
    const items = new Map<string, string>();
    const assign = vi.spyOn(MealPlanStore.prototype, 'assign');

    TestBed.resetTestingModule();
    TestBed.overrideProvider(LocalStorage, {
      useValue: {
        getItem: (key: string) => items.get(key) ?? null,
        setItem: (key: string, value: string) => {
          items.set(key, value);
        },
      } satisfies LocalStorage,
    });

    const fixture = TestBed.createComponent(RecipePreview);
    fixture.componentRef.setInput('recipe', shakshuka);
    await fixture.whenStable();

    const add = [...fixture.nativeElement.querySelectorAll('button')].find(
      (button) => button.textContent?.includes('Add to meal plan'),
    );
    add?.click();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('wm-weekday-picker')).not.toBeNull();

    const wednesday = [
      ...fixture.nativeElement.querySelectorAll('button'),
    ].find((button) => button.textContent?.trim() === 'Wednesday');
    wednesday?.click();
    await fixture.whenStable();

    expect(assign).toHaveBeenCalledWith({
      weekday: 'wednesday',
      recipeId: shakshuka.id,
    });
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
