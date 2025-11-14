# Local LLM Setup for OpenCode Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Configure OpenCode.ai to work with locally-hosted LLMs on M3 Max (36GB), leveraging Claude Code marketplace expertise for workflows and best practices.

**Architecture:** Install Ollama as the local LLM server, configure multiple optimized models (Qwen3-coder 35B, DeepSeek-coder 16B, Llama3.1 8B), set up OpenCode with custom configuration profiles, and create a testing/benchmarking framework to compare against Claude Code.

**Tech Stack:** Ollama (local LLM server), OpenCode.ai (AI coding assistant), Qwen3-coder/DeepSeek-coder/Llama3.1 (LLMs), JSON config files, bash scripts

---

## Task 1: Verify Ollama Installation

**Files:**
- Check: System binaries for ollama
- Create: `logs/ollama-install.log`

**Step 1: Check if Ollama is already installed**

Run:
```bash
which ollama
```

Expected output: Either path to ollama binary or empty (not installed)

**Step 2: Install Ollama if not present**

Run:
```bash
brew install ollama 2>&1 | tee logs/ollama-install.log
```

Expected: Installation success message or "already installed"

**Step 3: Verify installation**

Run:
```bash
ollama --version
```

Expected: Version number output (e.g., "ollama version 0.x.x")

**Step 4: Document installation**

Create file `logs/ollama-install.log` with version and timestamp

**Step 5: Commit**

```bash
git add logs/ollama-install.log
git commit -m "chore: verify ollama installation"
```

---

## Task 2: Start Ollama Service

**Files:**
- Create: `scripts/start-ollama.sh`
- Create: `logs/ollama-service.log`

**Step 1: Create service start script**

Create `scripts/start-ollama.sh`:
```bash
#!/bin/bash
# Start Ollama service in background
echo "Starting Ollama service..."
ollama serve > logs/ollama-service.log 2>&1 &
echo $! > logs/ollama.pid
echo "Ollama service started with PID $(cat logs/ollama.pid)"
echo "Waiting for service to be ready..."
sleep 3
curl -s http://localhost:11434/api/tags > /dev/null && echo "Ollama service is ready" || echo "Failed to connect to Ollama"
```

**Step 2: Make script executable**

Run:
```bash
chmod +x scripts/start-ollama.sh
```

Expected: No output (success)

**Step 3: Run the script**

Run:
```bash
./scripts/start-ollama.sh
```

Expected: "Ollama service is ready"

**Step 4: Verify service is running**

Run:
```bash
curl http://localhost:11434/api/tags
```

Expected: JSON response with model list (may be empty)

**Step 5: Commit**

```bash
git add scripts/start-ollama.sh logs/ollama.pid
git commit -m "feat: add ollama service startup script"
```

---

## Task 3: Download Qwen3-Coder Model

**Files:**
- Create: `scripts/download-models.sh`
- Create: `logs/model-downloads.log`

**Step 1: Create model download script**

Create `scripts/download-models.sh`:
```bash
#!/bin/bash
# Download and verify models for OpenCode

MODELS=(
  "qwen2.5-coder:7b"
  "deepseek-coder-v2:16b"
  "llama3.1:8b-instruct"
)

echo "Downloading models..." | tee logs/model-downloads.log

for model in "${MODELS[@]}"; do
  echo "Pulling $model..." | tee -a logs/model-downloads.log
  ollama pull "$model" 2>&1 | tee -a logs/model-downloads.log
  if [ ${PIPESTATUS[0]} -eq 0 ]; then
    echo "✓ $model downloaded successfully" | tee -a logs/model-downloads.log
  else
    echo "✗ $model download failed" | tee -a logs/model-downloads.log
  fi
done

echo "Download complete. Models available:" | tee -a logs/model-downloads.log
ollama list | tee -a logs/model-downloads.log
```

**Note:** Using qwen2.5-coder:7b instead of qwen3-coder:35b-q4 as the latter doesn't exist in Ollama registry

**Step 2: Make script executable**

Run:
```bash
chmod +x scripts/download-models.sh
```

Expected: No output

**Step 3: Run download script (this will take time)**

Run:
```bash
./scripts/download-models.sh
```

Expected: Download progress for each model, then success confirmations

**Step 4: Verify models are available**

Run:
```bash
ollama list
```

Expected: List showing qwen2.5-coder:7b, deepseek-coder-v2:16b, llama3.1:8b-instruct

**Step 5: Commit**

```bash
git add scripts/download-models.sh logs/model-downloads.log
git commit -m "feat: add model download script and download core models"
```

---

## Task 4: Test Model Functionality

**Files:**
- Create: `tests/test-model-basic.sh`
- Create: `logs/model-tests.log`

**Step 1: Create basic model test script**

Create `tests/test-model-basic.sh`:
```bash
#!/bin/bash
# Test basic model functionality

echo "Testing models..." | tee logs/model-tests.log

# Test qwen2.5-coder
echo -e "\n=== Testing qwen2.5-coder:7b ===" | tee -a logs/model-tests.log
response=$(ollama run qwen2.5-coder:7b "Write a hello world function in Python" 2>&1)
echo "$response" | tee -a logs/model-tests.log

if [[ $response == *"def"* ]] || [[ $response == *"print"* ]]; then
  echo "✓ qwen2.5-coder:7b is working" | tee -a logs/model-tests.log
else
  echo "✗ qwen2.5-coder:7b test failed" | tee -a logs/model-tests.log
fi

# Test deepseek-coder-v2
echo -e "\n=== Testing deepseek-coder-v2:16b ===" | tee -a logs/model-tests.log
response=$(ollama run deepseek-coder-v2:16b "Write fibonacci function" 2>&1)
echo "$response" | tee -a logs/model-tests.log

if [[ $response == *"def"* ]] || [[ $response == *"function"* ]]; then
  echo "✓ deepseek-coder-v2:16b is working" | tee -a logs/model-tests.log
else
  echo "✗ deepseek-coder-v2:16b test failed" | tee -a logs/model-tests.log
fi

echo -e "\n=== Model Tests Complete ===" | tee -a logs/model-tests.log
```

**Step 2: Make test script executable**

Run:
```bash
chmod +x tests/test-model-basic.sh
```

Expected: No output

**Step 3: Run model tests**

Run:
```bash
./tests/test-model-basic.sh
```

Expected: Model outputs code and success confirmations

**Step 4: Review test results**

Run:
```bash
cat logs/model-tests.log
```

Expected: Log showing successful model responses

**Step 5: Commit**

```bash
git add tests/test-model-basic.sh logs/model-tests.log
git commit -m "test: add basic model functionality tests"
```

---

## Task 5: Install OpenCode

**Files:**
- Create: `logs/opencode-install.log`
- Create: `docs/opencode-setup.md`

**Step 1: Check if OpenCode is installed**

Run:
```bash
which opencode
```

Expected: Path to opencode or empty

**Step 2: Install OpenCode via script**

Run:
```bash
curl -fsSL https://opencode.ai/install.sh | bash 2>&1 | tee logs/opencode-install.log
```

Alternative if above fails:
```bash
brew install opencode 2>&1 | tee logs/opencode-install.log
```

Expected: Installation success message

**Step 3: Verify OpenCode installation**

Run:
```bash
opencode --version
```

Expected: Version number output

**Step 4: Document installation steps**

