# OpenCode Panda CSS Marketplace

An open-source skills and agent marketplace for OpenCode, focused on **Panda CSS** front-end development workflows. Built for internal use at Cetec with local LLMs (Qwen2.5 Coder, DeepSeek Coder, Llama 3.1).

## What's Included

### 🎯 Skills (7)

Specialized knowledge modules for specific Panda CSS tasks:

| Skill | Description |
|-------|-------------|
| **panda-setup-config** | Initial Panda CSS setup, configuration, and build integration |
| **panda-token-architecture** | Design two-layer token systems (base + semantic) |
| **panda-recipe-patterns** | Create regular and slot recipes for components |
| **panda-component-impl** | Implement React components with Panda CSS |
| **panda-create-stories** | Create Storybook documentation for components |
| **panda-form-architecture** | Build composable, accessible form components |
| **panda-review-component** | Audit components for best practices compliance |

### 🤖 Agent (1)

Autonomous agent for complex multi-step work:

| Agent | Description |
|-------|-------------|
| **panda-architect** | Handles complex Panda CSS work: project setup, token system design, component architecture, refactoring |

## Quick Start

### Using Skills

Skills provide focused guidance for specific tasks. Reference them directly in prompts to OpenCode:

```
"Using the panda-setup-config skill, help me set up Panda CSS in this project"
```

```
"Follow the panda-component-impl skill to create a Button component"
```

```
"Use panda-token-architecture to design a token system for our design system"
```

### Using the Agent

The panda-architect agent orchestrates complex workflows:

```
"Use the panda-architect agent to set up a complete Panda CSS design system"
```

```
"Panda architect: refactor our existing components to use Panda CSS"
```

The agent automatically:
- Creates TodoWrite checklists for tracking progress
- References appropriate skills for detailed guidance
- Implements changes systematically
- Validates work at each step

## Local LLM Configuration

This marketplace works with the local LLMs configured in this repository:

| Model | Purpose | Size |
|-------|---------|------|
| **qwen2.5-coder:7b** | Primary coding model | 4.7GB |
| **deepseek-coder-v2:16b** | Fast iteration model | 9GB |
| **llama3.1:8b-instruct** | Tool-calling specialist | 4.7GB |

See `docs/opencode-setup.md` for full setup instructions.

## Skill Details

### 1. panda-setup-config

**When to use**: New Panda CSS projects, configuration updates

**What it covers**:
- Installation and initialization
- `panda.config.ts` configuration (strictTokens, importMap, prefix)
- TypeScript path mapping
- Vite integration
- Build script setup
- Troubleshooting common issues

**Example prompt**:
```
"Using panda-setup-config, help me configure Panda CSS with strictTokens enabled"
```

### 2. panda-token-architecture

**When to use**: Designing token systems, implementing themes

**What it covers**:
- Two-layer architecture (base + semantic tokens)
- Color scales (0-100 numeric progression)
- Spacing and sizing (unified scale)
- Typography tokens (fonts, weights, sizes, line heights)
- Theme support syntax (`{ base: '...', _dark: '...' }`)
- Common token pitfalls

**Example prompt**:
```
"Follow panda-token-architecture to create a token system with light/dark theme support"
```

### 3. panda-recipe-patterns

**When to use**: Creating component styles with variants

**What it covers**:
- When to use recipes vs patterns vs inline CSS
- Regular recipes (single-part components)
- Slot recipes (multi-part components)
- Compound variants
- Dynamic variant generation
- Recipe organization and registration

**Example prompt**:
```
"Use panda-recipe-patterns to create a Button recipe with 4 variants and 3 sizes"
```

### 4. panda-component-impl

**When to use**: Implementing React components with Panda CSS

**What it covers**:
- Box-based polymorphic components
- `splitProps` utility for CSS/HTML separation
- Recipe-based component patterns
- TypeScript integration with recipe types
- Accessibility patterns (ARIA, keyboard, focus styles)
- Component composition

**Example prompt**:
```
"Following panda-component-impl, create a CheckBox component with the checkbox recipe"
```

### 5. panda-create-stories

**When to use**: Documenting components in Storybook

**What it covers**:
- Recommended story structure (Default, All States, Ex:, A11y:)
- Interactive examples with state
- Theme comparison stories
- Accessibility testing with play functions
- ArgTypes configuration
- Story organization patterns

**Example prompt**:
```
"Use panda-create-stories to create Storybook stories for the Button component"
```

### 6. panda-form-architecture

**When to use**: Building form components and patterns

**What it covers**:
- Three-layer architecture (atomic, molecular, organism)
- FormField wrapper pattern
- ARIA attribute injection
- Integration with React Hook Form / Formik
- Accessibility best practices
- Form validation UI

**Example prompt**:
```
"Following panda-form-architecture, create a TextInput and FormField wrapper"
```

### 7. panda-review-component

**When to use**: Auditing components, code reviews, refactoring

**What it covers**:
- Four-phase review process (Discovery, Assessment, Recommendations, Implementation)
- Comprehensive checklist (architecture, styling, accessibility, TypeScript)
- Common findings and fixes
- Priority levels (P0-P3)
- Recommendation format with code examples

