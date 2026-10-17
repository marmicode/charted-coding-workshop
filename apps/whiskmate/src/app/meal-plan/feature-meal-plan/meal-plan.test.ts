import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, vi } from 'vitest';
import { RecipeRepository } from '@whiskmate/recipe/infra';
import {
  MealPlanStore,
  type WeekdayAssignments,
} from '@whiskmate/shared-meal-plan/domain';
import type { Recipe } from '@whiskmate/shared-recipe/model';
import { LocalStorage } from '@whiskmate/shared/infra';
import { MealPlan } from './meal-plan.ng';

const shakshuka: Recipe = {
  id: 'shakshuka',
  course: 'main',
  name: 'Shakshuka',
  description: null,
  pictureUri: 'https://example.com/shakshuka.jpg',
  ingredients: [],
  steps: [],
};

const cheesecake: Recipe = {
  id: 'lemon-ricotta-cheesecake',
  course: 'dessert',
  name: 'Lemon and Ricotta Cheesecake',
  description: null,
  pictureUri: 'https://example.com/cheesecake.jpg',
  ingredients: [],
  steps: [],
};

const emptyAssignments: WeekdayAssignments = {
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: null,
  sunday: null,
};

describe(MealPlan.name, () => {
  it('does not fetch any recipe when nothing is planned', async () => {
    const { fixture, findById } = mountMealPlan(emptyAssignments);
    await fixture.whenStable();

    expect(findById).not.toHaveBeenCalled();
    expect(dayElements(fixture.nativeElement)).toHaveLength(7);
    for (const day of dayElements(fixture.nativeElement)) {
      expect(day.textContent?.toLowerCase()).toContain('no recipe is planned');
    }
  });

  it('fetches the planned recipe by id', async () => {
    const { fixture, findById } = mountMealPlan({
      ...emptyAssignments,
      monday: 'shakshuka',
    });
    findById.mockReturnValue(of(shakshuka));
    await fixture.whenStable();

    expect(findById).toHaveBeenCalledExactlyOnceWith({ id: 'shakshuka' });
  });

  it('fetches each planned recipe', async () => {
    const { fixture, findById } = mountMealPlan({
      ...emptyAssignments,
      monday: 'shakshuka',
      friday: 'lemon-ricotta-cheesecake',
    });
    findById.mockImplementation(({ id }) =>
      of(id === 'shakshuka' ? shakshuka : cheesecake),
    );
    await fixture.whenStable();

    expect(findById).toHaveBeenCalledTimes(2);
    expect(findById).toHaveBeenNthCalledWith(1, { id: 'shakshuka' });
    expect(findById).toHaveBeenNthCalledWith(2, {
      id: 'lemon-ricotta-cheesecake',
    });
  });

  it('shows the name and picture of a planned recipe', async () => {
    const { fixture, findById } = mountMealPlan({
      ...emptyAssignments,
      monday: 'shakshuka',
    });
    findById.mockReturnValue(of(shakshuka));
    await fixture.whenStable();

    const [monday, ...otherDays] = dayElements(fixture.nativeElement);
    expect(findById).toHaveBeenCalledWith({ id: 'shakshuka' });
    expect(monday?.textContent).toContain('Shakshuka');
    expect(monday?.querySelector('img')?.getAttribute('src')).toBe(
      'https://example.com/shakshuka.jpg',
    );
    for (const day of otherDays) {
      expect(day.textContent?.toLowerCase()).toContain('no recipe is planned');
    }
  });

  it('renders a missing recipe as an empty day', async () => {
    const { fixture, findById } = mountMealPlan({
      ...emptyAssignments,
      monday: 'missing',
    });
    findById.mockReturnValue(of(undefined));
    await fixture.whenStable();

    const [monday] = dayElements(fixture.nativeElement);
    expect(findById).toHaveBeenCalledWith({ id: 'missing' });
    expect(monday?.textContent).toContain('Monday');
    expect(monday?.textContent?.toLowerCase()).toContain(
      'no recipe is planned',
    );
  });

  it('clears a day', async () => {
    const { fixture, findById, mealPlanStore } = mountMealPlan({
      ...emptyAssignments,
      monday: 'shakshuka',
    });
    findById.mockReturnValue(of(shakshuka));
    const clear = vi
      .spyOn(mealPlanStore, 'clear')
      .mockImplementation(() => undefined);
    await fixture.whenStable();

    fixture.nativeElement.querySelector('button')?.click();
    await fixture.whenStable();

    expect(findById).toHaveBeenCalledWith({ id: 'shakshuka' });
    expect(clear).toHaveBeenCalledExactlyOnceWith({ weekday: 'monday' });
  });
});

function mountMealPlan(assignments: WeekdayAssignments) {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: LocalStorage,
        useValue: {
          getItem: vi.fn().mockReturnValue(null),
          setItem: vi.fn(),
        },
      },
    ],
  });

  const findById = vi
    .spyOn(TestBed.inject(RecipeRepository), 'findById')
    .mockReturnValue(of(undefined));
  const mealPlanStore = TestBed.inject(MealPlanStore);
  vi.spyOn(mealPlanStore, 'assignments').mockReturnValue(assignments);

  const fixture = TestBed.createComponent(MealPlan);

  return { fixture, findById, mealPlanStore };
}

function dayElements(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('wm-meal-plan-day')];
}
