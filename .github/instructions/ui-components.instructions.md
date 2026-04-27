---
description: "Use when creating, editing, or reviewing Limeplay UI components"
applyTo: "apps/www/registry/default/ui/**"
---

# UI Component Patterns

## Structure

Components are headless, composable, and follow compound component pattern where appropriate.

```tsx
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { useXxxStore } from "@/registry/default/hooks/use-xxx"

interface RootProps extends React.ComponentProps<"div"> {
  asChild?: boolean
}

function Root({ asChild, ...props }: RootProps) {
  const Comp = asChild ? Slot : "div"
  const someState = useXxxStore((s) => s.field)
  return <Comp {...props} />
}

export { Root }
```

## Rules

- Always support `asChild` via `@radix-ui/react-slot`
- Never block event propagation — compose events
- Use granular `useXxxStore(s => s.field)` selectors — never select entire slices
- All controls must have ARIA labels, keyboard support, and focus-visible styles
- Use CSS variables from shadcn/ui theme — no custom colors
- Support dark mode
- No opinionated styles — keep headless
- `"use client"` directive required

## Registry

After creating/modifying a component, update `apps/www/registry/collection/registry-ui.ts`:

```ts
{
  name: "xxx-control",
  type: "registry:ui",
  dependencies: [],              // npm e.g. ["@radix-ui/react-slot"]
  registryDependencies: [],      // e.g. ["media-provider", "use-xxx"]
  files: [{
    path: "ui/xxx-control.tsx",
    target: "components/limeplay/xxx-control.tsx",
    type: "registry:ui",
  }],
}
```
