import { describe, expect, it } from 'vitest';
import { main } from './main';
import {
  CommandRunner,
  FileSystemAdapter,
  GitAdapter,
  PromptAdapter,
} from './infra';
import { Exercise } from './core';
import { type Public } from './util';

describe('cook', () => {
  it('does not checkout the implementation if TDD is enabled', async () => {
    const { executedCommands, files } = await runMain({
      choices: { exercise: '1-recipe-search', useTdd: true },
      files: {
        'apps/1-recipe-search-solution/some-file.txt': '',
        'apps/1-recipe-search-starter/some-file.txt': '',
        'apps/2-test-double-solution/some-file.txt': '',
        'apps/2-test-double-starter/some-file.txt': '',
      },
      nxJsonContent: {},
    });

    expect(executedCommands).toEqual([
      'git switch main',
      'git branch -D cooking || exit 0',
      'git switch -c cooking',
      'git add .',
      'git commit -m "feat: ✨ focus on 1-recipe-search-starter"',
    ]);
    expect(files).toEqual({
      'nx.json': JSON.stringify(
        {
          defaultProject: '1-recipe-search-starter',
        },
        null,
        2,
      ),
      'apps/whiskmate/some-file.txt': '',
    });
  });

  it('goes to exercise and checks out the implementation from solution project', async () => {
    const { executedCommands } = await runMain({
      choices: { exercise: '1-recipe-search' },
      nxJsonContent: {},
    });

    expect(executedCommands).toEqual([
      'git switch main',
      'git branch -D cooking || exit 0',
      'git switch -c cooking',
      'git show main:apps/1-recipe-search-solution/src/app/recipe/recipe-search.ng.ts > apps/1-recipe-search-starter/src/app/recipe/recipe-search.ng.ts',
      'git add .',
      'git commit -m "feat: ✨ focus on 1-recipe-search-starter"',
    ]);
  });

  it('uses TDD mode when forceTdd is true', async () => {
    const { executedCommands } = await runMain({
      choices: { exercise: '3-recipe-search-async-pipe' },
      nxJsonContent: {},
    });

    expect(executedCommands).toEqual([
      'git switch main',
      'git branch -D cooking || exit 0',
      'git switch -c cooking',
      'git add .',
      'git commit -m "feat: ✨ focus on 3-recipe-search-async-pipe-starter"',
    ]);
  });

  it('checks out solution', async () => {
    const { executedCommands, files } = await runMain({
      choices: { command: 'solution', confirmOverwrite: true },
      nxJsonContent: {
        defaultProject: '1-recipe-search-starter',
      },
    });

    expect(executedCommands).toEqual([
      'git switch main',
      'git branch -D cooking || exit 0',
      'git switch -c cooking',
      'git add .',
      'git commit -m "feat: ✨ focus on 1-recipe-search-solution"',
    ]);
    expect(JSON.parse(files['nx.json'])).toEqual({
      defaultProject: '1-recipe-search-solution',
    });
  });

  it('copies the selected exercise workspace to the workspace root', async () => {
    const { files } = await runMain({
      choices: { exercise: '1-recipe-search', useTdd: true },
      files: {
        'apps/1-recipe-search-starter/workspace/design-docs/plan.md': '# plan',
        'apps/1-recipe-search-starter/workspace/.claude/settings.json': '{}',
        'apps/1-recipe-search-solution/workspace/design-docs/plan.md':
          '# solution',
        'apps/2-test-double-starter/some-file.txt': '',
      },
      nxJsonContent: {},
    });

    expect(files['design-docs/plan.md']).toBe('# plan');
    expect(files['.claude/settings.json']).toBe('{}');
    expect(files['apps/whiskmate/workspace/design-docs/plan.md']).toBe('# plan');
  });

  it('copies the solution workspace when checking out the solution', async () => {
    const { files } = await runMain({
      choices: { command: 'solution', confirmOverwrite: true },
      files: {
        'apps/1-recipe-search-solution/workspace/contradictions.md': '# key',
      },
      nxJsonContent: {
        defaultProject: '1-recipe-search-starter',
      },
    });

    expect(files['contradictions.md']).toBe('# key');
    expect(JSON.parse(files['nx.json'])).toEqual({
      defaultProject: '1-recipe-search-solution',
    });
  });

  it('moves the app to apps/whiskmate and renames paths', async () => {
    const { files } = await runMain({
      choices: { exercise: '1-recipe-search', useTdd: true },
      files: {
        'apps/1-recipe-search-starter/project.json':
          '{"name":"1-recipe-search-starter","sourceRoot":"apps/1-recipe-search-starter/src","implicitDependencies":["1-recipe-search-starter-*"],"buildTarget":"1-recipe-search-starter:build"}',
        'apps/1-recipe-search-starter/vite.config.ts':
          "cacheDir: '../../node_modules/.vite/apps/1-recipe-search-starter'",
        'apps/1-recipe-search-starter/vitest.config.mts':
          "name: '1-recipe-search-starter',\ncoverage: '../../coverage/apps/1-recipe-search-starter'",
        'apps/1-recipe-search-starter/workspace/tsconfig.base.json':
          '{ "paths": { "@x": ["./apps/whiskmate/src/app/index.ts"] } }',
        'apps/2-test-double-starter/project.json':
          '{"name":"2-test-double-starter"}',
      },
      nxJsonContent: {},
    });

    expect(JSON.parse(files['apps/whiskmate/project.json'])).toEqual({
      name: '1-recipe-search-starter',
      sourceRoot: 'apps/whiskmate/src',
      implicitDependencies: ['whiskmate-*'],
      buildTarget: '1-recipe-search-starter:build',
    });
    expect(files['apps/whiskmate/vite.config.ts']).toBe(
      "cacheDir: '../../node_modules/.vite/apps/whiskmate'",
    );
    expect(files['apps/whiskmate/vitest.config.mts']).toBe(
      "name: '1-recipe-search-starter',\ncoverage: '../../coverage/apps/whiskmate'",
    );
    expect(files['tsconfig.base.json']).toBe(
      '{ "paths": { "@x": ["./apps/whiskmate/src/app/index.ts"] } }',
    );
    expect(files['apps/whiskmate/workspace/tsconfig.base.json']).toBe(
      '{ "paths": { "@x": ["./apps/whiskmate/src/app/index.ts"] } }',
    );
    expect(files['apps/2-test-double-starter/project.json']).toBeUndefined();
    expect(JSON.parse(files['nx.json']).defaultProject).toBe(
      '1-recipe-search-starter',
    );
  });

  it('stops cooking', async () => {
    const { executedCommands } = await runMain({
      choices: { command: 'stop' },
      hasLocalChanges: true,
      nxJsonContent: {
        defaultProject: '1-recipe-search-starter',
      },
    });
    expect(executedCommands).toEqual([
      'git reset --hard',
      'git clean -df',
      'git switch main',
    ]);
  });

  it('does not prompt if `-y` is passed', async () => {
    const { executedCommands } = await runMain({
      args: ['-y', 'start', '1-recipe-search'],
      /* These choices should be ignored (as not prompted) because we are in non-interactive mode (-y). */
      choices: { useTdd: true },
      nxJsonContent: {
        defaultProject: '1-recipe-search-starter',
      },
    });

    expect(executedCommands).toEqual([
      'git switch main',
      'git branch -D cooking || exit 0',
      'git switch -c cooking',
      /* `useTdd` is using its default value (false) because we are in non-interactive mode (-y). */
      'git show main:apps/1-recipe-search-solution/src/app/recipe/recipe-search.ng.ts > apps/1-recipe-search-starter/src/app/recipe/recipe-search.ng.ts',
      'git add .',
      'git commit -m "feat: ✨ focus on 1-recipe-search-starter"',
    ]);
  });
});

