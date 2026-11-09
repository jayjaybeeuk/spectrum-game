import { useCallback, useState } from "react";

export type ConsentStatus = "granted" | "denied";

export const CONSENT_STORAGE_KEY = "spectrum-game:analytics-consent";

// ⚡ Bolt: Cache the local storage read in memory to avoid repeated blocking disk I/O.
// Impact: Eliminates the second synchronous localStorage.getItem call when CookieConsent mounts.
let cachedConsent: ConsentStatus | null | undefined = undefined;

export const clearConsentCache = () => {
  cachedConsent = undefined;
};

export const readStoredConsent = (): ConsentStatus | null => {
  if (cachedConsent !== undefined) {
    return cachedConsent;
  }
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    cachedConsent = value === "granted" || value === "denied" ? value : null;
    return cachedConsent;
  } catch {
    // localStorage can be unavailable (private mode, blocked storage).
    cachedConsent = null;
    return null;
  }
};

const writeStoredConsent = (status: ConsentStatus) => {
  cachedConsent = status;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, status);
  } catch {
    // Ignore: the choice will simply be asked again next visit.
  }
};

/**
 * Tracks whether the visitor has granted or denied analytics consent.
 * `null` means no choice has been made yet and a consent prompt should be shown.
 */
const useCookieConsent = () => {
  // ⚡ Bolt: Lazily evaluate readStoredConsent to avoid synchronous disk I/O on every render.
  // Impact: Prevents localStorage.getItem from being called repeatedly after initial mount.
  const [consent, setConsent] = useState<ConsentStatus | null>(() => readStoredConsent());

  const grant = useCallback(() => {
    writeStoredConsent("granted");
    setConsent("granted");
  }, []);

  const deny = useCallback(() => {
    writeStoredConsent("denied");
    setConsent("denied");
  }, []);

  return { consent, grant, deny };
};

export default useCookieConsent;
