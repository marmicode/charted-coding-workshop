import { TestBed } from '@angular/core/testing';
import { describe, it } from 'vitest';
import { createRecipe } from '@whiskmate/shared-recipe/model';
import type { Weekday } from '@whiskmate/shared/model';
import { RecipePreview } from './recipe-preview.ng';

const shakshuka = createRecipe({
  id: 'shakshuka',
  name: 'Shakshuka',
  description: null,
  ingredients: [],
  pictureUri: 'https://example.com/shakshuka.jpg',
  steps: [],
});

function buttonByLabel(
  root: ParentNode,
  label: string,
): HTMLButtonElement | undefined {
  return [...root.querySelectorAll('button')].find(
    (button) => button.textContent?.trim().toLowerCase() === label,
  );
}

function mountRecipePreview(canAdd = true) {
  const fixture = TestBed.createComponent(RecipePreview);
  fixture.componentRef.setInput('recipe', shakshuka);
  fixture.componentRef.setInput('canAdd', canAdd);
  return fixture;
}

describe(RecipePreview.name, () => {
  it('asks which weekday, then emits it', async () => {
    const fixture = mountRecipePreview();
    let selected: Weekday | undefined;
    fixture.componentInstance.addToMealPlan.subscribe((weekday) => {
      selected = weekday;
    });
    await fixture.whenStable();

    buttonByLabel(fixture.nativeElement, 'add to meal plan')?.click();
    await fixture.whenStable();

    expect(
      fixture.nativeElement.querySelector('wm-weekday-picker'),
    ).not.toBeNull();

    buttonByLabel(fixture.nativeElement, 'wednesday')?.click();
    await fixture.whenStable();

    expect(selected).toBe('wednesday');
  });

  it('does not emit when the picker is dismissed', async () => {
    const fixture = mountRecipePreview();
    let emitted = 0;
    fixture.componentInstance.addToMealPlan.subscribe(() => {
      emitted += 1;
    });
    await fixture.whenStable();

    buttonByLabel(fixture.nativeElement, 'add to meal plan')?.click();
    await fixture.whenStable();
    buttonByLabel(fixture.nativeElement, 'dismiss')?.click();
    await fixture.whenStable();

    expect(emitted).toBe(0);
    expect(fixture.nativeElement.querySelector('wm-weekday-picker')).toBeNull();
  });

  it('shows add to meal plan', async () => {
    const fixture = mountRecipePreview();
    await fixture.whenStable();

    expect(
      buttonByLabel(fixture.nativeElement, 'add to meal plan'),
    ).toBeDefined();
  });

  it('disables add when the recipe cannot be added', async () => {
    const fixture = mountRecipePreview(false);
    await fixture.whenStable();

    const addButton = buttonByLabel(fixture.nativeElement, 'add to meal plan');
    expect(addButton?.disabled).toBe(true);

    addButton?.click();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('wm-weekday-picker')).toBeNull();
  });
});
