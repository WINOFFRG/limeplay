# GitHub Copilot PR Agent Instructions for Limeplay

## Project Overview
Limeplay is an open-source React video player library built with TypeScript and Tailwind CSS v4. We use Shaka Player as our playback engine for robust video streaming capabilities.

**Tech Stack:**
- **Frontend:** React + TypeScript
- **Styling:** Tailwind CSS v4
- **Video Engine:** Shaka Player
- **Design System:** shadcn/ui components
- **Build System:** Turbo (monorepo)

## Core Guidelines

### 1. Documentation Structure
- **Documentation Location:** `apps/www/content/` contains all library documentation
- **Registry Location:** `apps/www/registry/` contains the component registry
- **Build System:** `apps/www/registry/collection/` contains the build configuration

### 2. Import Path Conventions
When reviewing documentation, ensure import paths are correctly transformed:

**Internal Registry Paths → External Documentation Paths:**
```typescript
// Internal (registry)
import { Media } from "@/registry/default/ui/media"
import { useMediaStates } from "@/registry/default/hooks/use-media-state"

// External (documentation)
import { Media } from "@/components/limeplay/media"
import { useMediaStates } from "@/hooks/limeplay/use-media-state"
```

### 3. Code Quality Standards
- **TypeScript:** Strict typing, no `any` types unless absolutely necessary
- **React:** Functional components with hooks, proper prop interfaces
- **Tailwind:** Class ordering is handled by linting - focus on functionality
- **Naming:** Use descriptive, camelCase names for variables and functions

### 4. Documentation Standards
- **Consistency:** Maintain uniform heading styles and language across all docs
- **Clarity:** Write simple, clear explanations with full code context
- **Examples:** Include practical, runnable code examples
- **Structure:** Follow established patterns in existing documentation

### 5. Registry Parity
- Ensure all registry files in `apps/www/registry/` are up-to-date
- Verify component exports match their documentation
- Check that build system correctly processes all registry entries

### 6. Component Guidelines
- Follow shadcn/ui design patterns and conventions
- Maintain consistent prop interfaces across similar components
- Ensure proper TypeScript types for all props and return values
- Include proper JSDoc comments for public APIs

### 7. Testing Considerations
- Verify components work with the Shaka Player integration
- Ensure responsive design works across different screen sizes
- Test accessibility features (ARIA labels, keyboard navigation)

### 8. Performance Guidelines
- Optimize for video playback performance
- Minimize unnecessary re-renders in video components
- Use proper React patterns (memo, useCallback, useMemo) where beneficial

### 9. Error Handling
- Implement graceful fallbacks for video loading failures
- Provide meaningful error messages for debugging
- Handle edge cases in video playback scenarios

### 10. Accessibility
- Ensure video controls are keyboard accessible
- Include proper ARIA labels for screen readers
- Maintain color contrast ratios for UI elements

## Review Checklist
- [ ] Import paths correctly transformed for documentation
- [ ] TypeScript types are properly defined
- [ ] Documentation is consistent with existing patterns
- [ ] Registry files are updated and in sync
- [ ] Components follow shadcn/ui conventions
- [ ] Code examples are functional and clear
- [ ] No linting errors (Tailwind class ordering handled automatically)
- [ ] Proper error handling implemented
- [ ] Accessibility considerations addressed

## Resources
- [Shaka Player Documentation](https://shaka-player-demo.appspot.com/docs/api/tutorial-welcome.html)
- [shadcn/ui Design System](https://ui.shadcn.com/docs/registry)
- [Build System Code](apps/www/registry/collection/)
