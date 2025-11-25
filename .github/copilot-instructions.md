Limeplay is a shadcn/ui CLI-based modern UI library for building media players in React. The goal of this library is to allow industry-level media players like Spotify, Netflix, YouTube and many more platforms with ease. This is a UI library focused on UI Logic, accessibility, composable architecture and headless design. This library provides unopinionated styles and works on top of Shaka Player which acts as a player engine for the same. All the components in `apps/www/registry/default/ui` provides the UI components and `apps/www/registry/default/hooks` provides the logic components, a lot of them are interlinked and can be used together to build a complete media player. Currently we are building `apps/www/registry/default/blocks/linear-player` as the first example which represents the true representation of using this media player library. Since we are developing at a high velocity, we need our documentation to be up to date and accurate. Each document also consists of an isolated code example which is rendered in docs page by writing `<ComponentPreview name="$$" withPlayer />` where name attribute represents the ID of that component registered in registry.

## Core Architecture Understanding

### Event & Action Bridge System
Limeplay uses a dual-bridge architecture for state synchronization:
- **Event Bridge**: Native media element events are captured and synchronized to React state via centralized `PlayerHooks` component
- **Action Bridge**: UI interactions trigger native media element controls through dedicated hooks like `usePlayer()`, `useVolume()`, `useTimeline()`

### State Management Architecture  
- **Zustand + React Context Isolation**: Each `MediaProvider` creates an isolated store instance to support multiple players on the same page
- **Singleton Hook Pattern**: Hooks like `usePlayerStates()`, `useVolumeStates()` are singleton and MUST be centralized in `PlayerHooks` to prevent performance issues
- **Store Slice Pattern**: Each domain (player, volume, timeline, captions) has its own store slice that composes into `TypeMediaStore`

### Performance Requirements
1. **Centralized Event Handling**: All media event listeners MUST be in `PlayerHooks` to prevent re-render performance issues on high-velocity components
2. **Never call state hooks directly**: Never call `usePlayerStates()`, `useVolumeStates()` etc. directly in components - always centralize in `PlayerHooks`
3. **Memoization**: Use `React.memo`, `useCallback`, `useMemo` for high-frequency components like timeline controls

To understand registry you can simply ask for the "Shadcn UI Registry Template" contract on context7 MCP. The same concept is applied in `apps/www/registry/collection` each component, hook or even util from atomic level is registered right there which allows installation via the CLI. While we are developing we must ensure we don't miss to update the registry for the respective usage. We do have a build script which helps us ensure nothing is missing in registry which is also present in file but still we must ensure we don't miss to update the registry for the respective usage.

We are using Next.js 16 and React 19.1.1 for the development with Tailwind CSS 4.0.0 for styling. So make sure you are using the correct version of the dependencies and guidelines for the same. So that means syntax of using variables directly like `--lp-transition-speed-regular` can be used as  `duration-(--lp-transition-speed-regular)` and in all other places, or z-[100] can be used as z-100, make sure to refer tailwindcss v4 docs in case of any class name clashes or syntax errors.

## Import Path Transformation (CRITICAL FOR DOCUMENTATION)

When writing documentation, ALWAYS transform internal registry paths to external documentation paths:

**Registry Paths (Internal - Never use in docs):**
```typescript
import { Media } from "@/registry/default/ui/media"
import { useVolumeStates } from "@/registry/default/hooks/use-volume"
import { LinearMediaPlayer } from "@/registry/default/blocks/linear-player"
```

**Documentation Paths (External - Always use in docs):**
```typescript
import { Media } from "@/components/limeplay/media"  
import { useVolumeStates } from "@/hooks/limeplay/use-volume"
import { LinearMediaPlayer } from "@/blocks/linear-player"
```

**CLI Target Paths**: Refer to `TARGET_BASE_PATH = "components/limeplay"` in registry files for correct transformation. 

Returning to documentation: once a component is registered, it is ready for external use. Now there are a few things we need to ensure while writing the documentation. 

