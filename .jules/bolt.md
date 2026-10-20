## 2023-10-24 - React.memo on Children Array
**Learning:** Using React.memo on a component wrapper that receives a dynamically generated children array (e.g. `GAMES.map`) is ineffective because the array reference changes on every render.
**Action:** Extract static option maps outside the component or use `useMemo` so that the `children` prop maintains referential equality.
## 2024-10-07 - Bypassing React State for High-Frequency DOM Events
**Learning:** Using React state (like `useState`) inside high-frequency event handlers such as `ResizeObserver` triggers synchronous React re-renders on every update. Even with `requestAnimationFrame` throttling, this causes unnecessary React diffing overhead for pure layout updates (like scaling).
**Action:** When only visual properties (like `height` and `transform`) need updating based on resize events, bypass React state entirely. Store mutable values in `useRef`, calculate the new values, and mutate the `.style` property directly on the DOM node refs. This drops the render cycle count to zero, significantly lowering main thread execution time.
## 2025-03-05 - Extracting Static UI to Memoized Components
**Learning:** Having static or minimally-changing UI (like game details and download links) in the same component as rapidly updating state (like emulator startup state) causes unnecessary reconciliation of the static UI's DOM elements on every state change.
**Action:** Extract such UI into separate components wrapped in `React.memo`, passing down only the necessary primitive props (like string values) to prevent wasteful re-renders when the parent's unrelated state updates.
## 2025-03-05 - Caching DOM Writes in High-Frequency Resize Handlers
**Learning:** Even when bypassing React state in high-frequency event handlers like `ResizeObserver`, unconditionally writing to DOM style properties (like `style.height` and `style.transform`) still triggers unnecessary browser work if the computed values haven't actually changed. For instance, resizing a window wider than a container's maximum width continuously fires the observer, repeatedly applying the exact same maximum scale value.
**Action:** When updating DOM element styles manually outside the render cycle, always cache the last applied value (e.g. in a `useRef`) and return early if the newly calculated value equals the cached one, preventing redundant DOM style writes.
## 2024-10-14 - JSSpeccy Teardown DOM Accumulation
**Learning:** JSSpeccy's `exit()` method stops the emulator but fails to tear down its injected DOM elements (like the canvas). This causes old canvases to accumulate indefinitely in the DOM every time a new game is loaded, eventually leading to performance degradation and memory leaks.
**Action:** When working with 3rd-party emulators like JSSpeccy in React, explicitly clear the container's `innerHTML` during the teardown phase (after calling exit/destroy) before a new instance is created.
## 2025-03-05 - Avoid requestAnimationFrame in ResizeObserver with Direct DOM Mutation
**Learning:** Using `requestAnimationFrame` inside a `ResizeObserver` delays the layout update by one frame. If the observer is tracking a container whose width is managed by the browser (like flex/grid/percentage layouts), the browser updates the container width immediately, but the scale (managed by `requestAnimationFrame`) updates on the next frame. This 1-frame offset creates a noticeable visual jitter/lag during resizing. Since the DOM updates in `applyScale` already check a cached `currentScaleRef` to avoid redundant DOM writes, `requestAnimationFrame` is unnecessary and actively harmful to visual smoothness.
**Action:** When updating DOM properties inside a `ResizeObserver` by mutating refs directly and using caching to avoid redundant writes, do not wrap the update in `requestAnimationFrame`. Let the `ResizeObserver` naturally batch the updates within the same render cycle for smooth scaling.

## 2024-05-18 - Replacing ResizeObserver with Pure CSS Container Queries
**Learning:** Using JavaScript `ResizeObserver` to apply CSS transforms like scaling for proportional elements causes unnecessary React lifecycle/rendering overhead and can lead to a 1-frame visual lag. Modern CSS container queries (`containerType: "inline-size"`) with `cqw` math natively handle this flawlessly without running any JavaScript.
**Action:** When a DOM element needs to scale proportionally relative to its container's width, default to CSS `aspectRatio`, `containerType: "inline-size"`, and `transform: scale(...)` with `cqw` units instead of reaching for `ResizeObserver`.

## 2025-03-05 - Deferred Heavy Initialization on Rapid State Updates
**Learning:** When a UI component updates state rapidly (like a dropdown menu traversed with arrow keys), synchronous reactions that perform heavy work (like loading a WASM emulator or complex object lookups) can block the main thread and freeze the UI.
**Action:** Use React 18's `useDeferredValue` on the rapidly changing state to decouple the urgent UI updates from the heavy side-effects, allowing the browser to keep the interface perfectly responsive while batching/delaying the expensive work.

## 2024-05-30 - Lazy evaluate `isScriptLoaded` for window.JSSpeccy
**Learning:** Initializing `useState` with `false` when a global object might already be loaded (e.g. `window.JSSpeccy`) and then updating it to `true` in a `useEffect` causes an immediate, unnecessary React re-render of the entire component tree holding the emulator. Since users might navigate or have the script already loaded via another mechanism, the first mount pays a penalty.
**Action:** Always lazily initialize such states using a function in `useState(() => typeof window !== "undefined" && !!window.JSSpeccy)` to avoid initial paint layout thrashing.
