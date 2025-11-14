#!/usr/bin/env node

import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import { platform } from 'os';

async function installOllama() {
  const spinner = ora('Installing Ollama...').start();

  try {
    // Detect platform and use appropriate installation method
    const currentPlatform = platform();

    if (currentPlatform === 'darwin') {
      // macOS - use Homebrew
      spinner.text = 'Installing Ollama via Homebrew...';
      await execa('brew', ['install', 'ollama']);
    } else if (currentPlatform === 'linux') {
      // Linux - use official install script
      spinner.text = 'Installing Ollama via official script...';
      await execa('curl', ['-fsSL', 'https://ollama.ai/install.sh', '|', 'sh'], {
        shell: true
      });
    } else {
      throw new Error(`Unsupported platform: ${currentPlatform}. Please install Ollama manually from https://ollama.ai`);
    }

    spinner.succeed(chalk.green('Ollama installed successfully'));

    // Verify installation
    spinner.text = 'Verifying installation...';
    const { stdout } = await execa('ollama', ['--version']);
    spinner.succeed(chalk.green(`Ollama ${stdout.trim()} is ready`));

  } catch (error) {
    spinner.fail(chalk.red(`Failed to install Ollama: ${error.message}`));
    console.log('');
    console.log(chalk.yellow('Please install Ollama manually:'));
    console.log(chalk.cyan('  macOS: brew install ollama'));
    console.log(chalk.cyan('  Linux: curl -fsSL https://ollama.ai/install.sh | sh'));
    console.log(chalk.cyan('  Other: Visit https://ollama.ai'));
    process.exit(1);
  }
}

async function main() {
  console.log(chalk.blue('🔧 Ollama Installation'));
  console.log(chalk.gray('This will install Ollama on your system.\n'));

  // Check if Ollama is already installed
  try {
    const { stdout } = await execa('ollama', ['--version']);
    console.log(chalk.green(`✓ Ollama is already installed (${stdout.trim()})`));
    return;
  } catch (error) {
    // Ollama not installed, proceed with installation
  }

  await installOllama();
}

main().catch(error => {
  console.error(chalk.red('Installation failed:'), error.message);
  process.exit(1);
});