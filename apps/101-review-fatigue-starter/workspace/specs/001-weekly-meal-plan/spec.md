# Feature Specification: Weekly Meal Plan

**Feature Branch**: `001-weekly-meal-plan`

**Created**: 2026-09-04

**Status**: Draft

**Input**: User description: "Users can add existing recipes to a weekly meal plan so they know what to cook each day."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Add a recipe to a day (Priority: P1)

A home cook wants to decide what to make during the week. They select a recipe they already have in Whiskmate and assign it to a specific day so they do not have to decide at mealtime.

**Why this priority**: This is the core action described in the feature request. Without the ability to assign recipes to days, the meal plan delivers no value.

**Independent Test**: Can be fully tested by choosing one existing recipe, assigning it to a day (e.g., Tuesday), and confirming that day shows that recipe in the plan.

**Acceptance Scenarios**:

1. **Given** the user is viewing their weekly meal plan, **When** they choose an existing recipe and assign it to a day, **Then** that day displays the selected recipe.
2. **Given** the user is browsing their recipe collection, **When** they add a recipe to the meal plan from the recipe view, **Then** they can choose which day to assign it to and the assignment is saved.
3. **Given** a day already has a recipe assigned, **When** the user assigns a different recipe to that day, **Then** the new recipe replaces the previous one for that day.

---

### User Story 2 - View the weekly meal plan (Priority: P2)

A user opens the meal plan to see at a glance what they intend to cook each weekday, Monday through Sunday, including which days are still unplanned.

**Why this priority**: Users need a clear weekly overview to benefit from planning. Viewing the plan makes assignments meaningful and supports daily cooking decisions.

**Independent Test**: Can be fully tested by opening the meal plan and verifying all seven weekdays, Monday through Sunday, are shown with assigned recipes or a clear empty state.

**Acceptance Scenarios**:

1. **Given** the user has assigned recipes to some days, **When** they open the weekly meal plan, **Then** they see Monday through Sunday with assigned recipes shown on the correct days.
2. **Given** the user has not assigned any recipes, **When** they open the weekly meal plan, **Then** they see all seven weekdays, each showing that no recipe is planned, and a prompt to start adding recipes.
3. **Given** a day has an assigned recipe, **When** the user views that day on the plan, **Then** they see that recipe's name and picture.

---

### User Story 3 - Remove or change a planned recipe (Priority: P3)

A user changes their mind about a meal or needs to free up a day. They remove a recipe from a day or replace it with another recipe without losing the recipe from their collection.

**Why this priority**: Plans change frequently. Without edit and remove actions, users cannot correct mistakes or adapt to schedule changes, which reduces trust in the feature.

**Independent Test**: Can be fully tested by assigning a recipe to a day, removing it, and confirming the day returns to an unplanned state while the recipe remains available in the recipe collection.

**Acceptance Scenarios**:

1. **Given** a day has an assigned recipe, **When** the user removes the recipe from that day, **Then** the day shows as unplanned and the recipe remains in the recipe collection.
2. **Given** the same recipe is assigned to multiple days, **When** the user removes it from one day, **Then** only that day's assignment is removed and other assignments remain unchanged.

---

### Edge Cases

- What happens when the user tries to add a recipe but has no recipes in their collection, or none match the picker filters? The picker shows "No recipes found". Creating recipes is out of scope.
- What happens when a previously assigned recipe is no longer available in the recipe collection? That day renders as empty. The weekday slot stays, and the user can assign another recipe.
- What happens when the user assigns the same recipe to multiple days? The system allows it, since households often repeat favorite meals.
- What happens when the user opens the plan mid-week? The plan still shows Monday through Sunday. Earlier weekdays stay visible.
- What happens when the user reloads the app? The same weekday assignments are restored.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display seven weekday slots, Monday through Sunday, including days with no recipe. The plan is a reusable template, not a dated calendar week.
- **FR-002**: System MUST allow users to assign an existing recipe from their recipe collection to any weekday.
- **FR-003**: System MUST show assigned recipes on the correct weekday in the meal plan view.
- **FR-004**: System MUST replace the recipe assigned to a weekday when the user assigns a different existing recipe. No confirmation dialog.
- **FR-005**: System MUST allow users to remove a recipe assignment from a weekday without deleting the recipe from the recipe collection.
- **FR-006**: System MUST persist meal plan assignments so reloading the app restores the same weekday assignments.
- **FR-007**: System MUST show a clear empty state on each weekday with no assigned recipe. The seven slots stay visible when every day is empty.
- **FR-008**: System MUST allow the same recipe to be assigned to more than one weekday.
- **FR-009**: System MUST show the assigned recipe's name and picture on that weekday.
- **FR-010**: System MUST prevent assignment of recipes that do not exist in the user's recipe collection.
- **FR-011**: System MUST render a weekday as empty when its stored recipe is no longer in the recipe collection. The weekday slot stays.
- **FR-012**: System MUST allow users to assign a recipe to a weekday from the recipe collection view.

### Key Entities

- **Weekly Meal Plan**: A Monday–Sunday template, containing zero or one assigned recipe per weekday. Not a dated calendar week.
- **Day Slot**: A single weekday (Monday–Sunday) that can hold at most one assigned recipe at a time.
- **Recipe Assignment**: A link between an existing recipe and a weekday slot.
- **Recipe**: An existing item in the user's recipe collection, referenced by assignments but not duplicated or modified by the meal plan.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can assign a recipe to a day in under 30 seconds after opening the meal plan.
- **SC-002**: 90% of users can identify what they are cooking today from the weekly meal plan on their first visit without additional help.
- **SC-003**: Meal plan assignments persist across reloads with no data loss.
- **SC-004**: Users can add a recipe from the meal plan or from Search, and can replace or remove a recipe on the meal plan. Adding from Search stays on Search. Replace does not ask for confirmation.
- **SC-005**: At least 80% of users who complete one assignment return to view the weekly plan again within the same week.

## Assumptions

- Users already have access to a recipe collection within Whiskmate; creating new recipes is out of scope for this feature.
- Each day has one meal slot (one assigned recipe per day). Breakfast, lunch, and dinner slots are out of scope for this version.
- The meal plan is a reusable Monday–Sunday template. Dated calendar weeks are out of scope. Assignments stay until the user changes them.
- The feature serves a single user on a single device or account; shared household plans are out of scope.
- Grocery lists, nutritional summaries, and automatic meal suggestions are out of scope for this version.
- Standard web application responsiveness applies: the plan should load and reflect changes without noticeable delay during normal use.
