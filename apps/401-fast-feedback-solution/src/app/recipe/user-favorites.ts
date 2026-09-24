import { computed, inject, Injectable, signal } from '@angular/core';
import { LocalStorage } from '../shared/local-storage';

const FAVORITES_STORAGE_KEY = 'whiskmate:favorites';

@Injectable({ providedIn: 'root' })
export class UserFavorites {
  private _localStorage = inject(LocalStorage);
  private _favoriteIds = signal(this._loadFavoriteIds());

  favoriteIds = computed(() => this._favoriteIds());

  addFavorite(recipeId: string): void {
    this._favoriteIds.update((favoriteIds) => {
      const nextFavoriteIds = new Set(favoriteIds);
      nextFavoriteIds.add(recipeId);
      this._persistFavoriteIds(nextFavoriteIds);
      return nextFavoriteIds;
    });
  }

  removeFavorite(recipeId: string): void {
    this._favoriteIds.update((favoriteIds) => {
      const nextFavoriteIds = new Set(favoriteIds);
      nextFavoriteIds.delete(recipeId);
      this._persistFavoriteIds(nextFavoriteIds);
      return nextFavoriteIds;
    });
  }

  private _loadFavoriteIds(): Set<string> {
    const storedValue = this._localStorage.getItem(FAVORITES_STORAGE_KEY);

    if (storedValue == null) {
      return new Set();
    }

    try {
      const favoriteIds = JSON.parse(storedValue) as string[];
      return new Set(favoriteIds);
    } catch {
      return new Set();
    }
  }

  private _persistFavoriteIds(favoriteIds: Set<string>): void {
    this._localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify([...favoriteIds]),
    );
  }
}
