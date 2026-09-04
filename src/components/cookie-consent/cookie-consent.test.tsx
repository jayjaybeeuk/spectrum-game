import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_STORAGE_KEY } from "../../hooks/useCookieConsent";

// clarity.ts reads import.meta.env at module load, so stub env before importing.
const loadComponent = async () => {
  vi.resetModules();
  const mod = await import("./cookie-consent");
  return mod.CookieConsent;
};

const renderWithChakra = (ui: React.ReactElement) =>
  render(<ChakraProvider>{ui}</ChakraProvider>);

const CLARITY_SCRIPT = "script#ms-clarity";

describe("CookieConsent", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    document.querySelectorAll(CLARITY_SCRIPT).forEach((s) => s.remove());
    delete window.clarity;
  });

  it("renders nothing in development", async () => {
    vi.stubEnv("PROD", false);
    vi.stubEnv("VITE_CLARITY_ID", "abc123");
    const CookieConsent = await loadComponent();

    renderWithChakra(<CookieConsent />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.querySelector(CLARITY_SCRIPT)).toBeNull();
  });

  it("renders nothing in production when no Clarity ID is configured", async () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("VITE_CLARITY_ID", "");
    const CookieConsent = await loadComponent();

    renderWithChakra(<CookieConsent />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("asks for consent and only loads Clarity after Accept", async () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("VITE_CLARITY_ID", "abc123");
    const CookieConsent = await loadComponent();
    const user = userEvent.setup();

    renderWithChakra(<CookieConsent />);

    expect(screen.getByRole("dialog", { name: "Cookie consent" })).toBeInTheDocument();
    expect(document.querySelector(CLARITY_SCRIPT)).toBeNull();

    await user.click(screen.getByRole("button", { name: "Accept" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.querySelector(CLARITY_SCRIPT)).not.toBeNull();
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("granted");
  });

  it("never loads Clarity after Decline", async () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("VITE_CLARITY_ID", "abc123");
    const CookieConsent = await loadComponent();
    const user = userEvent.setup();

    renderWithChakra(<CookieConsent />);
    await user.click(screen.getByRole("button", { name: "Decline" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.querySelector(CLARITY_SCRIPT)).toBeNull();
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("denied");
  });

  it("does not prompt again once a choice has been stored", async () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("VITE_CLARITY_ID", "abc123");
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    const CookieConsent = await loadComponent();

    renderWithChakra(<CookieConsent />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.querySelector(CLARITY_SCRIPT)).not.toBeNull();
  });
});
