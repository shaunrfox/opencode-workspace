# Panda CSS Component Review

## When to Use This Skill

Use this skill when:
- Auditing existing components for Panda CSS best practices
- Identifying technical debt and improvement opportunities
- Preparing components for production
- Reviewing pull requests with component changes
- Refactoring components to use Panda CSS patterns

**IMPORTANT**: This skill creates recommendations and presents them for approval BEFORE making any changes.

## Review Process

### Phase 1: Discovery

Gather information about the component:

1. **Read component implementation file**
   - Understand current architecture
   - Identify styling approach (inline CSS, Panda CSS, mix)
   - Note TypeScript types and props

2. **Check for recipe definition**
   - Look for recipe in `src/recipes/`
   - Verify recipe is registered in `panda.config.ts`

3. **Review usage patterns**
   - Check how component is used in codebase
   - Identify common prop combinations

### Phase 2: Assessment

Evaluate component against comprehensive checklist:

#### Architecture

- [ ] Component uses Box as foundation for polymorphic behavior
- [ ] splitProps utility used to separate CSS from HTML props
- [ ] Recipe imported and applied correctly
- [ ] TypeScript types use generated recipe variant types

#### Styling

- [ ] Uses recipe-based styling (not inline CSS or external classes)
- [ ] No hard-coded values (colors, spacing, etc.)
- [ ] Uses semantic tokens for theme-aware styling
- [ ] Supports light AND dark themes

#### Accessibility

- [ ] Includes `_focusVisible` styles in recipe
- [ ] ARIA attributes present where needed
- [ ] Keyboard interaction implemented for custom elements
- [ ] Semantic HTML used (button, not div with onClick)

#### Responsiveness

- [ ] Supports responsive prop values where appropriate
- [ ] Container queries used if component-level responsive needed

#### TypeScript

- [ ] Recipe variant types imported and used
- [ ] Prop conflicts resolved (Omit overlapping types)
- [ ] All props properly typed

#### Performance

- [ ] No unnecessary re-renders (check memo usage if needed)
- [ ] splitProps called once per render
- [ ] No inline function definitions in render

#### Documentation

- [ ] Component exported with type
- [ ] Props interface exported
- [ ] Usage examples in Storybook

### Phase 3: Recommendations

Generate prioritized improvement list:

**Priority Levels**:
- **P0** (Critical): Breaks functionality, accessibility violations
- **P1** (High): Poor UX, missing best practices
- **P2** (Medium): Technical debt, optimization opportunities
- **P3** (Low): Nice-to-haves, stylistic improvements

**Recommendation Format**:
```
[P1] Missing _focusVisible styles

Current: No visible focus indicator for keyboard navigation

Recommended:
- Add _focusVisible condition to recipe
- Set outlineWidth, outlineColor for visible focus state

Code example:
base: {
  _focusVisible: {
    outlineWidth: '2',
    outlineOffset: '1',
    outlineColor: { base: 'blue.50', _dark: 'blue.40' }
  }
}

Effort: 10 minutes
Impact: Improved accessibility for keyboard users
```

### Phase 4: Implementation

**ONLY AFTER USER APPROVAL**:

1. Create TodoWrite items for each approved recommendation
2. Implement changes incrementally
3. Test after each change
4. Verify no regressions

## Common Findings

### Finding 1: Recipe Types Not Used

**Issue**: Manual prop types instead of generated recipe types

```typescript
// Current (bad)
type ButtonProps = {
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
}

// Recommended
import { type ButtonVariantProps } from '@styled-system/recipes'
type ButtonProps = ButtonVariantProps
```

**Priority**: P2 (out of sync with recipe changes)

### Finding 2: Missing splitProps

**Issue**: CSS and HTML props not separated

```typescript
// Current (bad)
export const Button: FC<ButtonProps> = (props) => {
  return <button className={button(props)} {...props} />
  // ❌ Spreads all props, including Panda CSS props, to HTML
}

// Recommended
export const Button: FC<ButtonProps> = (props) => {
  const [className, htmlProps] = splitProps(props)
  return <button className={className} {...htmlProps} />
  // ✅ Only HTML props passed to element
}
```

**Priority**: P1 (console warnings, invalid HTML attributes)

### Finding 3: Hard-coded Values

**Issue**: Colors, spacing hard-coded instead of tokens

```typescript
// Current (bad)
<Box bg="#3b82f6" px="15px" />

// Recommended
<Box bg="blue.50" px="16" />
// Uses tokens that work in light/dark themes
```

**Priority**: P1 (breaks theme switching)

