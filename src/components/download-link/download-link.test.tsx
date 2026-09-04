import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DownloadLink } from "./download-link";

describe("DownloadLink", () => {
  it("shows the friendly label, not the file path", () => {
    render(<DownloadLink tapFile="/games/snake.tap" label="Snake" />);

    const link = screen.getByRole("link", { name: "Download Snake" });
    expect(link).toHaveAttribute("href", "/games/snake.tap");
    expect(link).toHaveAttribute("download");
    expect(screen.queryByText(/\/games\//)).not.toBeInTheDocument();
    expect(screen.queryByText(/\.tap/)).not.toBeInTheDocument();
  });
});
