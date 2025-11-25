import { notFound } from "next/navigation"
import { ImageResponse } from "@takumi-rs/image-response"

import {
  getImageResponseOptions,
  generate as MetadataImage,
} from "@/lib/og/mono"
import { getPageImage, source } from "@/lib/source"

export const revalidate = false

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/docs/[...slug]">
) {
  const { slug } = await params
  const page = source.getPage(slug.slice(0, -1))
  if (!page) notFound()

  return new ImageResponse(
    (
      <MetadataImage
        title={page.data.title}
        description={page.data.description}
        site="Limeplay"
      />
    ),
    await getImageResponseOptions()
  )
}

export function generateStaticParams(): {
  slug: string[]
}[] {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }))
}
