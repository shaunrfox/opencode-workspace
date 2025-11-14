#!/usr/bin/env node

import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import inquirer from 'inquirer';

const AVAILABLE_MODELS = [
  {
    name: "qwen2.5-coder:7b (Primary coding model - 4.7GB)",
    value: "qwen2.5-coder:7b",
    short: "qwen2.5-coder:7b"
  },
  {
    name: "deepseek-coder-v2:16b (Fast iteration - 9GB)",
    value: "deepseek-coder-v2:16b",
    short: "deepseek-coder-v2:16b"
  },
  {
    name: "llama3.1 (Tool calling specialist - 4.9GB)",
    value: "llama3.1",
    short: "llama3.1"
  }
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
  console.log(chalk.blue('🤖 OpenCode Model Downloader'));
  console.log(chalk.gray('Select the models you want to download:\n'));

  const { selectedModels } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedModels',
      message: 'Which models would you like to download?',
      choices: AVAILABLE_MODELS,
      default: AVAILABLE_MODELS.map(model => model.value),
      pageSize: 10,
      validate: (answer) => {
        if (answer.length < 1) {
          return 'You must choose at least one model.';
        }
        return true;
      }
    }
  ]);

  if (selectedModels.length === 0) {
    console.log(chalk.yellow('No models selected. Exiting.'));
    return;
  }

  console.log(chalk.blue(`\n📥 Downloading ${selectedModels.length} model(s)...\n`));

  for (const model of selectedModels) {
    try {
      await downloadModel(model);
    } catch (error) {
      // Continue with other models even if one fails
      console.log(chalk.yellow(`Continuing with next model...\n`));
    }
  }

  console.log(chalk.blue('\n✅ Download complete. Models available:'));
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