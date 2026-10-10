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
