# Panda CSS Token Architecture

## When to Use This Skill

Use this skill when:
- Designing a token system for a new design system
- Organizing colors, spacing, typography, and other design tokens
- Implementing theme support (light/dark mode)
- Creating semantic token layers for context-aware styling
- Refactoring hard-coded values to a token system

For implementing recipes using these tokens, use the **panda-recipe-patterns** skill.

## Two-Layer Token Architecture

Panda CSS uses a two-layer system for maximum flexibility:

**Layer 1: Base Tokens** - Raw design values (colors, spacing, typography)
**Layer 2: Semantic Tokens** - Context-aware aliases that reference base tokens

### Why Two Layers?

Separation enables theme switching without redefining entire palettes. Change base token values, and all semantic tokens that reference them update automatically.

```typescript
// Base tokens define the palette
tokens: {
  colors: {
    blue: {
      50: { value: '#eff6ff' },
      60: { value: '#3b82f6' }
    }
  }
}

// Semantic tokens provide meaning
semanticTokens: {
  colors: {
    primary: {
      value: { base: '{colors.blue.60}', _dark: '{colors.blue.50}' }
    }
  }
}

// Usage in components
<Button bg="primary" />  // Automatically theme-aware
```

## Base Tokens

### Color Scale Pattern

Use numeric progression (0-100) for consistent naming:
- **0** = Lightest
- **50** = Mid-tone
- **100** = Darkest

```typescript
export default defineConfig({
  theme: {
    extend: {
      tokens: {
        colors: {
          // Grayscale
          slate: {
            0: { value: '#ffffff' },
            5: { value: '#f8fafc' },
            10: { value: '#f1f5f9' },
            20: { value: '#e2e8f0' },
            30: { value: '#cbd5e1' },
            40: { value: '#94a3b8' },
            50: { value: '#64748b' },
            60: { value: '#475569' },
            70: { value: '#334155' },
            80: { value: '#1e293b' },
            90: { value: '#0f172a' },
            100: { value: '#000000' }
          },

          // Brand colors
          blue: {
            10: { value: '#eff6ff' },
            20: { value: '#dbeafe' },
            30: { value: '#bfdbfe' },
            40: { value: '#93c5fd' },
            50: { value: '#60a5fa' },
            60: { value: '#3b82f6' },
            70: { value: '#2563eb' },
            80: { value: '#1d4ed8' },
            90: { value: '#1e40af' },
            100: { value: '#1e3a8a' }
          },

          // Status colors
          green: { /* ... success states */ },
          red: { /* ... error states */ },
          yellow: { /* ... warning states */ },
          gold: { /* ... accent/CTA states */ }
        }
      }
    }
  }
})
```

**Pattern**: Same numeric scale across all hues for consistent lightness perception.

### Spacing & Sizing

Use a unified scale for both spacing (padding/margin) and sizing (width/height):

```typescript
tokens: {
  spacing: {
    0: { value: '0' },
    1: { value: '0.25rem' },   // 4px
    2: { value: '0.5rem' },    // 8px
    3: { value: '0.75rem' },   // 12px
    4: { value: '1rem' },      // 16px
    5: { value: '1.25rem' },   // 20px
    6: { value: '1.5rem' },    // 24px
    8: { value: '2rem' },      // 32px
    10: { value: '2.5rem' },   // 40px
    12: { value: '3rem' },     // 48px
    16: { value: '4rem' },     // 64px
    20: { value: '5rem' },     // 80px
    24: { value: '6rem' },     // 96px
    32: { value: '8rem' },     // 128px
    40: { value: '10rem' },    // 160px
    48: { value: '12rem' },    // 192px
    64: { value: '16rem' },    // 256px
  }
}
```

**Why**: Consistency between width/height and padding/margin. A `size="48"` icon and `p="48"` padding use the same scale.

**Usage**:
```typescript
<Box px="20" py="12" width="320" />
```

### Typography

Separate font families, weights, sizes, and line heights for flexible composition:

```typescript
tokens: {
  fonts: {
    body: { value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    mono: { value: '"SF Mono", Monaco, "Cascadia Code", monospace' },
    heading: { value: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }
  },

  fontWeights: {
    light: { value: 300 },
    regular: { value: 400 },
    medium: { value: 500 },
    semibold: { value: 600 },
    bold: { value: 700 }
  },

  fontSizes: {
    xs: { value: '0.75rem' },    // 12px
    sm: { value: '0.875rem' },   // 14px
    md: { value: '1rem' },       // 16px
    lg: { value: '1.125rem' },   // 18px
    xl: { value: '1.25rem' },    // 20px
    '2xl': { value: '1.5rem' },  // 24px
    '3xl': { value: '1.875rem' }, // 30px
    '4xl': { value: '2.25rem' }   // 36px
  },

  lineHeights: {
    tight: { value: '1.25' },
    default: { value: '1.5' },
    relaxed: { value: '1.75' }
  }
}
```

**Usage**:
```typescript
<Text fontFamily="body" fontSize="md" fontWeight="medium" lineHeight="default" />
```

### Border Radius

