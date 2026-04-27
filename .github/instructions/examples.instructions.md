---
description: "Use when creating, editing, or reviewing Limeplay example demo components"
applyTo: "apps/www/registry/default/examples/**"
---

# Example Component Patterns

Examples are demo components rendered in docs via `<ComponentPreview name="xxx-demo" withPlayer />`.

## Structure

```tsx
"use client"

import { useXxxStore } from "@/registry/default/hooks/use-xxx"
// or import UI components:
import * as XxxControl from "@/registry/default/ui/xxx-control"

export default function XxxDemo() {
  // Use granular selectors
  const value = useXxxStore((s) => s.field)

  return (
    // Component demo
  )
}
```

## Rules

- Examples use `@/registry/default/...` imports (they are internal source code)
- Must have `"use client"` directive
- Export as `default function`
- Name convention: `xxx-demo.tsx` or `xxx-feature-demo.tsx`
- Keep focused — demonstrate one thing per example

## Registry

After creating an example, add to `apps/www/registry/collection/registry-examples.ts`:

```ts
{
  name: "xxx-demo",
  type: "registry:example",
  registryDependencies: ["use-xxx"],  // hooks/components it uses
  files: [{
    path: "examples/xxx-demo.tsx",
    type: "registry:example",
    // NO target field for examples
  }],
}
```

Then reference in docs: `<ComponentPreview name="xxx-demo" withPlayer />`
