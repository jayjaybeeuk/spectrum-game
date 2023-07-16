import { useEffect } from "react";
import "./App.css";

declare const JSSpeccy: any;

function App() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/jsspeccy/jsspeccy.js";
    script.async = true;
    script.onload = () => scriptLoaded();

    document.body.appendChild(script);
  }, []);

  const scriptLoaded = () => {
    console.log("script loaded");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    JSSpeccy(document.getElementById("jsspeccy"), {
      zoom: 2,
      sandbox: false,
      autoStart: true,
      autoLoadTapes: true,
      openUrl: "https://spectrum-game-eight.vercel.app/helloworld.tap",
    });
  };

  return (
    <>
      <div id="jsspeccy"></div>
    </>
  );
}

export default App;
