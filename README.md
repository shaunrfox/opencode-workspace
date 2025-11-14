# OpenCode Workspace

Local LLM development environment using OpenCode + Ollama with an open-source Panda CSS marketplace for front-end development at Cetec.

## Overview

This repository provides:

1. **Local LLM Infrastructure**: OpenCode configured with Ollama backend running 3 specialized models
2. **Panda CSS Marketplace**: Open-source skills and agents for Panda CSS development workflows
3. **Development Environment**: Optimized for Apple Silicon (M3 Max, 36GB RAM)

## Quick Start

### Complete Setup

```bash
npm run setup
```

This will:
1. Install Ollama (if not already installed)
2. Download the recommended LLM models

### Manual Setup Steps

If you prefer to install components separately:

```bash
# Install Ollama
npm run install:ollama

# Download models interactively
npm run download:models
```

### Start Ollama Service

```bash
npm run start:ollama
```

### Use OpenCode with Local LLMs

```bash
opencode
```

OpenCode will connect to Ollama at `http://127.0.0.1:11434/v1` and use the configured models.

### Stop Ollama Service

```bash
npm run stop:ollama
```

### Use Panda CSS Marketplace

Skills and agents are available in `.opencode/`. Reference them in prompts:

```
"Using the panda-setup-config skill, help me set up Panda CSS"
```

See `.opencode/README.md` for complete documentation.

## Local LLM Models

| Model | Purpose | Size | Context |
|-------|---------|------|---------|
| **qwen2.5-coder:7b** | Primary coding model | 4.7GB | 32K |
| **deepseek-coder-v2:16b** | Fast iteration | 9GB | 16K |
| **llama3.1** | Tool calling specialist | 4.9GB | 8K |

### Model Selection

Models can be selected interactively when running `npm run download:models`.

The default model is **qwen2.5-coder:7b**. Configure in `~/.config/opencode/opencode.json` or use:

The default model is **qwen2.5-coder:7b**. Configure in `~/.config/opencode/opencode.json` or use:

```bash
opencode --model ollama/deepseek-coder-v2:16b
```

## Panda CSS Marketplace

### Skills Available

- **panda-setup-config**: Initial setup and configuration
- **panda-token-architecture**: Design token systems
- **panda-recipe-patterns**: Create component recipes
- **panda-component-impl**: Implement React components
- **panda-create-stories**: Storybook documentation
- **panda-form-architecture**: Build form components
- **panda-review-component**: Audit components

### Agent Available

- **panda-architect**: Autonomous agent for complex Panda CSS work

### Usage Examples

```bash
# Use a skill
opencode chat "Using panda-setup-config, set up Panda CSS with strictTokens"

# Use the agent
opencode chat "Panda architect: create a complete token system"
```

See `.opencode/README.md` for detailed skill and agent documentation.

## Project Structure

```
.
├── .opencode/                 # OpenCode marketplace
│   ├── README.md             # Marketplace documentation
│   ├── skills/               # 7 Panda CSS skills
│   └── agents/               # Panda architect agent
├── configs/                   # Configuration files
│   └── opencode-global.json  # OpenCode config (backup)
├── docs/                      # Documentation
│   ├── opencode-setup.md     # Setup instructions
│   └── plans/                # Implementation plans
├── scripts/                   # Node.js utility scripts
│   ├── install-ollama.js     # Install Ollama
│   ├── start-ollama.js       # Start Ollama service
│   ├── stop-ollama.js        # Stop Ollama service
│   ├── check-models.js       # Check installed models
│   └── download-models.js   # Download LLM models
├── package.json               # npm configuration and scripts
└── logs/                      # Log files

Global Config: ~/.config/opencode/opencode.json
```

## Configuration

### OpenCode Configuration

Located at `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "ollama/qwen2.5-coder:7b",
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama (local)",
      "options": {
        "baseURL": "http://127.0.0.1:11434/v1"
      },
      "models": {
        "qwen2.5-coder:7b": { "name": "Qwen2.5 Coder 7B (primary)" },
        "deepseek-coder-v2:16b": { "name": "DeepSeek Coder V2 16B (fast)" },
        "llama3.1:8b-instruct": { "name": "Llama 3.1 8B (tools)" }
      }
    }
  }
}
```

### Ollama Configuration

Ollama runs on `http://127.0.0.1:11434` with models stored in `~/.ollama/models/`.

## System Requirements

