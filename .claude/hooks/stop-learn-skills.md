# Stop skill learning

You run once at **Stop** (when the user or Claude ends a turn). Extract durable preferences from **steering** user messages in the session transcript and persist them as project skills.

## Hook input

The hook receives JSON on stdin (also passed as `$ARGUMENTS` in your task). Important fields:

- `transcript_path` — path to the session `.jsonl` transcript
- `cwd` — project root; all paths below are relative to this
- `session_id`
- `hook_event_name` — `"Stop"`
- `stop_hook_active` — if `true`, a prior Stop hook already continued the turn; **stop immediately** (no reads, no writes)
- `last_assistant_message` — final assistant text for this turn (optional; prefer the transcript for steering)
- `permission_mode`, `background_tasks`, `session_crons` — informational only

## Allow Claude to stop

This is a side-effect hook, not a gate. Do **not** block the stop: never return `{ "ok": false, ... }` or otherwise prevent completion. Finish learning (or do nothing) and exit without requesting more work.

## Guardrails

1. If `stop_hook_active` is `true`, **stop immediately** (no reads, no writes).
2. If the transcript file is missing or unreadable, stop.
3. Never store secrets, tokens, passwords, or private personal data in skills.
4. If there are no qualifying steering messages, stop without creating files.
5. Prefer **no change** over low-quality or redundant skills.

## What counts as a steering message

Read the transcript line by line (JSONL). Consider a user message **steering** when it is human guidance that redirects or constrains ongoing work, especially:

- `promptSource` is `"queued"` (user sent while the agent was already working)
- A mid-session correction, refinement, or constraint (e.g. “use Edit not Write”, “don’t commit unless asked”, “match existing style”, “smaller diff”)
- A reusable preference stated during the session, even if `promptSource` is `"typed"`
- A terse, imperative pattern-substitution instruction that names or points at specific code and says to replace it with something else (e.g. “use X instead of Y”) — even though it states no abstract rule itself and targets a single file/line. Do not judge these by wording alone; see “Recover the rule from the diff” below.

**Exclude:**

- `isMeta: true` messages
- Tool results (`message.content` is an array with `tool_result`)
- Local CLI command noise (`<command-name>`, `<local-command-caveat>`, `<local-command-stdout>`)
- Pure task requests with genuinely no reusable lesson, where the resulting edit is also a one-off with no generalizable pattern (“increment 42 to 43”, “fix the build”). A terse pattern-substitution instruction (previous bullet) is **not** excluded just because it lacks a stated rule or targets one file.
- Duplicate or near-duplicate steering already captured under `.agents/learned-skills/` (search reference files and the index table in [SKILL.md](.agents/learned-skills/SKILL.md))

Extract plain text from `message.content` (string or text blocks only).

### Recover the rule from the diff

Some steering messages are too terse to state the rule (“replace with asReadonly”). For these, don’t rely on the message text alone:

1. Find the edit(s) that followed in the transcript (`Edit`/`Write` tool_use entries — their `old_string`/`new_string`, or file diff) that the message caused.
2. Read the actual before → after code to recover the concrete pattern being replaced and its replacement.
3. State the generalized rule from that pattern, not from the message’s wording.
4. If the diff is a one-off (no reusable pattern — e.g. a typo fix, a hardcoded value change), drop it even if the instruction was terse and imperative.

## Filter for future usefulness

Keep a steering message only if generalized it would help **future** sessions on this repo:

- Coding conventions, workflow rules, tool preferences, review standards, commit/PR behavior
- Architecture or testing expectations that apply beyond one file

Drop one-off navigation, status checks, and session-specific trivia.

## Generalize

For each kept insight:

- Remove ephemeral details (branch names, ticket IDs, timestamps) unless they are the rule itself
- Replace specific file paths with patterns when the rule is broader (“in Angular components under `apps/`…”)
- Write imperative, testable instructions (“Do X”, “Never Y”, “Prefer Z”)
- Preserve the user’s intent; do not invent policies they did not imply

## Skill files (umbrella only)

All learnings go into **`.agents/learned-skills/`**. There is only one skill (`SKILL.md`); do **not** create additional skill directories for each pattern.

### Hub (edit rarely)

- `.agents/learned-skills/SKILL.md` — router, **Index** table (topic, triggers, link), and “how to apply”.

### Reference files (where new learnings go)

Pick a **domain subdirectory** under `.agents/learned-skills/` and add `<slug>.md` inside it. Use a short, kebab-case folder name that groups related references (e.g. `workflow/`, `testing/`, `api/`). Examples:

| Example domain                  | Example path                          | Example use                                    |
| ------------------------------- | ------------------------------------- | ---------------------------------------------- |
| Repo-specific stack conventions | `api/error-responses.md` | Choices that extend generic skill guidance for this codebase |
| Process / tooling               | `workflow/pr-descriptions.md`         | Commits, PRs, review habits                    |

Create a new domain folder when no existing one fits; do not force everything into a fixed list.

- `<slug>`: lowercase letters, numbers, hyphens; max 64 chars; stable across updates.
- Reference files are **not** skills: no YAML frontmatter, no symlinks.
- **Merge** into an existing reference when the topic matches; otherwise add a new file and a new row in the **Index** table in `SKILL.md`.
- Update the index **Triggers** column in `SKILL.md` when you extend an existing pattern.

### Reference file format

```markdown
# <Title>

## Instructions

<Clear, generalized bullets or short sections>

## Examples

<Optional: 1–2 short before/after or do/don’t examples>
```

- Prefer **no change** over adding a redundant reference or index row.
- Do **not** set `disable-model-invocation` on the hub unless conventions should never auto-load.

## Output

When finished, reply with a short summary:

- Reference files and/or `SKILL.md` index updated under `.agents/learned-skills/`, or “no learnings”

Do not modify unrelated project files.
