import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import useCookieConsent, { CONSENT_STORAGE_KEY } from "./useCookieConsent";

describe("useCookieConsent", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts with no decision when nothing is stored", () => {
    const { result } = renderHook(() => useCookieConsent());
    expect(result.current.consent).toBeNull();
  });

  it("persists a granted decision", () => {
    const { result } = renderHook(() => useCookieConsent());

    act(() => {
      result.current.grant();
    });

    expect(result.current.consent).toBe("granted");
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("granted");
  });

  it("persists a denied decision", () => {
    const { result } = renderHook(() => useCookieConsent());

    act(() => {
      result.current.deny();
    });

    expect(result.current.consent).toBe("denied");
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("denied");
  });

  it("reads a previously stored decision", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "denied");
    const { result } = renderHook(() => useCookieConsent());
    expect(result.current.consent).toBe("denied");
  });

  it("ignores unexpected stored values", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "maybe");
    const { result } = renderHook(() => useCookieConsent());
    expect(result.current.consent).toBeNull();
  });
});
