#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..', '..');

const SRC_DIR = join(repoRoot, 'src/ui-ux-pro-max/templates/platforms');
const ASSET_DIR = join(repoRoot, 'cli/assets/templates/platforms');
const REQUIRED_FRONTMATTER_PLATFORMS = new Set(['windsurf']);

async function readJson(path) {
  const raw = await readFile(path, 'utf8');
  return JSON.parse(raw);
}

function assertFrontmatterShape(config, path) {
  if (config.frontmatter == null) return;

  if (typeof config.frontmatter !== 'object') {
    throw new Error(`${path}: frontmatter must be an object or null`);
  }

  const { name, description } = config.frontmatter;
  if (typeof name !== 'string' || !name.trim()) {
    throw new Error(`${path}: frontmatter.name must be a non-empty string when frontmatter is present`);
  }
  if (typeof description !== 'string' || !description.trim()) {
    throw new Error(`${path}: frontmatter.description must be a non-empty string when frontmatter is present`);
  }
}

function assertRequiredFrontmatter(config, path) {
  if (!REQUIRED_FRONTMATTER_PLATFORMS.has(config.platform)) return;

  if (!config.frontmatter || typeof config.frontmatter !== 'object') {
    throw new Error(`${path}: frontmatter is required for ${config.platform} SKILL.md generation`);
  }

  const { name, description } = config.frontmatter;
  if (typeof name !== 'string' || !name.trim()) {
    throw new Error(`${path}: frontmatter.name must be a non-empty string for ${config.platform}`);
  }
  if (typeof description !== 'string' || !description.trim()) {
    throw new Error(`${path}: frontmatter.description must be a non-empty string for ${config.platform}`);
  }
}

const srcFiles = (await readdir(SRC_DIR)).filter(name => name.endsWith('.json')).sort();
const assetFiles = (await readdir(ASSET_DIR)).filter(name => name.endsWith('.json')).sort();

if (JSON.stringify(srcFiles) !== JSON.stringify(assetFiles)) {
  throw new Error('Platform template file lists differ between src and cli/assets');
}

for (const file of srcFiles) {
  const srcPath = join(SRC_DIR, file);
  const assetPath = join(ASSET_DIR, file);
  const src = await readJson(srcPath);
  const asset = await readJson(assetPath);

  assertFrontmatterShape(src, srcPath);
  assertFrontmatterShape(asset, assetPath);
  assertRequiredFrontmatter(src, srcPath);
  assertRequiredFrontmatter(asset, assetPath);

  if (JSON.stringify(src) !== JSON.stringify(asset)) {
    throw new Error(
      `Platform template mismatch for ${file} between src and cli/assets. Run: node cli/scripts/sync-assets.mjs`
    );
  }
}

console.log(`Platform template guard passed for ${srcFiles.length} files`);