### Finding 4: No Focus Styles

**Issue**: Missing visible focus indicator

```typescript
// Current (bad)
base: {
  outline: 'none'  // ❌ Removes browser default, no replacement
}

// Recommended
base: {
  _focusVisible: {
    outlineWidth: '2',
    outlineOffset: '1',
    outlineColor: { base: 'blue.50', _dark: 'blue.40' }
  }
}
```

**Priority**: P0 (accessibility violation)

### Finding 5: Missing ARIA Attributes

**Issue**: Interactive elements without proper ARIA

```typescript
// Current (bad)
<button disabled={loading}>Submit</button>

// Recommended
<button
  disabled={loading || disabled}
  aria-disabled={disabled}
  aria-busy={loading}
>
  Submit
</button>
```

**Priority**: P1 (poor screen reader experience)

### Finding 6: No Box Foundation

**Issue**: Component doesn't support polymorphic rendering

```typescript
// Current (bad)
export const Card: FC<CardProps> = (props) => {
  return <div className={card()} {...props} />
  // ❌ Always renders as div
}

// Recommended
export const Card: FC<CardProps> = ({ as = 'div', ...props }) => {
  return <Box as={as} className={card()} {...props} />
  // ✅ Can render as any element: <Card as="article" />
}
```

**Priority**: P2 (limits component flexibility)

### Finding 7: Inline Styles Mix

**Issue**: Mixing Panda CSS with inline styles

```typescript
// Current (bad)
<Box
  bg="blue.50"
  style={{ backgroundColor: 'red' }}  // ❌ Conflicts
/>

// Recommended
<Box bg="blue.50" />  // ✅ Use Panda CSS exclusively
```

**Priority**: P1 (unpredictable styling)

### Finding 8: Missing Theme Support

**Issue**: Colors don't adapt to theme

```typescript
// Current (bad)
bg: 'blue.50'  // ❌ Same in light/dark

// Recommended
bg: { base: 'blue.50', _dark: 'blue.40' }  // ✅ Theme-aware
```

**Priority**: P1 (poor dark mode support)

## Review Checklist Template

Use this template for systematic reviews:

```markdown
## Component Review: [ComponentName]

### Files Reviewed
- [ ] Implementation: `src/components/[Name]/[Name].tsx`
- [ ] Recipe: `src/recipes/[name].ts`
- [ ] Config: `panda.config.ts` (recipe registered)
- [ ] Stories: `src/components/[Name]/[Name].stories.tsx`

### Architecture ✅ / ⚠️ / ❌
- Box foundation: [status]
- splitProps usage: [status]
- Recipe application: [status]
- TypeScript types: [status]

### Styling ✅ / ⚠️ / ❌
- Recipe-based: [status]
- No hard-coded values: [status]
- Semantic tokens: [status]
- Theme support: [status]

### Accessibility ✅ / ⚠️ / ❌
- Focus styles: [status]
- ARIA attributes: [status]
- Keyboard interaction: [status]
- Semantic HTML: [status]

### Findings

#### [P0] Critical Issues
1. [Finding with code example]

#### [P1] High Priority
1. [Finding with code example]

#### [P2] Medium Priority
1. [Finding with code example]

#### [P3] Low Priority
1. [Finding with code example]

### Recommendations Summary

Estimated effort: [X hours]
Suggested order: [P0 items first, then P1, etc.]

### Next Steps
1. Review recommendations with team
2. Get approval for changes
3. Create TodoWrite items for approved changes
4. Implement incrementally
5. Test thoroughly
```

## Automated Checks

Consider running these tools:

### TypeScript

```bash
npx tsc --noEmit
```

Catches type errors, missing imports.

### ESLint

```bash
npx eslint src/components/
```

Catches common code issues.

### Axe Accessibility

```typescript
import { axe } from 'jest-axe'

test('component has no a11y violations', async () => {
  const { container } = render(<Component />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### Bundle Size

```bash
npx vite-bundle-visualizer
```

Identify heavy dependencies.

## After Review

1. **Prioritize findings** by impact and effort
2. **Get user approval** before implementing changes
3. **Create TodoWrite items** for tracking
4. **Implement incrementally** (don't change everything at once)
5. **Test thoroughly** after each change
6. **Document decisions** in component comments or ADRs

## Best Practices

- Review with fresh eyes (wait a day if you wrote the code)
- Focus on user-facing issues first (accessibility, functionality)
- Don't nitpick style preferences
- Provide clear, actionable recommendations
- Include code examples for each suggestion
- Estimate effort for each recommendation
- Always get approval before making changes
