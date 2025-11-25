import { notFound } from "next/navigation";
import * as React from "react";
import { registryItemSchema } from "shadcn/schema";
import { z } from "zod";
import { ThemeToggle } from "@/components/layouts/theme-toggle";
import { atomReader } from "@/hooks/use-config";
import { getRegistryComponent, getRegistryItem } from "@/lib/registry";

export const revalidate = false;
export const dynamic = "force-static";
export const dynamicParams = false;

const getCachedRegistryItem = React.cache(
  async (name: string) => await getRegistryItem(name)
);

export async function generateStaticParams() {
  const { Index } = await import("@/registry/__index__");
  const config = atomReader();
  const index = z.record(registryItemSchema).parse(Index[config.style]);

  const result = Object.values(index)
    .filter((block) =>
      ["registry:block", "registry:component", "registry:internal"].includes(
        block.type
      )
    )
    .map((block) => ({
      name: block.name,
    }));

  return result;
}

export default async function BlockPage({
  params,
}: {
  params: Promise<{
    name: string;
  }>;
}) {
  const { name } = await params;
  const item = await getCachedRegistryItem(name);
  const Component = getRegistryComponent(name);

  if (!(item && Component)) {
    return notFound();
  }

  return (
    <div className={item.meta?.container}>
      {process.env.NODE_ENV === "development" && (
        <ThemeToggle className="absolute top-2 right-2 z-50" />
      )}
      <Component {...item.meta?.props} />
    </div>
  );
}
