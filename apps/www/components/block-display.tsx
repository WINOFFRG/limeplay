import { highlight } from "fumadocs-core/highlight";
import * as React from "react";
import type { registryItemFileSchema } from "shadcn/schema";
import type { z } from "zod";
import { BlockViewer } from "@/components/block-viewer";
import { ComponentPreview } from "@/components/component-preview";
import {
  createFileTreeForRegistryItemFiles,
  getRegistryItem,
} from "@/lib/registry";
import { cn } from "@/lib/utils";

export async function BlockDisplay({ name }: { name: string }) {
  const item = await getCachedRegistryItem(name);

  if (!item?.files) {
    return null;
  }

  const [tree, highlightedFiles] = await Promise.all([
    getCachedFileTree(item.files),
    getCachedHighlightedFiles(item.files),
  ]);

  return (
    <BlockViewer highlightedFiles={highlightedFiles} item={item} tree={tree}>
      <ComponentPreview
        className={cn("", item.meta?.containerClassName)}
        hideCode
        name={item.name}
      />
    </BlockViewer>
  );
}

const getCachedRegistryItem = React.cache(
  async (name: string) => await getRegistryItem(name)
);

const getCachedFileTree = React.cache(
  async (files: { path: string; target?: string }[]) =>
    createFileTreeForRegistryItemFiles(files)
);

const getCachedHighlightedFiles = React.cache(
  async (files: z.infer<typeof registryItemFileSchema>[]) =>
    await Promise.all(
      files.map(async (file) => ({
        ...file,
        highlightedContent: await highlight(file.content ?? "", {
          lang: "tsx",
        }),
      }))
    )
);
