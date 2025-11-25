"use client";

import { useConfig } from "@/hooks/use-config";
import { Index } from "@/registry/__index__";

export function PreviewTabComponent({
  componentName,
}: {
  componentName: string;
}) {
  if (!componentName) {
    throw new Error("component name is required");
  }

  const [config] = useConfig();

  const Component = Index[config.style][componentName]?.component;

  if (!Component) {
    return (
      <p className="text-muted-foreground text-sm">
        Component{" "}
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
          {componentName}
        </code>{" "}
        not found in registry.
      </p>
    );
  }

  return <Component />;
}
