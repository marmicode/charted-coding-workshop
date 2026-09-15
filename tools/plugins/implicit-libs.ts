import type { CreateNodes } from '@nx/devkit';

export const createNodes: CreateNodes = [
  'libs/*/*/index.ts',
  (indexPathList: string[]) => {
    return indexPathList.map((indexPath) => {
      const [libs, scope, name] = indexPath.split('/');
      const projectRoot = `${libs}/${scope}/${name}`;
      const projectName = `${scope}-${name}`;
      const nameParts = name.split('-');
      const type = nameParts[0] ?? name;

      return [
        indexPath,
        {
          projects: {
            [projectRoot]: {
              name: projectName,
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
