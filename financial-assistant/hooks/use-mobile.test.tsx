"use client"

import { renderHook } from "@testing-library/react"
import { useMobile } from "./use-mobile"
import { useMediaQuery } from "react-responsive"

// Mock react-responsive
jest.mock("react-responsive", () => ({
  useMediaQuery: jest.fn(),
}))

describe("useMobile hook", () => {
  test("returns true for mobile devices", () => {
    ;(useMediaQuery as jest.Mock).mockReturnValue(true)
    const { result } = renderHook(() => useMobile())
    expect(result.current).toBe(true)
  })

  test("returns false for non-mobile devices", () => {
    ;(useMediaQuery as jest.Mock).mockReturnValue(false)
    const { result } = renderHook(() => useMobile())
    expect(result.current).toBe(false)
  })

  test("uses correct media query", () => {
    renderHook(() => useMobile())
    expect(useMediaQuery).toHaveBeenCalledWith({ query: "(max-width: 767px)" })
  })
})

