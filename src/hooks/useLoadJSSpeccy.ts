import { RefObject, useEffect, useCallback, useRef, useState } from "react";

declare const JSSpeccy: any;

interface Emulator {
  openUrl: (url: string) => void;
}

const useLoadJSSpeccy = (ref: RefObject<HTMLDivElement>, openUrl: string) => {
  const emu = useRef<Emulator | null>(null);
  const [loaded, setLoaded] = useState(false);

  const scriptLoaded = useCallback(
    (openUrl: string) => {
      console.log("script loaded");

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      emu.current = JSSpeccy(ref.current, {
        zoom: 2,
        sandbox: false,
        autoStart: true,
        autoLoadTapes: true,
        openUrl,
      });
    },
    [ref]
  );

  const loadUrl = useCallback((openUrl: string) => {
    console.log("url loaded");

    if (emu.current) {
      emu.current.openUrl(openUrl);
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      loadUrl(openUrl);
    } else {
      const script = document.createElement("script");
      script.src = "/jsspeccy/jsspeccy.js";
      script.async = true;
      script.onload = () => scriptLoaded(openUrl);

      document.body.appendChild(script);
      setLoaded(true);
    }
  }, [loaded, openUrl, scriptLoaded, loadUrl]);

  return ref;
};

export default useLoadJSSpeccy;