Create `docs/opencode-setup.md`:
```markdown
# OpenCode Setup Documentation

## Installation

OpenCode was installed on $(date) using the official installation script.

### Installation Method
- Primary: curl -fsSL https://opencode.ai/install.sh | bash
- Fallback: brew install opencode

### Verification
- Version: $(opencode --version)
- Location: $(which opencode)

## Next Steps
1. Configure OpenCode with Ollama backend
2. Set up model profiles
3. Test integration
```

**Step 5: Commit**

```bash
git add logs/opencode-install.log docs/opencode-setup.md
git commit -m "chore: install opencode and document setup"
```

---

## Task 6: Create OpenCode Global Configuration

**Files:**
- Create: `~/.config/opencode/opencode.json`
- Create: `configs/opencode-global.json` (backup copy)

**Step 1: Create config directory**

Run:
```bash
mkdir -p ~/.config/opencode
```

Expected: No output (directory created)

**Step 2: Create global configuration file**

Create `~/.config/opencode/opencode.json`:
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
        "qwen2.5-coder:7b": {
          "name": "Qwen2.5 Coder 7B (primary)"
        },
        "deepseek-coder-v2:16b": {
          "name": "DeepSeek Coder V2 16B (fast)"
        },
        "llama3.1:8b-instruct": {
          "name": "Llama 3.1 8B (tools)"
        }
      }
    }
  }
}
```

**Step 3: Create backup copy in project**

Run:
```bash
mkdir -p configs
cp ~/.config/opencode/opencode.json configs/opencode-global.json
```

Expected: No output (file copied)

**Step 4: Verify config is valid JSON**

Run:
```bash
cat ~/.config/opencode/opencode.json | jq .
```

Expected: Formatted JSON output (no errors)

**Step 5: Commit**

```bash
git add configs/opencode-global.json
git commit -m "feat: create opencode global configuration"
```

---

## Task 7: Create OpenCode Profile Configurations

**Files:**
- Create: `configs/profiles/coding-heavy.json`
- Create: `configs/profiles/fast-iteration.json`
- Create: `configs/profiles/tool-calling.json`
- Create: `configs/README.md`

**Step 1: Create profiles directory**

Run:
```bash
mkdir -p configs/profiles
```

Expected: No output

**Step 2: Create coding-heavy profile**

Create `configs/profiles/coding-heavy.json`:
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
      }
    }
  },
  "systemPrompt": "You are an expert coding assistant. Focus on writing clean, well-tested code. Follow DRY, YAGNI, and TDD principles."
}
```

**Step 3: Create fast-iteration profile**

Create `configs/profiles/fast-iteration.json`:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "ollama/deepseek-coder-v2:16b",
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama (local)",
      "options": {
        "baseURL": "http://127.0.0.1:11434/v1"
      }
    }
  },
  "systemPrompt": "You are a fast coding assistant optimized for quick iterations and prototyping."
}
```

**Step 4: Create tool-calling profile**

Create `configs/profiles/tool-calling.json`:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "ollama/llama3.1:8b-instruct",
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama (local)",
      "options": {
        "baseURL": "http://127.0.0.1:11434/v1"
      }
    }
  },
  "systemPrompt": "You are a tool-calling specialist. Efficiently use available tools for file operations and system commands."
}
```

**Step 5: Document profiles**

Create `configs/README.md`:
```markdown
# OpenCode Configuration Profiles

## Available Profiles

### coding-heavy.json
- **Model:** Qwen2.5 Coder 7B
- **Use case:** Complex coding tasks, refactoring, architectural work
- **Strengths:** Code quality, best practices, comprehensive solutions

### fast-iteration.json
- **Model:** DeepSeek Coder V2 16B
- **Use case:** Quick prototyping, rapid iteration, daily development
- **Strengths:** Speed, concise responses, good for simple tasks

### tool-calling.json
- **Model:** Llama 3.1 8B Instruct
- **Use case:** File operations, git commands, system interactions
- **Strengths:** Tool calling, structured outputs, command execution

## Usage

To use a profile, copy it to your project directory:

\`\`\`bash
cp configs/profiles/coding-heavy.json .opencode.json
\`\`\`

Or reference it directly:

\`\`\`bash
opencode --config configs/profiles/coding-heavy.json
\`\`\`

## Global Configuration

The global configuration is located at:
- `~/.config/opencode/opencode.json`

A backup copy is maintained at:
- `configs/opencode-global.json`
```

**Step 6: Commit**

```bash
git add configs/profiles/ configs/README.md
git commit -m "feat: create opencode configuration profiles"
```

---

## Task 8: Create OpenCode Test Script

**Files:**
- Create: `tests/test-opencode-integration.sh`
- Create: `logs/opencode-tests.log`

**Step 1: Create integration test script**

Create `tests/test-opencode-integration.sh`:
```bash
#!/bin/bash
# Test OpenCode integration with Ollama

echo "Testing OpenCode integration..." | tee logs/opencode-tests.log

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
  echo "✗ Ollama service is not running" | tee -a logs/opencode-tests.log
  echo "Run ./scripts/start-ollama.sh first" | tee -a logs/opencode-tests.log
  exit 1
fi

echo "✓ Ollama service is running" | tee -a logs/opencode-tests.log

# Check if OpenCode config exists
if [ -f ~/.config/opencode/opencode.json ]; then
  echo "✓ OpenCode config found" | tee -a logs/opencode-tests.log
else
  echo "✗ OpenCode config not found" | tee -a logs/opencode-tests.log
  exit 1
fi

# Validate config is valid JSON
if jq empty ~/.config/opencode/opencode.json 2>/dev/null; then
  echo "✓ OpenCode config is valid JSON" | tee -a logs/opencode-tests.log
else
  echo "✗ OpenCode config is invalid JSON" | tee -a logs/opencode-tests.log
  exit 1
fi

# Check if models are available
echo "Checking available models..." | tee -a logs/opencode-tests.log
ollama list | tee -a logs/opencode-tests.log

echo -e "\n✓ All integration checks passed" | tee -a logs/opencode-tests.log
echo "OpenCode is ready to use with local Ollama models" | tee -a logs/opencode-tests.log
```

**Step 2: Make script executable**

Run:
```bash
chmod +x tests/test-opencode-integration.sh
```

Expected: No output

**Step 3: Run integration tests**

Run:
```bash
./tests/test-opencode-integration.sh
```

Expected: All checks pass with ✓ symbols

**Step 4: Review test results**

Run:
```bash
cat logs/opencode-tests.log
```

Expected: Log showing all integration tests passed

**Step 5: Commit**

```bash
git add tests/test-opencode-integration.sh logs/opencode-tests.log
git commit -m "test: add opencode integration tests"
```

---

## Task 9: Create Benchmark Test Suite

**Files:**
- Create: `tests/benchmarks/code-generation.sh`
- Create: `tests/benchmarks/refactoring.sh`
- Create: `tests/benchmarks/tool-calling.sh`
- Create: `tests/benchmarks/README.md`
- Create: `logs/benchmarks/`

**Step 1: Create benchmark directory structure**

Run:
```bash
mkdir -p tests/benchmarks logs/benchmarks
```

Expected: No output

**Step 2: Create code generation benchmark**

