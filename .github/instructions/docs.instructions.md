---
description: "Use when creating, editing, or reviewing Limeplay documentation pages"
applyTo: "apps/www/content/docs/**"
---

# Documentation Patterns

Uses fumadocs with MDX. Docs live under `apps/www/content/docs/`.

## Hook Doc Structure

```mdx
---
title: use-xxx
description: Feature for managing xxx.
---

## Installation

\```npm
npx shadcn add @limeplay/use-xxx
\```

Register the feature:

\```tsx title="lib/media.ts"
import { xxxFeature } from "@/hooks/limeplay/use-xxx"

createMediaKit({
  features: [..., xxxFeature()] as const,
})
\```

## Store

Access via `useXxxStore(selector)`:

\```tsx
import { useXxxStore } from "@/hooks/limeplay/use-xxx"

const value = useXxxStore(s => s.field)
\```

### State

| Field | Type | Description |
|---|---|---|
| `field` | `type` | What it does |

### Actions

| Method | Description |
|---|---|
| `action()` | What it does |

## Events

| Event | Payload | When |
|---|---|---|
| `eventname` | `{ field }` | When it fires |

## API Reference

<AutoTypeTable
  path="./registry/default/hooks/use-xxx.ts"
  name="XxxStore"
/>
```

## Component Doc Structure

```mdx
---
title: Xxx Control
description: What this component does.
---

<ComponentPreview name="xxx-demo" withPlayer />

## Installation

\```npm
npx shadcn add @limeplay/xxx-control
\```

<Callout>
Requires [`xxxFeature`](/docs/hooks/use-xxx) registered in your [`createMediaKit`](/docs/components/media-provider).
</Callout>

## Usage

\```tsx title="components/player/xxx.tsx"
import * as Xxx from "@/components/limeplay/xxx-control"

export function XxxControl() {
  return <Xxx.Root />
}
\```

## Components

### Root

Description of the root component.
```

## Critical Rules

- **NEVER** use `@/registry/...` imports — use `@/hooks/limeplay/*` and `@/components/limeplay/*`
- **NEVER** reference deleted APIs: `usePlayback()`, `useVolume()`, `PlayerHooks`, `mediaRef`, `on*` callbacks
- Every hook doc needs: Installation, Feature registration, Store (State + Actions tables), Events table, AutoTypeTable
- Every component doc needs: ComponentPreview, Installation, Callout for required features, Usage code block
- Keep tone concise and professional — no storytelling
