# Research: Weekly Meal Plan

**Feature**: `001-weekly-meal-plan`  
**Date**: 2026-09-04

## 1. Persistence strategy

**Decision**: Persist meal plan assignments in `localStorage` using the existing `LocalStorage` abstraction, keyed as `whiskmate:meal-plan`.

**Rationale**: The app already persists user state locally via `UserFavorites` (same `LocalStorage` service, JSON serialization, signal-based reactive updates). There is no backend API. This matches FR-006 (persist across reloads) with zero new infrastructure.

**Alternatives considered**:

| Alternative                              | Rejected because                               |
| ---------------------------------------- | ---------------------------------------------- |
| In-memory only (signals, no persistence) | Fails SC-003; users lose plan on refresh       |
| IndexedDB                                | Overkill for ≤7 recipe IDs per week            |
| New backend API                          | Out of scope; no server exists in the monorepo |

## 2. Week scoping and auto-reset

**Decision**: Store one Monday–Sunday template. No week key. Reloading restores the same assignments. The plan is not tied to calendar dates.

**Rationale**: Matches FR-001 and FR-006. A reusable template avoids date math. Assignments stay until the user changes them.

**Alternatives considered**:

| Alternative                                    | Rejected because                                                                      |
| ---------------------------------------------- | ------------------------------------------------------------------------------------- |
| ISO week key (`YYYY-Www`) with automatic reset | The plan is not a dated calendar week. A new calendar week must not clear assignments |
| Per-week storage keys (`meal-plan:2026-W36`)   | There is one template, not a series of weeks                                          |
| Sunday-start week                              | Conflicts with spec (Monday–Sunday)                                                   |

## 3. State management pattern

**Decision**: Implement a root-level `MealPlan` injectable service using Angular signals and computed values, mirroring `UserFavorites`.

**Rationale**: Consistent with Angular 22 patterns already in the codebase (`signal`, `computed`, `inject`). Keeps components thin and centralizes persistence and assignment rules.

**Alternatives considered**:

| Alternative           | Rejected because                                                              |
| --------------------- | ----------------------------------------------------------------------------- |
| Component-local state | Duplicates persistence logic across views; harder to share with recipe search |
| NgRx / external store | Unnecessary complexity for 7 slots of data                                    |

## 4. Recipe resolution

**Decision**: Store only `recipeId` per day slot. Resolve name and picture via `RecipeRepository` at render time. If a stored ID is not found, that day renders as empty and the weekday slot stays (FR-011).

**Rationale**: Assignments reference existing recipes without duplication. A missing id uses the same empty state as an unplanned day, so the week view never crashes and never hides a weekday.

**Alternatives considered**:

| Alternative                                 | Rejected because                                                           |
| ------------------------------------------- | -------------------------------------------------------------------------- |
| Snapshot recipe name and picture in storage | Stale display data if the catalog changes; duplicates entity data          |
| Flag the slot as broken                     | A missing id renders as empty. A separate broken state disagrees with that |

## 5. UI entry points

**Decision**: Add a dedicated `/meal-plan` route with a navbar link. Assign recipes from the meal plan page via an in-page recipe picker, and from Search via a weekday picker on the recipe card (US1 scenario 2, FR-012). The picker reuses catalog filtering. Empty picker results show "No recipes found". Closing it without a selection leaves the day unchanged.

**Rationale**: FR-002 and FR-012 are both in scope. Search stays on Search (SC-004). The plan page still shows the seven weekdays (FR-001).

**Alternatives considered**:

| Alternative                    | Rejected because                                   |
| ------------------------------ | -------------------------------------------------- |
| Modal-only, no dedicated route | No place for the Monday–Sunday overview (FR-001)   |
| Defer add-from-Search          | FR-012 and US1 scenario 2 require it               |
| Drag-and-drop between days     | Out of scope. Assign, replace, and remove cover v1 |

## 6. Testing approach

**Decision**: Unit-test `MealPlan` service with a mock `LocalStorage` and mock `RecipeRepository`. Component tests for `MealPlanPage` and `DaySlot` using Vitest + jsdom (existing vite config). Use the `data-testid` values in the UI contract.

**Rationale**: Vitest is configured in `vite.config.mts` but no tests exist yet. Service tests cover persistence and assignment rules cheaply. Component tests verify user-visible behavior.

**Alternatives considered**:

| Alternative           | Rejected because                                                   |
| --------------------- | ------------------------------------------------------------------ |
| E2E only (Playwright) | No Playwright project configured in this workspace                 |
| No tests              | Constitution template references TDD; service logic needs coverage |

## 7. Weekday representation

**Decision**: Use a `Weekday` union type (`'monday' | 'tuesday' | ... | 'sunday'`) as object keys in assignments. Display labels derived from a constant ordered array.

**Rationale**: Human-readable in storage JSON, type-safe in TypeScript, stable iteration order for rendering seven slots.

**Alternatives considered**:

| Alternative                      | Rejected because                                         |
| -------------------------------- | -------------------------------------------------------- |
| Numeric 0–6 (JS `Date.getDay()`) | Sunday-first numbering conflicts with Monday-start spec  |
| ISO date strings per slot        | The plan is a Monday–Sunday template, not a set of dates |
