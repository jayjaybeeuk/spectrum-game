/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Microsoft Clarity project ID. Analytics is disabled when unset. */
  readonly VITE_CLARITY_ID?: string;
}
