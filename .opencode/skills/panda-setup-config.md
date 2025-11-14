# Panda CSS Setup & Configuration

## When to Use This Skill

Use this skill when:
- Initializing Panda CSS in a new React + Vite project
- Setting up `panda.config.ts` with best practices
- Configuring strict token enforcement
- Creating reusable presets for design systems
- Integrating Panda CSS with your build pipeline

## Installation

Install Panda CSS and its dependencies:

```bash
npm install -D @pandacss/dev
```

## Initialization

Initialize Panda CSS configuration:

```bash
npx panda init
```

This creates:
- `panda.config.ts` - Main configuration file
- `styled-system/` - Generated CSS and TypeScript files

## Core Configuration

Edit `panda.config.ts`:

```typescript
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // Required: Files to analyze for usage
  include: [
    './src/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}'
  ],

  // Required: Output directory
  outdir: 'styled-system',

  // Recommended: Enforce design system consistency
  strictTokens: true,

  // Optional: Cleaner import paths
  importMap: '@styled-system',

  // Optional: Avoid CSS class conflicts
  prefix: 'panda',

  // Optional: JSX framework
  jsxFramework: 'react'
})
```

### Critical Configuration Options

**strictTokens: true** (Recommended)
- Enforces design system consistency
- Prevents hard-coded values like `bg="red"` or `px="15"`
- Only allows token values: `bg="red.50"` or `px="20"`
- Compile-time errors for invalid values

**importMap**
- Enables clean imports: `import { css } from '@styled-system/css'`
- Instead of: `import { css } from '../styled-system/css'`
- Requires TypeScript path mapping (see below)

**prefix**
- Adds prefix to generated CSS classes
- Useful for design systems to avoid conflicts
- Example: `.panda-button` instead of `.button`

## TypeScript Path Mapping

Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@styled-system/*": ["./styled-system/*"]
    }
  }
}
```

## Vite Configuration

Add to `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@styled-system': resolve(__dirname, './styled-system'),
      '~': resolve(__dirname, './src')
    }
  }
})
```

## Build Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "prepare": "panda codegen",
    "dev": "panda --watch & vite",
    "build": "panda codegen && tsc && vite build",
    "lint": "panda codegen && eslint ."
  }
}
```

**Key Points**:
- `prepare`: Runs after `npm install` (generates types for first-time setup)
- `dev`: Watches for changes and regenerates CSS
- `build`: Generates CSS before production build
- `lint`: Ensures types are generated before linting

## Import Global Styles

Add to `src/main.tsx` or `src/index.tsx`:

```typescript
import '@styled-system/styles.css'
```

## .gitignore

Add generated files to `.gitignore`:

```
# Panda CSS
styled-system/
```

**Why**: Generated files should be created during build, not committed.

## Design System Preset

For reusable design systems, create `panda-preset.ts`:

```typescript
import { definePreset } from '@pandacss/dev'

export const myDesignSystemPreset = definePreset({
  // Theme tokens
  theme: {
    extend: {
      tokens: {
        colors: {
          brand: {
            50: { value: '#eff6ff' },
            100: { value: '#dbeafe' },
            // ... more shades
          }
        },
        spacing: {
          // Custom spacing scale
        }
      },
      semanticTokens: {
        colors: {
          primary: {
            value: { base: '{colors.brand.600}', _dark: '{colors.brand.400}' }
          }
        }
      }
    }
  },

  // Custom conditions
  conditions: {
    extend: {
      checked: '&:is(:checked, [data-checked], [aria-checked=true])'
    }
  },

  // Recipes
  theme: {
    extend: {
      recipes: {
        // Import your recipes here
      }
    }
  }
})
```

Use preset in `panda.config.ts`:

```typescript
import { defineConfig } from '@pandacss/dev'
import { myDesignSystemPreset } from './panda-preset'

export default defineConfig({
  presets: [myDesignSystemPreset],

  // Override or extend preset values
  theme: {
    extend: {
      tokens: {
        colors: {
          accent: { value: '#f59e0b' }
        }
      }
    }
  }
})
```

## Troubleshooting

### Styles Not Updating

1. Check if `panda --watch` is running (in dev mode)
2. Restart the watch process
3. Run `panda codegen --clean` to clear cache
4. Verify files are included in `include` glob pattern

### TypeScript Errors

1. Ensure `panda codegen` has run at least once
2. Check TypeScript path mappings in `tsconfig.json`
3. Restart TypeScript server in your editor

### Tokens Not Found

1. Verify `strictTokens` is set correctly
2. Run `panda codegen` to regenerate token types
3. Check token definitions in `theme.extend.tokens`

### CSS Not Loading

1. Verify `@styled-system/styles.css` is imported in entry file
2. Check Vite config has correct alias resolution
3. Clear Vite cache: `rm -rf node_modules/.vite`

## Next Steps

After setup:

1. **Define tokens**: Use **panda-token-architecture** skill
2. **Create recipes**: Use **panda-recipe-patterns** skill
3. **Build components**: Use **panda-component-impl** skill

## Best Practices Checklist

- [ ] Enable `strictTokens: true` for design system enforcement
- [ ] Configure TypeScript path mapping for clean imports
- [ ] Set up Vite aliases for convenience
- [ ] Add `panda codegen` to build pipeline
- [ ] Import global styles in entry file
- [ ] Add `styled-system/` to `.gitignore`
- [ ] Create reusable preset for shared design systems
- [ ] Document custom configuration for team members
