import { describe, it } from 'vitest';
import { App } from './app';

describe(App.name, () => {
  it.todo('hides the meal plan link unless wip is set', () => {
    // Mount `App` with the `wip` flag unset.
    // Assert the navbar has no Meal Plan link.
    // Set the `wip` flag.
    // Assert the navbar shows Meal Plan next to Search, targeting `/meal-plan`.
  });
});
