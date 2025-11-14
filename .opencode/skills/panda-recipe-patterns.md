# Panda CSS Recipe Patterns

## When to Use This Skill

Use this skill when:
- Creating reusable component styles with variants
- Building multi-part component styling (checkboxes, tooltips, menus)
- Defining compound variants (multiple conditions)
- Organizing component style libraries
- Deciding between recipes, patterns, and inline CSS

For implementing these recipes in React components, use the **panda-component-impl** skill.

## When to Use What

### Use Recipes When:
- Component has multiple style variants (e.g., button: primary, secondary, outline)
- Component has size variants (small, medium, large)
- Styles are reused across multiple instances
- Need compound variants (combining multiple variant conditions)
- Want to auto-apply styles to JSX components
- Building a design system with consistent component APIs

### Use Patterns When:
- Need computed/transformed styles (e.g., icon sizing that sets width=height)
- Creating reusable layout primitives (stack, grid, container)
- Want a props-based API for common styling tasks
- Need to enforce constraints (e.g., size must be a valid token)

### Use Inline CSS When:
- One-off styles specific to a single usage
- Dynamic values from props or state
- Component-specific overrides of recipe defaults
- Rapid prototyping before extracting to recipe

**Example Decision Tree**:
```
Button component with variants? → Recipe
Icon with size prop? → Pattern
Unique spacing on one div? → Inline CSS
Reusable card layout? → Recipe
```

## Regular Recipes (Single-Part Components)

### Basic Recipe Structure

Create: `src/recipes/button.ts`

```typescript
import { defineRecipe } from '@pandacss/dev';

const buttonBase = {
  position: 'relative',
  appearance: 'none',
  minWidth: '0',
  transitionDuration: 'fast',
  transitionProperty: 'background, border-color, color, box-shadow',
  transitionTimingFunction: 'default',
  userSelect: 'none',
  verticalAlign: 'middle',
  display: 'flex',
  alignItems: 'center',
  gap: '4',
  fontFamily: 'body',
  fontSize: '16',
  fontWeight: 'medium',
  lineHeight: 'default',
  borderWidth: '1',
  borderStyle: 'solid',
  borderColor: 'transparent',
  borderRadius: '4',
  outlineWidth: '2',
  outlineStyle: 'solid',
  outlineColor: 'transparent',
  outlineOffset: '1',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  _disabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  _focusVisible: {
    outlineColor: { base: 'slate.80', _dark: 'slate.5' },
  },
  '& svg': {
    fill: 'current',
  },
};

const buttonVariants = {
  variant: {
    primary: {
      bg: { base: 'slate.90', _dark: 'slate.5' },
      color: { base: 'slate.0', _dark: 'slate.90' },
      _hover: {
        bg: { base: 'slate.70', _dark: 'slate.10' },
      },
      _active: {
        bg: { base: 'slate.100', _dark: 'slate.20' },
      },
      _disabled: {
        _hover: {
          bg: { base: 'slate.90', _dark: 'slate.5' },
        },
      },
      _selected: {
        bg: { base: 'slate.5', _dark: 'slate.90' },
        color: { base: 'slate.90', _dark: 'slate.0' },
      },
    },
    standard: {
      bg: { base: 'slate.5', _dark: 'slate.70' },
      color: { base: 'slate.90', _dark: 'slate.0' },
      _hover: {
        bg: { base: 'slate.10', _dark: 'slate.60' },
      },
      _active: {
        bg: { base: 'slate.20', _dark: 'slate.80' },
      },
      _disabled: {
        _hover: {
          bg: { base: 'slate.5', _dark: 'slate.70' },
        },
      },
      _selected: {
        bg: { base: 'slate.90', _dark: 'slate.5' },
        color: { base: 'slate.0', _dark: 'slate.90' },
      },
    },
    hollow: {
      bg: 'transparent',
      borderColor: { base: 'slate.30', _dark: 'slate.60' },
      color: { base: 'slate.90', _dark: 'slate.0' },
      _hover: {
        bg: { base: 'slate.10', _dark: 'slate.60' },
        borderColor: { base: 'slate.10', _dark: 'slate.60' },
      },
      _active: {
        bg: { base: 'slate.20', _dark: 'slate.80' },
        borderColor: { base: 'slate.20', _dark: 'slate.80' },
      },
      _disabled: {
        _hover: {
          bg: 'transparent',
        },
      },
      _selected: {
        bg: { base: 'slate.90', _dark: 'slate.5' },
        color: { base: 'slate.0', _dark: 'slate.90' },
        borderColor: 'transparent',
      },
    },
    ghost: {
      bg: 'transparent',
      color: { base: 'slate.90', _dark: 'slate.0' },
      _hover: {
        bg: { base: 'slate.10', _dark: 'slate.60' },
      },
      _active: {
        bg: { base: 'slate.20', _dark: 'slate.70' },
      },
      _disabled: {
        _hover: {
          bg: 'transparent',
        },
      },
      _selected: {
        bg: { base: 'slate.90', _dark: 'slate.5' },
        color: { base: 'slate.0', _dark: 'slate.90' },
      },
    },
    cta: {
      bg: { base: 'gold.20', _dark: 'gold.30' },
      color: 'slate.90',
      _hover: {
        bg: { base: 'gold.10', _dark: 'gold.20' },
      },
      _active: {
        bg: { base: 'gold.30', _dark: 'gold.40' },
      },
      _disabled: {
        _hover: {
          bg: { base: 'gold.20', _dark: 'gold.30' },
        },
      },
    },
    danger: {
      bg: 'red.50',
      color: 'slate.0',
      _hover: {
        bg: 'red.40',
      },
      _active: {
        bg: 'red.60',
      },
      _disabled: {
        _hover: {
          bg: 'red.50',
        },
      },
    },
  },
};

export const buttonRecipe = defineRecipe({
  className: 'button',
  jsx: ['Button'],
  base: buttonBase,
  variants: {
    ...buttonVariants,
    size: {
      medium: {
        fontSize: '16',
        py: '3',
        px: '10',
      },
      large: {
        fontSize: '16',
        py: '7',
        px: '12',
      },
      small: {
        fontSize: '14',
        py: '0',
        px: '8',
        '& svg': {
          mt: '-1',
          mb: '-1',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'standard',
    size: 'medium',
  },
});

export const iconButtonRecipe = defineRecipe({
  className: 'icon-button',
  jsx: ['IconButton'],
  base: buttonBase,
  variants: {
    ...buttonVariants,
    size: {
      medium: {
        fontSize: '16',
        p: '3',
      },
      large: {
        fontSize: '16',
        p: '7',
      },
      small: {
        fontSize: '14',
        p: '0',
        '& svg': {
          mt: '-1',
          mb: '-1',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'standard',
    size: 'medium',
  },
});
```

