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
  output?: HookOutputFor<HOOK_EVENT_NAME>;
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

function _parseHookInput<HOOK_EVENT_NAME extends HookEvent>(
  raw: string,
  hookEventName: HOOK_EVENT_NAME,
): HookInputFor<HOOK_EVENT_NAME> {
  const data = _normalizeCursorHookInput(JSON.parse(raw) as HookInput);

  if (data.hook_event_name !== hookEventName) {
    throw new Error(
      `Expected hook event ${hookEventName}, got ${data.hook_event_name}`,
    );
  }

  return data as HookInputFor<HOOK_EVENT_NAME>;
}

function _normalizeCursorHookInput(data: HookInput): HookInput {
  if ((data.hook_event_name as string) === 'postToolUse') {
    data.hook_event_name = 'PostToolUse';
  }
  return data;
}
