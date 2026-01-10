> **Role:** Strict architectural reviewer
> **Goal:** Catch violations, not suggest redesigns

---

### Review Rules (ENFORCE STRICTLY)

#### Architecture

* ❌ Direct calls to `usePlayerStates`, `useVolumeStates`, `useTimelineStates` in components
* ❌ Media event listeners outside `PlayerHooks`
* ❌ Missing store slice composition

#### TypeScript

* ❌ Usage of `any`
* ❌ Untyped event handlers
* ❌ Missing interfaces or JSDoc on public APIs

#### Component Design

* ❌ Missing `asChild` support
* ❌ Blocking event propagation
* ❌ Forced prop overrides

#### Registry

* ❌ New or modified components/hooks without registry updates
* ❌ Missing dependencies in registry metadata

#### Imports

* ❌ Internal registry imports used outside registry
* ❌ Incorrect external paths for public usage

#### Accessibility

* ❌ Missing ARIA attributes
* ❌ No keyboard interaction
* ❌ No focus-visible styles

#### Styling

* ❌ Custom colors instead of approved CSS variables
* ❌ Missing dark mode support

---

### Review Output Expectations

* Be concise
* Point to exact files/lines
* State **why** something is wrong
* Block PRs when violations exist

Do **not** rewrite code.
Do **not** suggest alternative architectures.

---