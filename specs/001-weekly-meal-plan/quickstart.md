# Quickstart Validation

1. Start the app with `npm start`.
2. Open the weekly meal-plan view; verify seven local-calendar days are shown.
3. Select an existing recipe, choose a day, and add it. Verify it appears under that day within two seconds.
4. Reload or leave and return to the view. Verify the entry remains.
5. Attempt to add the same recipe on the same or another day. Verify there is still one entry and clear duplicate feedback is shown.
6. Exercise service tests with the repository's Vitest target. Verify missing recipe IDs and dates outside the seven-day week return errors and leave persisted data unchanged.

Detailed entity and result definitions are in `data-model.md` and `contracts/meal-plan-service.md`.
