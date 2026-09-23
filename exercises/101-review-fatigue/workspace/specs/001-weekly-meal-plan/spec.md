# Feature Specification: Weekly Meal Plan

**Feature Branch**: `001-weekly-meal-plan`

**Created**: 2026-09-04

**Status**: Draft

**Input**: User description: "Users can add existing recipes to a weekly meal plan so they know what to cook each day."

## User Scenarios & Testing *(mandatory)*

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

A user opens the meal plan to see at a glance what they intend to cook each day of the current week, including which days are still unplanned.

**Why this priority**: Users need a clear weekly overview to benefit from planning. Viewing the plan makes assignments meaningful and supports daily cooking decisions.

**Independent Test**: Can be fully tested by opening the meal plan and verifying all seven days of the current week are shown with assigned recipes or a clear empty state.

**Acceptance Scenarios**:

1. **Given** the user has assigned recipes to some days, **When** they open the weekly meal plan, **Then** they see all seven days of the current week with assigned recipes shown on the correct days.
2. **Given** the user has not assigned any recipes, **When** they open the weekly meal plan, **Then** they see an empty plan with a clear prompt to start adding recipes.
3. **Given** a day has an assigned recipe, **When** the user views that day on the plan, **Then** they can see enough recipe information (at minimum the recipe name) to know what to cook.

---

### User Story 3 - Remove or change a planned recipe (Priority: P3)

A user changes their mind about a meal or needs to free up a day. They remove a recipe from a day or move it to another day without losing the recipe from their collection.

**Why this priority**: Plans change frequently. Without edit and remove actions, users cannot correct mistakes or adapt to schedule changes, which reduces trust in the feature.

**Independent Test**: Can be fully tested by assigning a recipe to a day, removing it, and confirming the day returns to an unplanned state while the recipe remains available in the recipe collection.

**Acceptance Scenarios**:

1. **Given** a day has an assigned recipe, **When** the user removes the recipe from that day, **Then** the day shows as unplanned and the recipe remains in the recipe collection.
2. **Given** a recipe is assigned to one day, **When** the user moves it to a different day, **Then** the original day becomes unplanned and the new day shows the recipe.
3. **Given** the same recipe is assigned to multiple days, **When** the user removes it from one day, **Then** only that day's assignment is removed and other assignments remain unchanged.

---

### Edge Cases

- What happens when the user tries to add a recipe but has no recipes in their collection? The system should explain that recipes must exist first and guide the user to find or add recipes.
- What happens when a previously assigned recipe is no longer available in the recipe collection? The plan should indicate the assignment is broken and allow the user to clear or replace it.
- What happens at the start of a new calendar week? The plan resets to a new empty week for the current calendar week; assignments do not carry over automatically.
- What happens when the user assigns the same recipe to multiple days? The system allows it, since households often repeat favorite meals.
- What happens when the user opens the plan mid-week? The plan shows today plus the next six days.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a weekly meal plan covering all seven days of the current calendar week (Monday through Sunday).
- **FR-002**: System MUST allow users to assign an existing recipe from their recipe collection to any day of the current week.
- **FR-003**: System MUST show assigned recipes on the correct day in the weekly meal plan view.
- **FR-004**: System MUST allow users to replace the recipe assigned to a day with a different existing recipe.
- **FR-005**: System MUST allow users to remove a recipe assignment from a day without deleting the recipe from the recipe collection.
- **FR-006**: System MUST allow users to move a recipe assignment from one day to another within the current week.
- **FR-007**: System MUST persist meal plan assignments so they remain available when the user returns during the same calendar week.
- **FR-008**: System MUST show a clear empty state for days with no assigned recipe.
- **FR-009**: System MUST allow the same recipe to be assigned to more than one day in the same week.
- **FR-010**: System MUST provide enough recipe detail on the plan (at minimum recipe name) for the user to identify what to cook.
- **FR-011**: System MUST prevent assignment of recipes that do not exist in the user's recipe collection.
- **FR-012**: System MUST handle unavailable assigned recipes gracefully by flagging the broken assignment and allowing the user to clear or replace it.
- **FR-013**: System MUST allow users to assign a recipe to a day from the recipe collection view.

### Key Entities

- **Weekly Meal Plan**: A plan for the current calendar week, containing zero or one assigned recipe per day.
- **Day Slot**: A single day within the weekly plan (Monday–Sunday) that can hold at most one assigned recipe at a time.
- **Recipe Assignment**: A link between an existing recipe and a specific day slot within the current week's plan.
- **Recipe**: An existing item in the user's recipe collection, referenced by assignments but not duplicated or modified by the meal plan.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can assign a recipe to a day in under 30 seconds after opening the meal plan.
- **SC-002**: 90% of users can identify what they are cooking today from the weekly meal plan on their first visit without additional help.
- **SC-003**: Meal plan assignments persist across sessions within the same calendar week with no data loss.
- **SC-004**: Users can update their plan (add, replace, remove, or move a recipe) in a single interaction path per action without leaving the meal plan flow.
- **SC-005**: At least 80% of users who complete one assignment return to view the weekly plan again within the same week.

## Assumptions

- Users already have access to a recipe collection within Whiskmate; creating new recipes is out of scope for this feature.
- Each day has one meal slot (one assigned recipe per day). Breakfast, lunch, and dinner slots are out of scope for this version.
- Assigning to a day that already has a recipe is rejected. The user must remove the existing meal before assigning a different recipe.
- The meal plan covers only the current calendar week (Monday–Sunday). Navigating to past or future weeks is out of scope for this version.
- Assignments do not roll over automatically when a new week begins; each week starts with a fresh plan.
- The feature serves a single user on a single device or account; shared household plans are out of scope.
- Grocery lists, nutritional summaries, and automatic meal suggestions are out of scope for this version.
- Standard web application responsiveness applies: the plan should load and reflect changes without noticeable delay during normal use.
