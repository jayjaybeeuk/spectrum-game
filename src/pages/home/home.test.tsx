import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./home";
import { GAMES } from "./games";

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

const renderHome = () =>
  render(
    <ChakraProvider>
      <Home />
    </ChakraProvider>
  );

describe("Home", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    delete window.JSSpeccy;
  });

  afterEach(() => {
    delete window.JSSpeccy;
    document
      .querySelectorAll('script[src="/jsspeccy/jsspeccy.js"]')
      .forEach((s) => s.remove());
  });

  it("lists every game in the dropdown", () => {
    renderHome();

    const options = screen.getAllByRole("option").filter((o) => o.getAttribute("value"));
    expect(options.map((o) => o.textContent)).toEqual(GAMES.map((g) => g.name));
  });

  it("shows a loading overlay until the emulator script has loaded", () => {
    renderHome();
    expect(screen.getByText("Loading emulator...")).toBeInTheDocument();
  });

  it("shows the friendly name on the download button and updates on selection", async () => {
    const user = userEvent.setup();
    renderHome();

    expect(
      screen.getByRole("link", { name: `Download ${GAMES[0].name}` })
    ).toHaveAttribute("href", `/games/${GAMES[0].file}`);

    await user.selectOptions(screen.getByRole("combobox"), "snake.tap");

    expect(screen.getByRole("link", { name: "Download Snake" })).toHaveAttribute(
      "href",
      "/games/snake.tap"
    );
  });

  it("starts the emulator when the overlay is clicked after the script loads", async () => {
    const user = userEvent.setup();
    const jsspeccy = vi.fn(() => ({ openUrl: vi.fn(), exit: vi.fn() }));
    window.JSSpeccy = jsspeccy;

    renderHome();

    await user.click(
      screen.getByRole("button", { name: /Click to start emulator with sound/ })
    );

    expect(jsspeccy).toHaveBeenCalledTimes(1);
    expect(jsspeccy).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ openUrl: `/games/${GAMES[0].file}` })
    );
    expect(screen.queryByText(/Click to start emulator/)).not.toBeInTheDocument();
  });
});
