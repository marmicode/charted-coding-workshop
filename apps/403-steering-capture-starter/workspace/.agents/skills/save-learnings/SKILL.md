---
name: save-learnings
description: Persist steering captured by the learn-skills hooks into workspace conventions. Use when the user runs /save-learnings, asks to save learnings, or asks to apply cached session steering from .claude/hooks/learn-skills/.cache.
---

# Save learnings

You are applying **steering already detected** across cached sessions. Read every session file under `.claude/hooks/learn-skills/.cache/`, dedupe the learnings, persist durable preferences under `.agents/skills/workspace-conventions/`, then move the session files to `.claude/hooks/learn-skills/.cache/archived/`.

## Input

Read session JSON files that sit **directly** in `.claude/hooks/learn-skills/.cache/` (one file per session). Ignore the `archived/` directory and anything inside it. Do not use an inline Stop payload, and do not limit yourself to the current session.

Each file looks like:

```json
{
  "sessionId": "...",
  "transcriptPath": "/absolute/path/to/session.jsonl",
  "learnedSkills": [{ "description": "...", "seen": true }]
}
```

Collect every `learnedSkills` entry that has a non-empty `description`, from every readable session file. Include items whether `seen` is true or false. Invoking this skill is the confirmation; do not ask which items to keep.

If the cache directory is missing, or it contains no session files, stop without creating or editing files.

Skip a file you cannot parse. Leave unreadable files in `.cache/`; do not archive them.

## Dedupe

Build one candidate list:

1. Collapse items whose descriptions are very similar. Keep a single candidate.
2. For that candidate, keep the first non-empty `transcriptPath` among the sessions that contributed it. The transcript is only for recovering the rule from edits.

Do not re-classify sessions from scratch. Use this deduped list. Transcripts are for recovering rules from diffs and for context.

## Do not wait

Finish applying (or do nothing), archive the sessions you read, and exit. If a candidate cannot be generalized, skip it; do not ask the user.

## Guardrails

1. Never store secrets, tokens, passwords, or private personal data in skills.
2. If there are no qualifying learnings after filtering, do not create or update skill files. Still archive the session files you successfully read.
3. Prefer **no change** over low-quality or redundant skills.

## Recover the rule from the diff

Some cached descriptions are terse (“replace with asReadonly”). Don’t rely on the description text alone:

1. Find the user message(s) and the edit(s) that followed in that candidate’s transcript (`Edit`/`Write` tool_use entries — their `old_string`/`new_string`, or file diff).
2. Read the actual before → after code to recover the concrete pattern being replaced and its replacement.
3. State the generalized rule from that pattern, not from the message’s wording.
4. If the diff is a one-off (no reusable pattern — e.g. a typo fix, a hardcoded value change), drop it even if the cached description exists.
5. If `transcriptPath` is missing or the file cannot be read, keep the candidate only when the description itself is already a clear, reusable rule. Otherwise drop it.

Extract plain text from transcript `message.content` (string or text blocks only). Ignore `isMeta: true` messages, tool results, and local CLI command noise (`<command-name>`, `<local-command-caveat>`, `<local-command-stdout>`).

Skip a candidate if it is a duplicate or near-duplicate of steering already captured under `.agents/skills/workspace-conventions/references/` (search reference files and the index table in `.agents/skills/workspace-conventions/SKILL.md` when that file exists; if the hub or folder is missing yet, treat the index as empty).

## Filter for future usefulness

Keep a learning only if generalized it would help **future** sessions on this repo:

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

All learnings go into **`.agents/skills/workspace-conventions/`** — one skill directory for this repo’s captured steering. Do **not** create additional skill directories for each pattern.

### Bootstrap (when persisting learnings)

Do **not** create the skill tree on a no-op (guardrail 2). When you **do** have at least one learning to persist:

1. Create **`.agents/skills/workspace-conventions/`** if it does not exist.
2. Create **`.agents/skills/workspace-conventions/SKILL.md`** if it does not exist, using this hub template (keep the empty Index table until you add the first reference row):

```markdown
---
name: workspace-conventions
description: Repo-specific steering and conventions learned from user sessions. Use when working in this repository and preferences may apply beyond generic skills.
---

# Workspace conventions

Captured preferences from this project’s sessions. Read relevant rows in the **Index** and follow linked reference files.

## How to apply

1. Match the current task against **Triggers** in the Index.
2. Open the linked reference under `references/` and follow its **Instructions**.
3. When a reference conflicts with a one-off user message in the current session, prefer the current session.

## Index

| Topic | Triggers | Reference |
| ----- | -------- | --------- |
```

3. Create domain folders under `references/` as needed when adding reference files (the hub file alone is enough until the first reference).

If the directory or hub already exists, reuse them; only append or update content per the rules below.

### Hub (edit rarely)

- `.agents/skills/workspace-conventions/SKILL.md` — router, **Index** table (topic, triggers, link), and “how to apply”.

### Reference files (where new learnings go)

Pick a **domain subdirectory** under `.agents/skills/workspace-conventions/references/` and add `<slug>.md` inside it. Use a short, kebab-case folder name that groups related references (e.g. `workflow/`, `testing/`, `api/`). Examples:

| Example domain                  | Example path                             | Example use                                                  |
| ------------------------------- | ---------------------------------------- | ------------------------------------------------------------ |
| Repo-specific stack conventions | `references/api/error-responses.md`      | Choices that extend generic skill guidance for this codebase |
| Process / tooling               | `references/workflow/pr-descriptions.md` | Commits, PRs, review habits                                  |

Paths in the index table in `SKILL.md` should be relative to the skill root (e.g. `references/workflow/pr-descriptions.md`), matching other skills in `.agents/skills/`.

Create a new domain folder under `references/` when no existing one fits; do not force everything into a fixed list.

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

## Archive sessions

After the persistence pass (including when every learning was dropped):

1. Create `.claude/hooks/learn-skills/.cache/archived/` if needed.
2. Move each session file you successfully read from `.claude/hooks/learn-skills/.cache/` into that `archived/` directory.
3. If a file with the same name is already there, replace it.
4. Do not move `archived/` into itself, and do not recreate the session files in `.cache/`.

## When finished

Do not modify unrelated project files. Tell the user which conventions you added or updated, and that the session files were archived. If nothing qualified, say that and still confirm the archive.
