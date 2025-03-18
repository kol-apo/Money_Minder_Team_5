"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"

// Static financial advice responses
const financialResponses = [
  "Based on your spending habits, I recommend creating a budget that allocates 50% for needs, 30% for wants, and 20% for savings and debt repayment.",
  "Consider using the debt avalanche method to pay off your high-interest debts first, which will save you more money in the long run.",
  "For retirement planning, aim to save at least 15% of your pre-tax income annually. Starting early is key to building a substantial nest egg.",
  "An emergency fund should cover 3-6 months of essential expenses. Keep this money in a high-yield savings account for easy access.",
  "When investing, diversification is important. Consider a mix of stocks, bonds, and other assets based on your risk tolerance and time horizon.",
  "To reduce monthly expenses, review subscription services you rarely use, refinance high-interest loans, and consider meal planning to reduce food costs.",
  "For first-time homebuyers, save at least 20% for a down payment to avoid private mortgage insurance (PMI) and get better interest rates.",
  "Tax-advantaged accounts like 401(k)s and IRAs can significantly boost your retirement savings through compound growth and tax benefits.",
  "The 50/30/20 budget rule is a simple framework: 50% of income for necessities, 30% for discretionary spending, and 20% for financial goals.",
  "When improving your credit score, focus on paying bills on time, reducing credit utilization below 30%, and avoiding opening too many new accounts.",
]

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export function useChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response with delayed random financial advice
    setIsLoading(true)
    setTimeout(() => {
      const randomResponse = financialResponses[Math.floor(Math.random() * financialResponses.length)]
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomResponse,
      }
      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 1500)
  }

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  }
}

