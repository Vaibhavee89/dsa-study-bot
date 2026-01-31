import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeProvider } from "@/components/theme-provider";

const renderWithProvider = (component: React.ReactNode) => {
  return render(<ThemeProvider defaultTheme="light">{component}</ThemeProvider>);
};

describe("ThemeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.getItem = vi.fn().mockReturnValue(null);
    window.localStorage.setItem = vi.fn();
  });

  it("renders the theme toggle button", () => {
    renderWithProvider(<ThemeToggle />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("has accessible label", () => {
    renderWithProvider(<ThemeToggle />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("title");
  });

  it("changes theme on click", () => {
    renderWithProvider(<ThemeToggle />);
    const button = screen.getByRole("button");
    
    fireEvent.click(button);
    expect(window.localStorage.setItem).toHaveBeenCalled();
  });
});
