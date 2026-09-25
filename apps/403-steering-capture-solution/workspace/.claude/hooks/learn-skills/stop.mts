#!/usr/bin/env node
import { runHook, stopContinuationOutput } from '../internal/run-hook.mts';
import {
  isLearnSkillsReentry,
  loadCache,
  type SessionCache,
} from './internal/session-cache.mts';

await runHook({
  hookEventName: 'Stop',
  handler: async (input) => {
    if (isLearnSkillsReentry()) {
      return;
    }

    if (input.stop_hook_active) {
      return;
    }

    const cache = await loadCache(input);

    if (!cache || cache.learnedSkills.length === 0) {
      return;
    }

    const skillList = cache.learnedSkills
      .map((skill) => `- ${skill.description}`)
      .join('\n');
    const sessionPayload = _sessionPayloadJson(cache);

    await cache.clear();

    return {
      output: stopContinuationOutput(`This session captured reusable steering.
Ask the user — using AskUserQuestion with **multiple selection allowed** — which learned skills to add to the project. Use one option per skill (label = the skill description):

${skillList}

## Session steering payload (for apply; cache file already removed)

\`\`\`json
${sessionPayload}
\`\`\`

After they answer, always read and follow \`.claude/hooks/learn-skills/internal/persist-learned-skills.md\` using the **session payload JSON above** and the **exact descriptions they selected** (use an empty list if they chose none). The apply step must run even when they select no skills.`),
    };
  },
});

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