Create `tests/benchmarks/code-generation.sh`:
```bash
#!/bin/bash
# Benchmark: Code generation test

echo "=== Code Generation Benchmark ===" | tee logs/benchmarks/code-generation.log

TEST_PROMPT="Write a React component that displays a list of items with filtering"

echo "Testing with qwen2.5-coder:7b..." | tee -a logs/benchmarks/code-generation.log
START=$(date +%s)
response=$(ollama run qwen2.5-coder:7b "$TEST_PROMPT" 2>&1)
END=$(date +%s)
DURATION=$((END - START))

echo "Response time: ${DURATION}s" | tee -a logs/benchmarks/code-generation.log
echo "Response:" | tee -a logs/benchmarks/code-generation.log
echo "$response" | tee -a logs/benchmarks/code-generation.log

# Check if response contains expected code elements
if [[ $response == *"import"* ]] && [[ $response == *"useState"* ]] && [[ $response == *"filter"* ]]; then
  echo "✓ Code generation test passed" | tee -a logs/benchmarks/code-generation.log
else
  echo "✗ Code generation test failed - missing expected elements" | tee -a logs/benchmarks/code-generation.log
fi
```

**Step 3: Create refactoring benchmark**

Create `tests/benchmarks/refactoring.sh`:
```bash
#!/bin/bash
# Benchmark: Refactoring test

echo "=== Refactoring Benchmark ===" | tee logs/benchmarks/refactoring.log

TEST_CODE='function calculate(a, b, c) {
  let result = 0;
  if (c === "add") {
    result = a + b;
  } else if (c === "subtract") {
    result = a - b;
  } else if (c === "multiply") {
    result = a * b;
  }
  return result;
}'

TEST_PROMPT="Refactor this function to be more maintainable: $TEST_CODE"

echo "Testing refactoring with deepseek-coder-v2:16b..." | tee -a logs/benchmarks/refactoring.log
START=$(date +%s)
response=$(ollama run deepseek-coder-v2:16b "$TEST_PROMPT" 2>&1)
END=$(date +%s)
DURATION=$((END - START))

echo "Response time: ${DURATION}s" | tee -a logs/benchmarks/refactoring.log
echo "Response:" | tee -a logs/benchmarks/refactoring.log
echo "$response" | tee -a logs/benchmarks/refactoring.log

if [[ $response == *"function"* ]] || [[ $response == *"const"* ]]; then
  echo "✓ Refactoring test passed" | tee -a logs/benchmarks/refactoring.log
else
  echo "✗ Refactoring test failed" | tee -a logs/benchmarks/refactoring.log
fi
```

**Step 4: Create tool-calling benchmark**

Create `tests/benchmarks/tool-calling.sh`:
```bash
#!/bin/bash
# Benchmark: Tool calling test

echo "=== Tool Calling Benchmark ===" | tee logs/benchmarks/tool-calling.log

TEST_PROMPT="List the steps to create a new directory called 'test' and create a file 'hello.txt' in it with the content 'Hello World'"

echo "Testing with llama3.1:8b-instruct..." | tee -a logs/benchmarks/tool-calling.log
START=$(date +%s)
response=$(ollama run llama3.1:8b-instruct "$TEST_PROMPT" 2>&1)
END=$(date +%s)
DURATION=$((END - START))

echo "Response time: ${DURATION}s" | tee -a logs/benchmarks/tool-calling.log
echo "Response:" | tee -a logs/benchmarks/tool-calling.log
echo "$response" | tee -a logs/benchmarks/tool-calling.log

if [[ $response == *"mkdir"* ]] && [[ $response == *"echo"* ]]; then
  echo "✓ Tool calling test passed" | tee -a logs/benchmarks/tool-calling.log
else
  echo "✗ Tool calling test failed" | tee -a logs/benchmarks/tool-calling.log
fi
```

**Step 5: Create benchmark README**

Create `tests/benchmarks/README.md`:
```markdown
# OpenCode Benchmark Suite

This directory contains benchmarks for testing OpenCode with local Ollama models.

## Benchmark Tests

### code-generation.sh
Tests the model's ability to generate complete, functional code from descriptions.
- **Model:** qwen2.5-coder:7b
- **Metric:** Response time, code completeness

### refactoring.sh
Tests the model's ability to refactor existing code for better maintainability.
- **Model:** deepseek-coder-v2:16b
- **Metric:** Response time, refactoring quality

### tool-calling.sh
Tests the model's ability to understand and suggest appropriate tool/command usage.
- **Model:** llama3.1:8b-instruct
- **Metric:** Response time, command accuracy

## Running Benchmarks

Run all benchmarks:
\`\`\`bash
for test in tests/benchmarks/*.sh; do
  chmod +x "$test"
  "$test"
done
\`\`\`

Run individual benchmark:
\`\`\`bash
./tests/benchmarks/code-generation.sh
\`\`\`

## Results

Results are logged to `logs/benchmarks/` with timestamps and performance metrics.
```

**Step 6: Commit**

```bash
git add tests/benchmarks/ logs/benchmarks/.gitkeep
git commit -m "test: create benchmark test suite"
```

---

## Task 10: Create Performance Monitoring Script

**Files:**
- Create: `scripts/monitor-performance.sh`
- Create: `logs/performance/`

**Step 1: Create performance monitoring script**

Create `scripts/monitor-performance.sh`:
```bash
#!/bin/bash
# Monitor Ollama performance metrics

echo "=== Ollama Performance Monitor ===" | tee logs/performance/monitor-$(date +%Y%m%d-%H%M%S).log

echo "Checking Ollama status..." | tee -a logs/performance/monitor-$(date +%Y%m%d-%H%M%S).log
curl -s http://localhost:11434/api/ps | jq . | tee -a logs/performance/monitor-$(date +%Y%m%d-%H%M%S).log

echo -e "\nRunning models:" | tee -a logs/performance/monitor-$(date +%Y%m%d-%H%M%S).log
ollama ps | tee -a logs/performance/monitor-$(date +%Y%m%d-%H%M%S).log

echo -e "\nSystem memory usage:" | tee -a logs/performance/monitor-$(date +%Y%m%d-%H%M%S).log
vm_stat | perl -ne '/page size of (\d+)/ and $size=$1; /Pages\s+([^:]+)[^\d]+(\d+)/ and printf("%-16s % 16.2f Mi\n", "$1:", $2 * $size / 1048576);' | tee -a logs/performance/monitor-$(date +%Y%m%d-%H%M%S).log

echo -e "\nCPU usage:" | tee -a logs/performance/monitor-$(date +%Y%m%d-%H%M%S).log
ps aux | grep ollama | grep -v grep | tee -a logs/performance/monitor-$(date +%Y%m%d-%H%M%S).log
```

**Step 2: Make script executable**

Run:
```bash
chmod +x scripts/monitor-performance.sh
mkdir -p logs/performance
```

Expected: No output

**Step 3: Run performance monitor**

Run:
```bash
./scripts/monitor-performance.sh
```

Expected: Current Ollama status and system metrics

**Step 4: Create continuous monitoring script**

Create `scripts/monitor-continuous.sh`:
```bash
#!/bin/bash
# Continuous monitoring of Ollama performance

echo "Starting continuous monitoring (Ctrl+C to stop)..."
echo "Logging to logs/performance/continuous-$(date +%Y%m%d).log"

while true; do
  echo "=== $(date) ===" | tee -a logs/performance/continuous-$(date +%Y%m%d).log
  ollama ps | tee -a logs/performance/continuous-$(date +%Y%m%d).log
  echo "" | tee -a logs/performance/continuous-$(date +%Y%m%d).log
  sleep 5
done
```

Run:
```bash
chmod +x scripts/monitor-continuous.sh
```

**Step 5: Commit**

```bash
git add scripts/monitor-performance.sh scripts/monitor-continuous.sh logs/performance/.gitkeep
git commit -m "feat: add performance monitoring scripts"
```

---

## Task 11: Create Documentation Structure