### Extract Base Styles for DRY Code

**Pattern**: Share base styles between related recipes:

```typescript
// Shared base for button and iconButton
const buttonBase = {
  appearance: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transitionDuration: 'fast',
  _disabled: { opacity: 0.4, cursor: 'not-allowed' },
  _focusVisible: { outlineWidth: '2', outlineColor: 'blue.50' }
}

// Shared variant styles
const buttonVariants = {
  variant: {
    primary: { /* ... */ },
    secondary: { /* ... */ }
  }
}

// Button recipe
export const buttonRecipe = defineRecipe({
  className: 'button',
  jsx: ['Button'],
  base: buttonBase,
  variants: {
    ...buttonVariants,
    size: { /* button sizes */ }
  },
  defaultVariants: { variant: 'primary', size: 'medium' }
})

// IconButton recipe (reuses base and variants)
export const iconButtonRecipe = defineRecipe({
  className: 'iconButton',
  jsx: ['IconButton'],
  base: buttonBase,
  variants: {
    ...buttonVariants,
    size: {
      small: { width: '32', height: '32' },
      medium: { width: '40', height: '40' },
      large: { width: '48', height: '48' }
    }
  },
  defaultVariants: { variant: 'primary', size: 'medium' }
})
```

**Why**: Keeps related components visually consistent, reduces duplication.

### Dynamic Variants from Tokens

**Pattern**: Generate variants from design tokens:

```typescript
import { tokens } from '../styles/tokens'

// Get fontSize tokens
const fontSizeTokens = tokens.fontSizes

type FontSizeKey = keyof typeof fontSizeTokens

// Generate fontSize variants dynamically
const fontSizes = (Object.keys(fontSizeTokens) as FontSizeKey[]).reduce(
  (accumulator, currentKey) => {
    accumulator[currentKey] = { fontSize: currentKey }
    return accumulator
  },
  {} as Record<FontSizeKey, Record<'fontSize', string>>
)

export const textRecipe = defineRecipe({
  className: 'text',
  jsx: ['Text'],
  variants: {
    size: fontSizes  // All token sizes available as variants
  }
})
```

