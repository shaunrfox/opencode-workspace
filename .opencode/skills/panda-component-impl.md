# Panda CSS Component Implementation

## When to Use This Skill

Use this skill when:
- Building React components with Panda CSS styling
- Implementing recipe-based component variants
- Creating polymorphic components (components that can render as different elements)
- Integrating TypeScript with Panda CSS types
- Implementing accessible components with Panda CSS
- Setting up component file structure

For creating the recipes themselves, use the **panda-recipe-patterns** skill first.

## Component File Structure

```
src/
  components/
    Button/
      Button.tsx          # Component implementation
      index.tsx           # Public exports
      Button.stories.tsx  # Storybook documentation (optional)
    Icon/
      Icon.tsx
      index.tsx
      svg/                # SVG source files (for icon systems)
    CheckBox/
      CheckBox.tsx
      index.tsx
```

**Pattern**: Each component in its own directory with implementation + exports.

## Base Component Pattern (Box)

The Box component is the foundation - a polymorphic element that accepts all Panda CSS style props.

Create: `src/components/Box/Box.tsx`

```typescript
import { createElement } from 'react'
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cx } from '@styled-system/css'
import { box } from '@styled-system/patterns'
import type { SystemStyleObject } from '@styled-system/types'
import { splitProps } from '~/utils/splitProps'

// Box can render as any HTML element
export type BoxProps =
  Omit<ComponentPropsWithoutRef<ElementType>, 'as'> &
  SystemStyleObject &  // Enable all Panda CSS style props
  {
    as?: ElementType
    children?: ReactNode
  }

export const Box = ({ as = 'div', ...props }: BoxProps) => {
  // Separate Panda CSS props from HTML props
  const [className, otherProps] = splitProps(props)

  // Combine box pattern with custom className
  const comboClassName = cx(box({}), className)

  return createElement(as, { className: comboClassName, ...otherProps })
}
```

**Key Points**:
- `as` prop: Polymorphic rendering (div, button, a, span, etc.)
- `SystemStyleObject`: Enables all Panda CSS style props (bg, px, fontSize, etc.)
- `splitProps`: Utility to separate CSS props from HTML props
- `createElement`: Dynamic element creation based on `as` prop

## The splitProps Utility

Critical utility for separating Panda CSS props from HTML attributes.

Create: `src/utils/splitProps.ts`

```typescript
import { cx, css, splitCssProps } from '@styled-system/css'

/**
 * Splits component props into Panda CSS props and HTML props.
 * Returns [className, otherProps].
 */
export const splitProps = (
  props: Record<string, any>
): [string, Record<string, any>] => {
  // Panda's utility: splits CSS props from other props
  const [cssProps, otherProps] = splitCssProps(props)

  // Extract css prop separately
  const { css: cssProp, ...styleProps } = cssProps

  // Generate className from CSS props
  const generatedClassName = css(cssProp, styleProps)

  // Merge with existing className if present
  const existingClassName = otherProps.className || ''
  const mergedClassName = cx(existingClassName, generatedClassName)

  // Remove className from otherProps (it's now in mergedClassName)
  const { className, ...remainingProps } = otherProps

  return [mergedClassName, remainingProps]
}
```

**Why**: Enables inline style props on components while keeping clean HTML output.

**Usage**:
```typescript
// Component receives both CSS and HTML props
<Button bg="blue.50" px="20" onClick={handleClick} disabled>

// splitProps separates them:
// cssProps: { bg: 'blue.50', px: '20' }
// htmlProps: { onClick: handleClick, disabled: true }
```

## Recipe-Based Components

### Simple Recipe Component

Create: `src/components/Button/Button.tsx`

```typescript
import { type FC } from 'react'
import { cx } from '@styled-system/css'
import { button, type ButtonVariantProps } from '@styled-system/recipes'
import { Box, type BoxProps } from '../Box/Box'
import { splitProps } from '~/utils/splitProps'

export type ButtonProps =
  BoxProps &
  ButtonVariantProps &
  {
    loading?: boolean
    disabled?: boolean
    href?: string
  }

export const Button: FC<ButtonProps> = ({
  variant,
  size,
  loading = false,
  disabled = false,
  href,
  ...props
}) => {
  // Separate Panda CSS props from HTML props
  const [className, otherProps] = splitProps(props)

  // Determine element type
  const as = href ? 'a' : 'button'

  // Combine recipe className with custom className
  const comboClassName = cx(
    button({ variant, size }),  // Recipe styles
    className                   // Custom overrides
  )

  return (
    <Box
      as={as}
      className={comboClassName}
      disabled={loading || disabled}
      href={href}
      {...otherProps}
    />
  )
}
```

