# Implementation Plan: Weekly Meal Plan

**Branch**: `001-weekly-meal-plan` | **Date**: 2026-09-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-weekly-meal-plan/spec.md`

## Summary

Add a weekly meal plan to Whiskmate so users can assign existing recipes to weekdays (Monday–Sunday), view the plan at a glance, and update assignments (add, replace, remove). The plan is a reusable template, not a dated calendar week. Technical approach: new `meal-plan` feature module in the Angular app with a signal-based `MealPlan` service persisting to `localStorage` (same pattern as `UserFavorites`), a `/meal-plan` route, add-from-Search, and unit/component tests via Vitest.

## Technical Context

**Language/Version**: TypeScript 6.0 / Angular 22.1  
**Primary Dependencies**: Angular Router, Angular Signals, RxJS, Angular Material, Nx 23.2  
**Storage**: Browser `localStorage` via existing `LocalStorage` abstraction (`whiskmate:meal-plan` key)  
**Testing**: Vitest 4.1 + jsdom (`@analogjs/vitest-angular`)  
**Target Platform**: Web browser (SPA served by `@angular/build:dev-server`)  
**Project Type**: Nx monorepo, single Angular frontend app (`apps/whiskmate`)  
**Performance Goals**: Instant UI updates on assignment (<100ms perceived); no network latency (local data)  
**Constraints**: Monday–Sunday template with no week reset; one recipe per day; the same recipe may repeat; no backend; offline-capable via localStorage  
**Scale/Scope**: Single user; 7 day slots; ~10 static recipes in seed data; 1 new route, ~5 new source files, tests

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

The project constitution (`.specify/memory/constitution.md`) is a template and has not been ratified. **Gate status: PASS (provisional)** — design follows established Whiskmate conventions:

| Principle               | Compliance                                                          |
| ----------------------- | ------------------------------------------------------------------- |
| Match existing patterns | `MealPlan` service mirrors `UserFavorites` (signals + localStorage) |
| Test coverage           | Vitest unit tests for service; component tests for page/slots       |
| Simplicity              | No new libraries, no backend, no state management framework         |
| Independent testability | User stories map to service methods + UI `data-testid` contracts    |

**Post-design re-check**: No violations. Complexity Tracking table not required.

## Project Structure

### Documentation (this feature)

```text
specs/001-weekly-meal-plan/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── routes.md
│   ├── meal-plan-service.md
│   └── ui-components.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks — not yet created)
```

### Source Code (repository root)

```text
apps/whiskmate/src/app/
├── app.ts                          # Add MEAL PLAN nav link
├── app.routes.ts                   # Add /meal-plan route
├── recipe/                         # Existing (unchanged core)
│   ├── recipe.ts
│   ├── recipe-repository.ts
│   └── ...
├── meal-plan/                      # NEW feature folder
│   ├── meal-plan.ts                # Service: state, persistence, assignment rules
│   ├── meal-plan-week.ts           # Weekday types and empty plan factory
│   ├── meal-plan-page.ng.ts        # Main weekly plan view
│   ├── day-slot.ng.ts              # Single day slot component
│   ├── recipe-picker.ng.ts         # Recipe selection dialog/overlay
│   ├── no-meal-plan.ng.ts          # Empty week state (optional, may be inline)
│   └── meal-plan.router-helper.ts  # Route path constants
└── shared/
    └── local-storage.ts            # Existing (reused)

apps/whiskmate/src/app/meal-plan/
├── meal-plan.spec.ts               # Service unit tests
├── meal-plan-page.spec.ts          # Page component tests
└── day-slot.spec.ts                # Slot component tests
```

**Structure Decision**: Feature-folder colocation under `apps/whiskmate/src/app/meal-plan/`, consistent with the existing `recipe/` feature. No new Nx libraries for v1 — the scope is a single app feature.

## Complexity Tracking

> No constitution violations requiring justification.

## Phase 0: Research

Completed — see [research.md](./research.md).

**Resolved decisions**:

1. `localStorage` persistence via `LocalStorage` service
2. Monday–Sunday template with no week key and no automatic reset
3. Signal-based `MealPlan` injectable service
4. Recipe ID references; a missing id renders that day empty and the slot stays
5. Dedicated `/meal-plan` route, in-page recipe picker, and add-from-Search weekday picker
6. Vitest for service and component tests

## Phase 1: Design & Contracts

Completed — artifacts:

| Artifact         | Path                                                               | Purpose                                    |
| ---------------- | ------------------------------------------------------------------ | ------------------------------------------ |
| Data model       | [data-model.md](./data-model.md)                                   | Entities, storage schema, validation rules |
| Route contract   | [contracts/routes.md](./contracts/routes.md)                       | `/meal-plan` route and nav                 |
| Service contract | [contracts/meal-plan-service.md](./contracts/meal-plan-service.md) | `MealPlan` public API and behavior         |
| UI contract      | [contracts/ui-components.md](./contracts/ui-components.md)         | Components and `data-testid` selectors     |
| Quickstart       | [quickstart.md](./quickstart.md)                                   | Manual and automated validation guide      |

### Implementation sequence (for `/speckit-tasks`)

Recommended task ordering:

1. **Foundation**: `meal-plan-week.ts` (types, `createEmptyPlan`)
2. **Service**: `meal-plan.ts` with persistence, assign/remove, and missing-id resolution
3. **Service tests**: `meal-plan.spec.ts` (persistence, validation)
4. **Routing**: `meal-plan.router-helper.ts`, route in `app.routes.ts`, nav link in `app.ts`
5. **UI — DaySlot**: `day-slot.ng.ts` + tests
6. **UI — RecipePicker**: `recipe-picker.ng.ts`
7. **UI — MealPlanPage**: `meal-plan-page.ng.ts` + tests, wire picker
8. **Polish**: empty state, accessibility labels
9. **Verify**: run quickstart scenarios

### Key integration points

| Existing code                    | Integration                                      |
| -------------------------------- | ------------------------------------------------ |
| `RecipeRepository`               | Validate and resolve recipe IDs in `MealPlan`    |
| `LocalStorage`                   | Persist `whiskmate:meal-plan` JSON blob          |
| `RecipeFilter` / `RecipePreview` | Reuse in `RecipePicker` for consistent search UX |
| `App` navbar                     | Add `MEAL PLAN` link alongside `SEARCH`          |

### Out of scope (deferred)

- Drag-and-drop between days
- Dated calendar weeks, including past or future weeks
- Shopping list generation from plan

## Next Step

Run **`/speckit-tasks`** to generate `tasks.md` with dependency-ordered implementation tasks.
