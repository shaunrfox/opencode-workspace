#!/usr/bin/env node

import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';

const MODELS = [
  "qwen2.5-coder:7b",
  "deepseek-coder-v2:16b",
  "llama3.1"
];

async function downloadModel(model) {
  const spinner = ora(`Downloading ${model}...`).start();

  try {
    await execa('ollama', ['pull', model], {
      stdio: 'inherit' // Show download progress
    });
    spinner.succeed(chalk.green(`✓ ${model} downloaded successfully`));
  } catch (error) {
    spinner.fail(chalk.red(`✗ ${model} download failed: ${error.message}`));
    throw error;
  }
}

async function main() {
  console.log(chalk.blue('Downloading models...'));

  for (const model of MODELS) {
    try {
      await downloadModel(model);
    } catch (error) {
      // Continue with other models even if one fails
      console.log(chalk.yellow(`Continuing with next model...`));
    }
  }

  console.log(chalk.blue('Download complete. Models available:'));
  try {
    const { stdout } = await execa('ollama', ['list']);
    console.log(stdout);
  } catch (error) {
    console.log(chalk.yellow('Could not list models'));
  }
}

main().catch(error => {
  console.error(chalk.red('Script failed:'), error.message);
  process.exit(1);
});