**Pattern Breakdown**:
1. Import recipe and its variant types from `@styled-system/recipes`
2. Extend `BoxProps` with `ButtonVariantProps` for full type safety
3. Use `splitProps` to separate CSS from HTML props
4. Apply recipe with `button({ variant, size })`
5. Merge recipe className with custom className using `cx`
6. Pass to Box component for rendering

### Slot Recipe Component

Multi-part components use slot recipes.

Create: `src/components/CheckBox/CheckBox.tsx`

```typescript
import { type FC, type InputHTMLAttributes } from 'react'
import { checkbox, type CheckboxVariantProps } from '@styled-system/recipes'
import { Box } from '../Box/Box'
import { Icon } from '../Icon/Icon'

export type CheckBoxProps =
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  CheckboxVariantProps &
  {
    label?: string
    indeterminate?: boolean
    error?: boolean
  }

export const CheckBox: FC<CheckBoxProps> = ({
  size,
  label,
  indeterminate = false,
  error = false,
  checked,
  ...props
}) => {
  // Get slot class names from recipe
  const { container, input, indicator } = checkbox({ size })

  return (
    <Box as="label" className={container}>
      <Box
        as="input"
        type="checkbox"
        className={input}
        checked={checked}
        // Data attributes for custom states
        {...(indeterminate && { 'data-indeterminate': true })}
        {...(error && { 'data-error': true })}
        {...props}
      />

      {/* Different icons for different states */}
      <Icon className={indicator} name="checkbox" data-state="unchecked" />
      <Icon className={indicator} name="checkbox-checked" data-state="checked" />
      <Icon className={indicator} name="checkbox-indeterminate" data-state="indeterminate" />

      {label && (
        <Box as="span" className={checkbox().label}>
          {label}
        </Box>
      )}
    </Box>
  )
}
```

**Slot Recipe Pattern**:
1. Destructure slot classes: `{ container, input, indicator }`
2. Apply each slot class to corresponding element
3. Use data attributes for custom states: `data-indeterminate`, `data-error`
4. Recipe CSS targets these data attributes via conditions

### Component with Conditional Rendering

Create: `src/components/Button/Button.tsx` (with loading state)

```typescript
import { type FC, type ReactNode } from 'react'
import { cx } from '@styled-system/css'
import { button, type ButtonVariantProps } from '@styled-system/recipes'
import { Box, type BoxProps } from '../Box/Box'
import { Spinner } from '../Spinner/Spinner'
import { splitProps } from '~/utils/splitProps'

export type ButtonProps =
  BoxProps &
  ButtonVariantProps &
  {
    loading?: boolean
    leftIcon?: ReactNode
    rightIcon?: ReactNode
    children: ReactNode
  }

export const Button: FC<ButtonProps> = ({
  variant,
  size,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  ...props
}) => {
  const [className, otherProps] = splitProps(props)

  return (
    <Box
      as="button"
      className={cx(button({ variant, size }), className)}
      disabled={loading || disabled}
      aria-busy={loading}  // Accessibility: announce loading state
      {...otherProps}
    >
      {/* Show spinner when loading */}
      {loading && <Spinner size={size} />}

      {/* Show left icon if not loading */}
      {!loading && leftIcon}

      {/* Button text */}
      <span>{children}</span>

      {/* Right icon */}
      {!loading && rightIcon}
    </Box>
  )
}
```

## TypeScript Patterns

### Extract Recipe Types

```typescript
import { button, type ButtonVariantProps } from '@styled-system/recipes'

// ButtonVariantProps includes:
// - variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
// - size?: 'small' | 'medium' | 'large'
```

**Pattern**: Always use generated variant types for prop types.

### Omit Conflicting Props

```typescript
import { text, type TextVariantProps } from '@styled-system/recipes'

// Avoid prop conflicts between Box and recipe
export type TextProps =
  Omit<BoxProps, keyof TextVariantProps> &  // Remove conflicts
  TextVariantProps &
  {
    children: ReactNode
  }
```

**Why**: Prevents TypeScript errors when Box and recipe define same props.

