import { type RefObject, useEffect, useCallback, useRef, useState } from "react";

interface Emulator {
  openUrl: (url: string) => void;
  exit: () => void;
}

type JSSpeccyType = (
  element: HTMLElement,
  options: {
    zoom: number;
    sandbox: boolean;
    autoStart: boolean;
    autoLoadTapes: boolean;
    openUrl: string;
  }
) => Emulator;

declare global {
  interface Window {
    JSSpeccy?: JSSpeccyType;
  }
}

const JSSPECCY_SCRIPT_SRC = "/jsspeccy/jsspeccy.js";

const useLoadJSSpeccy = (ref: RefObject<HTMLDivElement>, openUrl: string) => {
  const emu = useRef<Emulator | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (window.JSSpeccy) {
      setIsScriptLoaded(true);
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${JSSPECCY_SCRIPT_SRC}"]`
    ) as HTMLScriptElement | null;
    const onLoad = () => setIsScriptLoaded(true);

    if (existingScript) {
      existingScript.addEventListener("load", onLoad, { once: true });

      return () => {
        existingScript.removeEventListener("load", onLoad);
      };
    }

    const script = document.createElement("script");
    script.src = JSSPECCY_SCRIPT_SRC;
    script.async = true;
    script.addEventListener("load", onLoad, { once: true });

    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", onLoad);
    };
  }, []);

  const startEmulator = useCallback(() => {
    if (!ref.current || !window.JSSpeccy || emu.current) {
      return;
    }

    emu.current = window.JSSpeccy(ref.current, {
      zoom: 2,
      sandbox: false,
      autoStart: true,
      autoLoadTapes: true,
      openUrl,
    });
    setIsStarted(true);
  }, [openUrl, ref]);

  // When the selected game changes while the emulator is already running,
  // destroy the current instance and boot a fresh one with the new URL.
  // This ensures the Spectrum hardware state (memory, registers, timing) is
  // fully reset for every game rather than hot-swapping into a dirty machine.
  useEffect(() => {
    if (!isStarted || !emu.current || !ref.current || !window.JSSpeccy) {
      return;
    }

    emu.current.exit();
    emu.current = null;

    emu.current = window.JSSpeccy(ref.current, {
      zoom: 2,
      sandbox: false,
      autoStart: true,
      autoLoadTapes: true,
      openUrl,
    });
  }, [openUrl]); // eslint-disable-line react-hooks/exhaustive-deps
  // Intentionally omitting isStarted/ref/JSSpeccy — this effect should only
  // re-run when the user picks a different game, not on every render.

  return { isScriptLoaded, isStarted, startEmulator };
};

export default useLoadJSSpeccy;
