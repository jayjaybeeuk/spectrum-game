import { useRef, useState, useEffect, useLayoutEffect, memo, useCallback, type ChangeEvent, type RefObject } from "react";
import { Dropdown, DownloadLink } from "../../components";
import useLoadJSSpeccy from "../../hooks/useLoadJSSpeccy";
import { GAMES, DEFAULT_GAME, findGame, getGameUrl } from "./games";

// JSSpeccy at zoom=2 renders at 640×480 (320*2 × 240*2). Its setZoom() method
// stamps style.width=640px directly on its internal appContainer.
// We use transform: scale() for cross-browser support (zoom doesn't work in Firefox/Safari).
// The outer container gets explicit height = EMULATOR_HEIGHT * scale so layout doesn't collapse.
const EMULATOR_WIDTH = 640;
const EMULATOR_HEIGHT = 480;

interface ScaledEmulatorContainerProps {
  jssSpeccyRef: RefObject<HTMLDivElement>;
  isStarted: boolean;
  isScriptLoaded: boolean;
  startEmulator: () => void;
}

// ⚡ Bolt: Wrapped ScaledEmulatorContainer in React.memo().
// Impact: Prevents the entire emulator container and overlay from re-rendering
// unnecessarily when the user selects a different game from the dropdown.
const ScaledEmulatorContainer = memo(({ jssSpeccyRef, isStarted, isScriptLoaded, startEmulator }: ScaledEmulatorContainerProps) => {
  const emulatorContainerRef = useRef<HTMLDivElement>(null);
  const [emulatorScale, setEmulatorScale] = useState(1);

  const computeScale = (containerWidth: number) =>
    Math.min(1, containerWidth / EMULATOR_WIDTH);

  useLayoutEffect(() => {
    if (emulatorContainerRef.current) {
      setEmulatorScale(
        computeScale(emulatorContainerRef.current.getBoundingClientRect().width)
      );
    }
  }, []);

  useEffect(() => {
    const container = emulatorContainerRef.current;
    if (!container) return;

    // ⚡ Bolt: Throttled ResizeObserver with requestAnimationFrame to prevent
    // excessive synchronous React re-renders during window resizing.
    // Impact: Limits state updates to 1 per frame (max ~60fps) instead of firing multiple times per frame.
    let animationFrameId = 0;
    const observer = new ResizeObserver(([entry]) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setEmulatorScale(computeScale(entry.contentRect.width));
      });
    });

    observer.observe(container);
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  const handleStartOverlayActivate = () => {
    if (isScriptLoaded) {
      startEmulator();
    }
  };

  const scaledHeight = EMULATOR_HEIGHT * emulatorScale;

  return (
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
  );
});

// ⚡ Bolt: Extracted static options outside the component.
// Impact: Prevents recreating the children array for Dropdown on every render,
// reducing GC pressure and enabling Dropdown to be safely memoized.
const GAME_OPTIONS = GAMES.map((game) => (
  <option key={game.file} value={game.file}>
    {game.name}
  </option>
));

const Home = () => {
  const jssSpeccyRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState(DEFAULT_GAME.file);

  const selectedGame = findGame(selectedOption) ?? DEFAULT_GAME;
  const selectedGameUrl = getGameUrl(selectedGame.file);

  const { isScriptLoaded, isStarted, startEmulator } = useLoadJSSpeccy(
    jssSpeccyRef,
    selectedGameUrl
  );

  // ⚡ Bolt: Wrapped handleOptionChange in useCallback.
  // Impact: Maintains a stable reference for the handleChange prop, which enables
  // the Dropdown component to avoid unnecessary re-renders when other state changes.
  const handleOptionChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  }, []);

  return (
    <>
      <Dropdown handleChange={handleOptionChange} value={selectedOption}>
        {GAME_OPTIONS}
      </Dropdown>

      <ScaledEmulatorContainer
        jssSpeccyRef={jssSpeccyRef}
        isStarted={isStarted}
        isScriptLoaded={isScriptLoaded}
        startEmulator={startEmulator}
      />

      {selectedOption && (
        <div>
          <div>
            You can download and play this game on an emulator via this tap
            file:
          </div>
          <DownloadLink tapFile={selectedGameUrl} label={selectedGame.name} />
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
