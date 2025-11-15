import * as React from "react"
import { notFound } from "next/navigation"
import { registryItemSchema } from "shadcn/schema"
import { z } from "zod"

import { getRegistryComponent, getRegistryItem } from "@/lib/registry"
import { atomReader } from "@/hooks/use-config"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

const getCachedRegistryItem = React.cache(async (name: string) => {
  return await getRegistryItem(name)
})

export async function generateStaticParams() {
  const { Index } = await import("@/registry/__index__")
  const config = atomReader()
  const index = z.record(registryItemSchema).parse(Index[config.style])

  const result = Object.values(index)
    .filter((block) =>
      ["registry:block", "registry:component", "registry:internal"].includes(
        block.type
      )
    )
    .map((block) => ({
      name: block.name,
    }))

  return result
}

export default async function BlockPage({
  params,
}: {
  params: Promise<{
    name: string
  }>
}) {
  const { name } = await params
  const item = await getCachedRegistryItem(name)
  const Component = getRegistryComponent(name)

  if (!item || !Component) {
    return notFound()
  }

  return (
    <div className={item.meta?.container}>
      <Component {...item.meta?.props} />
    </div>
  )
}
