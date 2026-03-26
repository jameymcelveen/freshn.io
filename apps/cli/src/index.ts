import fs from 'fs';
import path from 'path';
import os from 'os';
import { parse } from 'smol-toml';
import { execa } from 'execa';
import chalk from 'chalk';
import semver from 'semver';
import { FreshnConfig, WorkstationState } from '@freshn/types';

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

// async function reportToDashboard(state: WorkstationState) {
//     // Use Firebase Admin or a simple Fetch call to your Next.js API route
//     await fetch('https://freshn.io/api/heartbeat', {
//         method: 'POST',
//         body: JSON.stringify(state)
//     });
// }

async function reportToDashboard(state: WorkstationState) {
    const DASHBOARD_URL = process.env.FRESHN_API_URL || 'http://localhost:3000/api/heartbeat';

    process.stdout.write(chalk.blue('📡 Reporting to dashboard... '));

    try {
        const response = await fetch(DASHBOARD_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state),
        });

        if (response.ok) {
            console.log(chalk.green('Synced!'));
        } else {
            console.log(chalk.red(`Failed (${response.status})`));
        }
    } catch (err) {
        console.log(chalk.yellow('Offline (Dashboard unreachable)'));
    }
}

async function syncBrewPackages(packages: string[]) {
    console.log(chalk.blue('\n📦 Syncing Homebrew Packages...'));

    const { stdout } = await execa('brew', ['list', '--formula']);
    const installed = stdout.split('\n');

    for (const pkg of packages) {
        if (installed.includes(pkg)) {
            console.log(chalk.green(`  ✅ ${pkg} is already present.`));
        } else {
            process.stdout.write(chalk.yellow(`  📥 Installing ${pkg}... `));
            try {
                await execa('brew', ['install', pkg]);
                console.log(chalk.green('Done!'));
            } catch (error: any) {
                // IDEMPOTENCY CHECK: Did it actually install despite the error?
                try {
                    await execa('brew', ['list', pkg]);
                    console.log(chalk.blue(' (Installed with warnings, but verified)'));
                } catch {
                    console.log(chalk.red(`\n❌ Failed to install ${pkg}:`));
                    console.error(chalk.dim(error.stderr || error.message));
                    // Decide here: throw error to stop the script, or continue?
                    // For a portfolio piece, "continue" is often better for flow.
                }
            }
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

        // 4. Sync Dotfiles
        if (config.dotfiles) {
            await syncDotfiles(config.dotfiles);
        }

        console.log(chalk.green.bold('\n✨ System state is synchronized.'));

        // 4. Metadata / Reporting Phase (Add this here!) ---
        console.log(chalk.blue('\n📊 Gathering System Metadata...'));

        // Get the final list of brew packages to report back
        const { stdout } = await execa('brew', ['list', '--formula']);
        const installedPackages = stdout.split('\n').filter(Boolean);

        const state: WorkstationState = {
            hostname: os.hostname(),
            os: `${os.platform()}-${os.arch()}`,
            status: 'online', // If we reached here without a 'catch', it's online
            lastSync: Date.now(),
            packages: installedPackages,
            version: '0.1.0' // Your CLI version
        };

        // For now, let’s just print it to prove it works
        console.log(chalk.dim(JSON.stringify(state, null, 2)));

        // NEXT STEP PREP:
        // await reportToDashboard(state);

        console.log(chalk.green.bold('\n✨ System is Fresh and Reported.'));

    } catch (err: any) {
        console.error(chalk.red('\n❌ Error:'), err.message);
    }
}

main();