**Why**: Automatically sync recipe variants with token changes.

## Slot Recipes (Multi-Part Components)

Use slot recipes for components with multiple styled parts (checkbox + label, tooltip + arrow, menu + items).

### Basic Slot Recipe Structure

Create: `src/recipes/checkbox.ts`

```typescript
import { defineSlotRecipe } from '@pandacss/dev'

export const checkBoxRecipe = defineSlotRecipe({
  className: 'checkbox',
  description: 'Checkbox component with label',
  jsx: ['CheckBox'],

  // Define named slots for component parts
  slots: ['container', 'input', 'indicator', 'label'],

  // Base styles for each slot
  base: {
    container: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8',
      cursor: 'pointer',
      position: 'relative'
    },

    input: {
      // Visually hidden but accessible
      position: 'absolute',
      opacity: 0,
      width: '1px',
      height: '1px',

      // Show different indicator icons based on state
      _checked: {
        "& ~ [data-part='indicator'][data-state='unchecked']": {
          display: 'none'
        },
        "& ~ [data-part='indicator'][data-state='checked']": {
          display: 'inline-flex'
        }
      },

      _indeterminate: {
        "& ~ [data-part='indicator'][data-state='indeterminate']": {
          display: 'inline-flex'
        }
      },

      _disabled: {
        "& ~ [data-part='indicator']": {
          opacity: 0.4,
          cursor: 'not-allowed'
        }
      }
    },

    indicator: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: '20',
      height: '20',
      borderWidth: '1',
      borderRadius: '4',
      borderColor: { base: 'slate.40', _dark: 'slate.60' },
      bg: { base: 'white', _dark: 'slate.90' },
      color: { base: 'blue.50', _dark: 'blue.40' }
    },

    label: {
      fontSize: 'md',
      color: { base: 'slate.90', _dark: 'slate.10' },
      userSelect: 'none'
    }
  },

  // Variants apply to specific slots
  variants: {
    size: {
      small: {
        indicator: { width: '16', height: '16' },
        label: { fontSize: 'sm' }
      },
      medium: {
        indicator: { width: '20', height: '20' },
        label: { fontSize: 'md' }
      },
      large: {
        indicator: { width: '24', height: '24' },
        label: { fontSize: 'lg' }
      }
    }
  },

  defaultVariants: {
    size: 'medium'
  }
})
```

### Complex State Handling

**Pattern**: Use sibling selectors for state-based styling:

```typescript
base: {
  input: {
    // When checked, show checked icon, hide unchecked icon
    _checked: {
      "& ~ [data-part='indicator']": {
        bg: { base: 'blue.50', _dark: 'blue.40' },
        borderColor: { base: 'blue.50', _dark: 'blue.40' },
        color: 'white'
      }
    },

    // When focused, add focus ring to indicator
    _focusVisible: {
      "& ~ [data-part='indicator']": {
        outlineWidth: '2',
        outlineOffset: '1',
        outlineColor: { base: 'blue.50', _dark: 'blue.40' }
      }
    },

    // Error state
    _invalid: {
      "& ~ [data-part='indicator']": {
        borderColor: { base: 'red.50', _dark: 'red.40' }
      },
      "& ~ [data-part='label']": {
        color: { base: 'red.50', _dark: 'red.40' }
      }
    }
  }
}
```

## Compound Variants

Use compound variants when combining multiple variant values requires unique styling.

**Pattern**: Conditional styling based on variant combinations:

```typescript
export const buttonRecipe = defineRecipe({
  variants: {
    variant: {
      primary: { /* ... */ },
      outline: { /* ... */ }
    },
    size: {
      small: { /* ... */ },
      large: { /* ... */ }
    },
    loading: {
      true: { cursor: 'wait' }
    }
  },

  // Special styles when specific variants combine
  compoundVariants: [
    {
      variant: 'primary',
      loading: true,
      css: {
        bg: { base: 'blue.40', _dark: 'blue.30' },  // Lighter when loading
        _hover: { bg: { base: 'blue.40', _dark: 'blue.30' } }  // Disable hover
      }
    },
    {
      variant: 'outline',
      size: 'small',
      css: {
        borderWidth: '1',  // Thinner border for small outline
        fontWeight: 'medium'
      }
    }
  ]
})
```

## Recipe Organization

### File Structure

