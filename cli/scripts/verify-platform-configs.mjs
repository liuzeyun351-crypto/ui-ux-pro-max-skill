import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliRoot = join(__dirname, '..');

async function readJSON(path) {
  const raw = await readFile(path, 'utf-8');
  return JSON.parse(raw);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function verifyAITypeCoverage() {
  const typesPath = join(cliRoot, 'src', 'types', 'index.ts');
  const content = await readFile(typesPath, 'utf-8');
  assert(content.includes("'trae'"), "AI type 'trae' is missing in cli/src/types/index.ts");
  assert(content.includes("'droid'"), "AI type 'droid' is missing in cli/src/types/index.ts");
}

async function verifyFrontmatter(platform) {
  const configPath = join(cliRoot, 'assets', 'templates', 'platforms', `${platform}.json`);
  const config = await readJSON(configPath);
  assert(config.frontmatter && typeof config.frontmatter === 'object', `${platform} frontmatter is missing`);
  assert(typeof config.frontmatter.name === 'string' && config.frontmatter.name.length > 0, `${platform} frontmatter.name is missing`);
  assert(typeof config.frontmatter.description === 'string' && config.frontmatter.description.length > 0, `${platform} frontmatter.description is missing`);
}

async function main() {
  await verifyAITypeCoverage();
  await verifyFrontmatter('roocode');
  await verifyFrontmatter('kiro');
  console.log('Platform config verification passed (trae/droid + roocode/kiro frontmatter).');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
