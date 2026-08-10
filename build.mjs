import { cpSync, existsSync, mkdirSync, rmSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const check = spawnSync(process.execPath, ['scripts/check-project.mjs'], { stdio: 'inherit' });
if (check.status !== 0) process.exit(check.status ?? 1);

const dist = resolve('dist');
if (existsSync(dist)) rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

copyFileSync('index.html', 'dist/index.html');
cpSync('public', 'dist', { recursive: true });

console.log('✓ Build Onyx créé dans dist/');
