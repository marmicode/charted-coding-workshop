#!/usr/bin/env node
import {
  cachePath,
  cwdFromInput,
  deleteSessionCache,
  isLearnSkillsRunning,
  printStopHookJsonOutput,
  readStopHookInput,
  readSessionCache,
  sessionIdFromInput,
  stopContinuationOutput,
  type SessionCache,
} from './_shared.mts';

process.exit(await main());

async function main(): Promise<number> {
  if (isLearnSkillsRunning()) {
    return 0;
  }

  const data = await readStopHookInput();

  if (data.stop_hook_active) {
    return 0;
  }

  const sessionId = sessionIdFromInput(data);
  if (!sessionId) {
    return 0;
  }

  const cwd = cwdFromInput(data);
  const cacheFilePath = cachePath(cwd, sessionId);
  const cache = await readSessionCache(cacheFilePath);

  if (!cache || cache.learnedSkills.length === 0) {
    return 0;
  }

  const skillList = cache.learnedSkills
    .map((skill) => `- ${skill.description}`)
    .join('\n');
  const sessionPayload = _sessionPayloadJson(cache);

  printStopHookJsonOutput(
    stopContinuationOutput(`This session captured reusable steering.
Ask the user — using AskUserQuestion with **multiple selection allowed** — which learned skills to add to the project. Use one option per skill (label = the skill description):

${skillList}

## Session steering payload (for apply; cache file already removed)

\`\`\`json
${sessionPayload}
\`\`\`

After they answer, always read and follow \`.claude/hooks/learn-skills/persist-learned-skills.md\` using the **session payload JSON above** and the **exact descriptions they selected** (use an empty list if they chose none). The apply step must run even when they select no skills.`),
  );

  await deleteSessionCache(cacheFilePath);

  return 0;
}

function _sessionPayloadJson(cache: SessionCache): string {
  return JSON.stringify(
    {
      sessionId: cache.sessionId,
      transcriptPath: cache.transcriptPath,
      learnedSkills: cache.learnedSkills,
    },
    null,
    2,
  );
}
