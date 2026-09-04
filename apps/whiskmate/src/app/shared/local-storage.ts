import { Service } from '@angular/core';

@Service({ factory: () => localStorage })
export abstract class LocalStorage {
  abstract setItem(key: string, value: string): void;
  abstract getItem(key: string): string | null;
}