1. Check whether the documentation file exists in the relative domain `apps/www/content/docs`; currently we are primarily focusing on the `components`, `hooks`, and `blocks` domains.
2. If a component relies on a hook like `mute-control` component relies on `use-volume` hook, you MUST include both the hook import in `PlayerHooks` AND the store composition in `create-media-store.ts`. This implements the "Event & Action Bridge" pattern:
   - **Event Bridge**: Add `useVolumeStates()` to `PlayerHooks` component  
   - **Action Bridge**: Add `VolumeStore` to `TypeMediaStore` composition
   - **Store Setup**: Import and spread `createVolumeStore()` in media store creation
   
   For example usage, always refer to `apps/www/content/docs/components/mute-control.mdx` documentation file. If there's doubt about usage patterns, notify the user immediately. Also reference `apps/www/registry/default/blocks` for working examples with proper hook integration. 
3. Once we provide with the installation steps, we provide the usage. Same instructions as provided in point 2 applies here as well. 
4. Once the above steps are complete, proceed to the Understanding section, where we describe the respective hook or component. In the understanding section we try to keep it as simple and explanatory as possible.
5. Once done we also provide with the API reference of that hook or component. Since we are using fumadocs we need to specify `<AutoTypeTable path="./registry/default/ui/media.tsx" name="MediaPropsDocs" />` where path stands for file and name stands for type to look. Now see there might be some edge cases for example in `apps/www/registry/default/ui/media.tsx` component we have a type which extends a type like `React.VideoHTMLAttributes` which could ruin the documentation, so in such cases we explicitly define a new type specifically for docs. I am attaching an example below.
    ```tsx
    export type MediaPropsDocs = Pick<MediaProps, "as">

    export type MediaProps =
    | ({
        /**
         * Type of Media Element to Render
         *
         * @default video
         */
        as: "video"
        } & React.VideoHTMLAttributes<HTMLVideoElement>)
    | ({ as: "audio" } & React.AudioHTMLAttributes<HTMLAudioElement>)
    ```

    In case you find the types to be missing you can always define them in the source file.

## TypeScript Safety Standards (MANDATORY)

1. **Strict Typing**: No `any` types unless absolutely necessary - always provide proper interfaces
2. **Props Documentation**: Use separate `*PropsDocs` types for API documentation when extending HTML attributes to avoid documentation clutter
3. **Store Interfaces**: All Zustand stores must have proper TypeScript interfaces with JSDoc comments
4. **Event Handlers**: Properly type all media event handlers and Shaka Player configurations
5. **Generic Constraints**: Use proper constraints for generic types, especially for HTML element refs

## Component Composition Patterns (CRITICAL)

### Slot-Based Composition (MANDATORY)
All components MUST support composition via `@radix-ui/react-slot`:
```typescript
import { Slot } from "@radix-ui/react-slot"

interface ComponentProps {
  asChild?: boolean
  // other props
}

export function Component({ asChild = false, ...props }: ComponentProps) {
  const Comp = asChild ? Slot : "div" 
  return <Comp {...props} />
}
```

### Required Patterns
1. **Prop Priority**: Spread props with `...props` before custom props to allow overrides
2. **Event Composition**: Never block event propagation - compose events instead  
3. **Ref Composition**: Use `composeRefs` from `@radix-ui/react-compose-refs` for multiple refs
4. **Slot Support**: Always support `asChild` prop for component composition

