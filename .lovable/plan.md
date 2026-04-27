## Add description and sub_area to Shop Detail page

Both fields exist in the `shops` table and are already fetched via `select('*')` — they just aren't rendered yet on the public Shop Detail page.

### Changes (single file: `src/pages/ShopDetail.tsx`)

**1. Include `sub_area` in the Location row**
Update the location merge logic so sub_area sits between address and area when present:

- If `address`, `sub_area`, `area` → "address, sub_area, area"
- If `sub_area` + `area` (no address) → "sub_area, area"
- If only `area` → "area" (current)
- If only `address` → "address" (current)

This keeps the existing single "Location" row design — no extra clutter.

**2. Add a Description block (only when present)**

Render a new card just below the Name/Status card and above the Details card:

```tsx
{shop.description && shop.description.trim() && (
  <div className="bg-card rounded-xl border border-border p-4">
    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1.5">
      About
    </p>
    <p className="text-foreground text-sm leading-relaxed whitespace-pre-line break-words">
      {shop.description}
    </p>
  </div>
)}
```

- Hidden entirely when description is null/empty/whitespace (per your requirement).
- Uses `whitespace-pre-line` so admin-entered line breaks display properly.
- Matches existing card styling (rounded-xl, border-border, bg-card) — no new design patterns introduced.

### Out of scope
- No DB changes (fields already exist).
- No admin form changes (already capture these fields).
- No `keywords` rendering (not requested; keywords are for search, not public display).