/**
 * Module boundary rules for Marmicode "Modular Layered Architecture".
 * @see https://cookbook.marmicode.io/nx/organize-libs#modular-layered-architecture
 * @see https://cookbook.marmicode.io/nx/boundaries
 *
 * Libraries live under `libs/{scope}/{name}` with `type` inferred from the last
 * segment of the folder name (e.g. `search-feature` → type:feature).
 */

const scope = (key: 'meal-plan' | 'recipe' | 'shared') => `scope:${key}`;
const type = (
  key: 'app' | 'feature' | 'ui' | 'domain' | 'infra' | 'model' | 'util',
) => `type:${key}`;

export const modularLayeredDepConstraints: Array<{
  sourceTag?: string;
  onlyDependOnLibsWithTags?: string[];
  allowedExternalImports?: string[];
}> = [
  {
    sourceTag: scope('shared'),
    onlyDependOnLibsWithTags: [scope('shared')],
  },
  {
    sourceTag: scope('recipe'),
    onlyDependOnLibsWithTags: [scope('recipe'), scope('shared')],
  },
  {
    sourceTag: scope('meal-plan'),
    onlyDependOnLibsWithTags: [
      scope('meal-plan'),
      scope('recipe'),
      scope('shared'),
    ],
  },
  {
    sourceTag: type('app'),
    onlyDependOnLibsWithTags: [
      type('feature'),
      type('ui'),
      type('domain'),
      type('infra'),
      type('model'),
      type('util'),
    ],
    allowedExternalImports: ['@angular/*', 'rxjs', 'rxjs/*'],
  },
  {
    sourceTag: type('feature'),
    onlyDependOnLibsWithTags: [
      type('feature'),
      type('ui'),
      type('domain'),
      type('infra'),
      type('model'),
      type('util'),
    ],
    allowedExternalImports: [
      '@angular/*',
      '@angular/core/rxjs-interop',
      'rxjs',
      'rxjs/*',
    ],
  },
  {
    sourceTag: type('ui'),
    onlyDependOnLibsWithTags: [type('ui'), type('model'), type('util')],
    allowedExternalImports: [
      '@angular/core',
      '@angular/common',
      '@angular/forms',
      '@angular/forms/*',
      '@angular/material',
      '@angular/material/*',
      '@angular/cdk',
      '@angular/cdk/*',
    ],
  },
  {
    sourceTag: type('domain'),
    onlyDependOnLibsWithTags: [
      type('domain'),
      type('infra'),
      type('model'),
      type('util'),
    ],
    allowedExternalImports: ['@angular/core'],
  },
  {
    sourceTag: type('infra'),
    onlyDependOnLibsWithTags: [type('infra'), type('model'), type('util')],
    allowedExternalImports: [
      '@angular/core',
      '@angular/common/http',
      'rxjs',
      'rxjs/*',
    ],
  },
  {
    sourceTag: type('model'),
    onlyDependOnLibsWithTags: [type('model'), type('util')],
    allowedExternalImports: [],
  },
  {
    sourceTag: type('util'),
    onlyDependOnLibsWithTags: [type('util')],
    allowedExternalImports: ['date-fns'],
  },
];
