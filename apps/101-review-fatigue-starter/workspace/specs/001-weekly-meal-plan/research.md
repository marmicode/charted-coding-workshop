# Research: Weekly Meal Plan

**Feature**: `001-weekly-meal-plan`  
**Date**: 2026-09-04

## 1. Persistence strategy

**Decision**: Persist meal plan assignments in `localStorage` using the existing `LocalStorage` abstraction, keyed as `whiskmate:meal-plan`.

**Rationale**: The app already persists user state locally via `UserFavorites` (same `LocalStorage` service, JSON serialization, signal-based reactive updates). There is no backend API. This matches FR-007 (persist across sessions) with zero new infrastructure.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| In-memory only (signals, no persistence) | Fails SC-003; users lose plan on refresh |
| IndexedDB | Overkill for ≤7 recipe IDs per week |
| New backend API | Out of scope; no server exists in the monorepo |

## 2. Week scoping and auto-reset

**Decision**: Scope stored data to the current ISO calendar week (Monday–Sunday). On load, compare stored `weekKey` (format `YYYY-Www`, e.g. `2026-W36`) to the computed current week; if they differ, discard stored assignments and start a fresh plan.

**Rationale**: Matches spec assumptions (current week only, no rollover). ISO week with Monday start aligns with FR-001. A single storage blob with embedded `weekKey` is simpler than per-week keys for v1.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Per-week storage keys (`meal-plan:2026-W36`) | Adds read/write complexity for a feature that only displays the current week |
| Sunday-start week | Conflicts with spec (Monday–Sunday) |
| Manual "new week" action | Spec requires automatic reset at week boundary |

## 3. State management pattern

**Decision**: Implement a root-level `MealPlan` injectable service using Angular signals and computed values, mirroring `UserFavorites`.

**Rationale**: Consistent with Angular 22 patterns already in the codebase (`signal`, `computed`, `inject`). Keeps components thin and centralizes persistence, week rollover, and assignment rules.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Component-local state | Duplicates persistence logic across views; harder to share with recipe search |
| NgRx / external store | Unnecessary complexity for 7 slots of data |

## 4. Recipe resolution and broken references

**Decision**: Store only `recipeId` per day slot. Resolve display names via `RecipeRepository` at render time. If a stored ID is not found, mark the slot as `broken` and offer clear/replace actions (FR-012).

**Rationale**: Assignments reference existing recipes without duplication. Static `RECIPES` data can change; graceful degradation is required by spec edge cases.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Snapshot recipe name in storage | Stale names if recipe data changes; duplicates entity data |
| Delete assignment silently on missing recipe | Hides user context; violates FR-012 |

## 5. UI entry points

**Decision**: Add a dedicated `/meal-plan` route with navbar link. Assign recipes from the meal plan page via an in-page recipe picker. Defer "add from recipe card" (spec US1 scenario 2) to a follow-up slice unless trivial—primary flow is plan-centric.

**Rationale**: P1/P2 stories center on the weekly plan view. A plan page with picker satisfies FR-002 in one interaction path (SC-004). Recipe search page changes can be added in tasks if time permits without blocking MVP.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Modal-only, no dedicated route | No place for FR-001 seven-day overview |
| Drag-and-drop between days | Higher UX complexity; move can be a button/menu action for v1 |

## 6. Testing approach

**Decision**: Unit-test `MealPlan` service with a mock `LocalStorage` and mock `RecipeRepository`. Component tests for `MealPlanPage` and `DaySlot` using Vitest + jsdom (existing vite config). Use `data-testid` attributes consistent with `recipe-preview` (`recipe-name`, `recipe-like-button`).

**Rationale**: Vitest is configured in `vite.config.mts` but no tests exist yet. Service tests cover persistence, week rollover, and assignment rules cheaply. Component tests verify user-visible behavior.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| E2E only (Playwright) | No Playwright project configured in this workspace |
| No tests | Constitution template references TDD; service logic needs coverage |

## 7. Weekday representation

**Decision**: Use a `Weekday` union type (`'monday' | 'tuesday' | ... | 'sunday'`) as object keys in assignments. Display labels derived from a constant ordered array.

**Rationale**: Human-readable in storage JSON, type-safe in TypeScript, stable iteration order for rendering seven slots.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Numeric 0–6 (JS `Date.getDay()`) | Sunday-first numbering conflicts with Monday-start spec |
| ISO date strings per slot | Over-specified for "current week" v1; harder to move between days |
