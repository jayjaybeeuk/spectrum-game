import { RefObject, useEffect, useCallback, useRef } from "react";

declare const JSSpeccy: any;

const useLoadJSSpeccy = (ref: RefObject<HTMLDivElement>, openUrl: string) => {
  const emu = useRef<any>(null);

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

    emu.openUrl(openUrl);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/jsspeccy/jsspeccy.js";
    script.async = true;
    script.onload = () => scriptLoaded(openUrl);

    document.body.appendChild(script);
  }, [openUrl, scriptLoaded]);

  // useEffect(() => {
  //   loadUrl(openUrl);
  // }, [loadUrl, openUrl]);

  return ref;
};

export default useLoadJSSpeccy;
