# Feature Specification: Weekly Meal Planning

**Feature Branch**: `001-weekly-meal-plan`
**Created**: 2026-09-04
**Status**: Draft
**Input**: User description: "Users can add existing recipes to a weekly meal plan so they know what to cook each day. Users can't add the same recipe twice."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Schedule recipes for the week (Priority: P1)
Users can select an existing recipe and assign it to a day in the weekly meal plan, allowing them to see what they intend to cook each day.

**Why this priority**: Scheduling recipes is the core value of the feature.

**Independent Test**: Add one existing recipe to a day and confirm it appears on that day's meal plan.

**Acceptance Scenarios**:
1. **Given** a user has existing recipes and an empty weekly meal plan, **When** they add a recipe to a selected day, **Then** the recipe appears assigned to that day.
2. **Given** a weekly meal plan contains scheduled recipes, **When** the user views the plan, **Then** each scheduled recipe is shown under its assigned day.

---

### User Story 2 - Prevent duplicate recipes (Priority: P1)
Users receive clear feedback when they try to add a recipe that is already in the weekly meal plan, so the plan does not contain the same recipe twice.

**Why this priority**: Preventing duplicates is an explicit business rule and preserves a reliable plan.

**Independent Test**: Add a recipe, attempt to add it again, and confirm there is still only one occurrence.

**Acceptance Scenarios**:
1. **Given** a recipe is already in the weekly meal plan, **When** the user tries to add that recipe again, **Then** the recipe is not added a second time and the user is told it is already planned.

---

### User Story 3 - Handle unavailable recipes gracefully (Priority: P2)
Users receive understandable feedback when an existing recipe cannot be added because it is unavailable or the requested day is invalid.

**Why this priority**: Clear feedback prevents confusion and protects the accuracy of the plan.

**Independent Test**: Attempt to add an unavailable recipe or invalid day and confirm the plan remains unchanged with an explanation shown.

**Acceptance Scenarios**:
1. **Given** the selected recipe cannot be found, **When** the user attempts to add it, **Then** the plan remains unchanged and the user sees an error message.
2. **Given** the user selects a day outside the current weekly plan, **When** they attempt to add a recipe, **Then** the plan remains unchanged and the user is prompted to select a valid day.

---

### Edge Cases
- A user attempts to add the same recipe to a different day; the duplicate rule prevents the second assignment.
- A user refreshes or revisits the plan; previously scheduled recipes remain visible.
- The selected recipe is deleted or becomes unavailable before the add action completes; no plan entry is created and the user is informed.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: Users MUST be able to view a meal plan for the current week organized by day.
- **FR-002**: Users MUST be able to choose an existing recipe and assign it to a valid day in the current weekly meal plan.
- **FR-003**: The system MUST display each scheduled recipe under the day to which it is assigned.
- **FR-004**: The system MUST prevent a recipe from appearing more than once in the same weekly meal plan, regardless of the selected day.
- **FR-005**: When a duplicate is attempted, the system MUST leave the existing plan unchanged and provide clear feedback that the recipe is already scheduled.
- **FR-006**: The system MUST preserve scheduled recipes when the user leaves and returns to the weekly meal plan.
- **FR-007**: The system MUST reject additions for unavailable recipes or invalid days without changing the meal plan and MUST explain the problem to the user.

### Key Entities
- **Weekly Meal Plan**: A user's plan for one calendar week, containing scheduled recipe assignments.
- **Recipe**: An existing cookable recipe that can be scheduled, identified by a stable identity and descriptive information.
- **Meal Plan Entry**: The relationship between one recipe and one valid day within a weekly meal plan.

## Success Criteria *(mandatory)*

### Measurable Outcomes
- **SC-001**: At least 90% of users can add an existing recipe to a selected day and verify it in the weekly plan within 60 seconds.
- **SC-002**: 100% of duplicate-add attempts leave no duplicate recipe in the weekly meal plan.
- **SC-003**: At least 95% of successful additions are visible under the selected day within 2 seconds.
- **SC-004**: At least 90% of users correctly identify what recipe is planned for each scheduled day in usability testing.

## Assumptions
- Each user has one active weekly meal plan for the selected calendar week.
- A recipe may be scheduled at most once per weekly meal plan, even if the user selects another day.
- Users can schedule recipes only from the set of recipes already available to them.
- This feature covers adding and viewing planned recipes; editing, removing, and repeating plans are outside the requested scope.
- The system uses the user's local calendar week and provides the current week by default.
