# Contradictions

Planted lines in the 101 starter review packet. Each item links the statements that disagree.

## Design doc

Empty week hides the seven days vs empty days stay visible:

- [design-docs/001-weekly-meal-plan.md:78](../../101-review-fatigue-starter/workspace/design-docs/001-weekly-meal-plan.md#L78)

  > If there are no recipes, hide the seven days and show only an empty message.

- [design-docs/001-weekly-meal-plan.md:20](../../101-review-fatigue-starter/workspace/design-docs/001-weekly-meal-plan.md#L20)

  > An empty day shows that no recipe is planned for that day, even if the whole week is empty.

Mid-week hides past days vs a Monday–Sunday template:

- [design-docs/001-weekly-meal-plan.md:79](../../101-review-fatigue-starter/workspace/design-docs/001-weekly-meal-plan.md#L79)

  > If the cook opens the plan in the middle of the week, show only today and the next 6 days. Past days are hidden.

- [design-docs/001-weekly-meal-plan.md:19](../../101-review-fatigue-starter/workspace/design-docs/001-weekly-meal-plan.md#L19)

  > Meal Plan page shows seven weekday slots: Monday through Sunday, not a calendar week tied to dates.

Sunday-first `Weekday` and Sunday–Saturday map vs Monday through Sunday:

- [design-docs/001-weekly-meal-plan.md:85](../../101-review-fatigue-starter/workspace/design-docs/001-weekly-meal-plan.md#L85)

  > `export type Weekday = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';`

- [design-docs/001-weekly-meal-plan.md:97](../../101-review-fatigue-starter/workspace/design-docs/001-weekly-meal-plan.md#L97)

  > Sunday–Saturday map. Not a calendar week tied to dates.

- [design-docs/001-weekly-meal-plan.md:19](../../101-review-fatigue-starter/workspace/design-docs/001-weekly-meal-plan.md#L19)

  > Meal Plan page shows seven weekday slots: Monday through Sunday, not a calendar week tied to dates.

Occupied day is a no-op, or swaps, vs replace, and a recipe already on another day is a no-op vs the same recipe on more than one day:

- [design-docs/001-weekly-meal-plan.md:104](../../101-review-fatigue-starter/workspace/design-docs/001-weekly-meal-plan.md#L104)

  > Does nothing if that day already has a recipe. The cook must clear it first.

- [design-docs/001-weekly-meal-plan.md:80](../../101-review-fatigue-starter/workspace/design-docs/001-weekly-meal-plan.md#L80)

  > Moving a recipe onto a day that already has one swaps the two recipes.

- [design-docs/001-weekly-meal-plan.md:24](../../101-review-fatigue-starter/workspace/design-docs/001-weekly-meal-plan.md#L24)

  > Assigning a recipe to a day that already has one replaces the previous recipe.

- [design-docs/001-weekly-meal-plan.md:103](../../101-review-fatigue-starter/workspace/design-docs/001-weekly-meal-plan.md#L103)

  > Does nothing if that recipe is already planned on another day.

- [design-docs/001-weekly-meal-plan.md:25](../../101-review-fatigue-starter/workspace/design-docs/001-weekly-meal-plan.md#L25)

  > The same recipe may be assigned to more than one day.

## Spec Kit

Mid-week start hides past days vs earlier weekdays staying visible:

- [specs/001-weekly-meal-plan/contracts/meal-plan-service.md:28](../../101-review-fatigue-starter/workspace/specs/001-weekly-meal-plan/contracts/meal-plan-service.md#L28)

  > Reactive list of seven day slots, Sunday through Saturday, including empty days. Opening the plan mid-week shows today and the next six days. Past days are hidden.

- [specs/001-weekly-meal-plan/spec.md:65](../../101-review-fatigue-starter/workspace/specs/001-weekly-meal-plan/spec.md#L65)

  > What happens when the user opens the plan mid-week? The plan still shows Monday through Sunday. Earlier weekdays stay visible.

Sunday-first and Sunday–Saturday vs Monday through Sunday:

- [specs/001-weekly-meal-plan/contracts/meal-plan-service.md:14](../../101-review-fatigue-starter/workspace/specs/001-weekly-meal-plan/contracts/meal-plan-service.md#L14)

  > `export type Weekday = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';`

- [specs/001-weekly-meal-plan/contracts/meal-plan-service.md:28](../../101-review-fatigue-starter/workspace/specs/001-weekly-meal-plan/contracts/meal-plan-service.md#L28)

  > Reactive list of seven day slots, Sunday through Saturday, including empty days. Opening the plan mid-week shows today and the next six days. Past days are hidden.

- [specs/001-weekly-meal-plan/data-model.md:14](../../101-review-fatigue-starter/workspace/specs/001-weekly-meal-plan/data-model.md#L14)

  > Represents one of the seven days in a weekly plan (Monday-first).

- [specs/001-weekly-meal-plan/research.md:32](../../101-review-fatigue-starter/workspace/specs/001-weekly-meal-plan/research.md#L32)

  > Sunday-start week — Conflicts with spec (Monday–Sunday)

- [specs/001-weekly-meal-plan/spec.md:72](../../101-review-fatigue-starter/workspace/specs/001-weekly-meal-plan/spec.md#L72)

  > **FR-001**: System MUST display seven weekday slots, Monday through Sunday, including days with no recipe. The plan is a reusable template, not a dated calendar week.

- [specs/001-weekly-meal-plan/contracts/meal-plan-service.md:67](../../101-review-fatigue-starter/workspace/specs/001-weekly-meal-plan/contracts/meal-plan-service.md#L67)

  > No stored data — Create an empty Monday–Sunday plan

Assign no-op and swap vs repeating a recipe, and vs replace:

- [specs/001-weekly-meal-plan/contracts/meal-plan-service.md:34](../../101-review-fatigue-starter/workspace/specs/001-weekly-meal-plan/contracts/meal-plan-service.md#L34)

  > Assign a recipe to a weekday. Does nothing if that recipe is already planned on another day. Does nothing if that day already has a recipe. The cook must clear it first. Moving a recipe onto a day that already has one swaps the two recipes. No-ops if recipeId is not in the collection.

- [specs/001-weekly-meal-plan/spec.md:79](../../101-review-fatigue-starter/workspace/specs/001-weekly-meal-plan/spec.md#L79)

  > **FR-008**: System MUST allow the same recipe to be assigned to more than one weekday.

- [specs/001-weekly-meal-plan/contracts/meal-plan-service.md:50](../../101-review-fatigue-starter/workspace/specs/001-weekly-meal-plan/contracts/meal-plan-service.md#L50)

  > `recipeId` is already assigned to another day — Both days show that recipe (FR-008)

- [specs/001-weekly-meal-plan/spec.md:75](../../101-review-fatigue-starter/workspace/specs/001-weekly-meal-plan/spec.md#L75)

  > **FR-004**: System MUST replace the recipe assigned to a weekday when the user assigns a different existing recipe. No confirmation dialog.

- [specs/001-weekly-meal-plan/contracts/meal-plan-service.md:49](../../101-review-fatigue-starter/workspace/specs/001-weekly-meal-plan/contracts/meal-plan-service.md#L49)

  > `day` already has a recipe — Previous recipe replaced (FR-004). No confirmation dialog

- [specs/001-weekly-meal-plan/contracts/ui-components.md:46](../../101-review-fatigue-starter/workspace/specs/001-weekly-meal-plan/contracts/ui-components.md#L46)

  > Change button — Opens recipe picker; visible when assigned. Selecting a recipe replaces the previous one

Empty state replaces the seven slots vs the seven slots staying visible:

- [specs/001-weekly-meal-plan/contracts/ui-components.md:30](../../101-review-fatigue-starter/workspace/specs/001-weekly-meal-plan/contracts/ui-components.md#L30)

  > Empty state — Shown when `isEmpty()` is true instead of the seven day slots. The slots appear after the first assignment.

- [specs/001-weekly-meal-plan/contracts/ui-components.md:31](../../101-review-fatigue-starter/workspace/specs/001-weekly-meal-plan/contracts/ui-components.md#L31)

  > Day slots container — Always wraps seven `DaySlot` components, Monday through Sunday

- [specs/001-weekly-meal-plan/contracts/ui-components.md:11](../../101-review-fatigue-starter/workspace/specs/001-weekly-meal-plan/contracts/ui-components.md#L11)

  > DaySlot × 7 (Monday through Sunday, including empty days)

- [specs/001-weekly-meal-plan/contracts/ui-components.md:75](../../101-review-fatigue-starter/workspace/specs/001-weekly-meal-plan/contracts/ui-components.md#L75)

  > `meal-plan-page` renders seven `day-slot-*` elements in Monday–Sunday order, including when every day is empty.

- [specs/001-weekly-meal-plan/spec.md:78](../../101-review-fatigue-starter/workspace/specs/001-weekly-meal-plan/spec.md#L78)

  > **FR-007**: System MUST show a clear empty state on each weekday with no assigned recipe. The seven slots stay visible when every day is empty.
