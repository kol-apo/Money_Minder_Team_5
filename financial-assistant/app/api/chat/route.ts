import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    system:
      "You are a helpful logic-based financial assistant for MoneyMinder. Provide concise, practical financial advice and insights based on the user's questions. Focus on budgeting, saving, investing, and general financial wellness. Be friendly but professional, and offer actionable tips when possible. You are not AI-powered but rather use logical financial principles and rules to provide guidance.",
    messages,
  })

  return result.toDataStreamResponse()
}

