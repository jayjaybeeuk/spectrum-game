## 2024-05-14 - Prevent Unnecessary Re-renders during Window Resize
**Learning:** `ResizeObserver` callbacks that fire on every frame (up to 60fps) can cause severe performance issues if they trigger state updates in a top-level component, forcing the entire component tree to re-render.
**Action:** Localize the state updated by high-frequency events (like resizing or scrolling) to the smallest possible component, or use techniques like debouncing/throttling. In this case, we extracted the scaling logic into a `ScaledEmulatorContainer` component.
