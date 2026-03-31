/**
 * validate-registries.ts
 *
 * Validates the built registry output in public/r/ to catch errors
 * in registry items during development. This runs independently of
 * the build script and can be used in CI or as a pre-build check.
 *
 * Validates:
 * 1. The registry collection (source of truth) against registrySchema.
 * 2. The built registry.json in public/r/ against registrySchema.
 * 3. Each individual built component JSON in public/r/*.json against
 *    registryItemSchema.
 * 4. Cross-references: every item in registry.json has a corresponding
 *    individual JSON file and vice versa.
 * 5. All registryDependencies resolve to existing items.
 */

import { promises as fs } from "fs"
import path from "path"
import { registryItemSchema, registrySchema } from "shadcn/schema"

import { registry as registryCollection } from "@/registry/collection/index"

const REGISTRY_OUTPUT_DIR = path.join(process.cwd(), "public/r")
const TIERS = ["free", "pro"] as const

let hasErrors = false
let warningCount = 0

/**
 * 4. Cross-reference: every item in registry.json should have a
 *    corresponding individual JSON, and vice versa.
 */
async function crossReferenceItems(
  registryData: null | { items: Array<{ name: string }> },
  individualItems: Map<string, unknown>
) {
  if (!registryData) {
    warn("Skipping cross-reference check (no registry.json data)")
    return
  }

  console.log("\n🔗 Cross-referencing registry items...")

  const registryNames = new Set(registryData.items.map((item) => item.name))
  const individualNames = new Set(individualItems.keys())

  // Items in registry.json but missing individual JSON files
  const missingJsonFiles = Array.from(registryNames).filter(
    (name) => !individualNames.has(name)
  )

  if (missingJsonFiles.length > 0) {
    warn(
      `Items in registry.json missing individual JSON files: ${missingJsonFiles.join(", ")}`
    )
  }

  // Individual JSON files not referenced in registry.json
  const extraJsonFiles = Array.from(individualNames).filter(
    (name) => !registryNames.has(name)
  )

  if (extraJsonFiles.length > 0) {
    // This is informational, not necessarily an error
    warn(
      `Individual JSON files not in registry.json: ${extraJsonFiles.join(", ")}`
    )
  }

  if (missingJsonFiles.length === 0 && extraJsonFiles.length === 0) {
    pass("All registry items have matching JSON files")
  }
}

