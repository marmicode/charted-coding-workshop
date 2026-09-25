#!/usr/bin/env node

import { join } from 'node:path';
import { parseJsonFromAgentText, runAgent } from '../internal/agent.mts';
import { runHook } from '../internal/run-hook.mts';
import {
  isLearnSkillsReentry,
  LearningSessionRepository,
  learnSkillsReentryEnv,
} from './internal/learning-session-repository.mts';
import { readFile } from 'node:fs/promises';

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
    if (!prompt) {
      return;
    }

    const cwd = input.cwd || process.cwd();
    const learningSessionRepository = new LearningSessionRepository(cwd);

    const sessionId = input.session_id;
    const previousLearnedSkills =
      (await learningSessionRepository.getSession(sessionId))?.learnedSkills ??
      [];
    const instructionsPath = join(
      import.meta.dirname,
      'internal/detect-steering-in-user-prompt.md',
    );
    const instructions = await readFile(instructionsPath, 'utf8');
    const classifierPrompt = `
${instructions}

## Previous learned skills

${previousLearnedSkills.map((skill) => `- ${skill.description}`).join('\n') || 'None'}

## User prompt to classify

${prompt}
`;

    const descriptions = _parseSteeringDescriptions(
      await runAgent(classifierPrompt, { cwd, env: learnSkillsReentryEnv() }),
    );
    if (descriptions.length === 0) {
      return;
    }

    await learningSessionRepository.upsertSession({
      sessionId,
      transcriptPath: input.transcript_path ?? '',
      learnedSkills: descriptions.map((description) => ({
        description,
        seen: false,
      })),
    });
  },
});

function _parseSteeringDescriptions(value: string): string[] {
  const result = parseJsonFromAgentText(value);

  if (Array.isArray(result)) {
    return result.filter(
      (item) => typeof item === 'string' && item.trim().length > 0,
    );
  }

  return [];
}
