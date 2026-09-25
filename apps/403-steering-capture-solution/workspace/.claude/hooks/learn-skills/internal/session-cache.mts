import type { HookInput } from '@anthropic-ai/claude-agent-sdk';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

/**
 * Set on the agent these hooks spawn. A nested UserPromptSubmit or Stop sees
 * it and returns, so classifying a prompt does not classify itself or persist
 * a second time.
 */
export const LEARN_SKILLS_REENTRY_ENV = 'LEARN_SKILLS_REENTRY';

export type LearnedSkill = {
  description: string;
};

type SessionCacheData = {
  sessionId: string;
  transcriptPath: string;
  learnedSkills: LearnedSkill[];
};

export type SessionCache = SessionCacheData & {
  clear: () => Promise<void>;
};

/**
 * True when this process is the agent spawned by the learn-skills hooks.
 * Callers return immediately so those hooks do not run again.
 */
export function isLearnSkillsReentry(): boolean {
  return process.env[LEARN_SKILLS_REENTRY_ENV] === '1';
}

/** Env for that spawned agent. Sets `LEARN_SKILLS_REENTRY`. */
export function learnSkillsReentryEnv(
  env: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
  return {
    ...env,
    [LEARN_SKILLS_REENTRY_ENV]: '1',
  };
}

export function dedupeDescriptions(descriptions: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const description of descriptions) {
    const trimmed = description.trim();
    if (!trimmed) {
      continue;
    }

    const key = _normalizeDescription(trimmed);
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(trimmed);
  }

  return result;
}

export function cacheDir(cwd: string): string {
  return join(cwd, '.claude', 'hooks', 'learn-skills', '.cache');
}

export function cachePath(cwd: string, sessionId: string): string {
  return join(cacheDir(cwd), `${_safeSessionFileName(sessionId)}.json`);
}

export async function loadCache(
  input: HookInput,
): Promise<SessionCache | undefined> {
  return readSessionCache(_cachePathFromInput(input));
}

export async function readSessionCache(
  path: string,
): Promise<SessionCache | undefined> {
  try {
    const raw = await readFile(path, 'utf8');
    return _parseSessionCache(JSON.parse(raw), path);
  } catch {
    return undefined;
  }
}

export async function writeSessionCache(
  path: string,
  cache: SessionCacheData,
): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(cache, null, 2)}\n`);
}

async function _deleteCacheFile(path: string): Promise<void> {
  try {
    await unlink(path);
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      return;
    }

    throw error;
  }
}

function _cachePathFromInput(input: HookInput): string {
  return cachePath(input.cwd || process.cwd(), input.session_id);
}

function _safeSessionFileName(sessionId: string): string {
  return sessionId.replace(/[^a-zA-Z0-9._-]/g, '_') || 'session';
}

function _normalizeDescription(description: string): string {
  return description.trim().toLowerCase().replace(/\s+/g, ' ');
}

function _parseSessionCache(
  value: unknown,
  path: string,
): SessionCache | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  if (
    typeof record.sessionId !== 'string' ||
    !Array.isArray(record.learnedSkills)
  ) {
    return undefined;
  }

  const learnedSkills = record.learnedSkills.flatMap((item) => {
    if (
      typeof item === 'object' &&
      item !== null &&
      'description' in item &&
      typeof item.description === 'string' &&
      item.description.trim()
    ) {
      return [{ description: item.description.trim() }];
    }

    return [];
  });

  return {
    sessionId: record.sessionId,
    transcriptPath:
      typeof record.transcriptPath === 'string' ? record.transcriptPath : '',
    learnedSkills,
    clear: () => _deleteCacheFile(path),
  };
}
