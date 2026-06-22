# uipro-cli

CLI to install UI/UX Pro Max skill for AI coding assistants.

## Installation

```bash
npm install -g uipro-cli
```

## Usage

```bash
# Install for specific AI assistant
uipro init --ai claude      # Claude Code
uipro init --ai cursor      # Cursor
uipro init --ai windsurf    # Windsurf
uipro init --ai antigravity # Antigravity
uipro init --ai copilot     # GitHub Copilot
uipro init --ai kiro        # Kiro
uipro init --ai codex       # Codex (Skills)
uipro init --ai roocode     # Roo Code
uipro init --ai qoder       # Qoder
uipro init --ai gemini      # Gemini CLI
uipro init --ai trae        # Trae
uipro init --ai opencode    # OpenCode
uipro init --ai continue    # Continue (Skills)
uipro init --ai all         # All assistants

# Options
uipro init --offline        # Skip GitHub download, use bundled assets only
uipro init --force          # Overwrite existing files

# Other commands
uipro versions              # List available versions
uipro update                # Update to latest version
```

## GitHub Authentication

GitHub's unauthenticated API allows 60 requests/hour per IP. If you hit rate limits, you can provide a GitHub Personal Access Token (PAT) to raise the limit to 5,000 requests/hour.

**Options (in order of precedence):**

```bash
# 1. Pass directly as a flag (one-off use)
uipro init --token ghp_yourtoken
uipro versions --token ghp_yourtoken
uipro update --token ghp_yourtoken

# 2. Set as a project-scoped environment variable (recommended)
export UI_PRO_MAX_GITHUB_TOKEN=ghp_yourtoken
uipro init

# 3. Fallback: GITHUB_TOKEN is also read if UI_PRO_MAX_GITHUB_TOKEN is not set
export GITHUB_TOKEN=ghp_yourtoken
uipro init
```

**Creating a token:** Go to <https://github.com/settings/tokens>, click **Generate new token (classic)**, and select **no scopes** — public repo access requires no permissions. Copy the token and store it as an environment secret; never hardcode it in source files.

> **Warning:** `GITHUB_TOKEN` is automatically injected by GitHub Actions with broad repo permissions. Prefer `UI_PRO_MAX_GITHUB_TOKEN` in CI to avoid accidentally attaching workflow credentials to release download requests.

## How It Works

By default, `uipro init` tries to download the latest release from GitHub to ensure you get the most up-to-date version. If the download fails (network error, rate limit), it automatically falls back to the bundled assets included in the CLI package.

Use `--offline` to skip the GitHub download and use bundled assets directly.

## Development

```bash
# Install dependencies
bun install

# Run locally
bun run src/index.ts --help

# Build
bun run build

# Link for local testing
bun link
```

## License

CC-BY-NC-4.0