- **OS**: macOS (tested) or Linux
- **RAM**: 16GB minimum, 32GB+ recommended
- **Disk**: ~20GB for models
- **Ollama**: Auto-installed via `npm run install:ollama` (v0.12.11+)
- **OpenCode**: v1.0.65+
- **Node.js**: v25.2.0+ (for npm scripts)
- **npm**: v10.0.0+

## Documentation

- **Setup Guide**: `docs/opencode-setup.md` - Complete setup instructions
- **Marketplace Docs**: `.opencode/README.md` - Skills and agent documentation
- **Implementation Plan**: `docs/plans/2025-11-14-local-llm-opencode-setup.md`
- **Project Draft**: `docs/project-draft.md` - Original planning document

## Common Commands

### Ollama Management

```bash
# Install Ollama (if not already installed)
npm run install:ollama

# Start Ollama service
npm run start:ollama

# Stop Ollama service
npm run stop:ollama

# Check installed models
npm run check:models

# Download models (interactive selection)
npm run download:models

# Complete setup (install + download models)
npm run setup

# Check available models (alternative)
ollama list

# Pull a specific model (alternative)
ollama pull qwen2.5-coder:7b
```

### OpenCode

```bash
# Start interactive chat
opencode

# One-off command
opencode chat "explain this code"

# Use specific model
opencode --model ollama/deepseek-coder-v2:16b

# Show config
cat ~/.config/opencode/opencode.json
```

### Development

```bash
# Install dependencies
npm install

# Check installed models
npm run check:models

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# View logs (if available)
tail -f logs/ollama-service.log

# List all available npm scripts
npm run
```

## Troubleshooting

### Ollama not responding

```bash
# Check if running
ps aux | grep ollama

# Restart
npm run stop:ollama && npm run start:ollama

# Check logs
tail -f logs/ollama-service.log
```

### OpenCode connection issues

```bash
# Verify Ollama endpoint
curl http://127.0.0.1:11434/api/tags

# Check OpenCode config
cat ~/.config/opencode/opencode.json

# Restart with fresh config
rm ~/.config/opencode/opencode.json
cp configs/opencode-global.json ~/.config/opencode/opencode.json
```

### Model not found

```bash
# List available models
ollama list

# Pull missing model
ollama pull qwen2.5-coder:7b
```

## Performance Benchmarks

Tested on M3 Max (16-core CPU, 40-core GPU, 36GB RAM):

| Model | Speed | Quality | Use Case |
|-------|-------|---------|----------|
| Qwen2.5 Coder 7B | ~30 tok/s | Excellent | Primary development |
| DeepSeek Coder 16B | ~15 tok/s | Very Good | Fast iterations |
| Llama 3.1 8B | ~25 tok/s | Good | Tool usage |

## Next Steps

### Phase 1: Basic Testing ✅
- [x] Install Ollama and OpenCode
- [x] Download models
- [x] Test basic functionality
- [x] Create marketplace structure
- [x] Port Panda CSS skills and agent
- [x] Convert scripts to npm/Node.js
- [x] Add automated Ollama installation

### Phase 2: Testing Skills 🚧
- [ ] Test each skill with local LLMs
- [ ] Validate agent workflows
- [ ] Refine prompts if needed

### Phase 3: Enhancement
- [ ] Add slash command shortcuts
- [ ] Create example Panda CSS project
- [ ] Add more design system skills
- [ ] Performance optimization

## Credits

- **OpenCode**: [https://opencode.ai](https://opencode.ai)
- **Ollama**: [https://ollama.ai](https://ollama.ai)
- **Node.js**: [https://nodejs.org](https://nodejs.org)
- **npm**: [https://www.npmjs.com](https://www.npmjs.com)
- **Original Marketplace**: [okshaun-claude-marketplace](https://github.com/shaunfox/okshaun-claude-marketplace)
- **Panda CSS**: [https://panda-css.com](https://panda-css.com)

## License

MIT License - see LICENSE file for details

---

## npm Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run install:ollama` | Install Ollama (macOS/Linux auto-detection) |
| `npm run start:ollama` | Start Ollama service in background |
| `npm run stop:ollama` | Stop Ollama service |
| `npm run check:models` | List currently installed models |
| `npm run download:models` | Interactive model selection and download |
| `npm run setup` | Complete setup (install Ollama + download models) |
| `npm test` | Run test suite with mocked downloads |
| `npm run test:watch` | Run tests in watch mode |

All scripts include progress indicators and error handling for a better developer experience.
