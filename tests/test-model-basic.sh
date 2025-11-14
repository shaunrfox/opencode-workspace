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
