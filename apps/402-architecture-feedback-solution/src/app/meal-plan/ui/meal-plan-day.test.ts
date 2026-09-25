import { TestBed } from '@angular/core/testing';
import { describe, it } from 'vitest';
import { RECIPES } from '@whiskmate/recipe/infra';
import { MealPlanDay } from './meal-plan-day.ng';

const shakshuka = RECIPES.find((recipe) => recipe.name === 'Shakshuka');
if (shakshuka == null) {
  throw new Error('Catalog must include Shakshuka.');
}

describe(MealPlanDay.name, () => {
  it('shows the empty state', async () => {
    const fixture = TestBed.createComponent(MealPlanDay);
    fixture.componentRef.setInput('weekday', 'monday');
    fixture.componentRef.setInput('recipe', null);
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent ?? '';
    expect(text).toContain('Monday');
    expect(text.toLowerCase()).toContain('no recipe is planned');
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('shows the recipe', async () => {
    const fixture = TestBed.createComponent(MealPlanDay);
    fixture.componentRef.setInput('weekday', 'monday');
    fixture.componentRef.setInput('recipe', shakshuka);
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent ?? '';
    const picture = fixture.nativeElement.querySelector('img');
    expect(text).toContain('Shakshuka');
    expect(picture?.getAttribute('src')).toBe(shakshuka.pictureUri);
  });

  it('emits remove', async () => {
    const fixture = TestBed.createComponent(MealPlanDay);
    fixture.componentRef.setInput('weekday', 'monday');
    fixture.componentRef.setInput('recipe', shakshuka);
    let emitted = 0;
    fixture.componentInstance.remove.subscribe(() => {
      emitted += 1;
    });
    await fixture.whenStable();

    fixture.nativeElement.querySelector('button')?.click();
    await fixture.whenStable();

    expect(emitted).toBe(1);
  });
});
