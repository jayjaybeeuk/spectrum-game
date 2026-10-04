import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dropdown } from "./dropdown";

describe("Dropdown", () => {
  it("renders with a placeholder and options", () => {
    const handleChange = vi.fn();
    render(
      <Dropdown value="" handleChange={handleChange}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Dropdown>
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Select option")).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("calls handleChange when a new option is selected", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Dropdown value="" handleChange={handleChange}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Dropdown>
    );

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "1");

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("displays the correct selected value", () => {
    const handleChange = vi.fn();
    render(
      <Dropdown value="2" handleChange={handleChange}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Dropdown>
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("2");
  });
});
