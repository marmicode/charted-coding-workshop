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

export const depConstraints: Array<{
  sourceTag?: string;
  onlyDependOnLibsWithTags?: string[];
  allowedExternalImports?: string[];
}> = [];

export const testDepConstraints = depConstraints.map((constraint) => ({
  ...constraint,
  allowedExternalImports: constraint.allowedExternalImports
    ? [...constraint.allowedExternalImports, '@angular/core/testing', 'vitest']
    : undefined,
}));
