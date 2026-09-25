import type {
  HookEvent,
  HookInput,
  SyncHookJSONOutput,
} from '@anthropic-ai/claude-agent-sdk';
import { stdin } from 'zx';

export async function runHook<HOOK_EVENT_NAME extends HookEvent>(options: {
  hookEventName: HOOK_EVENT_NAME;
  handler: (
    input: HookInputFor<HOOK_EVENT_NAME>,
  ) =>
    | HookHandlerResult<HOOK_EVENT_NAME>
    | void
    | Promise<HookHandlerResult<HOOK_EVENT_NAME> | void>;
}): Promise<never> {
  const input = _parseHookInput(await stdin(), options.hookEventName);
  const { exitCode = 0, output } = (await options.handler(input)) ?? {};
  if (output) {
    console.log(JSON.stringify(output));
  }
  process.exit(exitCode);
}

type HookHandlerResult<HOOK_EVENT_NAME extends HookEvent> = {
  exitCode?: number;
  output?: HookOutputFor<HOOK_EVENT_NAME> & {
    followup_message?: string;
  };
};

type HookSpecificOutput = NonNullable<SyncHookJSONOutput['hookSpecificOutput']>;

export type HookInputFor<HOOK_EVENT_NAME extends HookEvent> = Extract<
  HookInput,
  { hook_event_name: HOOK_EVENT_NAME }
>;

export type HookOutputFor<HOOK_EVENT_NAME extends HookEvent> = Omit<
  SyncHookJSONOutput,
  'hookSpecificOutput'
> &
  ([Extract<HookSpecificOutput, { hookEventName: HOOK_EVENT_NAME }>] extends [
    never,
  ]
    ? { hookSpecificOutput?: never }
    : {
        hookSpecificOutput?: Extract<
          HookSpecificOutput,
          { hookEventName: HOOK_EVENT_NAME }
        >;
      });

export function stopContinuationOutput(message: string): HookOutputFor<'Stop'> {
  return _enrichCursorStopOutput({
    hookSpecificOutput: {
      hookEventName: 'Stop',
      additionalContext: message,
    },
  });
}

/**
 * Cursor ignores Claude's stop hooks that do not "block".
 * We have to use a `followup_message` to make sure Cursor continues.
 */
function _enrichCursorStopOutput(
  output: HookOutputFor<'Stop'>,
): HookOutputFor<'Stop'> & { followup_message?: string } {
  return {
    followup_message: output.hookSpecificOutput?.additionalContext,
    ...output,
  };
}

function _parseHookInput<HOOK_EVENT_NAME extends HookEvent>(
  raw: string,
  hookEventName: HOOK_EVENT_NAME,
): HookInputFor<HOOK_EVENT_NAME> {
  const data = _normalizeHookInput(JSON.parse(raw) as HookInput, hookEventName);

  if (data.hook_event_name !== hookEventName) {
    throw new Error(
      `Expected hook event ${hookEventName}, got ${data.hook_event_name}`,
    );
  }

  return data as HookInputFor<HOOK_EVENT_NAME>;
}

function _normalizeHookInput(
  data: HookInput,
  hookEventName: HookEvent,
): HookInput {
  data.hook_event_name =
    _normalizeHookEventName(hookEventName) ?? hookEventName;
  return data;
}

/**
 * Claude Code hook names mapped to Cursor hook names.
 * @see https://cursor.com/docs/reference/third-party-hooks#hook-step-mapping
 */
const CURSOR_HOOK_EVENT_NAMES: Record<string, HookEvent> = {
  preToolUse: 'PreToolUse',
  postToolUse: 'PostToolUse',
  beforeSubmitPrompt: 'UserPromptSubmit',
  stop: 'Stop',
  subagentStop: 'SubagentStop',
  sessionStart: 'SessionStart',
  sessionEnd: 'SessionEnd',
  preCompact: 'PreCompact',
};

function _normalizeHookEventName(
  hookEventName: HookEvent,
): HookEvent | undefined {
  return CURSOR_HOOK_EVENT_NAMES[hookEventName];
}
