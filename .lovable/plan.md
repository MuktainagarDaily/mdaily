## Problem

On the Shop Detail page (`/shop/:id`), the back button calls `navigate(-1)`. When a user lands directly via a shared link or new tab, there is no in-app history, so pressing back either does nothing, exits the site, or returns to an external referrer (search engine, WhatsApp, etc.). This breaks the expected in-app navigation.

The same issue likely exists wherever else we use `navigate(-1)` as the only back action (e.g. Admin pages, NotFound).

## Goal

If the user has prior in-app history → go back as today.
If they arrived directly (no in-app history) → route them to a sensible page inside the app instead of leaving the site.

## Approach

1. **Detect direct entry reliably**
   - Track in-app navigations using a small flag set on `BrowserRouter`-driven route changes (e.g. set `sessionStorage.setItem('hasInAppHistory', '1')` on every internal navigation).
   - On mount of pages with a back button, decide the back behavior based on this flag (and as a secondary check, `window.history.state?.idx > 0`, which React Router populates).

2. **Add a small `useSmartBack` hook**
   - Location: `src/hooks/useSmartBack.ts`
   - Returns a `goBack(fallback: string)` function.
   - Logic:
     - If in-app history exists → `navigate(-1)`
     - Else → `navigate(fallback, { replace: true })`

3. **Wire fallback per page**
   - `ShopDetail` → fallback `/shops`
   - Any other place currently using `navigate(-1)` → audit and pass an appropriate fallback (likely `/` for admin login redirects, `/shops` or `/` elsewhere). Only change call sites that already use `navigate(-1)`; do not touch unrelated navigation.

4. **Mark in-app navigations**
   - Add a tiny listener inside `App.tsx` (or a dedicated `HistoryTracker` component mounted inside `BrowserRouter`) that sets the `hasInAppHistory` sessionStorage flag whenever the location changes. The first navigation after a fresh load flips the flag, so subsequent back presses behave normally.

## Out of scope

- No visual/UX redesign of the back button.
- No change to data fetching, SEO, or routing structure.
- No changes to business logic.

## Technical notes

- React Router v6: `window.history.state?.idx` is `0` on first entry and increments on internal pushes — usable as a secondary signal without sessionStorage, but sessionStorage survives in-page reloads better. We'll use sessionStorage as the primary check and `idx` as a fallback.
- Replace navigation (`replace: true`) on the fallback so the user's browser-back from `/shops` exits to wherever they came from, instead of looping back to the shop detail.
- Pure frontend change. No DB, no schema, no migrations.

## Files to touch

- `src/hooks/useSmartBack.ts` (new)
- `src/App.tsx` (add a small in-router history tracker)
- `src/pages/ShopDetail.tsx` (use `useSmartBack` with `/shops` fallback)
- Quick audit pass for other `navigate(-1)` usages and apply the same hook with appropriate fallbacks.