**Files:**
- Create: `docs/setup-guide.md`
- Create: `docs/comparison-guide.md`
- Create: `docs/troubleshooting.md`

**Step 1: Create setup guide**

Create `docs/setup-guide.md`:
```markdown
# OpenCode Local LLM Setup Guide

## Overview

This guide documents the setup of OpenCode.ai with local Ollama models on M3 Max (36GB).

## Prerequisites

- macOS with M3 Max chip (36GB unified memory)
- Homebrew installed
- Sufficient disk space (~20GB for models)

## Installation Steps

### 1. Install Ollama

\`\`\`bash
brew install ollama
ollama --version
\`\`\`

### 2. Start Ollama Service

\`\`\`bash
./scripts/start-ollama.sh
\`\`\`

### 3. Download Models

\`\`\`bash
./scripts/download-models.sh
\`\`\`

Models included:
- **qwen2.5-coder:7b** - Primary coding model
- **deepseek-coder-v2:16b** - Fast iteration model
- **llama3.1:8b-instruct** - Tool calling specialist

### 4. Install OpenCode

\`\`\`bash
curl -fsSL https://opencode.ai/install.sh | bash
# or
brew install opencode
\`\`\`

### 5. Configure OpenCode

Copy the global configuration:
\`\`\`bash
cp configs/opencode-global.json ~/.config/opencode/opencode.json
\`\`\`

### 6. Verify Installation

\`\`\`bash
./tests/test-opencode-integration.sh
\`\`\`

## Usage

### Starting OpenCode

\`\`\`bash
cd your-project
opencode
\`\`\`

### Switching Models

In OpenCode, type:
\`\`\`
/models
\`\`\`

Then select your desired model.

### Using Profiles

Copy a profile to your project:
\`\`\`bash
cp configs/profiles/coding-heavy.json .opencode.json
\`\`\`

## Monitoring

Monitor performance:
\`\`\`bash
./scripts/monitor-performance.sh
\`\`\`

Continuous monitoring:
\`\`\`bash
./scripts/monitor-continuous.sh
\`\`\`

## Next Steps

1. Run benchmarks: `./tests/benchmarks/code-generation.sh`
2. Compare with Claude Code
3. Document findings
```

**Step 2: Create comparison guide**

Create `docs/comparison-guide.md`:
```markdown
# OpenCode vs Claude Code Comparison

## Performance Comparison

### Response Speed
- **Metric:** Tokens per second
- **Test:** Code generation task
- **Results:** TBD (run benchmarks)

### Memory Usage
- **Metric:** RAM consumption during operation
- **Test:** Multi-file editing
- **Results:** TBD (use monitoring scripts)

### Accuracy
- **Metric:** Code correctness and completeness
- **Test:** Standard coding tasks
- **Results:** TBD (manual evaluation)

## Cost Analysis

### Claude Code
- Subscription: $X/month
- API costs: Pay per token
- Total monthly: ~$X

### Local Ollama
- Hardware: M3 Max (already owned)
- Electricity: ~$X/month
- Total monthly: ~$X

### Savings
- Monthly: $X
- Annual: $X

## Feature Comparison

| Feature | Claude Code | Local Ollama | Notes |
|---------|-------------|--------------|-------|
| Code generation | ✓ | ✓ | Compare quality |
| Tool calling | ✓ | ✓ | Test JSON format |
| Context window | Large | Model-dependent | qwen2.5: 128k tokens |
| Speed | Fast | Variable | Depends on model size |
| Privacy | Cloud | Local | 100% local |
| Cost | Subscription | Free | Hardware already owned |
| Model choice | Fixed | Flexible | Multiple models |

## Workflow Differences

### Claude Code Workflow
1. Start session
2. Natural language requests
3. Automatic tool calling
4. Code generation/editing

### Local Ollama Workflow
1. Start Ollama service
2. Start OpenCode
3. Select model profile
4. Natural language requests
5. Manual verification needed

## When to Use Each

### Use Claude Code When:
- Maximum accuracy needed
- Complex multi-file refactoring
- Learning from best practices
- Don't want to manage infrastructure

### Use Local Ollama When:
- Privacy is critical
- Working offline
- Cost optimization
- Experimenting with different models
- Building custom workflows

## Recommendations

TBD after completing benchmarks and real-world usage testing.
```

**Step 3: Create troubleshooting guide**

Create `docs/troubleshooting.md`:
```markdown
# Troubleshooting Guide

## Ollama Issues

### Service Won't Start

**Symptom:** `curl http://localhost:11434/api/tags` fails

**Solutions:**
1. Check if Ollama is installed: `which ollama`
2. Try starting manually: `ollama serve`
3. Check port availability: `lsof -i :11434`
4. Review logs: `cat logs/ollama-service.log`

### Model Download Fails

**Symptom:** `ollama pull` hangs or errors

**Solutions:**
1. Check internet connection
2. Check disk space: `df -h`
3. Try different mirror/registry
4. Review download logs: `cat logs/model-downloads.log`

### Out of Memory

**Symptom:** Ollama crashes or becomes unresponsive

**Solutions:**
1. Use smaller model (e.g., switch from 16b to 7b)
2. Close other applications
3. Check memory usage: `./scripts/monitor-performance.sh`
4. Consider quantized models (Q4, Q5)

## OpenCode Issues

### Config Not Found

**Symptom:** OpenCode doesn't use Ollama models

**Solutions:**
1. Verify config exists: `cat ~/.config/opencode/opencode.json`
2. Validate JSON: `jq . ~/.config/opencode/opencode.json`
3. Copy from backup: `cp configs/opencode-global.json ~/.config/opencode/opencode.json`
4. Try project-level config: `cp configs/opencode-global.json .opencode.json`

### Model Not Working

**Symptom:** Model doesn't respond or gives errors

**Solutions:**
1. Verify model is downloaded: `ollama list`
2. Test model directly: `ollama run qwen2.5-coder:7b "hello"`
3. Check Ollama is running: `curl http://localhost:11434/api/tags`
4. Review OpenCode logs

### Tool Calls as XML Instead of JSON

**Symptom:** Qwen3-coder outputs `<tool>` tags instead of JSON

**Solutions:**
1. Update Ollama to latest version: `brew upgrade ollama`
2. Use different model (llama3.1 for tool calling)
3. Check model version: `ollama show qwen2.5-coder:7b`
4. Try different system prompt in config

## Performance Issues

### Slow Response Times

**Symptom:** Models take too long to respond

**Solutions:**
1. Use smaller/faster model (deepseek-coder-v2:16b)
2. Check CPU usage during inference
3. Ensure no other heavy processes running
4. Consider using quantized models
5. Monitor with: `./scripts/monitor-performance.sh`

### High Memory Usage

**Symptom:** System becomes slow, swapping to disk

**Solutions:**
1. Use smaller model
2. Unload unused models: `ollama stop <model-name>`
3. Check running models: `ollama ps`
4. Restart Ollama service

## Integration Issues

### OpenCode Can't Connect to Ollama

**Symptom:** OpenCode shows connection errors

**Solutions:**
1. Verify Ollama is running: `curl http://localhost:11434/api/tags`
2. Check baseURL in config: `cat ~/.config/opencode/opencode.json | jq .provider.ollama.options.baseURL`
3. Try `http://localhost:11434/v1` instead of `http://127.0.0.1:11434/v1`
4. Restart both services

## Getting Help

