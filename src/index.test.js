import { jest } from '@jest/globals';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';
import { GitHubUsersMonitor } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('GitHubUsersMonitor', () => {
  test('class can be instantiated', () => {
    const monitor = new GitHubUsersMonitor();
    expect(monitor).toBeInstanceOf(GitHubUsersMonitor);
  });

  test('main process executes without error', async () => {
    const ip = join(__dirname, 'index.js');
    const result = execSync(`node ${ip}`, {
      env: {
        ...process.env,
        NODE_ENV: 'test'
      }
    }).toString();
    expect(result).toBeTruthy();
  });
});
