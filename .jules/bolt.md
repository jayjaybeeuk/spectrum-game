## 2024-05-14 - Prevent Unnecessary Re-renders during Window Resize
**Learning:** `ResizeObserver` callbacks that fire on every frame (up to 60fps) can cause severe performance issues if they trigger state updates in a top-level component, forcing the entire component tree to re-render.
**Action:** Localize the state updated by high-frequency events (like resizing or scrolling) to the smallest possible component, or use techniques like debouncing/throttling. In this case, we extracted the scaling logic into a `ScaledEmulatorContainer` component.

## 2024-05-24 - Preloading dynamically injected scripts
**Learning:** Dynamically injecting scripts in React components (like the emulator script) creates a waterfall where the browser can't start downloading the asset until the JS bundle loads and the component mounts.
**Action:** Add `<link rel="preload">` to index.html for large, critical scripts injected dynamically so the browser downloads them in parallel with the main JS bundle.
