import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export class LearningSessionRepository {
  private readonly _cwd: string;

  constructor(cwd: string) {
    this._cwd = cwd;
  }

  async upsertSession({
    sessionId,
    transcriptPath,
    learnedSkills,
  }: {
    sessionId: string;
    transcriptPath: string;
    learnedSkills?: LearnedSkill[];
  }): Promise<void> {
    const existing = await this.getSession(sessionId);
    const session: LearningSession = {
      sessionId,
      transcriptPath: transcriptPath.trim()
        ? transcriptPath
        : (existing?.transcriptPath ?? ''),
      learnedSkills: [
        ...(existing?.learnedSkills ?? []),
        ...(learnedSkills ?? []),
      ],
    };

    await this._writeSession(session);
  }

  async markLearnedSkillsSeen({
    sessionId,
    descriptions,
  }: {
    sessionId: string;
    descriptions: string[];
  }): Promise<void> {
    const existing = await this.getSession(sessionId);
    if (!existing) {
      return;
    }

    const descriptionsToMark = new Set(
      descriptions.map((description) => description.trim()),
    );
    await this._writeSession({
      ...existing,
      learnedSkills: existing.learnedSkills.map((skill) =>
        descriptionsToMark.has(skill.description)
          ? { ...skill, seen: true }
          : skill,
      ),
    });
  }

  async getSession(sessionId: string): Promise<LearningSession | undefined> {
    try {
      const raw = await readFile(this._sessionPath(sessionId), 'utf8');
      return _parseLearningSession(JSON.parse(raw));
    } catch {
      return undefined;
    }
  }

  private async _writeSession(session: LearningSession): Promise<void> {
    const path = this._sessionPath(session.sessionId);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, `${JSON.stringify(session, null, 2)}\n`);
  }

  private _sessionPath(sessionId: string): string {
    return join(
      this._cwd,
      '.claude',
      'hooks',
      'learn-skills',
      '.cache',
      `${_safeSessionFileName(sessionId)}.json`,
    );
  }
}

/**
 * Set on the agent these hooks spawn. A nested UserPromptSubmit or Stop sees
 * it and returns, so classifying a prompt does not classify itself or persist
 * a second time.
 */
export const LEARN_SKILLS_REENTRY_ENV = 'LEARN_SKILLS_REENTRY';

export type LearnedSkill = {
  description: string;
  seen: boolean;
};

export type LearningSession = {
  sessionId: string;
  transcriptPath: string;
  learnedSkills: LearnedSkill[];
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

function _safeSessionFileName(sessionId: string): string {
  return sessionId.replace(/[^a-zA-Z0-9._-]/g, '_') || 'session';
}

function _parseLearningSession(value: unknown): LearningSession | undefined {
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
      return [
        {
          description: item.description.trim(),
          seen: 'seen' in item && item.seen === true,
        },
      ];
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
