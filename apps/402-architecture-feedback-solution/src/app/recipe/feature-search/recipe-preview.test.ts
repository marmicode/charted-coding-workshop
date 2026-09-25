import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, it, vi } from 'vitest';
import { RECIPES } from '@whiskmate/recipe/infra';
import { MealPlanStore } from '@whiskmate/shared-meal-plan/domain';
import { LocalStorage, WIP_STORAGE_KEY } from '@whiskmate/shared/infra';
import { RecipePreview } from './recipe-preview.ng';

const shakshuka = RECIPES.find((recipe) => recipe.name === 'Shakshuka');
if (shakshuka == null) {
  throw new Error('Catalog must include Shakshuka.');
}

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

function mountRecipePreview(arrange?: {
  storage?: MemoryStorage;
  beforeCreate?: (store: MealPlanStore) => void;
}): {
  fixture: ReturnType<typeof TestBed.createComponent<RecipePreview>>;
  storage: MemoryStorage;
  store: MealPlanStore;
} {
  TestBed.resetTestingModule();
  const storage = arrange?.storage ?? new MemoryStorage();
  if (arrange?.storage == null) {
    storage.setItem(WIP_STORAGE_KEY, 'true');
  }
  TestBed.overrideProvider(LocalStorage, { useValue: storage });
  const store = TestBed.inject(MealPlanStore);
  arrange?.beforeCreate?.(store);
  const fixture = TestBed.createComponent(RecipePreview);
  fixture.componentRef.setInput('recipe', shakshuka);
  return { fixture, storage, store };
}

describe(RecipePreview.name, () => {
  it('asks which weekday, then assigns it', async () => {
    const { fixture, store } = mountRecipePreview();
    const assign = vi.spyOn(store, 'assign');
    await fixture.whenStable();

    buttonByLabel(fixture.nativeElement, 'add to meal plan')?.click();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('wm-weekday-picker')).not.toBeNull();

    buttonByLabel(fixture.nativeElement, 'wednesday')?.click();
    await fixture.whenStable();

    expect(assign).toHaveBeenCalledWith({
      weekday: 'wednesday',
      recipeId: shakshuka.id,
    });
  });

  it('leaves the plan unchanged when the picker is dismissed', async () => {
    const { fixture, store } = mountRecipePreview();
    const assign = vi.spyOn(store, 'assign');
    await fixture.whenStable();

    buttonByLabel(fixture.nativeElement, 'add to meal plan')?.click();
    await fixture.whenStable();
    buttonByLabel(fixture.nativeElement, 'dismiss')?.click();
    await fixture.whenStable();

    expect(assign).not.toHaveBeenCalled();
  });

  it('hides add to meal plan unless wip is set', async () => {
    const storage = new MemoryStorage();
    const { fixture } = mountRecipePreview({ storage });
    await fixture.whenStable();

    expect(
      buttonByLabel(fixture.nativeElement, 'add to meal plan'),
    ).toBeDefined();

    storage.setItem(WIP_STORAGE_KEY, 'true');
    await fixture.whenStable();

    expect(
      buttonByLabel(fixture.nativeElement, 'add to meal plan'),
    ).toBeDefined();
  });

  it('disables add when the recipe is already planned', async () => {
    const storage = new MemoryStorage();
    storage.setItem(WIP_STORAGE_KEY, 'true');
    const { fixture } = mountRecipePreview({
      storage,
      beforeCreate: (store) => {
        store.assign({ weekday: 'monday', recipeId: shakshuka.id });
      },
    });
    await fixture.whenStable();

    const addButton = buttonByLabel(fixture.nativeElement, 'add to meal plan');
    expect(addButton?.disabled).toBe(true);

    addButton?.click();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('wm-weekday-picker')).toBeNull();
  });

  it('shows add to meal plan with the wip flag removed', async () => {
    const storage = new MemoryStorage();
    const { fixture } = mountRecipePreview({ storage });
    await fixture.whenStable();

    expect(
      buttonByLabel(fixture.nativeElement, 'add to meal plan'),
    ).toBeDefined();
  });
});
