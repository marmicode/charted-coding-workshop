import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WIP_STORAGE_KEY } from '../authz/wip.guard';
import { WeekdayAssignments } from '../meal-plan/meal-plan';
import { MealPlanStore } from '../meal-plan/meal-plan-store';
import { LocalStorage } from '../shared/local-storage';
import { RECIPES } from './recipe-data';
import { RecipePreview } from './recipe-preview.ng';

describe(RecipePreview.name, () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('asks which weekday, then assigns it', async () => {
    const shakshuka = RECIPES.find((recipe) => recipe.id === 'shakshuka')!;
    const items = new Map<string, string>([[WIP_STORAGE_KEY, 'true']]);
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

  it('leaves the plan unchanged when the picker is dismissed', async () => {
    const shakshuka = RECIPES.find((recipe) => recipe.id === 'shakshuka')!;
    const items = new Map<string, string>([[WIP_STORAGE_KEY, 'true']]);
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

    const dismiss = [...fixture.nativeElement.querySelectorAll('button')].find(
      (button) => button.textContent?.trim() === 'Dismiss',
    );
    dismiss?.click();
    await fixture.whenStable();

    expect(assign).not.toHaveBeenCalled();
  });

  it('hides add to meal plan unless wip is set', async () => {
    const shakshuka = RECIPES.find((recipe) => recipe.id === 'shakshuka')!;
    const storedValues = signal<Record<string, string>>({});
    const localStorage: LocalStorage = {
      getItem: (key) => storedValues()[key] ?? null,
      setItem: (key, value) => {
        storedValues.update((current) => ({ ...current, [key]: value }));
      },
    };

    TestBed.resetTestingModule();
    TestBed.overrideProvider(LocalStorage, { useValue: localStorage });

    const fixture = TestBed.createComponent(RecipePreview);
    fixture.componentRef.setInput('recipe', shakshuka);
    await fixture.whenStable();

    const addButton = () =>
      [...fixture.nativeElement.querySelectorAll('button')].find((button) =>
        button.textContent?.includes('Add to meal plan'),
      );

    expect(addButton()).toBeTruthy();

    localStorage.setItem(WIP_STORAGE_KEY, 'true');
    await fixture.whenStable();

    expect(addButton()).toBeTruthy();
  });

  it('disables add when the recipe is already planned', async () => {
    const shakshuka = RECIPES.find((recipe) => recipe.id === 'shakshuka')!;
    const storedWeek: WeekdayAssignments = {
      monday: null,
      tuesday: null,
      wednesday: shakshuka.id,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    };
    const items = new Map<string, string>([
      [WIP_STORAGE_KEY, 'true'],
      ['whiskmate:meal-plan', JSON.stringify(storedWeek)],
    ]);

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
    ) as HTMLButtonElement;

    add.click();
    await fixture.whenStable();

    expect(add.disabled).toBe(true);
    expect(fixture.nativeElement.querySelector('wm-weekday-picker')).toBeNull();
  });

  it('shows add to meal plan with the wip flag removed', async () => {
    const shakshuka = RECIPES.find((recipe) => recipe.id === 'shakshuka')!;
    const items = new Map<string, string>();

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

    expect(add).toBeTruthy();
  });
});
