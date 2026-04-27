---
description: "Use when updating registry collection files or debugging registry/install issues"
applyTo: "apps/www/registry/collection/**"
---

# Registry Collection Patterns

Registry metadata lives in `apps/www/registry/collection/`. These files define what users install via `npx shadcn add @limeplay/xxx`.

## Files

| File | What it registers |
|---|---|
| `registry-hooks.ts` | Feature hooks (`type: "registry:hook"`) |
| `registry-ui.ts` | UI components (`type: "registry:ui"`) |
| `registry-examples.ts` | Demo components for docs (`type: "registry:example"`) |
| `registry-lib.ts` | Internal utilities (`type: "registry:lib"`) |
| `registry-blocks.ts` | Composed blocks (`type: "registry:block"`) |

## Item Shape

```ts
{
  name: string,                    // kebab-case, e.g. "use-volume"
  type: "registry:hook",           // matches the file
  dependencies?: string[],         // npm packages
  devDependencies?: string[],      // npm dev deps
  registryDependencies?: string[], // other registry items by name
  files: [{
    path: string,                  // source: "hooks/use-volume.ts"
    target?: string,               // install target: "hooks/limeplay/use-volume.ts"
    type: string,                  // same as parent type
  }],
  // UI-only:
  css?: Record<string, Record<string, string>>,
  cssVars?: { light: {...}, dark: {...} },
}
```

## Rules

- `registryDependencies` must list ALL registry items that the code imports
- `dependencies` must list ALL npm packages the code imports (except React/Next.js)
- `files[].path` is relative to `apps/www/registry/default/`
- `files[].target` is where it installs in the user's project
- Examples do NOT have `target` — they are not installable
- After any change: run `bun run registry:build` in `apps/www/` and verify no errors
- Test install: `npx shadcn add @limeplay/xxx`

## Common Mistakes

- Missing `registryDependencies` → install fails silently (missing imports)
- Wrong `path` → registry build succeeds but file is empty
- Forgetting to add new examples to `registry-examples.ts` → `<ComponentPreview>` shows nothing
