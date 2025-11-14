#!/bin/bash
# Download and verify models for OpenCode

MODELS=(
  "qwen2.5-coder:7b"
  "deepseek-coder-v2:16b"
  "llama3.1"
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
