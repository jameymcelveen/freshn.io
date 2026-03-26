import fs from 'fs';
import path from 'path';
import os from 'os';
import { parse } from 'smol-toml';
import { execa } from 'execa';
import chalk from 'chalk';
import semver from 'semver';

interface FreshnConfig {
    meta: {
        name: string;
        owner: string;
        node_version?: string;
    };
    brew?: {
        packages?: { items: string[] };
        casks?: { items: string[] };
    };
    dotfiles?: Record<string, string>;
}

const isDryRun = process.argv.includes('--dry-run');

async function syncBrewPackages(packages: string[]) {
    console.log(chalk.blue('\n📦 Syncing Homebrew Packages...'));

    // Get list of already installed packages once to save time
    const { stdout } = await execa('brew', ['list', '--formula']);
    const installed = stdout.split('\n');

    for (const pkg of packages) {
        if (installed.includes(pkg)) {
            console.log(chalk.green(`  ✅ ${pkg} is already present.`));
        } else {
            if (!isDryRun) {
                process.stdout.write(chalk.yellow(`  📥 Installing ${pkg}... `));
                await execa('brew', ['install', pkg]);
            } else {
                console.log(chalk.dim(`  [Dry Run] 📥 Would install ${pkg}`));
            }
            console.log(chalk.green('Done!'));
        }
    }
}

async function syncDotfiles(dotfiles: Record<string, string>) {
    console.log(chalk.blue('\n🔗 Syncing Dotfiles...'));
    const HOME = os.homedir();

    for (const [targetName, sourceRelPath] of Object.entries(dotfiles)) {
        const targetPath = path.join(HOME, targetName);
        const sourcePath = path.resolve(sourceRelPath);

        // 1. Check if the target exists
        if (fs.existsSync(targetPath)) {
            const stats = fs.lstatSync(targetPath);

            // 2. Idempotency Check: Is it already a symlink pointing to the right place?
            if (stats.isSymbolicLink()) {
                const existingTarget = fs.readlinkSync(targetPath);
                if (existingTarget === sourcePath) {
                    console.log(chalk.green(`  ✅ ${targetName} is correctly linked.`));
                    continue;
                } else {
                    if (!isDryRun) {
                        console.log(chalk.yellow(`  🔄 ${targetName} points elsewhere. Re-linking...`));
                        fs.unlinkSync(targetPath);
                    } else {
                        console.log(chalk.dim(`  [Dry Run] 🔄 ${targetName} points elsewhere. Would Re-link...`));
                    }
                }
            } else {
                // It's a real file - safety first, don't overwrite
                console.log(chalk.red(`  ⚠️  Skipped ${targetName}: A real file exists at this path.`));
                continue;
            }
        }

        // 3. Action: Create the link
        if (!isDryRun) {
            fs.symlinkSync(sourcePath, targetPath);
            console.log(chalk.green(`  ✨ Linked ${targetName}`));
        } else {
            console.log(chalk.dim(`  [Dry Run] ✨ Would link ${targetName}`));
        }
    }
}
async function validateEnvironment(requiredVersion?: string) {
    const currentVersion = process.version;
    if (requiredVersion && !semver.satisfies(currentVersion, requiredVersion)) {
        console.error(chalk.red(`❌ Environment Error: Node.js version ${requiredVersion} is required.`));
        console.error(chalk.yellow(`   Current version: ${currentVersion}`));
        process.exit(1);
    }
    console.log(chalk.dim(`✓ Environment Check: Node ${currentVersion}`));
}

// ... syncBrewPackages and syncDotfiles remain the same ...

async function main() {
    console.log(chalk.green.bold('\n--- 🌿 Freshn.io (Idempotent Mode) ---'));

    if (isDryRun) {
        console.log(chalk.magenta('🔍 DRY RUN MODE: No changes will be made to your system.'));
    }

    try {
        const configData = fs.readFileSync('./freshn.toml', 'utf-8');
        const config = parse(configData) as unknown as FreshnConfig;

        // 1. Validate Node version before doing anything
        await validateEnvironment(config.meta.node_version);

        // 2. Sync Brew
        if (config.brew?.packages?.items) {
            await syncBrewPackages(config.brew.packages.items);
        }

        // 3. Sync Dotfiles
        if (config.dotfiles) {
            await syncDotfiles(config.dotfiles);
        }

        console.log(chalk.green.bold('\n✨ System state is synchronized.'));
    } catch (err: any) {
        console.error(chalk.red('\n❌ Error:'), err.message);
    }
}

main();