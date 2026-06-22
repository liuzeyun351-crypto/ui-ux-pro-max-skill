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

const MAX_DOWNLOAD_SIZE = 50 * 1024 * 1024; // 50MB

export async function downloadRelease(url: string, dest: string): Promise<void> {
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

  const contentLength = parseInt(response.headers.get('content-length') || '0');
  if (contentLength > MAX_DOWNLOAD_SIZE) {
    throw new GitHubDownloadError(`Download too large: ${contentLength} bytes exceeds ${MAX_DOWNLOAD_SIZE} byte limit`);
  }

  const buffer = await response.arrayBuffer();
  if (buffer.byteLength > MAX_DOWNLOAD_SIZE) {
    throw new GitHubDownloadError(`Download too large: ${buffer.byteLength} bytes exceeds ${MAX_DOWNLOAD_SIZE} byte limit`);
  }

  await writeFile(dest, Buffer.from(buffer));
}

export function getAssetUrl(release: Release): string | null {
  // First try to find an uploaded ZIP asset
  const asset = release.assets.find(a => a.name.endsWith('.zip'));
  if (asset?.browser_download_url) {
    return asset.browser_download_url;
  }

  // Fall back to GitHub's auto-generated archive
  // Format: https://github.com/{owner}/{repo}/archive/refs/tags/{tag}.zip
  if (release.tag_name && /^v?\d+\.\d+\.\d+/.test(release.tag_name)) {
    return `https://github.com/${REPO_OWNER}/${REPO_NAME}/archive/refs/tags/${release.tag_name}.zip`;
  }

  return null;
}
