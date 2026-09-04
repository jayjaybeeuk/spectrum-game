import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RefObject } from "react";
import useLoadJSSpeccy from "./useLoadJSSpeccy";

const SCRIPT_SELECTOR = 'script[src="/jsspeccy/jsspeccy.js"]';

const makeEmulator = () => ({ openUrl: vi.fn(), exit: vi.fn() });

const makeRef = (): RefObject<HTMLDivElement> => ({
  current: document.createElement("div")
});

describe("useLoadJSSpeccy", () => {
  beforeEach(() => {
    delete window.JSSpeccy;
    document.querySelectorAll(SCRIPT_SELECTOR).forEach((s) => s.remove());
  });

  afterEach(() => {
    delete window.JSSpeccy;
  });

  it("injects the JSSpeccy script tag and reports loaded once it fires load", () => {
    const { result } = renderHook(() => useLoadJSSpeccy(makeRef(), "/games/a.tap"));

    const script = document.querySelector<HTMLScriptElement>(SCRIPT_SELECTOR);
    expect(script).not.toBeNull();
    expect(script?.async).toBe(true);
    expect(result.current.isScriptLoaded).toBe(false);
    expect(result.current.isStarted).toBe(false);

    act(() => {
      script?.dispatchEvent(new Event("load"));
    });

    expect(result.current.isScriptLoaded).toBe(true);
  });

  it("does not inject a second script tag when one already exists", () => {
    const existing = document.createElement("script");
    existing.src = "/jsspeccy/jsspeccy.js";
    document.body.appendChild(existing);

    const { result } = renderHook(() => useLoadJSSpeccy(makeRef(), "/games/a.tap"));

    expect(document.querySelectorAll(SCRIPT_SELECTOR)).toHaveLength(1);

    act(() => {
      existing.dispatchEvent(new Event("load"));
    });
    expect(result.current.isScriptLoaded).toBe(true);
  });

  it("reports loaded immediately when JSSpeccy is already on window", () => {
    window.JSSpeccy = vi.fn(makeEmulator);

    const { result } = renderHook(() => useLoadJSSpeccy(makeRef(), "/games/a.tap"));

    expect(result.current.isScriptLoaded).toBe(true);
    expect(document.querySelector(SCRIPT_SELECTOR)).toBeNull();
  });

  it("starts the emulator with the selected game and does not start twice", () => {
    const emulator = makeEmulator();
    const jsspeccy = vi.fn(() => emulator);
    window.JSSpeccy = jsspeccy;
    const ref = makeRef();

    const { result } = renderHook(() => useLoadJSSpeccy(ref, "/games/snake.tap"));

    act(() => {
      result.current.startEmulator();
    });

    expect(jsspeccy).toHaveBeenCalledTimes(1);
    expect(jsspeccy).toHaveBeenCalledWith(
      ref.current,
      expect.objectContaining({
        zoom: 2,
        autoStart: true,
        autoLoadTapes: true,
        openUrl: "/games/snake.tap"
      })
    );
    expect(result.current.isStarted).toBe(true);

    act(() => {
      result.current.startEmulator();
    });
    expect(jsspeccy).toHaveBeenCalledTimes(1);
  });

  it("does nothing on start if the script has not loaded yet", () => {
    const { result } = renderHook(() => useLoadJSSpeccy(makeRef(), "/games/a.tap"));

    act(() => {
      result.current.startEmulator();
    });

    expect(result.current.isStarted).toBe(false);
  });

  it("restarts the emulator with a fresh instance when the game changes", () => {
    const first = makeEmulator();
    const second = makeEmulator();
    const jsspeccy = vi.fn().mockReturnValueOnce(first).mockReturnValueOnce(second);
    window.JSSpeccy = jsspeccy;
    const ref = makeRef();

    const { result, rerender } = renderHook(
      ({ url }: { url: string }) => useLoadJSSpeccy(ref, url),
      { initialProps: { url: "/games/snake.tap" } }
    );

    act(() => {
      result.current.startEmulator();
    });
    expect(jsspeccy).toHaveBeenCalledTimes(1);

    rerender({ url: "/games/breakout.tap" });

    expect(first.exit).toHaveBeenCalledTimes(1);
    expect(jsspeccy).toHaveBeenCalledTimes(2);
    expect(jsspeccy).toHaveBeenLastCalledWith(
      ref.current,
      expect.objectContaining({ openUrl: "/games/breakout.tap" })
    );
  });

  it("does not boot the emulator on game change if it was never started", () => {
    const jsspeccy = vi.fn(makeEmulator);
    window.JSSpeccy = jsspeccy;

    const { rerender } = renderHook(
      ({ url }: { url: string }) => useLoadJSSpeccy(makeRef(), url),
      { initialProps: { url: "/games/snake.tap" } }
    );

    rerender({ url: "/games/breakout.tap" });

    expect(jsspeccy).not.toHaveBeenCalled();
  });

  it("exits the emulator on unmount", () => {
    const emulator = makeEmulator();
    window.JSSpeccy = vi.fn(() => emulator);

    const { result, unmount } = renderHook(() =>
      useLoadJSSpeccy(makeRef(), "/games/snake.tap")
    );

    act(() => {
      result.current.startEmulator();
    });
    unmount();

    expect(emulator.exit).toHaveBeenCalledTimes(1);
  });
});
