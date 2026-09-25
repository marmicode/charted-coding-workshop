import type { CreateNodes } from '@nx/devkit';

/**
 * An `index.ts` two levels under an app's `src/app` is a library entry point.
 * `apps/<app>/src/app/shared/ui/index.ts` → scope:shared, type:ui.
 * A hyphenated folder uses its first segment as the type (`feature-meal-plan` → type:feature).
 */
export const createNodes: CreateNodes = [
  'apps/*/src/app/*/*/index.ts',
  (indexPaths) => {
    return indexPaths.map((indexPath) => {
      const [, appName, , , scope, name] = indexPath.split('/');
      const projectRoot = `apps/${appName}/src/app/${scope}/${name}`;
      const type = name.split('-')[0] ?? name;

      return [
        indexPath,
        {
          projects: {
            [projectRoot]: {
              name: `${appName}-${scope}-${name}`,
              sourceRoot: projectRoot,
              projectType: 'library',
              tags: [`scope:${scope}`, `type:${type}`],
            },
          },
        },
      ];
    });
  },
];
