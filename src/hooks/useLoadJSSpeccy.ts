import { RefObject, useEffect, useCallback } from "react";

declare const JSSpeccy: any;

const useLoadJSSpeccy = (ref: RefObject<HTMLDivElement>, openUrl: string) => {
  const scriptLoaded = useCallback(
    (openUrl: string) => {
      console.log("script loaded");

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      JSSpeccy(ref.current, {
        zoom: 2,
        sandbox: false,
        autoStart: true,
        autoLoadTapes: true,
        openUrl,
      });
    },
    [ref]
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/jsspeccy/jsspeccy.js";
    script.async = true;
    script.onload = () => scriptLoaded(openUrl);

    document.body.appendChild(script);
  }, [openUrl, scriptLoaded]);

  return ref;
};

export default useLoadJSSpeccy;
