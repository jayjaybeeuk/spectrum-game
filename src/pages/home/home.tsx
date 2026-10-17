import { useRef, useState, memo, useCallback, type ChangeEvent, type RefObject } from "react";
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
  const handleStartOverlayActivate = () => {
    if (isScriptLoaded) {
      startEmulator();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: `${EMULATOR_WIDTH}px`,
        aspectRatio: `${EMULATOR_WIDTH} / ${EMULATOR_HEIGHT}`,
        containerType: "inline-size",
        overflow: "hidden",
        minWidth: 0,
        marginTop: "1rem",
      }}
    >
      <div
        style={{
          // ⚡ Bolt: Replaced ResizeObserver with pure CSS container queries.
          // Impact: Eliminates JavaScript execution during window resize entirely.
          // The browser natively handles the scaling calculations via `cqw` units,
          // removing observer overhead, improving scrolling/resizing smoothness,
          // and reducing React component complexity.
          transform: `scale(min(1, 100cqw / ${EMULATOR_WIDTH}px))`,
          transformOrigin: "top left",
          // ⚡ Bolt: Promoted the scaled container to a hardware-accelerated layer.
          // Impact: Offloads dynamic scaling of the active JSSpeccy canvas during window resize
          // from the CPU to the GPU. This prevents expensive main-thread repaints on every resize frame.
          willChange: "transform",
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

interface GameInfoProps {
  selectedOption: string;
  selectedGameUrl: string;
  selectedGameName: string;
}

// ⚡ Bolt: Extracted GameInfo into a memoized component.
// Impact: Prevents unnecessary reconciliation of the game information UI
// when the emulator state changes.
const GameInfo = memo(({ selectedOption, selectedGameUrl, selectedGameName }: GameInfoProps) => {
  if (!selectedOption) return null;

  return (
    <div>
      <div>
        You can download and play this game on an emulator via this tap
        file:
      </div>
      <DownloadLink tapFile={selectedGameUrl} label={selectedGameName} />
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
  );
});

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

      <GameInfo
        selectedOption={selectedOption}
        selectedGameUrl={selectedGameUrl}
        selectedGameName={selectedGame.name}
      />
    </>
  );
};

export default Home;
