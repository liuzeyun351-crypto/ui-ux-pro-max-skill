import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import type { Release } from '../types/index.js';

const REPO_OWNER = 'nextlevelbuilder';
const REPO_NAME = 'ui-ux-pro-max-skill';
const API_BASE = 'https://api.github.com';

export class GitHubRateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GitHubRateLimitError';
  }
}

export class GitHubDownloadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GitHubDownloadError';
  }
}

function checkRateLimit(response: Response): void {
  const remaining = response.headers.get('x-ratelimit-remaining');
  if (response.status === 403 && remaining === '0') {
    const resetTime = response.headers.get('x-ratelimit-reset');
    const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000).toLocaleTimeString() : 'unknown';
    throw new GitHubRateLimitError(`GitHub API rate limit exceeded. Resets at ${resetDate}`);
  }
  if (response.status === 429) {
    throw new GitHubRateLimitError('GitHub API rate limit exceeded (429 Too Many Requests)');
  }
}

export async function fetchReleases(): Promise<Release[]> {
  const url = `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/releases`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'uipro-cli',
    },
  });

  checkRateLimit(response);

  if (!response.ok) {
    throw new GitHubDownloadError(`Failed to fetch releases: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getLatestRelease(): Promise<Release> {
  const url = `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'uipro-cli',
    },
  });

  checkRateLimit(response);

  if (!response.ok) {
    throw new GitHubDownloadError(`Failed to fetch latest release: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function downloadRelease(url: string, dest: string, expectedSha256?: string): Promise<void> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'uipro-cli',
      'Accept': 'application/octet-stream',
    },
  });

  checkRateLimit(response);

  if (!response.ok) {
    throw new GitHubDownloadError(`Failed to download: ${response.status} ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();

  if (expectedSha256) {
    const actual = createHash('sha256').update(Buffer.from(buffer)).digest('hex');
    if (actual !== expectedSha256) {
      throw new GitHubDownloadError(
        `SHA-256 mismatch — download may be corrupted or tampered.
Expected: ${expectedSha256}
Actual:   ${actual}`
      );
    }
  }

  await writeFile(dest, Buffer.from(buffer));
}

export async function findChecksumAsset(release: Release, assetName: string): Promise<string | null> {
  const checksumNames = [`${assetName}.sha256`, 'checksums.sha256', 'SHA256SUMS'];
  const checksumAsset = release.assets.find(a => checksumNames.includes(a.name));
  if (!checksumAsset) return null;

  const response = await fetch(checksumAsset.browser_download_url, {
    headers: { 'User-Agent': 'uipro-cli' },
  });
  if (!response.ok) return null;

  const text = await response.text();
  // Format: "<hash>  <filename>" or just "<hash>"
  const match = text.trim().match(/^([0-9a-f]{64})/m);
  return match ? match[1] : null;
}

export function getAssetUrl(release: Release): string | null {
  // First try to find an uploaded ZIP asset
  const asset = release.assets.find(a => a.name.endsWith('.zip'));
  if (asset?.browser_download_url) {
    return asset.browser_download_url;
  }

  // Fall back to GitHub's auto-generated archive
  // Format: https://github.com/{owner}/{repo}/archive/refs/tags/{tag}.zip
  if (release.tag_name) {
    return `https://github.com/${REPO_OWNER}/${REPO_NAME}/archive/refs/tags/${release.tag_name}.zip`;
  }

  return null;
}
