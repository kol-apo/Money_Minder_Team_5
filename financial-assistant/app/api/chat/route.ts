// Replace the entire file with a simpler implementation that doesn't use OpenAI

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Get the last user message
  const lastUserMessage = messages.filter((m) => m.role === "user").pop()

  // Static responses based on common financial questions
  const responses = [
    "Based on your spending habits, I recommend creating a budget that allocates 50% for needs, 30% for wants, and 20% for savings and debt repayment.",
    "For retirement planning, aim to save at least 15% of your pre-tax income annually. Starting early is key to building a substantial nest egg.",
    "An emergency fund should cover 3-6 months of essential expenses. Keep this money in a high-yield savings account for easy access.",
    "When investing, diversification is important. Consider a mix of stocks, bonds, and other assets based on your risk tolerance and time horizon.",
    "To reduce monthly expenses, review subscription services you rarely use, refinance high-interest loans, and consider meal planning to reduce food costs.",
    "The 50/30/20 budget rule is a simple framework: 50% of income for necessities, 30% for discretionary spending, and 20% for financial goals.",
  ]

  // Select a random response
  const randomResponse = responses[Math.floor(Math.random() * responses.length)]

  // Create a response that mimics the structure expected by the client
  return new Response(
    JSON.stringify({
      role: "assistant",
      content: randomResponse,
      id: `resp-${Date.now()}`,
      createdAt: new Date(),
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
}

