import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Brain } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { OptionButton } from "@/components/ui/OptionButton";

const defaultProps = {
  id: "brain_basic",
  label: "Basic",
  description: "Entry-level brain",
  selected: false,
  onClick: vi.fn(),
  icon: Brain,
};

describe("OptionButton", () => {
  it("renders label and description", () => {
    render(<OptionButton {...defaultProps} />);
    expect(screen.getByText("Basic")).toBeInTheDocument();
    expect(screen.getByText("Entry-level brain")).toBeInTheDocument();
  });

  it("shows Selected badge when selected", () => {
    render(<OptionButton {...defaultProps} selected={true} />);
    expect(screen.getByText("Selected")).toBeInTheDocument();
  });

  it("does not show Selected badge when not selected", () => {
    render(<OptionButton {...defaultProps} selected={false} />);
    expect(screen.queryByText("Selected")).not.toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<OptionButton {...defaultProps} onClick={onClick} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("has aria-pressed=true when selected", () => {
    render(<OptionButton {...defaultProps} selected={true} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("has aria-pressed=false when not selected", () => {
    render(<OptionButton {...defaultProps} selected={false} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });
});
