#!/usr/bin/env node

import { cp, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliRoot = join(__dirname, '..');
const repoRoot = join(cliRoot, '..');

const SYNC_TARGETS = [
  ['src/ui-ux-pro-max/templates/platforms', 'cli/assets/templates/platforms'],
];

for (const [fromRel, toRel] of SYNC_TARGETS) {
  const from = join(repoRoot, fromRel);
  const to = join(repoRoot, toRel);

  await mkdir(dirname(to), { recursive: true });
  await cp(from, to, { recursive: true, force: true });
}

console.log('Synced platform templates from src to cli/assets');
