import fs from 'fs';
import path from 'path';
import os from 'os';
import { parse } from 'smol-toml';
import { execa } from 'execa';
import chalk from 'chalk';

async function bootstrap() {
  console.log(chalk.green.bold('\n--- 🌿 Freshn.io Sync Engine ---'));

  try {
    const configPath = './freshn.toml';
    if (!fs.existsSync(configPath)) {
        throw new Error('freshn.toml not found! Run the bootstrap script.');
    }

    const configData = fs.readFileSync(configPath, 'utf-8');
    const config = parse(configData);
    const HOME = os.homedir();

    console.log(chalk.dim(`Config: ${config.meta.name} (${config.meta.owner})`));

    // --- 1. Handle Brew Packages ---
    if (config.brew?.packages?.items) {
      console.log(chalk.blue('\n📦 Syncing Packages...'));
      for (const pkg of config.brew.packages.items) {
        try {
          await execa('brew', ['list', pkg]);
          console.log(chalk.green(`  ✅ ${pkg}`));
        } catch {
          process.stdout.write(chalk.yellow(`  📥 Installing ${pkg}... `));
          await execa('brew', ['install', pkg]);
          console.log(chalk.green('Done!'));
        }
      }
    }

    // --- 2. Handle Symlinks ---
    if (config.dotfiles) {
      console.log(chalk.blue('\n🔗 Syncing Dotfiles...'));
      for (const [targetName, sourceRelPath] of Object.entries(config.dotfiles)) {
        const targetPath = path.join(HOME, targetName);
        const sourcePath = path.resolve(sourceRelPath);

        if (fs.existsSync(targetPath)) {
          const stats = fs.lstatSync(targetPath);
          if (stats.isSymbolicLink()) continue;
          console.log(chalk.red(`  ⚠️  Skipped ${targetName} (Real file exists)`));
          continue;
        }

        fs.symlinkSync(sourcePath, targetPath);
        console.log(chalk.green(`  ✨ Linked ${targetName}`));
      }
    }

    console.log(chalk.green.bold('\n✨ System is Fresh.'));
  } catch (err) {
    console.error(chalk.red('\n❌ Freshn Error:'), err.message);
  }
}

bootstrap();
