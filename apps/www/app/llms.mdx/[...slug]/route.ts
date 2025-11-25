import { notFound } from "next/navigation"
import { NextResponse, type NextRequest } from "next/server"

import { getLLMText } from "@/lib/get-llm-text"
import { source } from "@/lib/source"

export const revalidate = false

export async function GET(
  _req: NextRequest,
  { params }: RouteContext<"/llms.mdx/[...slug]">
) {
  const slug = (await params).slug
  const pageSlug = slug.map((segment, index) => 
    index === slug.length - 1 && segment.endsWith('.mdx') 
      ? segment.slice(0, -4) 
      : segment
  )
  const page = source.getPage(pageSlug)
  if (!page) notFound()

  return new NextResponse(await getLLMText(page), {
    headers: {
      "Content-Type": "text/markdown",
    },
  })
}

export function generateStaticParams() {
  const routes = source.generateParams()

  return routes
    .map((route) => {
      const slug = [...route.slug]
      if (slug.length > 0) {
        slug[slug.length - 1] = `${slug[slug.length - 1]}.mdx`
      }
      return { slug }
    })
}

/**
 * 
 * Bug in nextjs 16 where a folder and file with similar names will cause error 
 * 
 * > Build error occurred
Error: EISDIR: illegal operation on a directory, copyfile '/Users/X/Documents/Personal/Github/limeplay/apps/www/.next/server/app/llms.mdx/hooks.body' -> '/Users/X/Documents/Personal/Github/limeplay/apps/www/out/llms.mdx/hooks'
    at ignore-listed frames {
  errno: -21,
  code: 'EISDIR',
  syscall: 'copyfile',
  path: '/Users/X/Documents/Personal/Github/limeplay/apps/www/.next/server/app/llms.mdx/hooks.body',
  dest: '/Users/X/Documents/Personal/Github/limeplay/apps/www/out/llms.mdx/hooks'
}
error: script "build" exited with code 1
 */