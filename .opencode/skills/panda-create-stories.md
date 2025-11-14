# Panda CSS Component Stories

## When to Use This Skill

Use this skill when:
- Creating Storybook documentation for Panda CSS components
- Demonstrating component variants and states
- Setting up accessibility testing with play functions
- Building interactive component examples
- Documenting real-world usage patterns

## Prerequisites

Before creating stories, ensure:
- Component exists (created via **panda-component-impl** skill)
- Storybook installed and configured
- Component props and variants are understood

## Recommended Storybook Setup

Install recommended addons:

```bash
npx storybook@latest init
npm install -D @storybook/addon-a11y @storybook/addon-themes
```

Configure in `.storybook/main.ts`:

```typescript
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',  // Accessibility testing
    '@storybook/addon-themes' // Theme switching
  ]
}

export default config
```

## Story Structure Pattern

Instead of creating many individual state stories, organize into four categories:

1. **Default** - Demonstrates primary usage
2. **All States** - Shows all variants and states together
3. **Ex: [Pattern]** - Interactive examples with "Ex:" prefix
4. **A11y: [Test]** - Accessibility tests with "A11y:" prefix

This approach reduces clutter and improves scanability.

## Basic Story Template

Create: `src/components/Button/Button.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  args: {
    children: 'Button'
  }
}
```

## Story Pattern 1: All Variants

Show all variant combinations in a single view:

```typescript
import { Box } from '../Box/Box'

export const AllVariants: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="20">
      <Box display="flex" gap="12" alignItems="center">
        <Button variant="primary">Primary</Button>
        <Button variant="standard">Standard</Button>
        <Button variant="hollow">Hollow</Button>
        <Button variant="ghost">Ghost</Button>
      </Box>

      <Box display="flex" gap="12" alignItems="center">
        <Button size="small">Small</Button>
        <Button size="medium">Medium</Button>
        <Button size="large">Large</Button>
      </Box>

      <Box display="flex" gap="12" alignItems="center">
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
      </Box>
    </Box>
  )
}
```

**Why**: See all options at once without navigating between stories.

## Story Pattern 2: Interactive Examples

Use "Ex:" prefix for real-world usage patterns:

```typescript
import { useState } from 'react'

export const ExToggleButton: Story = {
  render: () => {
    const [selected, setSelected] = useState(false)

    return (
      <Button
        variant={selected ? 'primary' : 'standard'}
        onClick={() => setSelected(!selected)}
      >
        {selected ? 'Selected' : 'Not Selected'}
      </Button>
    )
  }
}

export const ExButtonGroup: Story = {
  render: () => {
    const [active, setActive] = useState('option1')

    return (
      <Box display="flex" gap="0">
        <Button
          variant={active === 'option1' ? 'primary' : 'standard'}
          onClick={() => setActive('option1')}
          borderRadius="md 0 0 md"
        >
          Option 1
        </Button>
        <Button
          variant={active === 'option2' ? 'primary' : 'standard'}
          onClick={() => setActive('option2')}
          borderRadius="0"
        >
          Option 2
        </Button>
        <Button
          variant={active === 'option3' ? 'primary' : 'standard'}
          onClick={() => setActive('option3')}
          borderRadius="0 md md 0"
        >
          Option 3
        </Button>
      </Box>
    )
  }
}
```

## Story Pattern 3: Theme Comparison

Show light and dark mode side-by-side:

```typescript
export const ThemeComparison: Story = {
  render: () => (
    <Box display="flex" gap="20">
      <Box bg="bg.primary" p="20" borderRadius="md">
        <Button variant="primary">Light Mode</Button>
      </Box>

      <Box
        bg="bg.primary"
        p="20"
        borderRadius="md"
        data-theme="dark"  // Force dark theme
      >
        <Button variant="primary">Dark Mode</Button>
      </Box>
    </Box>
  )
}
```

## Story Pattern 4: Accessibility Testing

Use "A11y:" prefix and play functions for automated testing:

