"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { useState } from "react"

// Define a simple chat hook to replace the ai/react useChat
function useSimpleChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      // Add bot response
      const responses = [
        "Based on your spending habits, I recommend creating a budget that allocates 50% for needs, 30% for wants, and 20% for savings and debt repayment.",
        "For retirement planning, aim to save at least 15% of your pre-tax income annually. Starting early is key to building a substantial nest egg.",
        "An emergency fund should cover 3-6 months of essential expenses. Keep this money in a high-yield savings account for easy access.",
        "When investing, diversification is important. Consider a mix of stocks, bonds, and other assets based on your risk tolerance and time horizon.",
        "To reduce monthly expenses, review subscription services you rarely use, refinance high-interest loans, and consider meal planning to reduce food costs.",
        "The 50/30/20 budget rule is a simple framework: 50% of income for necessities, 30% for discretionary spending, and 20% for financial goals.",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const botMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: randomResponse,
      }
      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 1000)
  }

  return { messages, input, handleInputChange, handleSubmit, isLoading }
}

export function FinancialAdvisor() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useSimpleChat()

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-md bg-muted/50">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Welcome to your Financial Assistant</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Ask me anything about your finances, budgeting, or for financial advice!
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-sm font-medium">Try asking:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleInputChange({ target: { value: "How can I reduce my monthly expenses?" } } as any)
                  }
                >
                  How can I reduce my expenses?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange({ target: { value: "What's a good savings rate?" } } as any)}
                >
                  What's a good savings rate?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange({ target: { value: "Should I pay off debt or invest?" } } as any)}
                >
                  Pay off debt or invest?
                </Button>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-secondary">
              <div className="flex space-x-2">
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-75"></div>
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a financial question..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

