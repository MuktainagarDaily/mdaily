## Audit result: Amenities feature is orphaned also give sql patch script for this changes

The `src/components/shared/AmenitiesPicker.tsx` component exists and is fully built (preset chips + custom add + `parseAmenities` helper for `text[] | string | null`), but it is **not wired up anywhere**:

- No `amenities` column exists on `shops` or `shop_requests` (verified against live DB).
- No file imports `AmenitiesPicker` (zero usages across the codebase).
- No public display of amenities on shop detail.
- No CSV import/export coverage.
- Not mentioned in `master_schema.sql`, `DOCUMENT.md`, or `V2_DOC_CHANGES.md`.

So nothing actually works yet. To make the feature functional, we need DB changes + form integration + public display + admin tooling coverage.

---

## What needs to change

### 1. Database (migration)

Add nullable `amenities text[]` to two tables (matches what `AmenitiesPicker` already produces and what `parseAmenities` already expects):

```sql
ALTER TABLE public.shops          ADD COLUMN IF NOT EXISTS amenities text[] DEFAULT '{}'::text[];
ALTER TABLE public.shop_requests  ADD COLUMN IF NOT EXISTS amenities text[] DEFAULT '{}'::text[];
```

No RLS changes needed (existing policies cover all columns). No backfill needed (default empty array).

Will also append the same statements to `supabase/master_schema.sql` per project convention.

### 2. Admin shop forms — write path

Integrate `AmenitiesPicker` into:

- `src/components/admin/ShopModal.tsx` (full create/edit form) — placed after Description, before Image, with a collapsed-by-default visual grouping consistent with existing sections.
- `src/components/admin/SpeedShopModal.tsx` (quick-add) — included as an optional collapsible block so the speed flow stays fast.

Both will read existing values via `parseAmenities(shop.amenities)` and write back as `string[]` (or `null` if empty, to keep DB tidy).

### 3. Public listing request — write path

- `src/components/RequestListingModal.tsx` — add the picker as an optional section so submitters can suggest amenities. Stored on `shop_requests.amenities`.

### 4. Approval flow — propagation

- `src/components/admin/RequestsTab.tsx` — when approving a request, copy `request.amenities` into the new shop row alongside the other fields already being propagated.

### 5. Public display — read path

- `src/pages/ShopDetail.tsx` — add an "Amenities" section (only renders if `parseAmenities(shop.amenities).length > 0`) using existing chip styling so it matches the rest of the page.
- `src/components/ShopCard.tsx` — **no change** (keep cards compact; amenities only show on detail page).

### 6. CSV import/export — coverage

- `src/components/admin/CsvImportModal.tsx` — accept an optional `amenities` column. Parse using a pipe `|` separator (commas would collide with CSV); empty cell → empty array. Validate as a list of trimmed non-empty strings, max ~12 entries per row.
- `src/components/admin/ShopsTab.tsx` CSV export — include an `amenities` column joined with `|`.
- Update the CSV template/header docs surfaced in the import modal preview.

### 7. Types & docs

- `src/integrations/supabase/types.ts` is auto-generated and will refresh after the migration — no manual edit.
- Update `DOCUMENT.md` and `V2_DOC_CHANGES.md` with a short "Amenities" entry (storage shape, where it shows, CSV format).

---

## Out of scope (intentionally skipped)

- Filtering shops by amenity on Home/Shops pages — can be added later as a follow-up; not required to make the feature "workable".
- Showing amenities on `ShopCard` — keeps card density unchanged.
- Backfilling existing shops with guessed amenities.
- Search index changes for amenities (current search by name/area/address stays as-is).

---

## Files touched


| File                                      | Change                                                |
| ----------------------------------------- | ----------------------------------------------------- |
| migration (new)                           | Add `amenities text[]` to `shops` and `shop_requests` |
| `supabase/master_schema.sql`              | Mirror the ALTERs                                     |
| `src/components/admin/ShopModal.tsx`      | Mount `AmenitiesPicker`, include in save payload      |
| `src/components/admin/SpeedShopModal.tsx` | Optional collapsible amenities block                  |
| `src/components/RequestListingModal.tsx`  | Optional amenities section in public form             |
| `src/components/admin/RequestsTab.tsx`    | Carry `amenities` into approved shop row              |
| `src/pages/ShopDetail.tsx`                | Render amenities chips section                        |
| `src/components/admin/ShopsTab.tsx`       | CSV export includes `amenities` (`                    |
| `src/components/admin/CsvImportModal.tsx` | Parse + validate `amenities` column                   |
| `DOCUMENT.md`, `V2_DOC_CHANGES.md`        | Document amenities feature                            |


No new dependencies. No breaking changes — the column is nullable with a safe default, and `parseAmenities` already tolerates `null`, comma-strings, and arrays.