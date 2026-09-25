import { computed, inject, Injectable, signal } from '@angular/core';
import { type User as UserProfile } from '@whiskmate/authz/model';
import { LocalStorage } from '@whiskmate/shared/infra';

const USER_STORAGE_KEY = 'whiskmate:user';

@Injectable({ providedIn: 'root' })
export class CurrentUser {
  private _localStorage = inject(LocalStorage);
  private _user = signal<UserProfile | null>(this._loadUser());

  user = this._user.asReadonly();

  isAdmin = computed(() => {
    const roles = this._user()?.roles ?? [];
    return roles.includes('admin');
  });

  private _loadUser(): UserProfile | null {
    const storedValue = this._localStorage.getItem(USER_STORAGE_KEY);

    if (storedValue == null) {
      return null;
    }

    try {
      return JSON.parse(storedValue) as UserProfile;
    } catch {
      return null;
    }
  }
}
