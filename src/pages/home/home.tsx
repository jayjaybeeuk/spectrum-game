import { useRef, useState, type ChangeEvent } from "react";
import { Dropdown, DownloadLink } from "../../components";
import useLoadJSSpeccy from "../../hooks/useLoadJSSpeccy";

const Home = () => {
  const jssSpeccyRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState("helloworld.tap");

  const { isScriptLoaded, isStarted, startEmulator } = useLoadJSSpeccy(
    jssSpeccyRef,
    `/games/${selectedOption}`
  );

  const handleOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleStartOverlayActivate = () => {
    if (isScriptLoaded) {
      startEmulator();
    }
  };

  return (
    <>
      <Dropdown handleChange={handleOptionChange} value={selectedOption}>
        <option value="helloworld.tap">Hello World</option>
        <option value="breakout.tap">Breakout</option>
        <option value="snake.tap">Snake</option>
        <option value="northampton-adventure.tap">Northampton Adventure</option>
        <option value="1-helloworld-zx-basic-playground.tap">
          Test - Hello World Playground
        </option>
        <option value="2-graphics-bank-switching.tap">
          Test - Graphics Bank Switching
        </option>
        <option value="3-loop-function.tap">Test - Loop function</option>
        <option value="4-circle-plot.tap">Test - Circle plot</option>
        <option value="5-basic-platform-logic.tap">Test - Basic platform logic</option>
      </Dropdown>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          minHeight: "384px",
          minWidth: "512px",
          marginTop: "1rem",
          backgroundColor: "#000"
        }}
      >
        {!isStarted && (
          <div
            role="button"
            tabIndex={0}
            onClick={handleStartOverlayActivate}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleStartOverlayActivate();
              }
            }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "0.5rem",
              padding: "1rem",
              backgroundColor: "rgba(0, 0, 0, 0.82)",
              color: "#f7fafc",
              cursor: isScriptLoaded ? "pointer" : "wait",
              zIndex: 1
            }}
          >
            <strong>
              {isScriptLoaded ? "Click to start emulator with sound" : "Loading emulator..."}
            </strong>
            <div>
              {isScriptLoaded
                ? "Audio unlocks after your first interaction."
                : "The emulator script is still loading."}
            </div>
          </div>
        )}
        <div id="jsspeccy" ref={jssSpeccyRef} />
      </div>

      {selectedOption && (
        <div>
          <div>
            You can download and play this game on an emulator via this tap
            file:
          </div>
          <DownloadLink tapFile={`/games/${selectedOption}`} />
          <div>
            To see all of the games available,{" "}
            <a
              target="_blank"
              href="https://github.com/jayjaybeeuk/spectrum-game" rel="noreferrer"
            >
              go to my GitHub page
            </a>
            .
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
