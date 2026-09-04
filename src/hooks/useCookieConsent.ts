import { useCallback, useState } from "react";

export type ConsentStatus = "granted" | "denied";

export const CONSENT_STORAGE_KEY = "spectrum-game:analytics-consent";

const readStoredConsent = (): ConsentStatus | null => {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    // localStorage can be unavailable (private mode, blocked storage).
    return null;
  }
};

const writeStoredConsent = (status: ConsentStatus) => {
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