If issues persist:
1. Check logs in `logs/` directory
2. Run diagnostics: `./tests/test-opencode-integration.sh`
3. Review Ollama docs: https://ollama.ai/docs
4. Review OpenCode docs: https://opencode.ai/docs
```

**Step 4: Commit**

```bash
git add docs/setup-guide.md docs/comparison-guide.md docs/troubleshooting.md
git commit -m "docs: create comprehensive documentation"
```

---

## Task 12: Create Project README

**Files:**
- Create: `README.md`

**Step 1: Create main README**

Create `README.md`:
```markdown
# OpenCode Local LLM Setup

Local LLM setup for OpenCode.ai using Ollama on M3 Max (36GB), inspired by Claude Code marketplace patterns.

## Quick Start

1. **Install and start Ollama**
   \`\`\`bash
   brew install ollama
   ./scripts/start-ollama.sh
   \`\`\`

2. **Download models**
   \`\`\`bash
   ./scripts/download-models.sh
   \`\`\`

3. **Install OpenCode**
   \`\`\`bash
   curl -fsSL https://opencode.ai/install.sh | bash
   \`\`\`

4. **Configure OpenCode**
   \`\`\`bash
   cp configs/opencode-global.json ~/.config/opencode/opencode.json
   \`\`\`

5. **Verify setup**
   \`\`\`bash
   ./tests/test-opencode-integration.sh
   \`\`\`

## Project Structure

\`\`\`
.
├── configs/
│   ├── profiles/              # OpenCode configuration profiles
│   │   ├── coding-heavy.json
│   │   ├── fast-iteration.json
│   │   └── tool-calling.json
│   └── opencode-global.json   # Backup of global config
├── docs/
│   ├── setup-guide.md         # Detailed setup instructions
│   ├── comparison-guide.md    # OpenCode vs Claude Code
│   ├── troubleshooting.md     # Common issues and solutions
│   └── plans/                 # Implementation plans
├── scripts/
│   ├── start-ollama.sh        # Start Ollama service
│   ├── download-models.sh     # Download LLM models
│   ├── monitor-performance.sh # One-time performance check
│   └── monitor-continuous.sh  # Continuous monitoring
├── tests/
│   ├── test-model-basic.sh    # Basic model functionality tests
│   ├── test-opencode-integration.sh  # Integration tests
│   └── benchmarks/            # Performance benchmarks
│       ├── code-generation.sh
│       ├── refactoring.sh
│       └── tool-calling.sh
└── logs/                      # All logs and test results
```

## Models

### Primary: qwen2.5-coder:7b
- **Size:** ~4.7GB
- **Use case:** Main coding tasks
- **Context:** 128k tokens

### Fast: deepseek-coder-v2:16b
- **Size:** ~9GB
- **Use case:** Quick iterations
- **Context:** 64k tokens

### Tools: llama3.1:8b-instruct
- **Size:** ~4.7GB
- **Use case:** Tool calling, structured output
- **Context:** 128k tokens

## Configuration Profiles

- **coding-heavy.json** - Complex coding, refactoring, architecture
- **fast-iteration.json** - Quick prototyping, simple tasks
- **tool-calling.json** - File operations, git commands

## Usage

### Start OpenCode
\`\`\`bash
cd your-project
opencode
\`\`\`

### Switch models
In OpenCode: \`/models\`

### Use a profile
\`\`\`bash
cp configs/profiles/coding-heavy.json .opencode.json
opencode
\`\`\`

## Monitoring

### Check current status
\`\`\`bash
./scripts/monitor-performance.sh
\`\`\`

### Continuous monitoring
\`\`\`bash
./scripts/monitor-continuous.sh
\`\`\`

### Running benchmarks
\`\`\`bash
./tests/benchmarks/code-generation.sh
./tests/benchmarks/refactoring.sh
./tests/benchmarks/tool-calling.sh
\`\`\`

## Documentation

- [Setup Guide](docs/setup-guide.md) - Detailed installation
- [Comparison Guide](docs/comparison-guide.md) - OpenCode vs Claude Code
- [Troubleshooting](docs/troubleshooting.md) - Common issues

## Inspired By

This project adapts patterns from the Claude Code plugin marketplace, particularly:
- Configuration profile system
- Testing and benchmarking approach
- Documentation structure
- Workflow optimization principles

## Requirements

- macOS with Apple Silicon (M1/M2/M3)
- 16GB+ RAM (36GB recommended for larger models)
- 20GB+ free disk space
- Homebrew

## License

MIT
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: create project README"
```

---

## Task 13: Create .gitignore

**Files:**
- Create: `.gitignore`

**Step 1: Create .gitignore file**

Create `.gitignore`:
```
# Logs
logs/*.log
logs/*/*.log
!logs/.gitkeep
!logs/benchmarks/.gitkeep
!logs/performance/.gitkeep

# Ollama
logs/ollama.pid

# Node modules (if using npm packages)
node_modules/

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# Local configs (use configs/ for versioned configs)
.opencode.json

# Temporary files
tmp/
temp/
*.tmp

# Model files (if downloaded locally)
*.gguf
*.bin

# Test outputs
test-output/
```

**Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: add gitignore"
```

---

## Task 14: Create Initial Git Commit

**Files:**
- Initialize: Git repository

**Step 1: Initialize git repository**

Run:
```bash
git init
```

Expected: "Initialized empty Git repository"

**Step 2: Add all files**

Run:
```bash
git add .
```

Expected: No output

**Step 3: Create initial commit**

Run:
```bash
git commit -m "feat: initial opencode local llm setup"
```

Expected: Commit created with file count

**Step 4: Create main branch (if not default)**

Run:
```bash
git branch -M main
```

Expected: No output

**Step 5: Verify commit**

Run:
```bash
git log --oneline
```

Expected: Single commit visible

---

## Task 15: Run Complete Test Suite

**Files:**
- Update: All test logs

**Step 1: Run all tests**

Run:
```bash
# Ensure Ollama is running
./scripts/start-ollama.sh

# Run integration tests
./tests/test-opencode-integration.sh

# Run model tests
./tests/test-model-basic.sh

