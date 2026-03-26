import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootPkgPath = path.resolve(__dirname, '../package.json');

const rawData = fs.readFileSync(rootPkgPath, 'utf8');
const pkg = JSON.parse(rawData);

const currentVersion = pkg.version || '0.1.0';
const parts = currentVersion.split('.').map(Number);

// Basic Patch Bump: 0.1.0 -> 0.1.1
parts[2] += 1;
const nextVersion = parts.join('.');

pkg.version = nextVersion;

fs.writeFileSync(rootPkgPath, JSON.stringify(pkg, null, 2) + '\n');

console.log(`✅ Bumped version from ${currentVersion} to ${nextVersion}`);