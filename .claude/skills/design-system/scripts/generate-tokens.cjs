#!/usr/bin/env node
/**
 * Generate CSS variables from design tokens JSON
 *
 * Usage:
 *   node generate-tokens.cjs --config tokens.json -o tokens.css
 *   node generate-tokens.cjs --config tokens.json --format tailwind
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    config: null,
    output: null,
    format: 'css' // css | tailwind
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--config' || args[i] === '-c') {
      options.config = args[++i];
    } else if (args[i] === '--output' || args[i] === '-o') {
      options.output = args[++i];
    } else if (args[i] === '--format' || args[i] === '-f') {
      options.format = args[++i];
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: node generate-tokens.cjs [options]

Options:
  -c, --config <file>   Input JSON token file (required)
  -o, --output <file>   Output file (default: stdout)
  -f, --format <type>   Output format: css | tailwind (default: css)
  -h, --help            Show this help
      `);
      process.exit(0);
    }
  }

  return options;
}

/**
 * Look up a single dotted path in the token tree
 */
function lookupPath(dotPath, tokens) {
  const parts = dotPath.split('.');
  let node = tokens;
  for (const key of parts) {
    node = node?.[key];
  }
  if (node?.$value !== undefined) {
    return resolveReference(node.$value, tokens);
  }
  return node;
}

/**
 * Resolve token references like {primitive.color.blue.600}
 * Handles both standalone references and inline references within strings
 */
function resolveReference(value, tokens) {
  if (typeof value !== 'string') return value;

  // Replace all {path.to.token} references within the string
  const resolved = value.replace(/\{([^}]+)\}/g, (match, refPath) => {
    const result = lookupPath(refPath, tokens);
    return result !== undefined ? result : match;
  });

  return resolved;
}

/**
 * Convert token name to CSS variable name
 */
function toCssVarName(path) {
  return '--' + path.join('-').replace(/\./g, '-');
}

/**
 * Flatten tokens into CSS variables
 */
function flattenTokens(obj, tokens, prefix = [], result = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...prefix, key];

    if (value && typeof value === 'object') {
      if (value.$value !== undefined) {
        // This is a token
        const cssVar = toCssVarName(currentPath);
        const resolvedValue = resolveReference(value.$value, tokens);
        result[cssVar] = resolvedValue;
      } else {
        // Recurse into nested object
        flattenTokens(value, tokens, currentPath, result);
      }
    }
  }

  return result;
}

/**
 * Unwrap root container if tokens are nested under a named key
 * (e.g. "andritz-precision" in the Andritz DTCG format)
 */
function unwrapRoot(tokens) {
  const keys = Object.keys(tokens).filter(k => !k.startsWith('$'));
  if (keys.length === 1 && typeof tokens[keys[0]] === 'object' && tokens[keys[0]].primitive) {
    return tokens[keys[0]];
  }
  return tokens;
}

/**
 * Generate CSS output
 */
function generateCSS(rawTokens) {
  const tokens = unwrapRoot(rawTokens);

  const primitive = flattenTokens(tokens.primitive || {}, tokens, ['primitive']);
  const semantic = flattenTokens(tokens.semantic || {}, tokens, []);
  const component = flattenTokens(tokens.component || {}, tokens, []);
  // Support both "dark.semantic" and "semantic-dark" layouts
  const darkSemantic = flattenTokens(
    tokens.dark?.semantic || tokens['semantic-dark'] || {},
    tokens,
    []
  );

  let css = `/* Andritz Precision — Design Tokens (Auto-generated) */
/* Do not edit directly — modify design-tokens-starter.json instead */

/* === PRIMITIVES === */
:root {
${Object.entries(primitive).map(([k, v]) => `  ${k}: ${v};`).join('\n')}
}

/* === SEMANTIC (Light Theme) === */
:root {
${Object.entries(semantic).map(([k, v]) => `  ${k}: ${v};`).join('\n')}
}

/* === COMPONENTS === */
:root {
${Object.entries(component).map(([k, v]) => `  ${k}: ${v};`).join('\n')}
}
`;

  if (Object.keys(darkSemantic).length > 0) {
    css += `
/* === SEMANTIC (Dark Theme) === */
.dark {
${Object.entries(darkSemantic).map(([k, v]) => `  ${k}: ${v};`).join('\n')}
}
`;
  }

  return css;
}

/**
 * Generate Tailwind config output
 */
function generateTailwind(rawTokens) {
  const tokens = unwrapRoot(rawTokens);
  const semantic = flattenTokens(tokens.semantic || {}, tokens, []);

  // Extract colors for Tailwind
  const colors = {};
  for (const [key, value] of Object.entries(semantic)) {
    if (key.includes('color')) {
      const name = key.replace('--color-', '').replace(/-/g, '.');
      colors[name] = `var(${key})`;
    }
  }

  return `// Tailwind color config - Auto-generated
// Add to tailwind.config.ts theme.extend.colors

module.exports = {
  colors: ${JSON.stringify(colors, null, 2).replace(/"/g, "'")}
};
`;
}

/**
 * Main
 */
function main() {
  const options = parseArgs();

  if (!options.config) {
    console.error('Error: --config is required');
    process.exit(1);
  }

  // Resolve config path
  const configPath = path.resolve(process.cwd(), options.config);

  if (!fs.existsSync(configPath)) {
    console.error(`Error: Config file not found: ${configPath}`);
    process.exit(1);
  }

  // Read and parse tokens
  const tokens = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  // Generate output
  let output;
  if (options.format === 'tailwind') {
    output = generateTailwind(tokens);
  } else {
    output = generateCSS(tokens);
  }

  // Write output
  if (options.output) {
    const outputPath = path.resolve(process.cwd(), options.output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, output);
    console.log(`Generated: ${outputPath}`);
  } else {
    console.log(output);
  }
}

main();
