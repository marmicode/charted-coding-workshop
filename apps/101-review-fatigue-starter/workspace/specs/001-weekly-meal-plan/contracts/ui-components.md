# Contract: UI Components

**Feature**: `001-weekly-meal-plan`  
**Date**: 2026-09-04

## Component tree

```text
MealPlanPage
├── (empty state) NoMealPlan / inline message
├── DaySlot × 7
│   ├── day label
│   ├── recipe name / empty prompt / broken message
│   └── actions: Add | Change | Remove | Move
└── RecipePicker (dialog or overlay)
    ├── RecipeFilter (reused)
    └── RecipePreview rows (selectable) OR compact recipe list
```

## MealPlanPage

**Selector**: `wm-meal-plan-page`  
**Route**: `/meal-plan`

| Element | `data-testid` | Content / behavior |
|---------|---------------|-------------------|
| Page root | `meal-plan-page` | Container for weekly plan |
| Page title | `meal-plan-title` | "Weekly Meal Plan" (or similar) |
| Week indicator | `meal-plan-week` | Current week label (e.g. "Week of Sep 6, 2026") |
| Empty state | `meal-plan-empty` | Shown when `isEmpty()` is true instead of the day-slot list. Day slots render only after the first assignment. |
| Day slots container | `meal-plan-days` | Wraps seven `DaySlot` components |

## DaySlot

**Selector**: `wm-day-slot`  
**Inputs**: `slot: DaySlotView`

| Element | `data-testid` | Content / behavior |
|---------|---------------|-------------------|
| Slot root | `day-slot-{weekday}` | e.g. `day-slot-monday` |
| Day label | `day-slot-label` | "Monday", etc. |
| Recipe name | `day-slot-recipe-name` | Recipe name when assigned; hidden when empty |
| Empty prompt | `day-slot-empty` | e.g. "No meal planned" when `status === 'empty'` |
| Broken message | `day-slot-broken` | e.g. "Recipe unavailable" when `status === 'broken'` |
| Add button | `day-slot-add` | Opens recipe picker; visible when empty |
| Change button | `day-slot-change` | Opens recipe picker; visible when assigned or broken |
| Remove button | `day-slot-remove` | Clears assignment; visible when assigned or broken |

## RecipePicker

**Selector**: `wm-recipe-picker`  
**Role**: Modal/dialog for selecting a recipe to assign to a target day

| Element | `data-testid` | Content / behavior |
|---------|---------------|-------------------|
| Picker root | `recipe-picker` | Dialog container |
| Picker title | `recipe-picker-title` | e.g. "Choose a recipe for Monday" |
| Recipe option | `recipe-picker-option-{recipeId}` | Selectable row per recipe |
| Confirm / select | `recipe-picker-select` | On recipe row click or explicit select button |
| Cancel | `recipe-picker-cancel` | Closes without assignment |
| No recipes | `recipe-picker-empty` | Message when collection is empty; link to search |

## Interaction flows

### Assign recipe (P1)

1. User clicks `day-slot-add` on an empty day.
2. `RecipePicker` opens with `data-testid="recipe-picker"`.
3. User selects a recipe.
4. Picker closes; corresponding `day-slot-{weekday}` shows `day-slot-recipe-name`.

### View plan (P2)

1. User navigates to `/meal-plan`.
2. `meal-plan-page` renders seven `day-slot-*` elements in Sunday–Saturday order.
3. Assigned days show recipe names; unassigned days show `day-slot-empty`.

### Remove recipe (P3)

1. User clicks `day-slot-remove` on an assigned day.
2. Slot returns to empty state (`day-slot-empty` visible, `day-slot-recipe-name` absent).

### Move recipe (P3)

1. User chooses "Move" action on an assigned day (button `day-slot-move` or via change flow).
2. User picks target day.
3. If the target is empty, source becomes empty and target shows the recipe. If the target already has a recipe, the two days swap.

## Accessibility

- All action buttons MUST have `aria-label` describing the action and day (e.g. "Add meal for Monday").
- Recipe picker MUST trap focus while open and restore focus on close.
- Day slots SHOULD use semantic headings or `role="list"` / `role="listitem"` for screen readers.

## Styling conventions

- Reuse `wm-card` for day slots where appropriate (consistent with `RecipePreview`).
- Reuse Material components (`MatButton`, `MatDialog` or CDK overlay) matching existing `recipe-preview` patterns.
- Responsive layout: seven slots stack vertically on narrow viewports; grid on wider screens.
