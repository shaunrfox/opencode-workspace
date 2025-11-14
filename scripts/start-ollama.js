#!/usr/bin/env node

import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';

const spinner = ora('Starting Ollama service...').start();

try {
  // Start Ollama service in background
  const ollamaProcess = execa('ollama', ['serve'], {
    detached: true,
    stdio: 'ignore'
  });

  // Give it a moment to start
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Check if service is ready
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    if (response.ok) {
      spinner.succeed(chalk.green('Ollama service is ready'));
    } else {
      spinner.fail(chalk.red('Ollama service failed to respond'));
      process.exit(1);
    }
  } catch (error) {
    spinner.fail(chalk.red('Failed to connect to Ollama service'));
    process.exit(1);
  }

} catch (error) {
  spinner.fail(chalk.red(`Failed to start Ollama: ${error.message}`));
  process.exit(1);
}