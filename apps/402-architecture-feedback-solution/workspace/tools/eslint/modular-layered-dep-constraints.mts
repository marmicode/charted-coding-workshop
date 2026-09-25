/**
 * Module boundary rules for Marmicode "Modular Layered Architecture".
 * @see https://cookbook.marmicode.io/nx/organize-libs#modular-layered-architecture
 * @see https://cookbook.marmicode.io/nx/boundaries
 *
 * Libraries live under `apps/<app>/src/app/{scope}/{name}` with `type` inferred from the
 * folder name (`feature-search` → type:feature; `ui-search` → type:ui).
 */

const scope = (
  key:
    | 'admin'
    | 'authz'
    | 'meal-plan'
    | 'recipe'
    | 'shared'
    | 'shared-meal-plan'
    | 'shared-recipe',
) => `scope:${key}`;
const type = (
  key: 'app' | 'feature' | 'ui' | 'domain' | 'infra' | 'model' | 'util',
) => `type:${key}`;

export const modularLayeredDepConstraints: Array<{
  sourceTag?: string;
  onlyDependOnLibsWithTags?: string[];
  allowedExternalImports?: string[];
}> = [
  {
    sourceTag: scope('authz'),
    onlyDependOnLibsWithTags: [scope('authz'), scope('shared')],
  },
  {
    sourceTag: scope('admin'),
    onlyDependOnLibsWithTags: [
      scope('admin'),
      scope('authz'),
      scope('recipe'),
      scope('shared'),
    ],
  },
  {
    sourceTag: scope('shared'),
    onlyDependOnLibsWithTags: [scope('shared')],
  },
  {
    sourceTag: scope('shared-recipe'),
    onlyDependOnLibsWithTags: [scope('shared-recipe'), scope('shared')],
  },
  {
    sourceTag: scope('shared-meal-plan'),
    onlyDependOnLibsWithTags: [
      scope('shared-meal-plan'),
      scope('shared-recipe'),
      scope('shared'),
    ],
  },
  {
    sourceTag: scope('recipe'),
    onlyDependOnLibsWithTags: [
      scope('recipe'),
      scope('shared'),
      scope('shared-recipe'),
      scope('shared-meal-plan'),
    ],
  },
  {
    sourceTag: scope('meal-plan'),
    onlyDependOnLibsWithTags: [
      scope('meal-plan'),
      scope('recipe'),
      scope('shared'),
      scope('shared-recipe'),
      scope('shared-meal-plan'),
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
