# Project: Local LLM Setup for OpenCode with Ollama

Goal: Configure OpenCode.ai to work with locally-hosted LLMs on M3 Max (36GB), leveraging Claude Code marketplace expertise for workflows and best practices.

## Phase 1: Local Model Infrastructure

1. Install Ollama

```bash
bashbrew install ollama
```

2. Download optimized models for your M3 Max

```bash
# Start Ollama service
ollama serve

# In another terminal, pull models (start small, scale up)
ollama pull qwen3-coder:35b-q4      # Your main coding model
ollama pull deepseek-coder-v2:16b    # Fast daily driver
ollama pull llama3.1:8b-instruct     # Tool calling specialist
ollama pull qwen2.5:32b              # Backup option

# Test a model
ollama run qwen3-coder:35b-q4
```

Apply it:

```bash
curl -fsSL https://opencode.ai/install.sh | bash
# or with Homebrew
brew install opencode
```

## Phase 2: OpenCode Installation & Configuration

1. Install OpenCode

```bash
curl -fsSL https://opencode.ai/install.sh | bash
# or with Homebrew
brew install opencode
```

2. Create OpenCode config
   OpenCode uses config files at both global (`~/.config/opencode/opencode.json`) and project level for LLM settings.
   Global config at `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "ollama/qwen3-opencode",
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama (local)",
      "options": {
        "baseURL": "http://127.0.0.1:11434/v1"
      },
      "models": {
        "qwen3-opencode": {
          "name": "Qwen3 Coder 35B (optimized)"
        },
        "deepseek-coder-v2:16b": {
          "name": "DeepSeek Coder V2 16B"
        },
        "llama3.1:8b-instruct": {
          "name": "Llama 3.1 8B (tools)"
        }
      }
    }
  }
}
```

3. Test OpenCode

```bash
cd ~/projects/test-project
opencode
# Type /models to select your model
# Try a simple prompt like "explain this codebase"
```

## Phase 3: Adapt Claude Code Marketplace Patterns

**Key insights from your marketplace:**

1. **Plugin Structure** - Your `.claude-plugin/` structure is brilliant. Consider creating an equivalent for OpenCode:

```
opencode-configs/
├── profiles/
│ ├── coding-heavy.json # qwen3-coder focused
│ ├── tool-calling.json # llama3.1 optimized
│ └── fast-iteration.json # deepseek-16b
└── templates/
└── project-init.json
```

2. **Skills Translation** - Your Panda CSS workflows could potentially be adapted as OpenCode "agents" or custom prompts
3. **Workflow Optimization** - Document what works vs. what doesn't compared to Claude Code

## Phase 4: Testing & Benchmarking

**Create test scenarios:**

1. Code generation (simple React component)
2. Refactoring (existing function)
3. Tool calling (file operations, git commands)
4. Multi-file coordination
5. Error debugging

**Track metrics:**

- Response speed (tokens/sec)
- Memory usage (Activity Monitor)
- Accuracy vs. Claude Code baseline
- Context window handling

## Phase 5: Documentation

**Build a comparison guide:**

- Performance benchmarks
- Cost analysis (free local vs. Claude Code subscription)
- Workflow differences
- When to use which tool

**Quick Commands for Claude Code**

```bash
# Monitor Ollama performance
watch -n 1 'curl http://localhost:11434/api/ps'

# Check model memory usage
ollama ps

# Switch models in OpenCode
# Type /models in OpenCode interface

# Test token generation speed
time ollama run qwen3-coder:35b-q4 "write a fibonacci function"
```

**Potential Issues to Watch**

Qwen3-coder with LM Studio's default system prompt outputs tool calls as XML while OpenCode expects JSON format. With Ollama, ensure you're using the latest version which handles JSON tool calls properly.

If OpenCode doesn't detect your local config, try copying the config file to your project directory as a workaround.

**Next Steps**

1. Get Ollama + models running
2. Configure OpenCode with the config above
3. Test on a simple project
4. Benchmark against Claude Code on real tasks
5. Document findings
6. Consider creating an "OpenCode plugin" marketplace inspired by your Claude Code work
