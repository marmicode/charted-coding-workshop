import type {
  HookInput,
  UserPromptSubmitHookInput,
  StopHookSpecificOutput,
  SyncHookJSONOutput,
  StopHookInput,
} from '@anthropic-ai/claude-agent-sdk';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { stdin, which } from 'zx';

export const LEARN_SKILLS_RUNNING_ENV = 'LEARN_SKILLS_RUNNING';

export type AgentBin = 'claude' | 'cursor-agent';

export type LearnedSkill = {
  description: string;
};

export type SessionCache = {
  sessionId: string;
  transcriptPath: string;
  learnedSkills: LearnedSkill[];
};

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

export async function readUserPromptSubmitHookInput(): Promise<UserPromptSubmitHookInput> {
  return JSON.parse(await stdin()) as UserPromptSubmitHookInput;
}

export async function readStopHookInput(): Promise<StopHookInput> {
  return JSON.parse(await stdin()) as StopHookInput;
}

export type StopContinuationOutput = {
  followup_message: string;
  hookSpecificOutput: StopHookSpecificOutput;
};

export function isLearnSkillsRunning(): boolean {
  return process.env[LEARN_SKILLS_RUNNING_ENV] === '1';
}

export function learnSkillsEnv(
  env: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
  return {
    ...env,
    [LEARN_SKILLS_RUNNING_ENV]: '1',
  };
}

export function printStopHookJsonOutput(output: SyncHookJSONOutput): void {
  console.log(JSON.stringify(output));
}

/**
 * Cursor ignores Claude's stop hooks that do not "block".
 * We have to use a continuation output to make sure Cursor continues.
 */
export function stopContinuationOutput(
  message: string,
): StopContinuationOutput {
  return {
    followup_message: message,
    hookSpecificOutput: {
      hookEventName: 'Stop',
      additionalContext: message,
    },
  };
}

export function sessionIdFromInput(data: HookInput): string | undefined {
  const sessionId = data.session_id;
  return sessionId ? sessionId : undefined;
}

export function cwdFromInput(data: HookInput): string {
  return data.cwd || process.cwd();
}

export function cacheDir(cwd: string): string {
  return join(cwd, '.claude', 'hooks', 'learn-skills', '.cache');
}

export function cachePath(cwd: string, sessionId: string): string {
  return join(cacheDir(cwd), `${_safeSessionFileName(sessionId)}.json`);
}

export async function readSessionCache(
  path: string,
): Promise<SessionCache | undefined> {
  try {
    const raw = await readFile(path, 'utf8');
    return _parseSessionCache(JSON.parse(raw));
  } catch {
    return undefined;
  }
}

export async function writeSessionCache(
  path: string,
  cache: SessionCache,
): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(cache, null, 2)}\n`);
}

export async function deleteSessionCache(path: string): Promise<void> {
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

export function parseJsonFromAgentText(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) {
    return undefined;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    const objectStart = trimmed.indexOf('{');
    const objectEnd = trimmed.lastIndexOf('}');
    if (objectStart >= 0 && objectEnd > objectStart) {
      try {
        return JSON.parse(trimmed.slice(objectStart, objectEnd + 1));
      } catch {
        // fall through to array extraction
      }
    }

    const arrayStart = trimmed.indexOf('[');
    const arrayEnd = trimmed.lastIndexOf(']');
    if (arrayStart < 0 || arrayEnd <= arrayStart) {
      return undefined;
    }

    try {
      return JSON.parse(trimmed.slice(arrayStart, arrayEnd + 1));
    } catch {
      return undefined;
    }
  }
}

export async function resolveAgentInvocation(
  cwd: string,
): Promise<{ bin: AgentBin; args: string[] }> {
  const preferred = _currentAgent();
  const bin = (await _hasBin(preferred))
    ? preferred
    : await _fallbackAgent(preferred);

  if (bin === 'cursor-agent') {
    return {
      bin,
      args: ['--print', '--force', '--trust', '--workspace', cwd],
    };
  }

  return {
    bin,
    args: ['--print', '--permission-mode', 'dontAsk', '--model', 'haiku'],
  };
}

function _safeSessionFileName(sessionId: string): string {
  return sessionId.replace(/[^a-zA-Z0-9._-]/g, '_') || 'session';
}

function _normalizeDescription(description: string): string {
  return description.trim().toLowerCase().replace(/\s+/g, ' ');
}

function _parseSessionCache(value: unknown): SessionCache | undefined {
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
  };
}

function _currentAgent(): AgentBin {
  if (process.env.CLAUDECODE) {
    return 'claude';
  }

  if (process.env.CURSOR_AGENT) {
    return 'cursor-agent';
  }

  return 'claude';
}

async function _fallbackAgent(preferred: AgentBin): Promise<AgentBin> {
  const other: AgentBin = preferred === 'claude' ? 'cursor-agent' : 'claude';

  if (await _hasBin(other)) {
    return other;
  }

  return preferred;
}

async function _hasBin(bin: string): Promise<boolean> {
  try {
    await which(bin);
    return true;
  } catch {
    return false;
  }
}
