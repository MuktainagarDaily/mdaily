import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

const FLAG = 'hasInAppHistory';
const PREV_ROUTE_KEY = 'prevInAppRoute';

/**
 * Patterns of routes the app actually serves. Keep in sync with the <Routes>
 * defined in src/App.tsx. Used to validate stored "previous route" values
 * before navigating to them, so we never send users to a 404.
 */
const VALID_ROUTE_PATTERNS: RegExp[] = [
  /^\/$/,
  /^\/shops(?:\?.*)?$/,
  /^\/category\/[^/?#]+(?:\?.*)?$/,
  /^\/shop\/[^/?#]+(?:\?.*)?$/,
  /^\/admin(?:\/login)?(?:\?.*)?$/,
];

function isValidAppRoute(path: string | null): path is string {
  if (!path || !path.startsWith('/')) return false;
  return VALID_ROUTE_PATTERNS.some((re) => re.test(path));
}

/**
 * Returns a goBack function that uses browser history when in-app history
 * exists. Otherwise it prefers the previously visited in-app route (tracked
 * by HistoryTracker, and validated against known app routes) and finally
 * falls back to the provided default route.
 *
 * Useful when users land on a deep page via a shared link / new tab, where
 * `navigate(-1)` would either do nothing or send them outside the app.
 */
export function useSmartBack() {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (fallback: string) => {
      const hasFlag = sessionStorage.getItem(FLAG) === '1';
      const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
      if (hasFlag || idx > 0) {
        navigate(-1);
        return;
      }
      const here = location.pathname + location.search;
      const prev = sessionStorage.getItem(PREV_ROUTE_KEY);
      const prevIsUsable = prev && prev !== here && isValidAppRoute(prev);
      const target = prevIsUsable ? prev! : fallback;
      navigate(target, { replace: true });
    },
    [navigate, location.pathname, location.search],
  );
}

export const IN_APP_HISTORY_FLAG = FLAG;
export const PREV_IN_APP_ROUTE_KEY = PREV_ROUTE_KEY;
