import { loader } from "fumadocs-core/source"
import { blocks } from "fumadocs-mdx:collections/server"

export const blocksSource = loader({
  baseUrl: "/blocks",
  source: blocks.toFumadocsSource(),
})
