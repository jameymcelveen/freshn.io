#!/bin/bash

# 1. Update Directory Structure
echo "📁 Transitioning to TypeScript structure..."
mkdir -p src bin configs

# 2. Install TypeScript dependencies
echo "📦 Adding TypeScript dev dependencies..."
pnpm add -D typescript @types/node tsx

# 3. Create tsconfig.json
cat <<EOF > tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
EOF

# 4. Update Package.json for TS
cat <<EOF > package.json
{
  "name": "freshn",
  "version": "0.1.0",
  "description": "Private workstation sync engine",
  "private": true,
  "type": "module",
  "bin": {
    "freshn": "./bin/freshn.js"
  },
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc",
    "fresh": "tsx src/index.ts"
  },
  "dependencies": {
    "smol-toml": "^1.1.0",
    "execa": "^8.0.1",
    "chalk": "^5.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0"
  }
}
EOF

# 5. Create the TypeScript Logic (src/index.ts)
cat <<EOF > src/index.ts
import fs from 'fs';
import path from 'path';
import os from 'os';
import { parse } from 'smol-toml';
import { execa } from 'execa';
import chalk from 'chalk';

// Define the Shape of our Config for Plugins/Packages
interface FreshnConfig {
  meta: {
    name: string;
    owner: string;
    last_sync?: string;
  };
  brew?: {
    packages?: { items: string[] };
    casks?: { items: string[] };
  };
  dotfiles?: Record<string, string>;
}

async function bootstrap() {
  console.log(chalk.green.bold('\n--- 🌿 Freshn.io (TS Engine) ---'));

  try {
    const configPath = path.resolve('./freshn.toml');
    const configData = fs.readFileSync(configPath, 'utf-8');
    const config = parse(configData) as unknown as FreshnConfig;
    const HOME = os.homedir();

    console.log(chalk.dim(\`Config: \${config.meta.name}\`));

    // --- Brew Logic ---
    if (config.brew?.packages?.items) {
      console.log(chalk.blue('\n📦 Syncing Packages...'));
      for (const pkg of config.brew.packages.items) {
        try {
          await execa('brew', ['list', pkg]);
          console.log(chalk.green(\`  ✅ \${pkg}\`));
        } catch {
          process.stdout.write(chalk.yellow(\`  📥 Installing \${pkg}... \`));
          await execa('brew', ['install', pkg]);
          console.log(chalk.green('Done!'));
        }
      }
    }

    // --- Symlink Logic ---
    if (config.dotfiles) {
      console.log(chalk.blue('\n🔗 Syncing Dotfiles...'));
      for (const [targetName, sourceRelPath] of Object.entries(config.dotfiles)) {
        const targetPath = path.join(HOME, targetName);
        const sourcePath = path.resolve(sourceRelPath);

        if (fs.existsSync(targetPath)) {
          if (fs.lstatSync(targetPath).isSymbolicLink()) continue;
          console.log(chalk.red(\`  ⚠️  Skipped \${targetName} (Real file)\`));
          continue;
        }

        fs.symlinkSync(sourcePath, targetPath);
        console.log(chalk.green(\`  ✨ Linked \${targetName}\`));
      }
    }

    console.log(chalk.green.bold('\n✨ System is Fresh.'));
  } catch (err: any) {
    console.error(chalk.red('\n❌ Freshn Error:'), err.message);
  }
}

bootstrap();
EOF

# 6. Create the "One-Click" install.sh (Put this in /public later)
cat <<EOF > install.sh
#!/bin/bash
# Freshn.io Remote Installer

echo "🌿 Starting Freshn.io Installation..."

# Check for Homebrew
if ! command -v brew &> /dev/null; then
    echo "🍺 Installing Homebrew..."
    /bin/bash -c "\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    curl -fsSL https://get.pnpm.io/install.sh | sh -
fi

# Clone and Run (assuming private repo access is set up via SSH)
if [ ! -d "\$HOME/.freshn" ]; then
    git clone git@github.com:jameymcelveen/freshn.io.git "\$HOME/.freshn"
fi

cd "\$HOME/.freshn"
pnpm install
pnpm fresh
EOF

echo "------------------------------------------------"
echo "🚀 TypeScript Migration Ready!"
echo "1. Run: pnpm install"
echo "2. Run: make fresh"
echo "------------------------------------------------"