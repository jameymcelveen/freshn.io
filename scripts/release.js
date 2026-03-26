import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });
const get = (cmd) => execSync(cmd).toString().trim();

function verifyEnvironment() {
    console.log('🔍 Checking Environment...');

    // 1. Verify .npmrc exists (for Vercel/pnpm stability)
    if (!fs.existsSync('.npmrc')) {
        console.error('❌ Error: .npmrc is missing. Vercel builds will fail.');
        process.exit(1);
    }

    // 2. Verify Node version is 20.x (LTS)
    const nodeVersion = process.version;
    if (!nodeVersion.startsWith('v20')) {
        console.warn(`⚠️  Warning: You are on Node ${nodeVersion}. Vercel is set to 20.x.`);
    }

    // 3. Check for GH CLI
    try {
        get('gh --version');
    } catch {
        console.error('❌ Error: GitHub CLI (gh) is not installed. Run: brew install gh');
        process.exit(1);
    }
}

try {
    verifyEnvironment();

    // ... rest of your release logic (branch check, bump, build, tag, push, pr)
} catch (error) {
    console.error('\n💥 Release failed:', error.message);
    process.exit(1);
}