**Example prompt**:
```
"Use panda-review-component to audit the Button component for best practices"
```

## Agent Details

### panda-architect

**When to use**: Complex multi-step Panda CSS work

**Capabilities**:
- Full project setup (config, tokens, recipes, components)
- Complete token system design
- Component library architecture
- CSS-to-Panda refactoring
- Design system implementation

**Methodology**:
- Creates TodoWrite checklists for tracking
- Works incrementally with validation at each step
- References skills for detailed guidance
- Explains architectural decisions
- Enforces best practices (strictTokens, accessibility, theme support)

**Example prompts**:
```
"Panda architect: set up Panda CSS with a complete token system and button component"
```

```
"Use panda-architect to refactor our existing form components to Panda CSS"
```

```
"Panda architect: create a design system preset with tokens, recipes, and base components"
```

## Directory Structure

```
.opencode/
├── README.md              # This file
├── skills/                # Individual skill modules
│   ├── panda-setup-config.md
│   ├── panda-token-architecture.md
│   ├── panda-recipe-patterns.md
│   ├── panda-component-impl.md
│   ├── panda-create-stories.md
│   ├── panda-form-architecture.md
│   └── panda-review-component.md
└── agents/                # Autonomous agents
    └── panda-architect.md
```

## Best Practices

### When to Use Skills vs Agent

**Use Skills when**:
- You need focused guidance on a specific task
- You want to learn the pattern for future reference
- You're working on a single component or file
- You prefer step-by-step instructions

**Use Agent when**:
- You have complex multi-step work
- You need orchestration across multiple files
- You want systematic project setup
- You prefer autonomous execution with tracking

### Working with Local LLMs

**Model Selection**:
- **Qwen2.5 Coder** (primary): Best for component implementation and recipe creation
- **DeepSeek Coder** (fast): Good for quick iterations and refactoring
- **Llama 3.1** (tools): Best for following structured workflows and agent tasks

**Tips**:
- Be explicit about which skill or agent to use
- Provide context about your project structure
- Ask for explanations if recommendations unclear
- Request code examples for complex patterns

## Common Workflows

### Workflow 1: New Panda CSS Project

```
1. "Using panda-setup-config, initialize Panda CSS in this project"
2. "Follow panda-token-architecture to create a token system"
3. "Use panda-recipe-patterns to create Button and Input recipes"
4. "Following panda-component-impl, implement the Button component"
5. "Use panda-create-stories to document the Button in Storybook"
```

### Workflow 2: Refactoring Existing Components

```
1. "Use panda-review-component to audit the Button component"
2. "Following recommendations, refactor using panda-component-impl"
3. "Create stories with panda-create-stories"
```

### Workflow 3: Building a Form

```
1. "Using panda-form-architecture, create TextInput atomic component"
2. "Create FormField organism wrapper"
3. "Build a registration form with validation"
```

### Workflow 4: Design System Setup (Use Agent)

```
"Panda architect: Set up a complete design system with:
- Panda CSS configuration with strictTokens
- Two-layer token system (base + semantic)
- Recipes for Button, Input, CheckBox
- Base components implementing these recipes
- Storybook documentation"
```

## Differences from Claude Code Marketplace

This OpenCode marketplace differs from the Claude Code plugin marketplace in several ways:

| Feature | Claude Code Marketplace | OpenCode Marketplace |
|---------|------------------------|----------------------|
| **Installation** | `/plugin marketplace add` command | Files already in `.opencode/` |
| **Structure** | `.claude-plugin/` directory | `.opencode/` directory |
| **Invocation** | Slash commands (`/panda-setup`) | Natural language references |
| **Agents** | Launched via Task tool | Referenced in prompts |
| **MCP Integration** | Built-in Context7 support | Not yet implemented |
| **Updates** | Git pull in plugin repo | Manual file updates |

## Roadmap

### Phase 1: Core Skills ✅
- [x] 7 Panda CSS skills ported
- [x] Panda architect agent ported
- [x] Documentation created

### Phase 2: Testing 🚧
- [ ] Test skills with Qwen2.5 Coder
- [ ] Test skills with DeepSeek Coder
- [ ] Test agent with Llama 3.1
- [ ] Validate outputs against best practices

### Phase 3: Enhancement
- [ ] Add slash command shortcuts (`.opencode/commands/`)
- [ ] Create additional skills (animations, transitions, responsive patterns)
- [ ] Add MCP integration for Panda CSS docs
- [ ] Create example project demonstrating all patterns

### Phase 4: Expansion
- [ ] Additional design system skills (Chakra UI, Tailwind)
- [ ] Testing and validation agents
- [ ] Performance optimization skills
- [ ] Team-specific workflows

## Contributing

This marketplace is built for internal Cetec use. To add or modify skills:

1. Create/edit markdown files in `.opencode/skills/`
2. Follow the existing skill structure and format
3. Test with local LLMs before committing
4. Update this README with any new skills

## Credits

- Original marketplace design: [okshaun-claude-marketplace](https://github.com/shaunrfox/okshaun-claude-marketplace)
- Panda CSS: [https://panda-css.com](https://panda-css.com)
- OpenCode: [https://opencode.ai](https://opencode.ai)

## License

MIT License - see LICENSE file for details
