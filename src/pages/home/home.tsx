import { useRef, useState, useEffect, type ChangeEvent } from "react";
import { Dropdown, DownloadLink } from "../../components";
import useLoadJSSpeccy from "../../hooks/useLoadJSSpeccy";

// JSSpeccy at zoom=2 renders at 640×480 (320*2 × 240*2) and stamps these
// pixel values directly on its internal container via setZoom(). We use these
// as the fixed inner dimensions and scale the outer wrapper to fit.
const EMULATOR_WIDTH = 640;
const EMULATOR_HEIGHT = 480;

const Home = () => {
  const jssSpeccyRef = useRef<HTMLDivElement>(null);
  const emulatorContainerRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState("helloworld.tap");
  const [emulatorScale, setEmulatorScale] = useState(1);

  const { isScriptLoaded, isStarted, startEmulator } = useLoadJSSpeccy(
    jssSpeccyRef,
    `/games/${selectedOption}`
  );

  // Scale the fixed-size JSSpeccy canvas down to fit the available width.
  // JSSpeccy internally sets style.width/height in px on its own container
  // (via setZoom), so we cannot rely on CSS width/height alone. Instead we
  // measure the outer wrapper and apply a CSS transform scale to the inner div.
  useEffect(() => {
    const container = emulatorContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      const availableWidth = entry.contentRect.width;
      setEmulatorScale(Math.min(1, availableWidth / EMULATOR_WIDTH));
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

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
      {/* Responsive outer shell — clips the inner fixed-size JSSpeccy canvas */}
      <div
        ref={emulatorContainerRef}
        style={{
          width: "100%",
          maxWidth: `${EMULATOR_WIDTH}px`,
          // Height tracks the scale so the document flow stays correct
          height: `${EMULATOR_HEIGHT * emulatorScale}px`,
          overflow: "hidden",
          marginTop: "1rem",
          position: "relative",
        }}
      >
        {/* Inner fixed-size div; scaled down via CSS transform when viewport is narrow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${EMULATOR_WIDTH}px`,
            height: `${EMULATOR_HEIGHT}px`,
            transformOrigin: "top left",
            transform: `scale(${emulatorScale})`,
            backgroundColor: "#000",
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
