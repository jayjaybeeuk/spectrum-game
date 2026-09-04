import { afterEach, describe, expect, it, vi } from "vitest";
import { initClarity } from "./clarity";

const CLARITY_SCRIPT = "script#ms-clarity";

describe("initClarity", () => {
  afterEach(() => {
    document.querySelectorAll(CLARITY_SCRIPT).forEach((s) => s.remove());
    delete window.clarity;
  });

  it("does nothing outside production", () => {
    vi.stubEnv("PROD", false);

    expect(initClarity("abc123")).toBe(false);
    expect(document.querySelector(CLARITY_SCRIPT)).toBeNull();
    expect(window.clarity).toBeUndefined();
  });

  it("does nothing in production without a project ID", () => {
    vi.stubEnv("PROD", true);

    expect(initClarity(undefined)).toBe(false);
    expect(document.querySelector(CLARITY_SCRIPT)).toBeNull();
  });

  it("injects the Clarity tag once in production with an ID", () => {
    vi.stubEnv("PROD", true);

    expect(initClarity("abc123")).toBe(true);
    expect(initClarity("abc123")).toBe(true);

    const scripts = document.querySelectorAll<HTMLScriptElement>(CLARITY_SCRIPT);
    expect(scripts).toHaveLength(1);
    expect(scripts[0].src).toBe("https://www.clarity.ms/tag/abc123");
    expect(scripts[0].async).toBe(true);
    expect(typeof window.clarity).toBe("function");
  });

  it("queues clarity() calls made before the tag loads", () => {
    vi.stubEnv("PROD", true);
    initClarity("abc123");

    window.clarity?.("consent");

    expect(window.clarity?.q).toEqual([["consent"]]);
  });
});
