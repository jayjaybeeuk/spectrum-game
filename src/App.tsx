import { useRef } from "react";
import useLoadJSSpeccy from "./hooks/useLoadJSSpeccy";
import "./App.css";

function App() {
  const jssSpeccyRef = useRef<HTMLDivElement>(null);

  useLoadJSSpeccy(jssSpeccyRef, "/games/helloworld.tap");

  return (
    <>
      <div id="jsspeccy" ref={jssSpeccyRef}></div>
    </>
  );
}

export default App;