async function runMain({
  args = [],
  choices = {},
  hasLocalChanges = false,
  nxJsonContent,
  files = {},
}: {
  args?: string[];
  choices?: Record<string, unknown>;
  nxJsonContent: { defaultProject?: string };
  hasLocalChanges?: boolean;
  files?: Record<string, string>;
}) {
  const fileSystemAdapter = new FileSystemFake();
  const commandRunner = new CommandRunnerFake();
  const gitAdapter = new GitFake();
  const promptAdapter = new PromptFake();

  fileSystemAdapter.configure({
    files: {
      ...files,
      'nx.json': JSON.stringify(nxJsonContent),
    },
  });
  gitAdapter.configure({
    hasLocalChanges,
  });
  promptAdapter.configure({ choices });

  const exercises: Exercise[] = [
    {
      id: '1-recipe-search',
      name: 'Recipe Search',
      implementationFiles: ['src/app/recipe/recipe-search.ng.ts'],
    },
    { id: '2-test-double', name: 'Test Double' },
    {
      id: '3-recipe-search-async-pipe',
      name: 'Recipe Search Async Pipe',
      forceTdd: true,
      implementationFiles: ['src/app/recipe/recipe-search.ng.ts'],
    },
  ];

  await main(args, {
    config: {
      base: 'main',
      exercises,
    },
    commandRunner,
    fileSystemAdapter,
    gitAdapter,
    promptAdapter,
  });

  return {
    executedCommands: commandRunner.getExecutedCommands(),
    files: fileSystemAdapter.getFiles(),
  };
}

