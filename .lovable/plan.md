
## Audit Findings

The app has three pages with headers:
- **Home** (`src/pages/Home.tsx`): Full hero header with logo + title centered (`flex items-center justify-center`). The brand row is `flex items-center justify-center gap-3 mb-1` — logo on left, title on right, no room for a menu button yet.
- **Shops** (`src/pages/Shops.tsx`): Compact primary header with back button + title + refresh icon.
- **ShopDetail** (`src/pages/ShopDetail.tsx`): Compact primary header with back button + title + share icon.

The `useAuth` hook already exists (`src/hooks/useAuth.tsx`) and exports `user`, `session`, `loading`, `signIn`, `signOut`. This is perfect — we read `user` to show "Guest" vs logged-in user info. No backend work needed.

---

## Plan

### New File: `src/components/UserMenuDrawer.tsx`
A self-contained component that handles:
1. The **trigger button** (avatar chip) — shown in headers
2. The **bottom sheet** (Drawer) — slides up when trigger is tapped

**Trigger button design** — matches the app's existing theme (`hsl(var(--primary))`). A pill-shaped button with:
- A circular avatar with initials (or user icon for guest) in primary-colored background
- No label text (compact, icon-only) to fit next to logo without crowding

**Drawer content:**
```
┌─────────────────────────────────┐
│  [Avatar 48px]                  │
│  Guest User          OR  [name/email]
│  "You're in Guest mode"   OR  "Signed in"
│  "Sign in or Sign up for full access"
│  ─────────────────────────────  │
│  🔖  Saved Shops    (coming)    │
│  📍  My Area        (coming)    │
│  🔔  Notifications  (coming)    │
│  ──────────────────────────── │
│  ⚙️  Settings       (coming)    │
│  ❓  Help & Feedback (coming)   │
│  ─────────────────────────────  │
│  (if logged in) Sign Out        │
│  (if guest)  Sign In  Sign Up   │
└─────────────────────────────────┘
```

All menu items are UI-only with "Coming soon" badges — no wiring. Sign In navigates to `/admin/login` (existing route). Sign Out calls `useAuth().signOut()`.

**UI surprise**: A subtle animated gradient banner at top of the drawer, and a "badge" row showing the user's access tier ("Guest" in amber, "Member" in primary blue, or "Admin" in green if admin user) — purely cosmetic but adds polish.

### Changes to `src/pages/Home.tsx`
In the Brand Row (`flex items-center justify-center gap-3 mb-1`):
- Change layout to `flex items-center justify-between` relative wrapper
- Keep logo+title centered in the middle
- Add `<UserMenuButton />` (trigger only) **absolutely positioned to the top-right** of the header, so it doesn't disrupt the centered layout

Specifically, add `relative` to the outer header container and position the avatar button as `absolute top-4 right-4` within the header's `max-w-lg` wrapper.

### Changes to `src/pages/Shops.tsx`
In the title row (`flex items-center gap-3 mb-3`):
- Add `<UserMenuButton />` between the refresh button and the right edge — or replace the right gap with it as the last item.

### Changes to `src/pages/ShopDetail.tsx`
In the header (`flex items-center gap-3`):
- Add `<UserMenuButton />` as the last item after the share button.

---

## Files Changed
| File | Change |
|------|--------|
| `src/components/UserMenuDrawer.tsx` | **New** — trigger button + drawer panel |
| `src/pages/Home.tsx` | Add `<UserMenuButton />` absolutely positioned top-right in header |
| `src/pages/Shops.tsx` | Add `<UserMenuButton />` to header right side |
| `src/pages/ShopDetail.tsx` | Add `<UserMenuButton />` to header right side |

No database, no Cloud, no `.env` changes. Reads only `useAuth` (already exists). All menu options are UI shells with "Coming soon" visual indicators.
