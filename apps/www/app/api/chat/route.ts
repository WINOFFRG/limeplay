import type { ServerRuntime } from "next"

import { createOpenAICompatible } from "@ai-sdk/openai-compatible"
import { convertToModelMessages, streamText } from "ai"

import { ProvideLinksToolSchema } from "@/lib/inkeep-qa-schema"

export const runtime: ServerRuntime = "nodejs"

const openai = createOpenAICompatible({
  apiKey: process.env.INKEEP_API_KEY,
  baseURL: "https://api.inkeep.com/v1",
  name: "inkeep",
})

export async function POST(req: Request) {
  const reqJson = await req.json()

  const result = streamText({
    messages: convertToModelMessages(reqJson.messages, {
      ignoreIncompleteToolCalls: true,
    }),
    model: openai("inkeep-qa-sonnet-4"),
    toolChoice: "auto",
    tools: {
      provideLinks: {
        inputSchema: ProvideLinksToolSchema,
      },
    },
  })

  return result.toUIMessageStreamResponse()
}
