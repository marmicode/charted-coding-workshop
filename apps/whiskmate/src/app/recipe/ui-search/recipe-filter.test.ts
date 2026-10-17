import { TestBed } from '@angular/core/testing';
import { describe, it, vi } from 'vitest';
import { RecipeFilter } from './recipe-filter.ng';

describe(RecipeFilter.name, () => {
  it('emits the selected course', async () => {
    const { fixture, filterChange } = mountRecipeFilter();
    await fixture.whenStable();

    clickCourse(fixture.nativeElement, 'starter');
    await fixture.whenStable();

    expect(filterChange).toHaveBeenLastCalledWith({
      keywords: '',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: ['starter'],
      favoritesOnly: false,
    });
  });

  it('emits every selected course', async () => {
    const { fixture, filterChange } = mountRecipeFilter();
    await fixture.whenStable();

    clickCourse(fixture.nativeElement, 'main');
    await fixture.whenStable();
    clickCourse(fixture.nativeElement, 'dessert');
    await fixture.whenStable();

    expect(filterChange).toHaveBeenLastCalledWith({
      keywords: '',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: ['main', 'dessert'],
      favoritesOnly: false,
    });
  });

  it('emits no course once the course is unselected', async () => {
    const { fixture, filterChange } = mountRecipeFilter();
    await fixture.whenStable();

    clickCourse(fixture.nativeElement, 'main');
    await fixture.whenStable();
    clickCourse(fixture.nativeElement, 'main');
    await fixture.whenStable();

    expect(filterChange).toHaveBeenCalledTimes(2);
    expect(filterChange).toHaveBeenLastCalledWith({
      keywords: '',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: [],
      favoritesOnly: false,
    });
  });
});

function mountRecipeFilter() {
  const fixture = TestBed.createComponent(RecipeFilter);
  const filterChange = vi.fn();
  fixture.componentInstance.filter.subscribe(filterChange);
  return { fixture, filterChange };
}

function clickCourse(root: HTMLElement, course: string): void {
  const toggle = [...root.querySelectorAll('mat-button-toggle')].find(
    (el) => el.textContent?.trim() === course,
  );
  const button = toggle?.querySelector('button');
  if (button == null) {
    throw new Error(`Course "${course}" not found.`);
  }
  button.click();
}
