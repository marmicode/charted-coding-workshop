import { inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LocalStorage } from './local-storage';

export const WIP_STORAGE_KEY = 'wip';

/** Work in progress — allows navigation only when the wip key is stored. */
@Injectable({ providedIn: 'root' })
export class WipGuard implements CanActivate {
  private _localStorage = inject(LocalStorage);

  canActivate(): boolean {
    return this._localStorage.getItem(WIP_STORAGE_KEY) != null;
  }
}