```typescript
tokens: {
  radii: {
    none: { value: '0' },
    sm: { value: '0.125rem' },  // 2px
    md: { value: '0.25rem' },   // 4px
    lg: { value: '0.5rem' },    // 8px
    xl: { value: '0.75rem' },   // 12px
    '2xl': { value: '1rem' },   // 16px
    full: { value: '9999px' }
  }
}
```

### Shadows

```typescript
tokens: {
  shadows: {
    sm: { value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    md: { value: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
    lg: { value: '0 10px 15px -3px rgb(0 0 0 / 0.1)' },
    xl: { value: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }
  }
}
```

### Z-Index

```typescript
tokens: {
  zIndex: {
    hide: { value: -1 },
    base: { value: 0 },
    dropdown: { value: 1000 },
    sticky: { value: 1100 },
    overlay: { value: 1200 },
    modal: { value: 1300 },
    popover: { value: 1400 },
    tooltip: { value: 1500 }
  }
}
```

## Semantic Tokens

Semantic tokens reference base tokens using `{tokenPath}` syntax:

```typescript
semanticTokens: {
  colors: {
    // Text colors
    text: {
      primary: {
        value: { base: '{colors.slate.90}', _dark: '{colors.slate.10}' }
      },
      secondary: {
        value: { base: '{colors.slate.60}', _dark: '{colors.slate.40}' }
      },
      disabled: {
        value: { base: '{colors.slate.40}', _dark: '{colors.slate.60}' }
      }
    },

    // Background colors
    bg: {
      primary: {
        value: { base: '{colors.slate.0}', _dark: '{colors.slate.90}' }
      },
      secondary: {
        value: { base: '{colors.slate.5}', _dark: '{colors.slate.80}' }
      },
      tertiary: {
        value: { base: '{colors.slate.10}', _dark: '{colors.slate.70}' }
      }
    },

    // Border colors
    border: {
      default: {
        value: { base: '{colors.slate.20}', _dark: '{colors.slate.70}' }
      },
      subtle: {
        value: { base: '{colors.slate.10}', _dark: '{colors.slate.80}' }
      }
    },

    // Intent colors
    success: {
      value: { base: '{colors.green.60}', _dark: '{colors.green.50}' }
    },
    error: {
      value: { base: '{colors.red.60}', _dark: '{colors.red.50}' }
    },
    warning: {
      value: { base: '{colors.yellow.60}', _dark: '{colors.yellow.50}' }
    },

    // Brand/accent
    primary: {
      value: { base: '{colors.blue.60}', _dark: '{colors.blue.50}' }
    },
    accent: {
      value: { base: '{colors.gold.30}', _dark: '{colors.gold.40}' }
    }
  }
}
```

**Theme Support Syntax**:
```typescript
value: { base: '...', _dark: '...' }
// base = light mode (default)
// _dark = dark mode
```

### Semantic Spacing

```typescript
semanticTokens: {
  spacing: {
    component: {
      xs: { value: '{spacing.2}' },   // 8px
      sm: { value: '{spacing.3}' },   // 12px
      md: { value: '{spacing.4}' },   // 16px
      lg: { value: '{spacing.6}' },   // 24px
      xl: { value: '{spacing.8}' }    // 32px
    },
    page: {
      sm: { value: '{spacing.12}' },  // 48px
      md: { value: '{spacing.16}' },  // 64px
      lg: { value: '{spacing.24}' }   // 96px
    }
  }
}
```

**Usage**:
```typescript
<Box p="component.md" />  // Component-level padding
<Container px="page.lg" />  // Page-level padding
```

## Common Pitfalls

### Avoid: Duplicating Values

```typescript
// BAD: Duplicating actual color values
semanticTokens: {
  colors: {
    primary: { value: { base: '#3b82f6', _dark: '#60a5fa' } }
  }
}

// GOOD: Reference base tokens
semanticTokens: {
  colors: {
    primary: { value: { base: '{colors.blue.60}', _dark: '{colors.blue.50}' } }
  }
}
```

### Avoid: Excessive Indirection

```typescript
// BAD: Too many layers (hard to trace)
base token → semantic token 1 → semantic token 2 → semantic token 3

// GOOD: Maximum 2-3 layers
base token → semantic token → usage
```

### Avoid: Miscategorized Tokens

```typescript
// BAD: Spacing values in color tokens
tokens: {
  colors: {
    padding: { value: '16px' }  // Wrong category!
  }
}

// GOOD: Use correct token category
tokens: {
  spacing: {
    4: { value: '1rem' }  // 16px
  }
}
```

## Token Organization Best Practices

- [ ] Use numeric scale (0-100) for colors with consistent lightness
- [ ] Unified spacing scale for both spacing and sizing
- [ ] Separate font properties for flexible composition
- [ ] Semantic tokens reference base tokens (not raw values)
- [ ] Theme variants use `{ base: '...', _dark: '...' }` syntax
- [ ] Limit semantic token indirection to 2-3 layers max
- [ ] Document token purpose and usage patterns
- [ ] Test tokens in both light and dark themes

## Next Steps

After defining tokens:

1. **Create recipes**: Use **panda-recipe-patterns** skill
2. **Build components**: Use **panda-component-impl** skill
3. **Test themes**: Verify light/dark mode switching works correctly