### Conditional Value Types

For responsive/theme-aware props:

```typescript
import { type ConditionalValue } from '@styled-system/types'
import { type ColorToken } from '@styled-system/tokens'

export type IconProps = {
  fill?: ConditionalValue<ColorToken>  // Enables: fill="blue.50" or fill={{ base: 'blue.50', _dark: 'blue.40' }}
}
```

### Component Props Pattern

```typescript
import { type ComponentPropsWithoutRef } from 'react'

// Get all props for a specific HTML element
export type InputProps = ComponentPropsWithoutRef<'input'> & {
  // Custom props
}

// For polymorphic components
export type BoxProps = ComponentPropsWithoutRef<ElementType> & {
  as?: ElementType
}
```

## Accessibility Patterns

### Always Include focusVisible

In recipes:
```typescript
base: {
  _focusVisible: {
    outlineWidth: '2',
    outlineOffset: '1',
    outlineColor: { base: 'blue.50', _dark: 'blue.40' }
  }
}
```

**Why**: Provides visible focus indication for keyboard navigation.

### ARIA Attributes

```typescript
export const Button: FC<ButtonProps> = ({ loading, disabled, ...props }) => {
  return (
    <button
      disabled={loading || disabled}
      aria-disabled={disabled}
      aria-busy={loading}
      {...props}
    />
  )
}
```

**Common ARIA Attributes**:
- `aria-label`: Label for screen readers
- `aria-disabled`: Disabled state
- `aria-busy`: Loading state
- `aria-checked`: Checkbox/radio state
- `aria-expanded`: Collapsed/expanded state
- `aria-pressed`: Toggle button state

### Keyboard Interaction

```typescript
export const MenuItem: FC<MenuItemProps> = ({ onClick, ...props }) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
      e.preventDefault()
      onClick?.(e)
    }
  }

  return (
    <Box
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      {...props}
    />
  )
}
```

**Why**: Ensure keyboard users can interact with custom components.

### Match Multiple State Selectors

In recipes, support both native and custom states:

```typescript
conditions: {
  checked: '&:is(:checked, [data-checked], [aria-checked=true], [data-state="checked"])'
}
```

**Why**: Works with native inputs AND custom components.

## Best Practices Checklist

- [ ] Use Box as foundation for polymorphic components
- [ ] Apply splitProps to separate CSS from HTML props
- [ ] Import and use recipe variant types for TypeScript
- [ ] Include ARIA attributes for accessibility
- [ ] Add keyboard interaction for custom interactive elements
- [ ] Use _focusVisible for visible focus states
- [ ] Test component in light AND dark themes
- [ ] Validate all variant combinations work correctly
- [ ] Test with keyboard-only navigation
- [ ] Test with screen reader (basic check)

## Common Pitfalls

### Avoid: Mixing CSS Approaches

```typescript
// BAD: Mixing inline styles, Panda props, and classes
<Box
  style={{ backgroundColor: 'red' }}  // Inline style (avoid)
  bg="blue.50"                        // Panda CSS (good)
  className="custom-class"            // External CSS (avoid)
/>

// GOOD: Use Panda CSS exclusively
<Box bg="blue.50" px="20" />
```

### Avoid: Not Using Recipe Types

```typescript
// BAD: Manual prop types (out of sync with recipe)
type ButtonProps = {
  variant?: 'primary' | 'secondary'
}

// GOOD: Use generated types
import { type ButtonVariantProps } from '@styled-system/recipes'
type ButtonProps = ButtonVariantProps
```

### Avoid: Missing Accessibility

```typescript
// BAD: No keyboard support, no ARIA
<div onClick={handleClick}>Click me</div>

// GOOD: Proper semantics and keyboard support
<button onClick={handleClick} aria-label="Action button">
  Click me
</button>
```

## Exporting Components

Create: `src/components/Button/index.tsx`

```typescript
export { Button } from './Button'
export type { ButtonProps } from './Button'
```

Create: `src/index.ts` (main library export)

```typescript
// Components
export { Box } from './components/Box'
export { Button, IconButton } from './components/Button'
export { Icon } from './components/Icon'
export { CheckBox } from './components/CheckBox'

// Types
export type { BoxProps } from './components/Box'
export type { ButtonProps, IconButtonProps } from './components/Button'
export type { IconProps } from './components/Icon'
```

**Pattern**: Export both components and their prop types for consuming projects.
