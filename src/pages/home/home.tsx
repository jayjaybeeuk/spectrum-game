import { useRef, useState, useEffect, useLayoutEffect, type ChangeEvent } from "react";
import { Dropdown, DownloadLink } from "../../components";
import useLoadJSSpeccy from "../../hooks/useLoadJSSpeccy";

// JSSpeccy at zoom=2 renders at 640×480 (320*2 × 240*2). Its setZoom() method
// stamps style.width=640px directly on its internal appContainer. We account
// for this by applying CSS `zoom` (not transform: scale) to the wrapper div.
//
// Why zoom, not transform: scale?
//   transform: scale() is purely visual — it doesn't affect layout dimensions.
//   This means the outer div needs a manually-tracked height and overflow:hidden
//   can clip the game after JSSpeccy appends its internal DOM (menubar + canvas).
//
//   CSS zoom scales both the visual output AND the layout dimensions, so:
//   - The outer container naturally shrinks to the correct height automatically.
//   - No manual height calculation is needed.
//   - JSSpeccy's inline style.width stamps are still visually scaled correctly.
//   - The ResizeObserver watches the unzoomed outer div — no feedback loop.
const EMULATOR_WIDTH = 640;
const EMULATOR_HEIGHT = 480;

const Home = () => {
  const jssSpeccyRef = useRef<HTMLDivElement>(null);
  const emulatorContainerRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState("helloworld.tap");
  // CSS zoom factor: 1 = full size (640px), <1 = scaled down for narrow viewports
  const [emulatorZoom, setEmulatorZoom] = useState(1);

  const { isScriptLoaded, isStarted, startEmulator } = useLoadJSSpeccy(
    jssSpeccyRef,
    `/games/${selectedOption}`
  );

  const computeZoom = (containerWidth: number) =>
    Math.min(1, containerWidth / EMULATOR_WIDTH);

  // Measure synchronously before the first paint so the correct zoom is applied
  // immediately — avoids a flash of the full-width 640px emulator on narrow screens.
  useLayoutEffect(() => {
    if (emulatorContainerRef.current) {
      setEmulatorZoom(
        computeZoom(emulatorContainerRef.current.getBoundingClientRect().width)
      );
    }
  }, []);

  // Keep zoom in sync with any subsequent viewport / layout changes.
  useEffect(() => {
    const container = emulatorContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      setEmulatorZoom(computeZoom(entry.contentRect.width));
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

      {/*
        Outer shell: limits max width and provides the resize anchor point.
        No explicit height — the inner div's CSS zoom participates in layout
        so the outer div grows/shrinks to fit automatically.
      */}
      <div
        ref={emulatorContainerRef}
        style={{
          width: "100%",
          maxWidth: `${EMULATOR_WIDTH}px`,
          // overflow:hidden is essential: without it, the 640px inner div causes
          // the flex parent (#root uses display:flex on body) to size to content,
          // making width:100% resolve to 640px even on narrow viewports. This
          // locks the ResizeObserver reading at 640px and zoom never drops below 1.
          // min-width:0 overrides the flex item default (min-width:auto) which
          // would also prevent the container from shrinking below content width.
          overflow: "hidden",
          minWidth: 0,
          marginTop: "1rem",
        }}
      >
        {/*
          Inner fixed-size div: always 640×480 in CSS space.
          CSS zoom scales this (and all JSSpeccy-injected content inside it)
          proportionally. Unlike transform: scale(), zoom affects layout so
          JSSpeccy's appContainer.style.width = "640px" stamps are harmless —
          they are still visually scaled down by the parent zoom.
        */}
        <div
          style={{
            zoom: emulatorZoom,
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
