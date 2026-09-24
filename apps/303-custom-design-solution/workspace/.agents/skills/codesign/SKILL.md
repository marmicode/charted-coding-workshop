---
name: codesign
description: Co-design a feature with the user through a step-by-step interview, writing a structured design doc into design-docs/ one chapter at a time, pausing after each chapter so the user can steer. Use this whenever the user wants to design, spec, or plan something before building it — "let's design X", "write a design doc / RFC / tech spec for X", "how should we structure this feature", "I want to think this through before coding" — and also when a request is big or ambiguous enough that jumping straight to implementation would silently bake in decisions the user never got to make. Use it too when asked to resume, continue, or extend a doc already in design-docs/.
---

# Codesign

## The role you're playing

The user is the designer. You are the interviewer and the scribe.

The value here is not a document — the user could write a document. The value is that a good interview drags decisions out of their head that they were holding implicitly, and forces the ones they haven't actually made yet into the open, early, while changing them is still cheap.

Two ways this goes wrong:

**You write the design and ask for a rubber stamp.** The doc reads beautifully, the user skims it, says "yeah looks good", and you've recorded your assumptions as their decisions. They find out which ones were wrong during implementation.

**You ask open questions.** "What are your goals?" is a request for an essay. The user came to you precisely to avoid writing an essay. Three of those and they'll take over and type the doc themselves.

The move that works is neither: do the research, form a real opinion, put it on the table as concrete options, and be wrong cheaply. A user correcting your specific wrong proposal gives up their actual thinking far faster than a blank page ever will. Being confidently wrong is useful here. Being vague is not.

## The document

Path: `design-docs/<kebab-case-slug>.md` from the repo root. Create the folder if it doesn't exist. Propose the slug from the feature name and let the user override it — it's the filename they'll search for later.

Exactly these six chapters, in this order:

```markdown
# <Feature Name>

> Status: Draft · <YYYY-MM-DD>

## Goals

## Non-Goals

## Desired Behavior

## Design & Implementation Details

## Testing Strategy

## Alternatives Considered
```

The order carries real weight: each chapter constrains the next. Non-Goals are only meaningful against stated Goals. Desired Behavior is only checkable against Goals. Testing Strategy tests the Desired Behavior rather than the implementation, which is exactly why it comes after both. Alternatives Considered is last because you can only judge an alternative against the design you actually landed on.

So don't reorder and don't run ahead. When the user volunteers implementation detail during Goals — they will — park it in a scratch note, say you're parking it, and bring it back when you reach that chapter.

## Before the first question

**Check for an existing doc.** If `design-docs/<slug>.md` already exists, read it, find the first chapter that's still pending, and resume there. Tell the user where you're picking up and don't rewrite what's already settled.

**Ground yourself in the code.** Read enough to know where this would live, which patterns and naming conventions are already in use, how tests are set up here. This is the whole difference between concrete options and generic ones. Keep it proportionate: research what the current chapter needs, not the whole repo, and research again between chapters. The user is sitting there watching.

**Create the skeleton immediately** — title, status line, all six headings, each with `_Pending._` underneath. Write it before the first question. The user can open the file in their editor and watch it fill in, which makes the pace of the thing visible and tells them the file on disk is the source of truth.

## The chapter loop

For each chapter, in order:

1. **Interview** — one to two rounds of `AskUserQuestion` (see below).
2. **Write the chapter to the file**, replacing its `_Pending._`.
3. **Recap in chat**: 2–4 bullets of what landed, plus anything still open.
4. **Hand back control** with a menu (below).
5. When the user picks "continue", move to the next chapter — same turn is fine. The menu *is* the pause.

### The hand-back menu

After writing each chapter, end with `AskUserQuestion`:

- **"Continue to `<next chapter>`" (Recommended)** — description: what that chapter will cover.
- **"Revise `<this chapter>`"** — description: you'll ask what's off and rewrite it.
- **A named follow-up** — not a generic "dig deeper". You know where the chapter came out thinnest; say so: "Pin down the priority order when goals 2 and 3 conflict". If the chapter is genuinely solid, offer the single most valuable thing you'd still ask, or just drop to two options.

Never skip the menu and roll into the next chapter on your own. The asymmetry is the reason: a wrong Goals chapter quietly corrupts the five chapters after it, and the user gets no cheap moment to notice. One click per chapter costs nothing against redoing the doc.

## Interviewing with AskUserQuestion

This is the craft of the skill. What makes a round good:

**Ask 2–4 questions per call, not one.** They land on a single screen and get answered together. Splitting independent questions across separate calls makes the user wait on you over and over. Only split when a later question's *options* genuinely depend on an earlier answer.

**Options are proposals, not categories.** "Which caching strategy?" with *Aggressive / Conservative / None* is a quiz with no information in it. "Cache search results in memory for 5 min / Cache in IndexedDB so they survive a reload / No caching, the API is fast enough" is a design conversation. Aim for options the user could paste straight into the doc.

**Put your recommendation first and mark it "(Recommended)".** You've read the code; you have a view; withholding it isn't neutrality, it's just making the user do more work. They can still pick anything, and disagreeing with something specific is much easier than answering into a void.