```typescript
import { expect, userEvent, within } from '@storybook/test'

export const A11yKeyboardNavigation: Story = {
  render: () => (
    <Box display="flex" gap="12">
      <Button>First</Button>
      <Button>Second</Button>
      <Button>Third</Button>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const buttons = canvas.getAllByRole('button')

    // Tab to first button
    await userEvent.tab()
    await expect(buttons[0]).toHaveFocus()

    // Tab to second button
    await userEvent.tab()
    await expect(buttons[1]).toHaveFocus()

    // Activate with keyboard
    await userEvent.keyboard('{Enter}')
  }
}

export const A11yDisabledState: Story = {
  render: () => <Button disabled>Disabled Button</Button>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')

    // Verify disabled state
    await expect(button).toBeDisabled()
    await expect(button).toHaveAttribute('aria-disabled', 'true')
  }
}

export const A11yLoadingState: Story = {
  render: () => <Button loading>Loading...</Button>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')

    // Verify loading state announced
    await expect(button).toHaveAttribute('aria-busy', 'true')
    await expect(button).toBeDisabled()
  }
}
```

## ArgTypes Configuration

**Important**: Only document props explicitly defined in component type, not inherited props.

```typescript
const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    // Document component-specific props only
    variant: {
      control: 'select',
      options: ['primary', 'standard', 'hollow', 'ghost', 'cta', 'danger'],
      description: 'Button visual variant'
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: 'Button size'
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner'
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button interaction'
    },

    // DON'T document inherited Box props like 'as', 'bg', 'px', etc.
    // These are available but shouldn't clutter the controls
  }
} satisfies Meta<typeof Button>
```

**Why**: Before creating argTypes, read the component file to understand its actual props.

## Responsive Stories

Document responsive behavior:

```typescript
export const Responsive: Story = {
  render: () => (
    <Button
      width={{ base: 'full', md: 'auto' }}
      size={{ base: 'large', md: 'medium' }}
    >
      Responsive Button
    </Button>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}
```

## Complex Component Example

For slot recipe components like CheckBox:

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { CheckBox } from './CheckBox'

const meta = {
  title: 'Components/CheckBox',
  component: CheckBox
} satisfies Meta<typeof CheckBox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions'
  }
}

export const AllStates: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="12">
      <CheckBox label="Unchecked" />
      <CheckBox label="Checked" checked />
      <CheckBox label="Indeterminate" indeterminate />
      <CheckBox label="Disabled" disabled />
      <CheckBox label="Disabled Checked" disabled checked />
      <CheckBox label="Error" error />
    </Box>
  )
}

export const ExFormIntegration: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)

    return (
      <Box>
        <CheckBox
          label="I agree to the terms"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <Box mt="12">
          <Button disabled={!checked}>Submit</Button>
        </Box>
      </Box>
    )
  }
}
```

## Best Practices Checklist

- [ ] Create Default story showing primary usage
- [ ] Create AllStates/AllVariants story for quick visual scan
- [ ] Use "Ex:" prefix for interactive real-world examples
- [ ] Use "A11y:" prefix for accessibility test stories
- [ ] Add play functions to test keyboard navigation
- [ ] Only document component-specific props in argTypes
- [ ] Test stories in both light and dark themes
- [ ] Include responsive stories for layout-dependent components
- [ ] Keep story code readable and well-commented

## Common Mistakes to Avoid

### Avoid: Too Many Individual Stories

```typescript
// BAD: Creating separate story for every state
export const Primary: Story = { args: { variant: 'primary' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Small: Story = { args: { size: 'small' } }
export const Medium: Story = { args: { size: 'medium' } }
// ... results in 20+ stories

// GOOD: Group related states
export const AllVariants: Story = { /* show all at once */ }
```

### Avoid: Documenting Inherited Props

```typescript
// BAD: Cluttering controls with Box props
argTypes: {
  variant: { /* ... */ },
  as: { /* ... */ },  // Don't document this
  bg: { /* ... */ },  // Don't document this
  px: { /* ... */ }   // Don't document this
}

// GOOD: Only component-specific props
argTypes: {
  variant: { /* ... */ },
  size: { /* ... */ },
  loading: { /* ... */ }
}
```

### Avoid: Missing Accessibility Tests

```typescript
// BAD: No accessibility validation
export const Button: Story = {
  render: () => <Button>Click me</Button>
}

// GOOD: Test keyboard navigation and ARIA
export const A11yKeyboard: Story = {
  render: () => <Button>Click me</Button>,
  play: async ({ canvasElement }) => {
    // Test keyboard interaction
  }
}
```

## Next Steps

After creating stories:

1. **Review component**: Use **panda-review-component** skill to audit best practices
2. **Test accessibility**: Run axe in Storybook addon
3. **Document patterns**: Add usage guidelines in story descriptions
