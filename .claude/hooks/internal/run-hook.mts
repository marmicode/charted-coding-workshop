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
    console.log(JSON.stringify(_normalizeHookOutput(output)));
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

/**
 * Cursor ignores Claude's stop hooks that do not "block".
 * We have to use a `followup_message` to make sure Cursor continues.
 *
 * Copilot CLI expects `additionalContext` at the top level and ignores
 * Claude's nested `hookSpecificOutput.additionalContext`.
 */
function _normalizeHookOutput(output: HookJsonOutput): HookJsonOutput {
  const hookSpecificOutput = output.hookSpecificOutput;
  if (
    hookSpecificOutput?.hookEventName === 'Stop' &&
    hookSpecificOutput.additionalContext
  ) {
    output = {
      ...output,
      followup_message: hookSpecificOutput.additionalContext,
    };
  }

  if (
    hookSpecificOutput &&
    'additionalContext' in hookSpecificOutput &&
    hookSpecificOutput?.additionalContext
  ) {
    output = {
      ...output,
      additionalContext: hookSpecificOutput.additionalContext,
    };
  }

  return output;
}

type HookJsonOutput = SyncHookJSONOutput & {
  followup_message?: string;
  additionalContext?: string;
};

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

  data = _normalizeCopilotHookInput(data);

  return data;
}

/**
 * Copilot CLI uses `path` instead of `file_path` in tool inputs.
 * Some versions also send camelCase payloads (`toolName`, `toolArgs` as a JSON string).
 */
function _normalizeCopilotHookInput(data: HookInput): HookInput {
  if (
    'tool_input' in data &&
    data.tool_input !== null &&
    typeof data.tool_input === 'object' &&
    'path' in data.tool_input
  ) {
    data = {
      ...data,
      tool_input: {
        ...data.tool_input,
        file_path: data.tool_input.path,
      },
    };
  }

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
