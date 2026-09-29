import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { App } from './app';
import { appRoutes } from './app.routes';
import { WIP_STORAGE_KEY } from './authz/wip.guard';
import { LocalStorage } from './shared/local-storage';

describe(App.name, () => {
  it('hides the meal plan link unless wip is set', async () => {
    const storedValues = signal<Record<string, string>>({});
    const localStorage: LocalStorage = {
      getItem: (key) => storedValues()[key] ?? null,
      setItem: (key, value) => {
        storedValues.update((current) => ({ ...current, [key]: value }));
      },
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideRouter(appRoutes)],
    });
    TestBed.overrideProvider(LocalStorage, { useValue: localStorage });

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const labels = () =>
      [...fixture.nativeElement.querySelectorAll('a')].map((link) => ({
        label: (link.textContent ?? '').trim().toLowerCase(),
        href: link.getAttribute('href'),
      }));

    expect(labels().some((link) => link.label === 'meal plan')).toBe(false);

    localStorage.setItem(WIP_STORAGE_KEY, 'true');
    await fixture.whenStable();

    const links = labels();
    const searchIndex = links.findIndex((link) => link.label === 'search');

    expect(links[searchIndex + 1]).toEqual({
      label: 'meal plan',
      href: '/meal-plan',
    });
  });
});
