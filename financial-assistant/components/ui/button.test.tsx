"use client"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "./button"

describe("Button component", () => {
  test("renders correctly", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument()
  })

  test("handles click events", async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await userEvent.click(screen.getByRole("button", { name: /click me/i }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test("applies variant classes correctly", () => {
    const { rerender } = render(<Button variant="default">Default</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-primary")

    rerender(<Button variant="destructive">Destructive</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-destructive")

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole("button")).toHaveClass("border")
  })

  test("applies size classes correctly", () => {
    const { rerender } = render(<Button size="default">Default</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-10")

    rerender(<Button size="sm">Small</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-9")

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-11")
  })
})