6. The library also aims to create a composable architecture. You can again confirm this on [components.build](https://www.components.build/) guidelines via the context7 MCP. In case you find any component or hook is not composable or can be improved, you can always notify the agent and I will myself update the codebase. We are always open to improve the codebase and make it more composable and reusable.

7. Components should follow WAI-ARIA guidelines and should be accessible. **Media Player Accessibility Requirements**:
   - **ARIA Labels**: All controls must have proper `aria-label` or `aria-labelledby` 
   - **Keyboard Navigation**: Full keyboard control (Space, Arrow keys, Enter, M for mute, F for fullscreen)
   - **Screen Reader Support**: Proper announcement of time, volume, play state changes
   - **Focus Management**: Visible focus indicators with proper focus-visible styles, logical focus order
   - **Color Contrast**: Minimum 4.5:1 contrast ratio for all UI elements
   - **Motion Sensitivity**: Respect `prefers-reduced-motion` for animations
   
   **Required ARIA Patterns for Media Controls**:
   ```typescript
   // Timeline control accessibility
   <div role="slider" aria-label="Seek" aria-valuemin={0} aria-valuemax={duration} aria-valuenow={currentTime}>
   
   // Volume control accessibility  
   <div role="slider" aria-label="Volume" aria-valuemin={0} aria-valuemax={100} aria-valuenow={volume * 100}>
   
   // Play/pause button
   <button aria-label={paused ? "Play" : "Pause"} aria-pressed={!paused}>
   ```
   
   If developer is missing accessibility props or you have web standards recommendations for Media Players, notify the user immediately.

8. For styling of the components we always try to ensure that in library components we don't try to apply any case styles which could add opinions, we must try to use base styles from the globals.css i.e the shadcn/ui base theme and styles. **Limeplay-Specific CSS Variables**: In addition to shadcn/ui variables, use these approved Limeplay-specific variables:
   ```css
   :root {
     /* Timeline specific */
     --lp-timeline-track-height: 4px;
     --lp-timeline-track-height-active: 7px;
     --lp-timeline-buffered-color: oklch(0.985 0 0 / 0.4);
     --lp-buffered-start: /* dynamic via style prop */;
     --lp-buffered-width: /* dynamic via style prop */;
     --lp-played-width: /* dynamic via style prop */;
     --lp-timeline-thumb-position: /* dynamic via style prop */;
     
     /* Volume specific */
     --lp-volume-value: /* dynamic via style prop */;
     
     /* Controls fade gradient */
     --background-image-lp-controls-fade: linear-gradient(...);
   }
   ```
   
   Note: Variables marked as "dynamic via style prop" are component-scoped and set inline via React style props. They follow the `--lp-*` naming convention for consistency.

   As for November, 2025 I'm attaching a variable list of all styles under Neutral theme present in shadcn. Let's ensure we are using the correct styles and variables from below reference as some variables are not present in the globals.css file.
    ```css
    :root {
    --radius: 0.625rem;
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.145 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.145 0 0);
    --primary: oklch(0.205 0 0);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.97 0 0);
    --secondary-foreground: oklch(0.205 0 0);
    --muted: oklch(0.97 0 0);
    --muted-foreground: oklch(0.556 0 0);
    --accent: oklch(0.97 0 0);
    --accent-foreground: oklch(0.205 0 0);
    --destructive: oklch(0.577 0.245 27.325);
    --border: oklch(0.922 0 0);
    --input: oklch(0.922 0 0);
    --ring: oklch(0.708 0 0);
    --chart-1: oklch(0.646 0.222 41.116);
    --chart-2: oklch(0.6 0.118 184.704);
    --chart-3: oklch(0.398 0.07 227.392);
    --chart-4: oklch(0.828 0.189 84.429);
    --chart-5: oklch(0.769 0.188 70.08);
    --sidebar: oklch(0.985 0 0);
    --sidebar-foreground: oklch(0.145 0 0);
    --sidebar-primary: oklch(0.205 0 0);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.97 0 0);
    --sidebar-accent-foreground: oklch(0.205 0 0);
    --sidebar-border: oklch(0.922 0 0);
    --sidebar-ring: oklch(0.708 0 0);
    }

    .dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.205 0 0);
    --card-foreground: oklch(0.985 0 0);
    --popover: oklch(0.205 0 0);
    --popover-foreground: oklch(0.985 0 0);
    --primary: oklch(0.922 0 0);
    --primary-foreground: oklch(0.205 0 0);
    --secondary: oklch(0.269 0 0);
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --accent: oklch(0.269 0 0);
    --accent-foreground: oklch(0.985 0 0);
    --destructive: oklch(0.704 0.191 22.216);
    --border: oklch(1 0 0 / 10%);
    --input: oklch(1 0 0 / 15%);
    --ring: oklch(0.556 0 0);
    --chart-1: oklch(0.488 0.243 264.376);
    --chart-2: oklch(0.696 0.17 162.48);
    --chart-3: oklch(0.769 0.188 70.08);
    --chart-4: oklch(0.627 0.265 303.9);
    --chart-5: oklch(0.645 0.246 16.439);
    --sidebar: oklch(0.205 0 0);
    --sidebar-foreground: oklch(0.985 0 0);
    --sidebar-primary: oklch(0.488 0.243 264.376);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.269 0 0);
    --sidebar-accent-foreground: oklch(0.985 0 0);
    --sidebar-border: oklch(1 0 0 / 10%);
    --sidebar-ring: oklch(0.556 0 0);
    }
    ```

9. We must all ensure that our code writing style and patterns are consistent across the codebase. Some examples include:
   - Use the spread operator (`...props`) for prop spreading
   - Ensure correct prop priority order
   - Add styles for hover, disabled, and focus-visible states
   - Include dark mode styling
   - Compose events without blocking them via props
   - Use Slot for composable design
   - Do not force overriding any prop; always provide the ability to override prop values

That's all most likely for the documentation, we will try to be consistent with the documentation in all the cases and ensure that a developer doesn't feel either overwhelmed with the information or confused with the usage. You should possibly think of all questions that a developer might have and try to answer them in the documentation. As an LLM it's your responsibility to ensure the documentation is up to date and accurate and LLM-friendly as well.

In all the cases the developer is present and expects AI to notify or ask directly the user. In case of any missing codebase it should be updated in steps and notified the to the user during AI code review process. The agent should be responible in updating the codebase.

For any improvements at documentation level we are using fumadocs framework you can always refer fumadocs documentation for the same via the context7 MCP. At any point of time documentation might be outdated or missing, feel free to start updating it.

## AI Code Review Checklist (MANDATORY)

### Pre-Commit Verification
- [ ] Registry dependencies updated in `apps/www/registry/collection/` for new/modified components
- [ ] Import paths transformed correctly in documentation (registry -> external paths)
- [ ] TypeScript interfaces properly documented with JSDoc comments
- [ ] Event & Action Bridge pattern implemented correctly (hooks in PlayerHooks + store composition)
- [ ] Performance patterns applied (memoization, centralized hooks, no direct hook calls in components)
- [ ] Accessibility attributes present (ARIA labels, keyboard support, focus management)
- [ ] Error handling implemented with graceful fallbacks for media loading/playback failures
- [ ] CSS variables from approved list used (shadcn + Limeplay-specific variables)
- [ ] Component composition via Slot pattern supported (`asChild` prop)
- [ ] `npm run registry:build` passes without errors

### Documentation Quality Check  
- [ ] Installation steps include Event & Action Bridge setup (PlayerHooks + store composition)
- [ ] Store composition example provided with proper TypeScript interfaces
- [ ] API reference uses `<AutoTypeTable>` with correct path/name parameters
- [ ] Usage examples show realistic implementation with proper import paths
- [ ] `<ComponentPreview name="$$" withPlayer />` used for media components
- [ ] Understanding section explains component/hook purpose clearly
- [ ] All code examples use external import paths, not registry paths

## Common Pitfalls & Anti-Patterns (NEVER DO)

### ❌ Critical Mistakes to Avoid:
1. **Performance Issues**: Never call `usePlayerStates()`, `useVolumeStates()`, `useTimelineStates()` directly in components (causes re-render performance issues)
2. **Type Safety**: Never use `any` types for media events, Shaka Player configs, or component props
3. **Event Handling**: Never block event propagation without composition - always compose events
4. **Registry Maintenance**: Never add/modify components without updating registry dependencies
5. **Documentation**: Never use internal registry imports in documentation examples
6. **Component Design**: Never force override props without allowing user override
7. **Accessibility**: Never skip ARIA attributes for media controls (mandatory for media players)
8. **Styling**: Never use custom CSS colors instead of approved CSS variables

### ✅ Always Required Patterns:
1. **Hook Management**: Centralize all hook calls in `PlayerHooks` component with proper memoization
2. **Type Safety**: Use proper TypeScript interfaces with JSDoc for all public APIs
3. **Event Composition**: Compose events and allow prop spreading with proper priority
4. **Registry Updates**: Update registry when adding/modifying any component, hook, or utility
5. **Import Transformation**: Transform registry paths to external paths in all documentation
6. **Component Composition**: Support `asChild` composition pattern via Radix Slot
7. **Accessibility**: Include proper ARIA labels, keyboard support, and focus management
8. **Variable Usage**: Use only approved CSS variables from shadcn/ui + Limeplay-specific list

### Error Handling Requirements
```typescript
// Proper error handling pattern for media operations
export function usePlayer() {
  function play() {
    const media = store.getState().mediaRef.current
    if (!media) return

    media.play().catch((error: unknown) => {
      console.error("Error playing media", error)
      store.setState({ status: "error", idle: false })
    })
  }
}
```

### Testing Strategy Requirements
1. **Shaka Player Integration**: Test components with actual Shaka Player instance
2. **Multi-Instance Testing**: Verify multiple players work independently  
3. **Error State Testing**: Test video loading failures, network issues, DRM failures
4. **Accessibility Testing**: Keyboard navigation, screen reader compatibility
5. **Performance Testing**: High-frequency state updates (timeline seeking, volume changes)