# Offline Mode

> Status: Draft · 2026-09-21

## Goals

- A cook who opened a recipe while online can still read it with no connection, mid-recipe, without losing their place.
- The app never shows a blank screen or a spinner that never resolves when the network is gone.
- Priority when these conflict: reading an already-opened recipe wins over everything else.

## Non-Goals

- Offline *editing* of recipes — not yet; sync conflict resolution is a project of its own and there is no demand signal for it.
- Offline search across the full catalog — out of scope; only recipes the user has actually opened are cached.
- Background sync when the app is closed — deliberately rejected; the battery and complexity cost is not worth it for a recipe app.

## Desired Behavior

_Pending._

## Design & Implementation Details

_Pending._

## Testing Strategy

_Pending._

## Alternatives Considered

_Pending._
