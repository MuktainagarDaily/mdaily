
## Audit Findings

All changes are in `src/pages/Home.tsx` only. No database, no Cloud, no `.env` changes needed.

---

## What's Being Changed

### 1. Interchange "Browse by Category" and "Recently Added" positions
Currently in `<main>`:
- Line 487: `{/* Categories */}` section
- Line 547: `{/* Recently Added */}` section

Swap them: **Recently Added comes first**, then **Browse by Category**.

### 2. Make StatPills clickable (lines 443–454)

The `StatPill` component (line 771) is currently a plain `<div>`. It needs to become a `<button>` that accepts an `onClick` prop.

- **"X Shops"** → `navigate('/shops')`
- **"X Open Now"** → `navigate('/shops?filter=open')`
- **"X Categories"** → scroll down to the Browse by Category section (smooth scroll using a `useRef` on the category section — which will now be lower on the page)
- **"X Verified"** → `navigate('/shops?filter=verified')`

Implementation: Add `onClick?: () => void` to `StatPill` props. Wrap in `<button>` with `cursor-pointer` when `onClick` is passed.

Scrolling to categories: add `const categorySectionRef = useRef<HTMLElement>(null)` and attach it to the category `<section>`. For the Categories pill click: `categorySectionRef.current?.scrollIntoView({ behavior: 'smooth' })`.

### 3. Trust Strip — make "X verified listings" clickable (lines 469–471)
The `<span>` showing `{verifiedCount} verified listings` becomes a `<button>` that navigates to `/shops?filter=verified`.

### 4. Sub-category UI foundation (UI only, no DB/Cloud)

Inside the `<DrawerContent>` filter sheet's **Category** section (lines 695–730), after each category button when it's selected (active), show an indented sub-row with placeholder sub-category chips. This is purely decorative/structural with hardcoded placeholder text like "All", "Sub A", "Sub B" to show the visual layout is ready. No data, no API — just the UI shell that will be wired up later.

Approach: Add a `SubCategoryRow` component that renders when a category chip is `active`:
```text
[Food & Restaurants - selected]
  → [ All ] [ Snacks ] [ Meals ] [ Sweets ]   ← placeholder chips, grayed out, non-functional
```
The placeholder chips will have a subtle `opacity-60` and a tooltip/label "Coming soon". They visually signal the feature is planned.

---

## Files Changed
- `src/pages/Home.tsx` only

## Summary of changes by line area
| Area | Change |
|------|--------|
| Line 442–454 (StatPills) | Add `onClick` to each pill; add `categorySectionRef` |
| Line 464–482 (Trust Strip) | Wrap verified listings span as button |
| Line 487–545 (Category section) | Move BELOW Recently Added; attach `categorySectionRef` |
| Line 547–560 (Recently Added) | Move ABOVE Category section |
| Line 695–730 (Filter drawer Category) | Add sub-category placeholder row UI |
| Line 771–779 (StatPill component) | Accept `onClick` prop, conditionally render as button |
