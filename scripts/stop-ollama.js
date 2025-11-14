#!/usr/bin/env node

import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';

const spinner = ora('Stopping Ollama service...').start();

try {
  // Check if Ollama is running
  const { stdout: psOutput } = await execa('ps', ['aux']);
  const isRunning = psOutput.includes('ollama serve');

  if (!isRunning) {
    spinner.info(chalk.yellow('Ollama service is not running'));
    process.exit(0);
  }

  // Stop Ollama service
  await execa('pkill', ['-f', 'ollama serve']);

  // Give it a moment to stop
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Verify it's stopped
  try {
    await fetch('http://localhost:11434/api/tags', { timeout: 1000 });
    spinner.fail(chalk.red('Ollama service is still running'));
    process.exit(1);
  } catch (error) {
    spinner.succeed(chalk.green('Ollama service stopped successfully'));
  }

} catch (error) {
  spinner.fail(chalk.red(`Failed to stop Ollama: ${error.message}`));
  process.exit(1);
}