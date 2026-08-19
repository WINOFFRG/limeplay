import { buildLLMsText, LLM_RESPONSE_HEADERS } from "@/lib/llms"

export const revalidate = false

export async function GET() {
  return new Response(buildLLMsText({ includeAllDocs: true }), {
    headers: LLM_RESPONSE_HEADERS,
  })
}
