import { type RefObject, useEffect, useCallback, useRef, useState } from "react";

interface Emulator {
  openUrl: (url: string) => void;
}

type JSSpeccyType = (
    element: HTMLElement,
    options: {
      zoom: number;
      sandbox: boolean;
      autoStart: boolean;
      autoLoadTapes: boolean;
      openUrl: string;
    }) => Emulator

declare const JSSpeccy: JSSpeccyType;

const useLoadJSSpeccy = (ref: RefObject<HTMLDivElement>, openUrl: string) => {
  const emu = useRef<Emulator | null>(null);
  const [loaded, setLoaded] = useState(false);

  const scriptLoaded = useCallback(() => {
    console.log("script loaded");

    if (ref.current) {
      emu.current = JSSpeccy(ref.current, {
        zoom: 2,
        sandbox: false,
        autoStart: true,
        autoLoadTapes: true,
        openUrl,
      });
    } else {
      console.error("ref.current is null");
    }
  }, [ref, openUrl]);

  const loadUrl = useCallback(() => {
    console.log("url loaded");

    if (emu.current) {
      emu.current.openUrl(openUrl);
    }
  }, [openUrl]);

  useEffect(() => {
    if (loaded) {
      loadUrl();
    } else {
      const script = document.createElement("script");
      script.src = "/jsspeccy/jsspeccy.js";
      script.async = true;
      script.onload = scriptLoaded;

      document.body.appendChild(script);
      setLoaded(true);
    }
  }, [loaded, loadUrl, scriptLoaded]);

  return ref;
};

export default useLoadJSSpeccy;
