#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { $ } from 'zx';
import {
  cachePath,
  cwdFromInput,
  dedupeDescriptions,
  isLearnSkillsRunning,
  learnSkillsEnv,
  parseJsonFromAgentText,
  readUserPromptSubmitHookInput,
  resolveAgentInvocation,
  sessionIdFromInput,
  writeSessionCache,
} from './_shared.mts';

process.exit(await main());

async function main(): Promise<number> {
  if (isLearnSkillsRunning()) {
    return 0;
  }

  const data = await readUserPromptSubmitHookInput();

  if (data.agent_id || (data.source && data.source !== 'user')) {
    return 0;
  }

  const prompt = data.prompt?.trim() ?? '';
  if (!prompt || prompt.startsWith('/')) {
    return 0;
  }

  const sessionId = sessionIdFromInput(data);
  if (!sessionId) {
    return 0;
  }

  const cwd = cwdFromInput(data);
  const instructionsPath = join(
    import.meta.dirname,
    'detect-steering-in-user-prompt.md',
  );
  const instructions = await readFile(instructionsPath, 'utf8');
  const classifierPrompt = `${instructions}

---

User prompt to classify:

${prompt}
`;

  const { bin, args } = await resolveAgentInvocation(cwd);
  const result = await $({
    cwd,
    quiet: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: learnSkillsEnv(),
  })`${bin} ${args} ${classifierPrompt}`.nothrow();

  const descriptions = _steeringDescriptions(
    parseJsonFromAgentText(result.text().trim() || result.stderr.trim()),
  );
  if (descriptions.length === 0) {
    return 0;
  }

  const path = cachePath(cwd, sessionId);
  await writeSessionCache(path, {
    sessionId,
    transcriptPath: data.transcript_path ?? '',
    learnedSkills: dedupeDescriptions(descriptions).map((description) => ({
      description,
    })),
  });
  return 0;
}

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
