/**
 * Microsoft Clarity analytics.
 *
 * Clarity is only ever loaded when:
 *  1. the app is a production build (import.meta.env.PROD), so local `yarn dev`
 *     sessions never pollute the Clarity project, and
 *  2. a project ID is supplied via the VITE_CLARITY_ID env var (see .env.example), and
 *  3. the visitor has explicitly granted consent (see useCookieConsent).
 */

const CLARITY_SCRIPT_BASE = "https://www.clarity.ms/tag/";
const CLARITY_SCRIPT_ID = "ms-clarity";

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[] };

declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

export const clarityProjectId: string | undefined =
  import.meta.env.VITE_CLARITY_ID || undefined;

export const isAnalyticsEnabled = (): boolean =>
  import.meta.env.PROD && Boolean(clarityProjectId);

/**
 * Injects the Clarity tag. Safe to call more than once; subsequent calls are no-ops.
 * Does nothing outside production or when no project ID is configured.
 */
export const initClarity = (
  projectId: string | undefined = clarityProjectId
): boolean => {
  if (!import.meta.env.PROD || !projectId) {
    return false;
  }

  if (document.getElementById(CLARITY_SCRIPT_ID)) {
    return true;
  }

  // Equivalent of the official Clarity snippet: queue calls until the tag loads.
  const clarity: ClarityFn =
    window.clarity ??
    ((...args: unknown[]) => {
      (clarity.q = clarity.q ?? []).push(args);
    });
  window.clarity = clarity;

  const script = document.createElement("script");
  script.id = CLARITY_SCRIPT_ID;
  script.async = true;
  script.src = `${CLARITY_SCRIPT_BASE}${encodeURIComponent(projectId)}`;
  document.head.appendChild(script);

  return true;
};
