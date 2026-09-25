import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, it, vi } from 'vitest';
import { RecipePreview } from '@whiskmate/recipe/ui';
import { MealPlanStore } from '@whiskmate/shared-meal-plan/domain';
import { LocalStorage } from '@whiskmate/shared/infra';
import { RecipeSearch } from './recipe-search.ng';

class MemoryStorage implements LocalStorage {
  private readonly items = signal(new Map<string, string>());

  setItem(key: string, value: string): void {
    this.items.update((items) => new Map(items).set(key, value));
  }

  getItem(key: string): string | null {
    return this.items().get(key) ?? null;
  }
}

function buttonByLabel(
  root: ParentNode,
  label: string,
): HTMLButtonElement | undefined {
  return [...root.querySelectorAll('button')].find(
    (button) => button.textContent?.trim().toLowerCase() === label,
  );
}

function mountRecipeSearch(): {
  fixture: ReturnType<typeof TestBed.createComponent<RecipeSearch>>;
  store: MealPlanStore;
} {
  TestBed.resetTestingModule();
  TestBed.overrideProvider(LocalStorage, { useValue: new MemoryStorage() });
  const store = TestBed.inject(MealPlanStore);
  const fixture = TestBed.createComponent(RecipeSearch);
  return { fixture, store };
}

function shakshukaPreview(fixture: {
  debugElement: ReturnType<
    typeof TestBed.createComponent<RecipeSearch>
  >['debugElement'];
}) {
  return fixture.debugElement
    .queryAll(By.directive(RecipePreview))
    .find((preview) => preview.componentInstance.recipe().name === 'Shakshuka');
}

describe(RecipeSearch.name, () => {
  it('asks which weekday, then assigns it', async () => {
    const { fixture, store } = mountRecipeSearch();
    const assign = vi.spyOn(store, 'assign');
    await fixture.whenStable();

    const preview = shakshukaPreview(fixture);
    const recipeId = preview?.componentInstance.recipe().id;
    buttonByLabel(preview?.nativeElement ?? fixture.nativeElement, 'add to meal plan')?.click();
    await fixture.whenStable();
    buttonByLabel(preview?.nativeElement ?? fixture.nativeElement, 'wednesday')?.click();
    await fixture.whenStable();

    expect(assign).toHaveBeenCalledWith({
      weekday: 'wednesday',
      recipeId,
    });
  });

  it('leaves the plan unchanged when the picker is dismissed', async () => {
    const { fixture, store } = mountRecipeSearch();
    const assign = vi.spyOn(store, 'assign');
    await fixture.whenStable();

    const preview = shakshukaPreview(fixture);
    buttonByLabel(preview?.nativeElement ?? fixture.nativeElement, 'add to meal plan')?.click();
    await fixture.whenStable();
    buttonByLabel(preview?.nativeElement ?? fixture.nativeElement, 'dismiss')?.click();
    await fixture.whenStable();

    expect(assign).not.toHaveBeenCalled();
  });

  it('disables add when the recipe is already planned', async () => {
    const { fixture, store } = mountRecipeSearch();
    await fixture.whenStable();

    const preview = shakshukaPreview(fixture);
    const recipeId = preview?.componentInstance.recipe().id ?? '';
    store.assign({ weekday: 'monday', recipeId });
    await fixture.whenStable();

    const addButton = buttonByLabel(
      preview?.nativeElement ?? fixture.nativeElement,
      'add to meal plan',
    );
    expect(addButton?.disabled).toBe(true);

    addButton?.click();
    await fixture.whenStable();

    expect(preview?.nativeElement.querySelector('wm-weekday-picker')).toBeNull();
  });
});
