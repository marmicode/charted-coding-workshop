import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it } from 'vitest';
import { App } from './app';
import { appRoutes } from './app.routes';
import { WIP_STORAGE_KEY } from './authz/wip.guard';
import { LocalStorage } from './shared/local-storage';

class MemoryStorage implements LocalStorage {
  private readonly items = signal(new Map<string, string>());

  setItem(key: string, value: string): void {
    this.items.update((items) => new Map(items).set(key, value));
  }

  getItem(key: string): string | null {
    return this.items().get(key) ?? null;
  }
}

function mealPlanLink(root: ParentNode): HTMLAnchorElement | undefined {
  return [...root.querySelectorAll('a')].find(
    (link) => link.textContent?.trim().toLowerCase() === 'meal plan',
  );
}

describe(App.name, () => {
  it.todo('hides the meal plan link unless wip is set', async () => {
    TestBed.resetTestingModule();
    const storage = new MemoryStorage();
    TestBed.overrideProvider(LocalStorage, { useValue: storage });
    TestBed.configureTestingModule({
      providers: [provideRouter(appRoutes)],
    });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    expect(mealPlanLink(fixture.nativeElement)).toBeUndefined();

    storage.setItem(WIP_STORAGE_KEY, 'true');
    await fixture.whenStable();

    const links = [...fixture.nativeElement.querySelectorAll('a')];
    const labels = links.map((link) => link.textContent?.trim().toLowerCase());
    const searchIndex = labels.indexOf('search');
    const mealPlanIndex = labels.indexOf('meal plan');
    expect(mealPlanIndex).toBe(searchIndex + 1);
    expect(links[mealPlanIndex]?.getAttribute('href')).toBe('/meal-plan');
  });
});
