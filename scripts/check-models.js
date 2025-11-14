#!/usr/bin/env node

import { execa } from 'execa';
import chalk from 'chalk';

async function checkInstalledModels() {
  console.log(chalk.blue('📋 Checking installed Ollama models...\n'));

  try {
    const { stdout } = await execa('ollama', ['list']);

    if (stdout.trim() === '') {
      console.log(chalk.yellow('No models installed.'));
      console.log(chalk.gray('Run `npm run download:models` to install some models.'));
      return;
    }

    console.log(chalk.green('Installed models:'));
    console.log(stdout);

    // Count models
    const lines = stdout.trim().split('\n');
    const modelCount = lines.length - 1; // Subtract header line
    console.log(chalk.gray(`\nTotal: ${modelCount} model(s) installed`));

  } catch (error) {
    console.error(chalk.red('Failed to check installed models:'), error.message);
    console.log(chalk.yellow('Make sure Ollama is installed and accessible.'));
    process.exit(1);
  }
}

async function main() {
  await checkInstalledModels();
}

main().catch(error => {
  console.error(chalk.red('Script failed:'), error.message);
  process.exit(1);
});