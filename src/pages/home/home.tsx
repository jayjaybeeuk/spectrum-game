import { useRef, useState, useEffect, useLayoutEffect, type ChangeEvent } from "react";
import { Dropdown, DownloadLink } from "../../components";
import useLoadJSSpeccy from "../../hooks/useLoadJSSpeccy";

// JSSpeccy at zoom=2 renders at 640×480 (320*2 × 240*2). Its setZoom() method
// stamps style.width=640px directly on its internal appContainer.
// We use transform: scale() for cross-browser support (zoom doesn't work in Firefox/Safari).
// The outer container gets explicit height = EMULATOR_HEIGHT * scale so layout doesn't collapse.
const EMULATOR_WIDTH = 640;
const EMULATOR_HEIGHT = 480;

const Home = () => {
  const jssSpeccyRef = useRef<HTMLDivElement>(null);
  const emulatorContainerRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState("helloworld.tap");
  // Scale factor: 1 = full size (640px), <1 = scaled down for narrow viewports
  const [emulatorScale, setEmulatorScale] = useState(1);

  const { isScriptLoaded, isStarted, startEmulator } = useLoadJSSpeccy(
    jssSpeccyRef,
    `/games/${selectedOption}`
  );

  const computeScale = (containerWidth: number) =>
    Math.min(1, containerWidth / EMULATOR_WIDTH);

  // Measure synchronously before the first paint so the correct scale is applied
  // immediately — avoids a flash of the full-width 640px emulator on narrow screens.
  useLayoutEffect(() => {
    if (emulatorContainerRef.current) {
      setEmulatorScale(
        computeScale(emulatorContainerRef.current.getBoundingClientRect().width)
      );
    }
  }, []);

  // Keep scale in sync with any subsequent viewport / layout changes.
  useEffect(() => {
    const container = emulatorContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      setEmulatorScale(computeScale(entry.contentRect.width));
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

  // Explicit height so the outer container doesn't collapse when inner is scaled
  const scaledHeight = EMULATOR_HEIGHT * emulatorScale;

  return (
    <>
      <Dropdown handleChange={handleOptionChange} value={selectedOption}>
              <option value="helloworld.tap">Hello World</option>
              <option value="breakout.tap">Breakout</option>
              <option value="snake.tap">Snake</option>
              <option value="northampton-adventure.tap">
                Northampton Adventure
              </option>
              <option value="2-graphics-bank-switching.tap">
                Test - Graphics Bank Switching
              </option>
              <option value="3-loop-function.tap">Test - Loop function</option>
              <option value="4-circle-plot.tap">Test - Circle plot</option>
              <option value="5-basic-platform-logic.tap">Test - Basic platform logic</option>
      </Dropdown>

      {/* 
        Outer shell: limits max width, provides resize anchor, and has explicit height
        matching the scaled inner content. minWidth: 0 allows flex child to shrink.
      */}
      <div
        ref={emulatorContainerRef}
        style={{
          width: "100%",
          maxWidth: `${EMULATOR_WIDTH}px`,
          height: `${scaledHeight}px`,
          overflow: "hidden",
          minWidth: 0,
          marginTop: "1rem",
        }}
      >
        {/*
          Inner fixed-size div: always 640×480 in CSS space.
          transform: scale() visually shrinks it. transform-origin: top left keeps
          it aligned to top-left. JSSpeccy's appContainer.style.width = "640px"
          stamps are still visually scaled correctly.
        */}
        <div
          style={{
            transform: `scale(${emulatorScale})`,
            transformOrigin: "top left",
            width: `${EMULATOR_WIDTH}px`,
            minHeight: `${EMULATOR_HEIGHT}px`,
            position: "relative",
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
                zIndex: 1,
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
              href="https://github.com/jayjaybeeuk/spectrum-game"
              rel="noreferrer"
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
