#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { GitHubUsersMonitor } from '../src/index.js';

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock GitHub environment variables
process.env.GITHUB_REPOSITORY = 'zaidhafeeez/super-system';
process.env.CUSTOM_TOKEN = process.env.GITHUB_TOKEN; // Use your token from env

// Create test directories if they don't exist
const testDir = path.join(__dirname, '../test-run');
const dirs = ['cache', 'markdown', 'html'];

async function setup() {
    console.log('Setting up test environment...');
    
    // Create test directories
    await fs.ensureDir(testDir);
    for (const dir of dirs) {
        await fs.ensureDir(path.join(testDir, dir));
    }

    // Copy config.json to test directory if it doesn't exist
    const configSource = path.join(__dirname, '../config.json');
    const configTarget = path.join(testDir, 'config.json');
    
    if (!await fs.pathExists(configTarget)) {
        await fs.copy(configSource, configTarget);
    }

    // Create empty checkpoint.json if it doesn't exist
    const checkpointFile = path.join(testDir, 'checkpoint.json');
    if (!await fs.pathExists(checkpointFile)) {
        await fs.writeJson(checkpointFile, { checkpoint: 0 });
    }

    console.log('Test environment ready!');
}

async function cleanup() {
    console.log('Cleaning up test environment...');
    if (await fs.pathExists(testDir)) {
        await fs.remove(testDir);
    }
    console.log('Cleanup complete!');
}

async function run() {
    try {
        if (process.argv.includes('--clean')) {
            await cleanup();
            return;
        }

        await setup();
        
        // Set working directory to test directory
        process.chdir(testDir);
        
        console.log('Starting test run...');
        await GitHubUsersMonitor.run();
        console.log('Test run completed successfully!');
    } catch (error) {
        console.error('Error during test run:', error);
        process.exit(1);
    }
}

// Run the script
run();
