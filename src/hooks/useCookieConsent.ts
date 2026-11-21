import { useCallback, useState } from "react";

export type ConsentStatus = "granted" | "denied";

export const CONSENT_STORAGE_KEY = "spectrum-game:analytics-consent";

let consentCache: ConsentStatus | null | undefined = undefined;

// ⚡ Bolt: Provide a utility to clear the cache for test environment resets.
export const clearConsentCache = () => {
  consentCache = undefined;
};

// ⚡ Bolt: Cache local storage reads in an in-memory variable.
// Impact: Eliminates repeated synchronous disk I/O from localStorage.getItem across different component mounts.
export const readStoredConsent = (): ConsentStatus | null => {
  if (consentCache !== undefined) {
    return consentCache;
  }

  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    consentCache = value === "granted" || value === "denied" ? value : null;
    return consentCache;
  } catch {
    // localStorage can be unavailable (private mode, blocked storage).
    consentCache = null;
    return null;
  }
};

const writeStoredConsent = (status: ConsentStatus) => {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, status);
    consentCache = status; // ⚡ Bolt: Update cache when writing.
  } catch {
    // Ignore: the choice will simply be asked again next visit.
  }
};

/**
 * Tracks whether the visitor has granted or denied analytics consent.
 * `null` means no choice has been made yet and a consent prompt should be shown.
 */
const useCookieConsent = () => {
  const [consent, setConsent] = useState<ConsentStatus | null>(readStoredConsent);

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