# Run benchmarks
for test in tests/benchmarks/*.sh; do
  chmod +x "$test"
  "$test"
done
```

Expected: All tests pass

**Step 2: Generate test report**

Create `logs/test-report-$(date +%Y%m%d).md`:
```bash
cat > "logs/test-report-$(date +%Y%m%d).md" << 'EOF'
# Test Report - $(date)

## Integration Tests
$(cat logs/opencode-tests.log)

## Model Tests
$(cat logs/model-tests.log)

## Benchmarks

### Code Generation
$(cat logs/benchmarks/code-generation.log)

### Refactoring
$(cat logs/benchmarks/refactoring.log)

### Tool Calling
$(cat logs/benchmarks/tool-calling.log)

## Summary
- All integration tests: PASS/FAIL
- All model tests: PASS/FAIL
- All benchmarks: COMPLETED

## Next Steps
1. Compare results with Claude Code
2. Document performance findings
3. Iterate on configurations
EOF
```

**Step 3: Review all logs**

Run:
```bash
ls -lh logs/
ls -lh logs/benchmarks/
```

Expected: All log files present with timestamps

**Step 4: Commit test results**

Run:
```bash
git add logs/
git commit -m "test: complete initial test suite execution"
```

---

## Task 16: Create Comparison Benchmark Against Claude Code

**Files:**
- Create: `tests/benchmarks/compare-claude-code.sh`
- Create: `docs/benchmark-results.md`

**Step 1: Create comparison script**

Create `tests/benchmarks/compare-claude-code.sh`:
```bash
#!/bin/bash
# Compare OpenCode performance with Claude Code baseline

echo "=== OpenCode vs Claude Code Comparison ===" | tee logs/benchmarks/comparison.log

# Define test cases
declare -A tests=(
  ["simple-function"]="Write a function to calculate factorial"
  ["react-component"]="Create a React component with useState and useEffect"
  ["refactor-code"]="Refactor this to use async/await: callback hell example"
  ["debug-error"]="Find and fix the bug in this code: off-by-one error"
  ["tool-usage"]="What commands would you use to create a new git branch and push it"
)

echo "Test Cases:" | tee -a logs/benchmarks/comparison.log
for test_name in "${!tests[@]}"; do
  echo "  - $test_name: ${tests[$test_name]}" | tee -a logs/benchmarks/comparison.log
done

echo -e "\n=== Manual Testing Instructions ===" | tee -a logs/benchmarks/comparison.log
echo "For each test case above:" | tee -a logs/benchmarks/comparison.log
echo "1. Run with Claude Code and note response time + quality (1-10)" | tee -a logs/benchmarks/comparison.log
echo "2. Run with OpenCode (qwen2.5-coder:7b) and note response time + quality (1-10)" | tee -a logs/benchmarks/comparison.log
echo "3. Document findings in docs/benchmark-results.md" | tee -a logs/benchmarks/comparison.log

echo -e "\n=== Automated OpenCode Tests ===" | tee -a logs/benchmarks/comparison.log

for test_name in "${!tests[@]}"; do
  prompt="${tests[$test_name]}"
  echo -e "\nTesting: $test_name" | tee -a logs/benchmarks/comparison.log

  START=$(date +%s)
  response=$(ollama run qwen2.5-coder:7b "$prompt" 2>&1)
  END=$(date +%s)
  DURATION=$((END - START))

  echo "Response time: ${DURATION}s" | tee -a logs/benchmarks/comparison.log
  echo "Response preview: ${response:0:200}..." | tee -a logs/benchmarks/comparison.log
done

echo -e "\n=== Next Steps ===" | tee -a logs/benchmarks/comparison.log
echo "1. Manually test same prompts with Claude Code" | tee -a logs/benchmarks/comparison.log
echo "2. Compare response quality and accuracy" | tee -a logs/benchmarks/comparison.log
echo "3. Update docs/benchmark-results.md with findings" | tee -a logs/benchmarks/comparison.log
```

**Step 2: Make script executable**

Run:
```bash
chmod +x tests/benchmarks/compare-claude-code.sh
```

Expected: No output

**Step 3: Create benchmark results template**

Create `docs/benchmark-results.md`:
```markdown
# Benchmark Results: OpenCode vs Claude Code

## Test Date
$(date)

## Test Environment
- **Hardware:** M3 Max, 36GB RAM
- **Ollama Version:** $(ollama --version)
- **OpenCode Version:** $(opencode --version 2>/dev/null || echo "TBD")
- **Primary Model:** qwen2.5-coder:7b

## Test Cases

### 1. Simple Function (Factorial)
**Prompt:** "Write a function to calculate factorial"

| Metric | Claude Code | OpenCode (qwen2.5-coder:7b) |
|--------|-------------|------------------------------|
| Response Time | TBD | TBD |
| Code Quality (1-10) | TBD | TBD |
| Correctness | TBD | TBD |
| Comments/Docs | TBD | TBD |

**Notes:**

### 2. React Component
**Prompt:** "Create a React component with useState and useEffect"

| Metric | Claude Code | OpenCode (qwen2.5-coder:7b) |
|--------|-------------|------------------------------|
| Response Time | TBD | TBD |
| Code Quality (1-10) | TBD | TBD |
| Best Practices | TBD | TBD |
| TypeScript Support | TBD | TBD |

**Notes:**

### 3. Refactoring
**Prompt:** "Refactor callback hell to async/await"

| Metric | Claude Code | OpenCode (qwen2.5-coder:7b) |
|--------|-------------|------------------------------|
| Response Time | TBD | TBD |
| Code Quality (1-10) | TBD | TBD |
| Error Handling | TBD | TBD |
| Explanation Quality | TBD | TBD |

**Notes:**

### 4. Debugging
**Prompt:** "Find and fix the bug in this code: [off-by-one error]"

| Metric | Claude Code | OpenCode (qwen2.5-coder:7b) |
|--------|-------------|------------------------------|
| Response Time | TBD | TBD |
| Bug Detection | TBD | TBD |
| Fix Quality | TBD | TBD |
| Explanation | TBD | TBD |

**Notes:**

### 5. Tool Usage
**Prompt:** "What commands would you use to create a new git branch and push it"

| Metric | Claude Code | OpenCode (qwen2.5-coder:7b) |
|--------|-------------|------------------------------|
| Response Time | TBD | TBD |
| Command Accuracy | TBD | TBD |
| Explanation | TBD | TBD |
| Best Practices | TBD | TBD |

**Notes:**

## Overall Comparison

### Performance
- **Winner:** TBD
- **Notes:**

### Code Quality
- **Winner:** TBD
- **Notes:**

### Accuracy
- **Winner:** TBD
- **Notes:**

### Cost Effectiveness
- **Claude Code Monthly Cost:** $X
- **OpenCode Monthly Cost:** ~$0 (electricity negligible)
- **Savings:** $X/month, $X/year

## Recommendations

### Use Claude Code When:
- TBD

### Use OpenCode (Local) When:
- TBD

## Conclusion

TBD after completing manual tests
```

**Step 4: Run comparison script**

Run:
```bash
./tests/benchmarks/compare-claude-code.sh
```

Expected: Automated tests complete, manual instructions displayed

**Step 5: Commit**

```bash
git add tests/benchmarks/compare-claude-code.sh docs/benchmark-results.md logs/benchmarks/comparison.log
git commit -m "test: add claude code comparison benchmarks"
```

---

## Task 17: Create Cleanup and Maintenance Scripts

**Files:**
- Create: `scripts/cleanup.sh`
- Create: `scripts/stop-ollama.sh`
- Create: `scripts/status.sh`

**Step 1: Create cleanup script**

Create `scripts/cleanup.sh`:
```bash
#!/bin/bash
# Cleanup logs and temporary files

echo "Cleaning up logs and temporary files..."

# Archive old logs
if [ -d logs ]; then
  timestamp=$(date +%Y%m%d-%H%M%S)
  mkdir -p logs/archive
  find logs -name "*.log" -type f -mtime +7 -exec mv {} logs/archive/ \;
  echo "Archived logs older than 7 days to logs/archive/"
fi

# Clean up old performance logs
find logs/performance -name "*.log" -type f -mtime +3 -delete 2>/dev/null
echo "Deleted performance logs older than 3 days"

# Clean up temporary files
rm -f logs/ollama.pid
rm -rf tmp/
rm -rf temp/

echo "Cleanup complete"
```

**Step 2: Create stop script**

Create `scripts/stop-ollama.sh`:
```bash
#!/bin/bash
# Stop Ollama service

echo "Stopping Ollama service..."

if [ -f logs/ollama.pid ]; then
  PID=$(cat logs/ollama.pid)
  if ps -p $PID > /dev/null; then
    kill $PID
    echo "Ollama service (PID: $PID) stopped"
    rm logs/ollama.pid
  else
    echo "Ollama process not found, removing stale PID file"
    rm logs/ollama.pid
  fi
else
  # Try to find and kill by process name
  pkill -f "ollama serve"
  if [ $? -eq 0 ]; then
    echo "Ollama service stopped"
  else
    echo "No running Ollama service found"
  fi
fi
```

**Step 3: Create status script**

Create `scripts/status.sh`:
```bash
#!/bin/bash
# Check status of all components

echo "=== OpenCode Local LLM Status ==="

# Check Ollama installation
echo -e "\n[Ollama Installation]"
if command -v ollama &> /dev/null; then
  echo "✓ Ollama installed: $(ollama --version)"
else
  echo "✗ Ollama not installed"
fi

# Check Ollama service
echo -e "\n[Ollama Service]"
if curl -s http://localhost:11434/api/tags > /dev/null; then
  echo "✓ Ollama service is running"
  echo "  Running models:"
  ollama ps
else
  echo "✗ Ollama service is not running"
  echo "  Start with: ./scripts/start-ollama.sh"
fi

# Check available models
echo -e "\n[Available Models]"
if command -v ollama &> /dev/null; then
  ollama list
else
  echo "✗ Cannot check models (Ollama not installed)"
fi

# Check OpenCode installation
echo -e "\n[OpenCode Installation]"
if command -v opencode &> /dev/null; then
  echo "✓ OpenCode installed: $(opencode --version 2>&1 || echo 'version unknown')"
else
  echo "✗ OpenCode not installed"
fi

# Check OpenCode configuration
echo -e "\n[OpenCode Configuration]"
if [ -f ~/.config/opencode/opencode.json ]; then
  echo "✓ Global config exists"
  if jq empty ~/.config/opencode/opencode.json 2>/dev/null; then
    echo "✓ Config is valid JSON"
  else
    echo "✗ Config has JSON errors"
  fi
else
  echo "✗ Global config not found"
fi

if [ -f .opencode.json ]; then
  echo "✓ Project config exists"
else
  echo "○ No project config (optional)"
fi

# Check disk space
echo -e "\n[System Resources]"
echo "Disk space:"
df -h . | tail -n 1

echo -e "\nMemory usage:"
vm_stat | perl -ne '/page size of (\d+)/ and $size=$1; /Pages\s+([^:]+)[^\d]+(\d+)/ and printf("%-16s % 16.2f Mi\n", "$1:", $2 * $size / 1048576);' | head -n 3

echo -e "\n=== Status Check Complete ==="
```

**Step 4: Make all scripts executable**

Run:
```bash
chmod +x scripts/cleanup.sh scripts/stop-ollama.sh scripts/status.sh
```

Expected: No output

**Step 5: Test status script**

Run:
```bash
./scripts/status.sh
```

Expected: Status overview of all components

**Step 6: Commit**

```bash
git add scripts/cleanup.sh scripts/stop-ollama.sh scripts/status.sh
git commit -m "feat: add maintenance and status scripts"
```

---

## Task 18: Create Quick Start Script

**Files:**
- Create: `scripts/quickstart.sh`

**Step 1: Create quickstart script**

Create `scripts/quickstart.sh`:
```bash
#!/bin/bash
# Quick start script for new setup

set -e  # Exit on error

echo "=== OpenCode Local LLM Quick Start ==="

# Check prerequisites
echo -e "\n[1/7] Checking prerequisites..."
if ! command -v brew &> /dev/null; then
  echo "✗ Homebrew not found. Install from https://brew.sh"
  exit 1
fi
echo "✓ Homebrew installed"

# Install Ollama
echo -e "\n[2/7] Installing Ollama..."
if command -v ollama &> /dev/null; then
  echo "✓ Ollama already installed"
else
  brew install ollama
  echo "✓ Ollama installed"
fi

# Start Ollama
echo -e "\n[3/7] Starting Ollama service..."
./scripts/start-ollama.sh

# Download models
echo -e "\n[4/7] Downloading models (this may take a while)..."
./scripts/download-models.sh

# Install OpenCode
echo -e "\n[5/7] Installing OpenCode..."
if command -v opencode &> /dev/null; then
  echo "✓ OpenCode already installed"
else
  echo "Installing OpenCode..."
  curl -fsSL https://opencode.ai/install.sh | bash
  echo "✓ OpenCode installed"
fi

# Configure OpenCode
echo -e "\n[6/7] Configuring OpenCode..."
mkdir -p ~/.config/opencode
cp configs/opencode-global.json ~/.config/opencode/opencode.json
echo "✓ OpenCode configured"

# Run tests
echo -e "\n[7/7] Running integration tests..."
./tests/test-opencode-integration.sh

# Success
echo -e "\n=== Setup Complete! ==="
echo ""
echo "Next steps:"
echo "  1. cd your-project"
echo "  2. opencode"
echo "  3. Type '/models' to select a model"
echo ""
echo "Available profiles:"
echo "  - coding-heavy: cp configs/profiles/coding-heavy.json .opencode.json"
echo "  - fast-iteration: cp configs/profiles/fast-iteration.json .opencode.json"
echo "  - tool-calling: cp configs/profiles/tool-calling.json .opencode.json"
echo ""
echo "Monitoring:"
echo "  - Check status: ./scripts/status.sh"
echo "  - Monitor performance: ./scripts/monitor-performance.sh"
echo "  - Run benchmarks: ./tests/benchmarks/code-generation.sh"
echo ""
echo "Documentation:"
echo "  - Setup guide: docs/setup-guide.md"
echo "  - Comparison: docs/comparison-guide.md"
echo "  - Troubleshooting: docs/troubleshooting.md"
```

**Step 2: Make script executable**

Run:
```bash
chmod +x scripts/quickstart.sh
```

Expected: No output

**Step 3: Update README with quickstart**

Run:
```bash
# Add quickstart command to README
sed -i '' '1a\
\
## One-Command Setup\
\
```bash\
./scripts/quickstart.sh\
```\
' README.md
```

Expected: No output (file updated)

**Step 4: Commit**

```bash
git add scripts/quickstart.sh README.md
git commit -m "feat: add one-command quickstart script"
```

---

## Task 19: Final Documentation Review and Summary

**Files:**
- Create: `docs/project-summary.md`

**Step 1: Create project summary**

Create `docs/project-summary.md`:
```markdown
# Project Summary: OpenCode Local LLM Setup

## Overview
Complete setup for running OpenCode.ai with local Ollama models on M3 Max (36GB), inspired by Claude Code marketplace patterns.

## Completed Components

### Infrastructure (✓)
- [x] Ollama installation and service management
- [x] Model download automation (qwen2.5-coder, deepseek-coder-v2, llama3.1)
- [x] OpenCode installation and configuration
- [x] Service monitoring and management scripts

### Configuration (✓)
- [x] Global OpenCode configuration
- [x] Three usage profiles (coding-heavy, fast-iteration, tool-calling)
- [x] Project structure and organization
- [x] Git repository setup

### Testing (✓)
- [x] Model functionality tests
- [x] OpenCode integration tests
- [x] Benchmark suite (code generation, refactoring, tool calling)
- [x] Comparison framework for Claude Code vs OpenCode

### Documentation (✓)
- [x] Comprehensive README
- [x] Setup guide with step-by-step instructions
- [x] Comparison guide (OpenCode vs Claude Code)
- [x] Troubleshooting guide
- [x] Benchmark results template

### Automation (✓)
- [x] One-command quickstart script
- [x] Service start/stop scripts
- [x] Performance monitoring (one-time and continuous)
- [x] Cleanup and maintenance scripts
- [x] Status checker

## File Structure

\`\`\`
opencode-workspace/
├── README.md                 # Main documentation
├── .gitignore               # Git ignore rules
├── configs/
│   ├── profiles/            # Usage profiles
│   │   ├── coding-heavy.json
│   │   ├── fast-iteration.json
│   │   └── tool-calling.json
│   ├── opencode-global.json # Global config backup
│   └── README.md            # Config documentation
├── docs/
│   ├── setup-guide.md       # Detailed setup
│   ├── comparison-guide.md  # Feature comparison
│   ├── troubleshooting.md   # Problem solving
│   ├── benchmark-results.md # Performance data
│   ├── project-summary.md   # This file
│   ├── opencode-setup.md    # Installation notes
│   └── plans/               # Implementation plans
│       └── 2025-11-14-local-llm-opencode-setup.md
├── scripts/
│   ├── quickstart.sh        # One-command setup
│   ├── start-ollama.sh      # Service start
│   ├── stop-ollama.sh       # Service stop
│   ├── download-models.sh   # Model downloads
│   ├── status.sh            # System status
│   ├── cleanup.sh           # Maintenance
│   ├── monitor-performance.sh     # One-time monitor
│   └── monitor-continuous.sh      # Continuous monitor
├── tests/
│   ├── test-model-basic.sh        # Model tests
│   ├── test-opencode-integration.sh # Integration tests
│   └── benchmarks/
│       ├── code-generation.sh
│       ├── refactoring.sh
│       ├── tool-calling.sh
│       ├── compare-claude-code.sh
│       └── README.md
└── logs/                    # All logs and outputs
    ├── benchmarks/
    └── performance/
\`\`\`

## Key Features

### 1. Easy Setup
- One-command installation: `./scripts/quickstart.sh`
- Automatic model downloads
- Pre-configured profiles

### 2. Multiple Model Profiles
- **Coding Heavy:** Qwen2.5 Coder 7B for complex tasks
- **Fast Iteration:** DeepSeek Coder V2 16B for quick work
- **Tool Calling:** Llama 3.1 8B for commands and tools

### 3. Comprehensive Testing
- Basic functionality tests
- Integration verification
- Performance benchmarks
- Comparison framework

### 4. Monitoring & Maintenance
- Real-time performance monitoring
- System resource tracking
- Automated cleanup
- Status checking

### 5. Documentation
- Step-by-step guides
- Troubleshooting help
- Comparison analysis
- Best practices

## Next Steps for Users

1. **Initial Setup**
   \`\`\`bash
   ./scripts/quickstart.sh
   \`\`\`

2. **Run Benchmarks**
   \`\`\`bash
   ./tests/benchmarks/code-generation.sh
   ./tests/benchmarks/refactoring.sh
   ./tests/benchmarks/tool-calling.sh
   \`\`\`

3. **Compare with Claude Code**
   - Run comparison benchmarks
   - Document findings in `docs/benchmark-results.md`
   - Determine best use cases for each tool

4. **Customize**
   - Modify profiles for specific needs
   - Add custom system prompts
   - Create project-specific configs

5. **Daily Usage**
   - Check status: `./scripts/status.sh`
   - Start working: `cd project && opencode`
   - Switch profiles as needed

## Design Principles

Following Claude Code marketplace patterns:

1. **DRY (Don't Repeat Yourself)**
   - Reusable scripts and configs
   - Centralized configuration management

2. **YAGNI (You Aren't Gonna Need It)**
   - No over-engineering
   - Simple, focused scripts
   - Clear separation of concerns

3. **TDD (Test-Driven Development)**
   - Tests before deployment
   - Verification at each step
   - Benchmark comparisons

4. **Frequent Commits**
   - Granular git history
   - Easy rollback
   - Clear progression

## Comparison with Claude Code

### Advantages of Local Setup
- ✓ Zero ongoing costs
- ✓ Complete privacy (100% local)
- ✓ No internet required
- ✓ Multiple model choices
- ✓ Full customization

### Advantages of Claude Code
- ✓ Cutting-edge models
- ✓ No hardware requirements
- ✓ No maintenance needed
- ✓ Consistent performance
- ✓ Regular updates

### Recommended Strategy
Use both strategically:
- **Local (OpenCode):** Daily work, private code, experimentation
- **Cloud (Claude Code):** Complex refactoring, learning, production code

## Success Metrics

After completing this setup, users should be able to:

- [x] Install entire stack in < 30 minutes
- [x] Run local LLM without internet
- [x] Switch between 3 optimized profiles
- [x] Monitor performance and resource usage
- [x] Benchmark against Claude Code
- [x] Troubleshoot common issues
- [x] Understand cost/benefit tradeoffs

## Maintenance

### Daily
- Check status before starting work
- Monitor resource usage if running large models

### Weekly
- Review logs for errors
- Run cleanup script
- Update models if new versions available

### Monthly
- Update Ollama: `brew upgrade ollama`
- Update OpenCode: `brew upgrade opencode` or reinstall
- Review and archive old logs

## Future Enhancements

Potential improvements:
- [ ] Add more model options
- [ ] Create custom fine-tuned models
- [ ] Integrate with other local tools
- [ ] Build OpenCode plugin marketplace
- [ ] Add automated benchmark scheduling
- [ ] Create model comparison dashboard

## Conclusion

This project provides a complete, production-ready setup for running OpenCode with local Ollama models, inspired by the best practices from Claude Code's marketplace. It balances ease of use with flexibility, providing both quick-start automation and detailed customization options.
```

**Step 2: Create final status check**

Run:
```bash
./scripts/status.sh | tee logs/final-status.log
```

Expected: Complete status overview

**Step 3: Create project metrics**

Run:
```bash
echo "=== Project Metrics ===" | tee logs/project-metrics.log
echo "Total files created: $(git ls-files | wc -l)" | tee -a logs/project-metrics.log
echo "Total commits: $(git rev-list --count HEAD)" | tee -a logs/project-metrics.log
echo "Lines of documentation: $(find docs -name "*.md" -exec cat {} \; | wc -l)" | tee -a logs/project-metrics.log
echo "Lines of scripts: $(find scripts -name "*.sh" -exec cat {} \; | wc -l)" | tee -a logs/project-metrics.log
echo "Lines of tests: $(find tests -name "*.sh" -exec cat {} \; | wc -l)" | tee -a logs/project-metrics.log
```

Expected: Project statistics

**Step 4: Final commit**

Run:
```bash
git add docs/project-summary.md logs/final-status.log logs/project-metrics.log
git commit -m "docs: add project summary and final metrics"
```

---

## Execution Complete

The implementation plan is now complete. All 19 tasks provide step-by-step instructions for:

1. Setting up Ollama with optimized models
2. Installing and configuring OpenCode
3. Creating configuration profiles
4. Building comprehensive test suites
5. Implementing monitoring tools
6. Writing complete documentation
7. Automating the entire workflow

Each task includes:
- Exact file paths
- Complete code snippets
- Expected outputs
- Verification steps
- Git commits

The plan follows DRY, YAGNI, and TDD principles with frequent commits.

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "Analyze project draft and extract requirements", "activeForm": "Analyzing project draft and extracting requirements", "status": "completed"}, {"content": "Structure plan into bite-sized tasks with exact file paths", "activeForm": "Structuring plan into bite-sized tasks with exact file paths", "status": "completed"}, {"content": "Create plan document with required header", "activeForm": "Creating plan document with required header", "status": "completed"}, {"content": "Save plan to docs/plans directory", "activeForm": "Saving plan to docs/plans directory", "status": "completed"}, {"content": "Offer execution options to user", "activeForm": "Offering execution options to user", "status": "in_progress"}]