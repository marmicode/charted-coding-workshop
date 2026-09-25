import { inject, Injectable } from '@angular/core';
import { LocalStorage } from './local-storage';

export const WIP_STORAGE_KEY = 'wip';

/** Work in progress — allows navigation only when the wip key is stored. */
@Injectable({ providedIn: 'root' })
export class WipGuard {
  private _localStorage = inject(LocalStorage);

  canActivate(): boolean {
    return this._localStorage.getItem(WIP_STORAGE_KEY) != null;
  }
}
