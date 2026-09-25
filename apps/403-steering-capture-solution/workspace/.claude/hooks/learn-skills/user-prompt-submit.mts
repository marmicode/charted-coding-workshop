#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { runAgent } from '../internal/agent.mts';
import { runHook } from '../internal/run-hook.mts';
import {
  cachePath,
  dedupeDescriptions,
  isLearnSkillsReentry,
  learnSkillsReentryEnv,
  writeSessionCache,
} from './internal/session-cache.mts';

await runHook({
  hookEventName: 'UserPromptSubmit',
  handler: async (input) => {
    if (isLearnSkillsReentry()) {
      return;
    }

    if (input.agent_id || (input.source && input.source !== 'user')) {
      return;
    }

    const prompt = input.prompt?.trim() ?? '';
    if (!prompt || prompt.startsWith('/')) {
      return;
    }

    const sessionId = input.session_id;

    const cwd = input.cwd || process.cwd();
    const instructionsPath = join(
      import.meta.dirname,
      'internal/detect-steering-in-user-prompt.md',
    );
    const instructions = await readFile(instructionsPath, 'utf8');
    const classifierPrompt = `${instructions}

---

User prompt to classify:

${prompt}
`;

    const descriptions = _steeringDescriptions(
      await runAgent(classifierPrompt, { cwd, env: learnSkillsReentryEnv() }),
    );
    if (descriptions.length === 0) {
      return;
    }

    const path = cachePath(cwd, sessionId);
    await writeSessionCache(path, {
      sessionId,
      transcriptPath: input.transcript_path ?? '',
      learnedSkills: dedupeDescriptions(descriptions).map((description) => ({
        description,
      })),
    });
  },
});

function _steeringDescriptions(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => _descriptionFromSteeringItem(item));
  }

  if (typeof value !== 'object' || value === null) {
    return [];
  }

  const record = value as Record<string, unknown>;
  if (Array.isArray(record.steerings)) {
    return record.steerings.flatMap((item) =>
      _descriptionFromSteeringItem(item),
    );
  }

  if (record.isSteering === true) {
    return _descriptionFromSteeringItem(record.description);
  }

  return [];
}

function _descriptionFromSteeringItem(item: unknown): string[] {
  if (typeof item === 'string') {
    const trimmed = item.trim();
    return trimmed ? [trimmed] : [];
  }

  if (
    typeof item === 'object' &&
    item !== null &&
    'description' in item &&
    typeof (item as { description: unknown }).description === 'string'
  ) {
    const trimmed = (item as { description: string }).description.trim();
    return trimmed ? [trimmed] : [];
  }

  return [];
}
