import { cn, formatCurrency } from "./utils"
import { describe, expect, test } from "vitest"

describe("cn utility function", () => {
  test("combines class names correctly", () => {
    expect(cn("class1", "class2")).toBe("class1 class2")
    expect(cn("class1", undefined, "class2")).toBe("class1 class2")
    expect(cn("class1", false && "class2", true && "class3")).toBe("class1 class3")
  })
})

describe("formatCurrency utility function", () => {
  test("formats USD currency correctly", () => {
    expect(formatCurrency(1000, "USD")).toBe("$1,000.00")
    expect(formatCurrency(1234.56, "USD")).toBe("$1,234.56")
    expect(formatCurrency(0, "USD")).toBe("$0.00")
  })

  test("formats EUR currency correctly", () => {
    expect(formatCurrency(1000, "EUR")).toBe("€1,000.00")
    expect(formatCurrency(1234.56, "EUR")).toBe("€1,234.56")
  })
})

