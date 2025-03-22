"use client"

import { renderHook, act } from "@testing-library/react"
import { useMobile } from "./use-mobile"
import { describe, afterEach, test, expect } from "@jest/globals"

// Mock window.innerWidth
const originalInnerWidth = window.innerWidth

describe("useMobile hook", () => {
  afterEach(() => {
    // Reset innerWidth to original value after each test
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: originalInnerWidth,
    })
  })

  test("returns true for mobile devices", () => {
    // Set viewport width to mobile size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 767,
    })

    // Trigger resize event
    act(() => {
      window.dispatchEvent(new Event("resize"))
    })

    const { result } = renderHook(() => useMobile())
    expect(result.current).toBe(true)
  })

  test("returns false for non-mobile devices", () => {
    // Set viewport width to desktop size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    })

    // Trigger resize event
    act(() => {
      window.dispatchEvent(new Event("resize"))
    })

    const { result } = renderHook(() => useMobile())
    expect(result.current).toBe(false)
  })
})

