#!/bin/bash
# Start Ollama service in background
echo "Starting Ollama service..."
ollama serve > logs/ollama-service.log 2>&1 &
echo $! > logs/ollama.pid
echo "Ollama service started with PID $(cat logs/ollama.pid)"
echo "Waiting for service to be ready..."
sleep 3
curl -s http://localhost:11434/api/tags > /dev/null && echo "Ollama service is ready" || echo "Failed to connect to Ollama"
