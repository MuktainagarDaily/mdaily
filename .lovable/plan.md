
## Audit Summary

All required changes are purely UI-level in two existing files — `src/pages/ShopDetail.tsx` and `src/pages/Home.tsx` (for search). No database, no new routes, no Lovable Cloud needed.

---

## Changes Planned

### 1. Sticky Action Bar — `ShopDetail.tsx`
The current action buttons (Call, WhatsApp, Maps, Share) are rendered inline in `<main>`. They will be moved into a **fixed bottom bar** (`fixed bottom-0 left-0 right-0 z-20`) that is always visible while scrolling. The main content area already has `pb-28` which is enough padding. The bar will show all available buttons in a row (up to 4), using compact icon+label layout. The inline "Action Buttons" section in the scroll area will be removed since buttons are now sticky.

### 2. Verified Badge → Tooltip — `ShopDetail.tsx`
Currently: clicking the "Verified" badge toggles an inline paragraph (unprofessional). New behavior: wrap the badge in a `<div className="relative group">` and show a small **CSS tooltip** on hover (and on tap/focus for mobile) — a small absolute positioned box below the badge reading "✓ Verified by Muktainagar Daily." No state needed, no JS click handler, pure CSS `group-hover:visible`. The `showVerifiedInfo` state is removed.

### 3. Clickable Category Chips → Navigate to filtered Shops — `ShopDetail.tsx`
The category chips below the shop name are currently plain `<span>` elements. They will become `<button>` elements that call `navigate(`/shops?category=${encodeURIComponent(c.name)}`)`. This matches exactly how `Home.tsx` category grid buttons already work (line 504). The `useNavigate` hook is already imported.

### 4. Improved Closed Indicator — `ShopDetail.tsx`
Currently shows just "CLOSED". When shop is closed and `opening_time` is set, it will show:
```
CLOSED
Open at 9:00 AM
```
Using a two-line layout in the badge: first line "CLOSED" in bold, second line "Open at {formatTime(opening_time)}" in small text. `formatTime` is already imported. The badge width will be slightly wider (`min-w-fit`) to accommodate the second line.

### 5. Category Search on Home Search Box — `Home.tsx`
Currently the search box on Home navigates to `/shops?search=...`. The search also needs to match category names. The fix: when the user submits a search term, also check if any loaded category name matches (case-insensitive). If it does, navigate to `/shops?category=...` instead of `?search=...`. If no category match, fall back to the existing `?search=...` behavior. The `categories` array is already loaded in Home. This is a pure client-side check in `handleSearch`.

---

## Files Changed
- `src/pages/ShopDetail.tsx` — items 1, 2, 3, 4
- `src/pages/Home.tsx` — item 5

No new files, no database changes, no `.env` changes.
