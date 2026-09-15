/**
 * Module boundary rules for Marmicode "Modular Layered Architecture".
 * @see https://cookbook.marmicode.io/nx/organize-libs#modular-layered-architecture
 * @see https://cookbook.marmicode.io/nx/boundaries
 *
 * Libraries live under `libs/{scope}/{name}` with `type` inferred from the last
 * segment of the folder name (e.g. `search-feature` → type:feature).
 */
export const modularLayeredDepConstraints = [
  {
    sourceTag: 'scope:shared',
    onlyDependOnLibsWithTags: ['scope:shared'],
  },
  {
    sourceTag: 'type:app',
    onlyDependOnLibsWithTags: [
      'type:feature',
      'type:ui',
      'type:domain',
      'type:infra',
      'type:model',
      'type:util',
    ],
  },
  {
    sourceTag: 'type:feature',
    onlyDependOnLibsWithTags: [
      'type:feature',
      'type:ui',
      'type:domain',
      'type:infra',
      'type:model',
      'type:util',
    ],
  },
  {
    sourceTag: 'type:ui',
    onlyDependOnLibsWithTags: ['type:ui', 'type:model', 'type:util'],
  },
  {
    sourceTag: 'type:domain',
    onlyDependOnLibsWithTags: [
      'type:domain',
      'type:infra',
      'type:model',
      'type:util',
    ],
  },
  {
    sourceTag: 'type:infra',
    onlyDependOnLibsWithTags: ['type:infra', 'type:model', 'type:util'],
  },
  {
    sourceTag: 'type:model',
    onlyDependOnLibsWithTags: ['type:model', 'type:util'],
  },
  {
    sourceTag: 'type:util',
    onlyDependOnLibsWithTags: ['type:util'],
  },
  {
    allSourceTags: ['platform:web', 'type:app'],
    allowedExternalImports: ['@angular/*', 'rxjs', 'rxjs/*'],
  },
  {
    allSourceTags: ['platform:web', 'type:feature'],
    allowedExternalImports: ['@angular/*', 'rxjs', 'rxjs/*'],
  },
  {
    allSourceTags: ['platform:web', 'type:ui'],
    allowedExternalImports: [
      '@angular/core',
      '@angular/common',
      '@angular/material',
      '@angular/cdk',
    ],
  },
  {
    allSourceTags: ['platform:web', 'type:domain'],
    allowedExternalImports: ['@angular/core'],
  },
  {
    allSourceTags: ['platform:web', 'type:infra'],
    allowedExternalImports: ['@angular/core', '@angular/common/http'],
  },
  {
    allSourceTags: ['platform:web', 'type:model'],
    allowedExternalImports: [],
  },
  {
    allSourceTags: ['platform:web', 'type:util'],
    allowedExternalImports: ['date-fns'],
  },
];
