import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

const FLAG = 'hasInAppHistory';

/**
 * Returns a goBack function that uses browser history when in-app history
 * exists, otherwise navigates to the provided fallback route.
 *
 * Useful when users land on a deep page via a shared link / new tab, where
 * `navigate(-1)` would either do nothing or send them outside the app.
 */
export function useSmartBack() {
  const navigate = useNavigate();

  return useCallback(
    (fallback: string) => {
      const hasFlag = sessionStorage.getItem(FLAG) === '1';
      const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
      if (hasFlag || idx > 0) {
        navigate(-1);
      } else {
        navigate(fallback, { replace: true });
      }
    },
    [navigate],
  );
}

export const IN_APP_HISTORY_FLAG = FLAG;