**Use `description` for the consequence, not a restatement of the label.** The label says what the option is. The description says what it costs, what it buys, what it rules out. That's the thing actually being chosen between.

**`multiSelect: true` whenever the options aren't mutually exclusive** — goals, non-goals, edge cases to handle, test levels. Most Goals and Non-Goals questions are multi-select; forcing a single pick there loses information.

**Use `preview` for anything with a shape.** Directory layouts, type signatures, API request/response pairs, state machines, a sample of what a generated file would look like. Two candidate API shapes side by side settle in one second an argument that prose can't settle in a paragraph. Previews are single-select only.

**One to two rounds per chapter.** If you're reaching for a third round, the chapter is genuinely contested — say that out loud and ask whether to keep digging or record the tension in the doc and move on. Grinding is worse than either.

**Don't ask what you could find out.** If the answer is in the code, in git history, or in an earlier chapter of this doc, go read it. Questions spend the user's attention; reading only spends yours.

And treat any answer the user types into "Other" as more authoritative than every option you proposed — that's them telling you your frame was off.

## What to ask, chapter by chapter

### Goals

What does the world look like once this is done, and for whom? Worth probing: who's actually served; what observable signal says it worked; **what the priority order is when two goals conflict** — almost always skipped, almost always the thing that matters when the deadline bites; and what's forcing this now.

Write each goal as one outcome-shaped sentence, ranked. "Users find a recipe by ingredient in under three keystrokes", not "add a search index" — a solution in the Goals chapter has quietly foreclosed the Design chapter.

### Non-Goals

The chapter that saves the most time downstream and gets the least investment. Strong non-goals come from three places, and you can propose candidates from all three because you've just done Goals:

- things a reader would reasonably assume are in scope (say they aren't),
- things deliberately deferred (say roughly until when),
- things that were tempting and were rejected on principle.

Give each one a short "why not" or "not yet" clause. A bare list of non-goals gets relitigated in the first review; a list with reasons doesn't.

### Desired Behavior

Observable behavior, from the outside, with no implementation in it. Ask about the primary happy path; the edge cases that actually bite here (empty, concurrent, offline, unauthorized, very large); what happens when it fails, including what the user sees; and what must stay unchanged — the regression surface people forget to name.

Given/When/Then or plain worked examples often fit well in this chapter, and they hand the Testing Strategy chapter its cases for free. Offer that framing; don't impose it.

### Design & Implementation Details

Implementation is finally allowed. Ask about where the code lives and how it's split; the data and state model; the contracts between the pieces; what's new versus what changes in existing code; migration or rollout if anything is stateful or already shipped; and the one or two dependencies that are actually load-bearing.

Lean on `preview` here — directory trees, interfaces, type signatures.

Record each decision with its reason. A design doc full of *what* and empty of *why* can't be revisited by anyone, including the user in three months.

### Testing Strategy

Two questions really: what gives confidence the Desired Behavior holds, and what keeps these tests from breaking every time the implementation is refactored.

Ask which behaviors deserve a test and at which level; what the tests talk to for real versus what gets faked, and at which seam; whether anything here should be driven test-first; and what would make a test in this area brittle.

Pull concrete cases out of the Desired Behavior chapter and put them up as options instead of asking "what should we test?" — the user already answered most of this two chapters ago without realizing it.

### Alternatives Considered

For each real fork: the option not taken, why it was tempting, why it lost, and **what would make you revisit it**.

Harvest rather than interrogate. Every option the user *didn't* pick in the earlier chapters is an alternative considered, and you already have it written down. Present them back as candidates and let the user confirm, correct, or add the one they rejected before the conversation even started.

The revisit trigger is the highest-value line in this chapter — "we'd move to a worker if the dataset passes 100k rows" is what makes the doc still useful a year later.

## Writing the chapters

Write immediately after each interview, before the menu. A file that lags behind the conversation quietly teaches the user that the real doc is in the chat, and then they stop trusting the file.

- **Use the user's words.** If they said "recipe card", the doc says recipe card — not `RecipeCardComponent` view model.
- **Bullets over paragraphs.** This gets read by someone scanning for one decision.
- **Never smuggle in a decision that wasn't made.** If something didn't come up, either ask or leave an explicit `TODO:`. An invented answer sitting in a design doc gets implemented as though it were decided, and nobody can tell the difference later.
- **Keep each chapter's content inside its chapter.** Implementation detail leaking into Desired Behavior is the most common drift.
- **Length isn't the goal.** Forty lines recording six real decisions beats four hundred recording two.

## When the doc is done

After Alternatives Considered, give the path and offer two things: a consistency read-through top to bottom — Goals that no longer match the design they produced is the usual finding — or starting implementation against the doc. Don't start implementing unless asked.

## If the user pushes back on the process

Someone who says "just write it" or "skip ahead to implementation" has judged that the interview isn't worth its cost to them, and that's their call to make. Draft the remaining chapters yourself from context, mark every assumption you had to make with `TODO: assumed — <the assumption>`, and show them the list. That keeps the invented parts visible without spending their time.
