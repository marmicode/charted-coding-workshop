import { $, which } from 'zx';

type AgentBin = 'claude' | 'cursor-agent';

/**
 * `cursor-agent` does not support an output JSON schema, so its reply is free
 * text. Pull the JSON object or array out of that text.
 */
function parseJsonFromAgentText(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) {
    return undefined;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    const objectStart = trimmed.indexOf('{');
    const objectEnd = trimmed.lastIndexOf('}');
    if (objectStart >= 0 && objectEnd > objectStart) {
      try {
        return JSON.parse(trimmed.slice(objectStart, objectEnd + 1));
      } catch {
        // fall through to array extraction
      }
    }

    const arrayStart = trimmed.indexOf('[');
    const arrayEnd = trimmed.lastIndexOf(']');
    if (arrayStart < 0 || arrayEnd <= arrayStart) {
      return undefined;
    }

    try {
      return JSON.parse(trimmed.slice(arrayStart, arrayEnd + 1));
    } catch {
      return undefined;
    }
  }
}

export async function runAgent(
  prompt: string,
  options: { cwd: string; env?: NodeJS.ProcessEnv },
): Promise<unknown> {
  const { bin, args } = await _resolveAgentInvocation(options.cwd);
  const result = await $({
    cwd: options.cwd,
    quiet: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: options.env,
  })`${bin} ${args} ${prompt}`.nothrow();

  return parseJsonFromAgentText(result.text().trim() || result.stderr.trim());
}

async function _resolveAgentInvocation(
  cwd: string,
): Promise<{ bin: AgentBin; args: string[] }> {
  const preferred = _currentAgent();
  const bin = (await _hasBin(preferred))
    ? preferred
    : await _fallbackAgent(preferred);

  if (bin === 'cursor-agent') {
    return {
      bin,
      args: ['--print', '--force', '--trust', '--workspace', cwd],
    };
  }

  return {
    bin,
    args: ['--print', '--permission-mode', 'dontAsk', '--model', 'haiku'],
  };
}

function _currentAgent(): AgentBin {
  if (process.env.CURSOR_AGENT) {
    return 'cursor-agent';
  }

  return 'claude';
}

async function _fallbackAgent(preferred: AgentBin): Promise<AgentBin> {
  const other: AgentBin = preferred === 'claude' ? 'cursor-agent' : 'claude';

  if (await _hasBin(other)) {
    return other;
  }

  return preferred;
}

async function _hasBin(bin: string): Promise<boolean> {
  try {
    await which(bin);
    return true;
  } catch {
    return false;
  }
}
