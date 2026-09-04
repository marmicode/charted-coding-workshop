# Tasks: Weekly Meal Planning

**Input**: Design documents from `/specs/001-weekly-meal-plan/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification. Validation is covered via quickstart.md manual checks in the Polish phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Angular application root: `apps/whiskmate/src/app/`
- Meal-plan feature: `apps/whiskmate/src/app/meal-plan/`
- Shared storage: `apps/whiskmate/src/app/shared/local-storage.ts`
- Recipe feature: `apps/whiskmate/src/app/recipe/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the meal-plan feature scaffold and wire it into the existing Angular app

- [ ] T001 Create meal-plan feature directory at `apps/whiskmate/src/app/meal-plan/`
- [ ] T002 [P] Add route helper with `MEAL_PLAN_PATH` and `mealPlan()` in `apps/whiskmate/src/app/meal-plan/meal-plan.router-helper.ts`
- [ ] T003 Register the meal-plan route in `apps/whiskmate/src/app/app.routes.ts` pointing to the meal-plan component
- [ ] T004 Add a "MEAL PLAN" navbar link in `apps/whiskmate/src/app/app.ts` using `meal-plan.router-helper.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Domain types, week calculation, persistence, and recipe lookup that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 [P] Define `WeeklyMealPlan`, `MealPlanEntry`, `LocalDate`, and `AddRecipeResult` types in `apps/whiskmate/src/app/meal-plan/meal-plan.ts` per `data-model.md` and `contracts/meal-plan-service.md`
- [ ] T006 [P] Implement local-calendar week helpers (`getCurrentWeekStart`, `getWeekDays`, `isDateInWeek`) in `apps/whiskmate/src/app/meal-plan/week.ts`
- [ ] T007 Add `findById(recipeId: string): Observable<Recipe | undefined>` to `apps/whiskmate/src/app/recipe/recipe-repository.ts` for recipe existence checks
- [ ] T008 Implement `MealPlanRepository` skeleton with `getWeek(weekStart?)` and localStorage read/write keyed by `meal-plan:{weekStart}` in `apps/whiskmate/src/app/meal-plan/meal-plan-repository.ts`
- [ ] T009 Implement `addRecipe(weekStart, recipeId, day)` success path in `apps/whiskmate/src/app/meal-plan/meal-plan-repository.ts` returning `{ ok: true, plan }` without mutating storage on validation failure
- [ ] T010 Create placeholder `MealPlan` component shell in `apps/whiskmate/src/app/meal-plan/meal-plan.ng.ts` and export it for routing

**Checkpoint**: Foundation ready — repository can load/save a week plan and add a valid recipe; route renders the shell component

---

## Phase 3: User Story 1 - Schedule recipes for the week (Priority: P1) 🎯 MVP

**Goal**: Users can select an existing recipe, assign it to a day in the current weekly meal plan, and see scheduled recipes under each day

**Independent Test**: Add one existing recipe to a day and confirm it appears on that day's meal plan; reload the page and confirm the entry persists

### Implementation for User Story 1

- [ ] T011 [US1] Render seven local-calendar day columns for the current week in `apps/whiskmate/src/app/meal-plan/meal-plan.ng.ts` using `MealPlanRepository.getWeek()`
- [ ] T012 [P] [US1] Add recipe picker UI that lists recipes from `RecipeRepository.search()` in `apps/whiskmate/src/app/meal-plan/meal-plan.ng.ts`
- [ ] T013 [US1] Wire day selection and add action to call `MealPlanRepository.addRecipe()` with the current week start in `apps/whiskmate/src/app/meal-plan/meal-plan.ng.ts`
- [ ] T014 [US1] Display each scheduled entry under its assigned day by joining `recipeId` with `RecipeRepository.findById()` in `apps/whiskmate/src/app/meal-plan/meal-plan.ng.ts`
- [ ] T015 [US1] Refresh the in-memory week view from the repository result after a successful add in `apps/whiskmate/src/app/meal-plan/meal-plan.ng.ts`

**Checkpoint**: User Story 1 is fully functional — users can add a recipe to a valid day, see it under that day, and find it again after reload

---

## Phase 4: User Story 2 - Prevent duplicate recipes (Priority: P1)

**Goal**: Users receive clear feedback when attempting to add a recipe that is already in the weekly meal plan; the plan never contains the same recipe twice

**Independent Test**: Add a recipe, attempt to add it again on the same or a different day, and confirm there is still only one occurrence with duplicate feedback shown

### Implementation for User Story 2

- [ ] T016 [US2] Enforce `recipeId` uniqueness across all entries in `apps/whiskmate/src/app/meal-plan/meal-plan-repository.ts`, returning `{ ok: false, reason: 'duplicate-recipe', plan }` without persisting
- [ ] T017 [US2] Show duplicate feedback when `addRecipe` returns `reason: 'duplicate-recipe'` in `apps/whiskmate/src/app/meal-plan/meal-plan.ng.ts`
- [ ] T018 [P] [US2] Disable or visually mark already-planned recipes in the recipe picker in `apps/whiskmate/src/app/meal-plan/meal-plan.ng.ts`

**Checkpoint**: User Stories 1 and 2 both work — scheduling and duplicate prevention with clear user feedback

---

## Phase 5: User Story 3 - Handle unavailable recipes gracefully (Priority: P2)

**Goal**: Users receive understandable feedback when a recipe cannot be found or the selected day is outside the current week; the plan remains unchanged

**Independent Test**: Attempt to add a missing recipe ID or an out-of-week date and confirm the plan is unchanged with an explanatory message shown

### Implementation for User Story 3

- [ ] T019 [US3] Return `{ ok: false, reason: 'recipe-not-found', plan }` when `RecipeRepository.findById()` does not resolve in `apps/whiskmate/src/app/meal-plan/meal-plan-repository.ts`
- [ ] T020 [US3] Return `{ ok: false, reason: 'invalid-day', plan }` when `day` is not one of the seven dates in the week in `apps/whiskmate/src/app/meal-plan/meal-plan-repository.ts`
- [ ] T021 [US3] Map `recipe-not-found` and `invalid-day` results to user-visible error messages in `apps/whiskmate/src/app/meal-plan/meal-plan.ng.ts`
- [ ] T022 [US3] Handle entries whose `recipeId` no longer resolves by showing an unavailable placeholder without removing the persisted entry in `apps/whiskmate/src/app/meal-plan/meal-plan.ng.ts`

**Checkpoint**: All user stories are independently functional with full validation and error feedback

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: End-to-end validation and UX refinements across all stories

- [ ] T023 [P] Ensure add feedback (success and error) is announced accessibly in `apps/whiskmate/src/app/meal-plan/meal-plan.ng.ts`
- [ ] T024 Run all scenarios in `specs/001-weekly-meal-plan/quickstart.md` against the running app
- [ ] T025 [P] Review meal-plan styling against existing recipe feature patterns in `apps/whiskmate/src/app/meal-plan/meal-plan.ng.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–5)**: All depend on Foundational phase completion
  - US1 (Phase 3) should complete before US2/US3 for the smoothest incremental delivery
  - US2 and US3 can proceed in parallel after US1 repository/UI wiring exists
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependencies on other stories
- **User Story 2 (P1)**: Depends on US1 add flow and repository `addRecipe` — extends validation and UI feedback
- **User Story 3 (P2)**: Depends on US1 add flow — adds remaining validation reasons and error display; independently testable once US1 exists