```
src/
  recipes/
    index.ts              # Export all recipes
    button.ts            # Regular recipe
    input.ts             # Regular recipe
    checkbox.ts          # Slot recipe
    radio.ts             # Slot recipe
    tooltip.ts           # Slot recipe
    menu.ts              # Slot recipe
```

### Export Pattern

`src/recipes/index.ts`:

```typescript
// Regular recipes
export { buttonRecipe } from './button'
export { iconButtonRecipe } from './button'
export { inputRecipe } from './input'
export { textRecipe } from './text'

// Slot recipes
export { checkBoxRecipe } from './checkbox'
export { radioRecipe } from './radio'
export { tooltipRecipe } from './tooltip'
export { menuRecipe } from './menu'
```

### Register in Config

`panda.config.ts`:

```typescript
import { defineConfig } from '@pandacss/dev'
import * as allRecipes from './src/recipes'

// Separate regular and slot recipes
const {
  checkBoxRecipe,
  radioRecipe,
  tooltipRecipe,
  menuRecipe,
  ...regularRecipes
} = allRecipes

// Transform keys: remove 'Recipe' suffix
const recipes = Object.fromEntries(
  Object.entries(regularRecipes).map(([key, value]) => [
    key.replace(/Recipe$/, ''),  // buttonRecipe → button
    value
  ])
)

const slotRecipes = {
  checkbox: checkBoxRecipe,
  radio: radioRecipe,
  tooltip: tooltipRecipe,
  menu: menuRecipe
}

export default defineConfig({
  theme: {
    extend: {
      recipes,
      slotRecipes
    }
  }
})
```

**Why**: Clean separation, automatic recipe registration.

## Responsive Recipes

**Pattern**: Use object syntax for responsive variants:

```typescript
export const cardRecipe = defineRecipe({
  base: {
    p: { base: '16', md: '20', lg: '24' },  // Responsive padding
    borderRadius: { base: '6', md: '8' },
    fontSize: { base: 'sm', md: 'md' }
  }
})
```

**Pattern**: Container queries for component-level responsive:

```typescript
export const menuRecipe = defineSlotRecipe({
  base: {
    container: {
      // Change layout based on container size (not viewport)
      width: { base: 'full', '@container(min-width: 768px)': '260' },
      position: { base: 'fixed', '@container(min-width: 768px)': 'relative' }
    }
  }
})
```

## Best Practices Checklist

- [ ] Extract shared base styles for related components
- [ ] Use semantic tokens (not raw colors) in recipes
- [ ] Define sensible defaultVariants
- [ ] Include common state styles (_hover, _focus, _disabled, _active)
- [ ] Add _focusVisible for accessibility
- [ ] Use slot recipes for multi-part components
- [ ] Document recipe purpose in description field
- [ ] Use compound variants for complex combinations
- [ ] Test all variant combinations
- [ ] Validate recipes work in light AND dark themes

## Common Pitfalls

### Avoid: Hard-coded Values

```typescript
// BAD: Hard-coded hex colors, px values
variants: {
  primary: {
    bg: '#3B82F6',
    padding: '12px'
  }
}

// GOOD: Use design tokens
variants: {
  primary: {
    bg: { base: 'blue.50', _dark: 'blue.40' },
    padding: '12'
  }
}
```

### Avoid: Missing Default Variants

```typescript
// BAD: No defaults, components render unstyled
variants: {
  size: { small: {...}, large: {...} }
}

// GOOD: Always provide defaults
variants: {
  size: { small: {...}, medium: {...}, large: {...} }
},
defaultVariants: {
  size: 'medium'
}
```

### Avoid: Over-nesting in Slot Recipes

```typescript
// BAD: Deep nesting, hard to maintain
base: {
  container: {
    '& > div > span > button': { /* ... */ }
  }
}

// GOOD: Use slots for structure
slots: ['container', 'wrapper', 'label', 'button'],
base: {
  container: { /* ... */ },
  button: { /* ... */ }
}
```

### Avoid: Duplicate Logic Across Recipes

```typescript
// BAD: Copy-paste same styles
const button = { _disabled: { opacity: 0.4 } }
const input = { _disabled: { opacity: 0.4 } }

// GOOD: Extract to shared constant
const disabledStyles = { opacity: 0.4, cursor: 'not-allowed' }

const button = { _disabled: disabledStyles }
const input = { _disabled: disabledStyles }
```

## Next Steps

After creating recipes:

1. **Implement in components**: Use **panda-component-impl** skill for React integration
2. **Test variants**: Verify all combinations work visually
3. **Document in Storybook**: Create stories showing all variants
