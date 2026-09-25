#!/usr/bin/env node
import { runHook } from '../internal/run-hook.mts';
import {
  isLearnSkillsReentry,
  LearningSessionRepository,
} from './internal/learning-session-repository.mts';

await runHook({
  hookEventName: 'Stop',
  handler: async (input) => {
    if (isLearnSkillsReentry()) {
      return;
    }

    if (input.stop_hook_active) {
      return;
    }

    const cwd = input.cwd || process.cwd();
    const repository = new LearningSessionRepository(cwd);
    const session = await repository.getSession(input.session_id);

    if (!session) {
      return;
    }

    /* Cursor's first beforeSubmitPrompt sends transcript_path: null. The file
     * exists by the next prompt and by Stop, so keep backfilling it. */
    if (session.transcriptPath == null) {
      await repository.upsertSession({
        sessionId: input.session_id,
        transcriptPath: input.transcript_path,
      });
    }

    const unseenLearnedSkills = session.learnedSkills.filter(
      (skill) => !skill.seen,
    );
    if (unseenLearnedSkills.length === 0) {
      return;
    }

    const learnedSkillsStr = unseenLearnedSkills
      .map((skill) => `- ${skill.description}`)
      .join('\n');

    await repository.markLearnedSkillsSeen({
      sessionId: input.session_id,
      descriptions: unseenLearnedSkills.map((skill) => skill.description),
    });

    return {
      output: {
        hookSpecificOutput: {
          hookEventName: 'Stop',
          additionalContext: `We just learned the following skills:
${learnedSkillsStr}

Remind me to run \`/save-learnings\` to save them.`,
        },
      },
    };
  },
});
