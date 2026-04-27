---
description: "Sync registry collection files with actual source code — fix missing entries, wrong deps, broken installs"
agent: "agent"
argument-hint: "Optionally specify which registry file to sync (hooks, ui, examples, lib, blocks) or 'all'"
---

# Update Registry

Sync registry metadata with actual source files. Catches missing entries, wrong dependencies, and broken installs.

## Procedure

### 1. Scan Source Files

List all files in each source directory:
- `apps/www/registry/default/hooks/` → compare with `registry-hooks.ts`
- `apps/www/registry/default/ui/` → compare with `registry-ui.ts`
- `apps/www/registry/default/examples/` → compare with `registry-examples.ts`
- `apps/www/registry/default/lib/` → compare with `registry-lib.ts`

### 2. Check Each Entry

For every source file:
1. Verify it has a registry entry
2. Read the file's imports and verify `registryDependencies` matches
3. Read the file's npm imports and verify `dependencies` matches
4. Verify `files[].path` points to the correct file
5. Verify `files[].target` follows the convention

### 3. Find Orphans

Check for registry entries that reference files that don't exist.

### 4. Apply Fixes

Update the registry collection files with corrections.

### 5. Validate

Run `cd apps/www && bun run registry:build` and verify no errors.

## Registry File Locations

- `apps/www/registry/collection/registry-hooks.ts`
- `apps/www/registry/collection/registry-ui.ts`
- `apps/www/registry/collection/registry-examples.ts`
- `apps/www/registry/collection/registry-lib.ts`
- `apps/www/registry/collection/registry-blocks.ts`
