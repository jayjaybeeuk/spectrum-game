import { render } from "@testing-library/react";
import { describe, it, vi, beforeEach } from "vitest";
import App from "./App";

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
  });

  it("renders without crashing", () => {
    render(<App />);
  });
});