function error(msg: string) {
  console.log(`❌ ${msg}`)
  hasErrors = true
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function main() {
  console.log("🧪 Validating registries...\n")

  await validateRegistryCollection()
  const registryData = await validateBuiltRegistryJson()
  const individualItems = await validateIndividualJsonFiles()
  await crossReferenceItems(registryData, individualItems)
  await validateDependencyResolution(registryData)
  await validateTierRegistries()

  // Summary
  console.log("\n" + "=".repeat(50))
  if (hasErrors) {
    console.log("\n❌ Validation failed with errors.")
    process.exit(1)
  } else if (warningCount > 0) {
    console.log(`\n⚠️  Validation passed with ${warningCount} warning(s).`)
  } else {
    console.log("\n✅ All registries passed validation.")
  }
}

function pass(msg: string) {
  console.log(`✅ ${msg}`)
}

async function readJsonFile(filePath: string): Promise<unknown> {
  const content = await fs.readFile(filePath, "utf-8")
  return JSON.parse(content)
}

/**
 * 2. Validate the built registry.json file.
 */
async function validateBuiltRegistryJson() {
  console.log("\n📋 Validating built registry.json...")

  const registryJsonPath = path.join(REGISTRY_OUTPUT_DIR, "registry.json")
  if (!(await fileExists(registryJsonPath))) {
    warn("public/r/registry.json not found. Run `registry:build` first.")
    return null
  }

  const data = await readJsonFile(registryJsonPath)
  const result = registrySchema.safeParse(data)

  if (!result.success) {
    error("public/r/registry.json validation failed:")
    console.log(JSON.stringify(result.error.format(), null, 2))
    return null
  }

  pass(`public/r/registry.json is valid (${result.data.items.length} items)`)
  return result.data
}

/**
 * 5. Validate registryDependencies resolve to existing items.
 */
async function validateDependencyResolution(
  registryData: null | {
    items: Array<{ name: string; registryDependencies?: string[] }>
  }
) {
  if (!registryData) {
    warn("Skipping dependency resolution check (no registry.json data)")
    return
  }

  console.log("\n🔗 Validating dependency resolution...")

  const allNames = new Set(registryData.items.map((item) => item.name))
  let missingCount = 0

  for (const item of registryData.items) {
    if (!item.registryDependencies?.length) continue

    for (const dep of item.registryDependencies) {
      // URL dependencies - extract the name and check the JSON exists
      if (dep.startsWith("http")) {
        const depName = dep.split("/").pop()?.replace(".json", "")
        if (depName && !allNames.has(depName)) {
          // Check if it's an external dependency (shadcn, etc.)
          if (!dep.includes("limeplay")) {
            // External dependency - skip validation
            continue
          }
          warn(
            `"${item.name}" depends on "${depName}" (${dep}) which is not in the registry`
          )
          missingCount++
        }
        continue
      }

      // Non-URL dependencies
      if (!dep.startsWith("@") && !allNames.has(dep)) {
        warn(`"${item.name}" depends on "${dep}" which is not in the registry`)
        missingCount++
      }
    }
  }

  if (missingCount === 0) {
    pass("All registryDependencies resolve correctly")
  }
}

/**
 * 3. Validate each individual component JSON file in public/r/.
 */
async function validateIndividualJsonFiles() {
  console.log("\n🔍 Validating individual component JSON files...")

  if (!(await fileExists(REGISTRY_OUTPUT_DIR))) {
    warn("public/r/ directory not found. Run `registry:build` first.")
    return new Map<string, unknown>()
  }

  const files = await fs.readdir(REGISTRY_OUTPUT_DIR)
  const jsonFiles = files.filter(
    (f) => f.endsWith(".json") && f !== "registry.json" // Skip the main registry file
  )

  const validatedItems = new Map<string, unknown>()
  let validCount = 0
  let invalidCount = 0

  for (const file of jsonFiles) {
    const filePath = path.join(REGISTRY_OUTPUT_DIR, file)
    const stat = await fs.stat(filePath)
    if (!stat.isFile()) continue

    try {
      const data = await readJsonFile(filePath)
      const result = registryItemSchema.safeParse(data)

      if (!result.success) {
        error(`${file} validation failed:`)
        // Print a concise summary of issues
        const issues = result.error.issues
        for (const issue of issues) {
          console.log(`   - ${issue.path.join(".")}: ${issue.message}`)
        }
        invalidCount++
      } else {
        validatedItems.set(result.data.name, result.data)
        validCount++
      }
    } catch (e) {
      error(`Failed to read/parse ${file}: ${e}`)
      invalidCount++
    }
  }

  if (invalidCount === 0) {
    pass(`All ${validCount} individual JSON files are valid`)
  } else {
    error(
      `${invalidCount}/${validCount + invalidCount} individual JSON files have validation errors`
    )
  }

  return validatedItems
}

/**
 * 1. Validate the registry collection (source of truth).
 */
async function validateRegistryCollection() {
  console.log("\n📦 Validating registry collection...")

  try {
    const result = registrySchema.safeParse(registryCollection)
    if (!result.success) {
      error("Registry collection validation failed:")
      console.log(JSON.stringify(result.error.format(), null, 2))
    } else {
      pass(`Registry collection is valid (${result.data.items.length} items)`)
    }
  } catch (e) {
    error(`Failed to validate registry collection: ${e}`)
  }
}

/**
 * 6. Validate tier-specific registries (free/pro).
 */
async function validateTierRegistries() {
  for (const tier of TIERS) {
    const tierDir = path.join(REGISTRY_OUTPUT_DIR, tier)
    if (!(await fileExists(tierDir))) continue

    console.log(`\n📂 Validating ${tier}/ registry...`)

    const registryJsonPath = path.join(tierDir, "registry.json")
    if (await fileExists(registryJsonPath)) {
      const data = await readJsonFile(registryJsonPath)
      const result = registrySchema.safeParse(data)

      if (!result.success) {
        error(`${tier}/registry.json validation failed:`)
        console.log(JSON.stringify(result.error.format(), null, 2))
      } else {
        pass(
          `${tier}/registry.json is valid (${result.data.items.length} items)`
        )
      }
    }
  }
}

function warn(msg: string) {
  console.log(`⚠️  ${msg}`)
  warningCount++
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.log("❌ Error:", err instanceof Error ? err.message : err)
    process.exit(1)
  })