class CommandRunnerFake implements CommandRunner {
  private _executedCommands: string[] = [];

  executeCommand(command: string) {
    this._executedCommands.push(command);
  }

  getExecutedCommands() {
    return this._executedCommands;
  }
}

class GitFake implements GitAdapter {
  private _hasLocalChanges = false;

  configure({ hasLocalChanges }: { hasLocalChanges?: boolean }) {
    this._hasLocalChanges = hasLocalChanges ?? this._hasLocalChanges;
  }

  hasLocalChanges() {
    return this._hasLocalChanges;
  }
}

class FileSystemFake implements FileSystemAdapter {
  private _files: Record<string, string> = {};

  configure({ files }: { files: Record<string, string> }) {
    this._files = files;
  }

  getFiles() {
    return this._files;
  }

  readFile(path: string) {
    const content = this._files[path];
    if (!content) {
      throw new Error(`File ${path} not found`);
    }
    return content;
  }

  writeFile(path: string, content: string) {
    this._files[path] = content;
  }

  readDir(dirPath: string): string[] {
    const dirPathTokens = dirPath.split('/');

    return Array.from(
      new Set(
        Object.keys(this._files)
          .map((filePath) => {
            const filePathTokens = filePath.split('/');
            return filePathTokens.slice(0, dirPathTokens.length + 1).join('/');
          })
          .filter((folderPath) => folderPath.startsWith(dirPath))
          .map((folderPath) => folderPath.replace(`${dirPath}/`, '')),
      ),
    );
  }

  removeDir(dirPath: string): void {
    this._files = Object.fromEntries(
      Object.entries(this._files).filter(
        ([filePath]) => !filePath.startsWith(dirPath),
      ),
    );
  }

  renameDir(from: string, to: string): void {
    const prefix = `${from}/`;
    const next: Record<string, string> = {};

    for (const [filePath, content] of Object.entries(this._files)) {
      if (filePath.startsWith(prefix)) {
        next[`${to}/${filePath.slice(prefix.length)}`] = content;
      } else {
        next[filePath] = content;
      }
    }

    this._files = next;
  }

  copyDirContents(source: string, destination: string): void {
    const prefix = source.endsWith('/') ? source : `${source}/`;
    const destPrefix = destination === '.' ? '' : `${destination.replace(/\/$/, '')}/`;

    for (const [filePath, content] of Object.entries(this._files)) {
      if (!filePath.startsWith(prefix)) {
        continue;
      }

      const relativePath = filePath.slice(prefix.length);
      this._files[`${destPrefix}${relativePath}`] = content;
    }
  }
}

class PromptFake implements Public<PromptAdapter> {
  private _choices: Record<string, unknown> = {};
  private _interactive = true;

  configure({ choices }: { choices: Record<string, unknown> }) {
    this._choices = choices;
  }

  disableInteractivity() {
    this._interactive = false;
  }

  prompt<T>(options) {
    const { name, initial } = options;
    if (!this._interactive) {
      return initial !== undefined ? ({ [name]: initial } as T) : null;
    }
    return Promise.resolve({
      [options.name]: this._choices[options.name] ?? options.initial,
    } as T);
  }
}