### Within Each User Story

- Repository validation before UI error handling
- Core add/view behavior before edge-case display (US3 unavailable recipe placeholder)
- Story complete before moving to the next priority

### Parallel Opportunities

- **Phase 1**: T002 can run in parallel with T001
- **Phase 2**: T005 and T006 can run in parallel; T007 is independent of meal-plan files
- **Phase 3**: T012 can run in parallel with T011 once T010 exists
- **Phase 4**: T018 can run in parallel with T016 after T017's contract is known
- **Phase 6**: T023 and T025 can run in parallel

---

## Parallel Example: User Story 1

```bash
# After foundational work completes, launch UI tasks together:
Task: "Render seven local-calendar day columns in apps/whiskmate/src/app/meal-plan/meal-plan.ng.ts"
Task: "Add recipe picker UI in apps/whiskmate/src/app/meal-plan/meal-plan.ng.ts"

# Then wire interactions sequentially:
Task: "Wire day selection and add action in apps/whiskmate/src/app/meal-plan/meal-plan.ng.ts"
Task: "Display scheduled entries joined with RecipeRepository in apps/whiskmate/src/app/meal-plan/meal-plan.ng.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Add one recipe to a day, verify display, reload and confirm persistence
5. Demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → foundation ready
2. Add User Story 1 → test independently → deploy/demo (MVP)
3. Add User Story 2 → test duplicate prevention → deploy/demo
4. Add User Story 3 → test error handling → deploy/demo
5. Polish with quickstart validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 UI (T011–T015)
   - Developer B: User Story 2 validation (T016) after T013 lands
   - Developer C: User Story 3 validation (T019–T020) after T009 lands
3. Integrate UI feedback tasks (T017–T018, T021–T022) as validation hooks land

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence
