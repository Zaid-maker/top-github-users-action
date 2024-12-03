import { jest } from '@jest/globals';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import ConfigFileHandler from '../../../helper/file/config_file.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create mock functions
const mockReadJson = jest.fn();
const mockOutputJson = jest.fn();

// Mock fs-extra
jest.mock('fs-extra', () => ({
    readJson: (...args) => mockReadJson(...args),
    outputJson: (...args) => mockOutputJson(...args)
}));

// Import fs-extra after mocking
import fs from 'fs-extra';

describe('ConfigFileHandler', () => {
    const mockConfigPaths = [
        join(process.cwd(), 'config.json'),
        join(dirname(dirname(dirname(__dirname))), 'config.json'),
        join(dirname(dirname(dirname(__dirname))), 'dist/config.json')
    ];
    
    const validConfig = {
        settings: {
            devMode: false,
            minUsersThreshold: 750,
            maxErrorIterations: 4,
            updateFrequency: "daily"
        },
        locations: [
            {
                country: "test-country",
                geoName: "test-geo",
                cities: ["city1", "city2"],
                imageUrl: "https://example.com/flag.svg"
            }
        ],
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "GitHub Users Monitor Configuration",
        description: "Configuration for tracking top GitHub users by country",
        version: "2.0.0",
        lastUpdated: expect.any(String)
    };

    beforeEach(() => {
        // Clear all mocks before each test
        mockReadJson.mockReset();
        mockOutputJson.mockReset();
    });

    describe('readConfigFile', () => {
        it('should successfully read a valid config file', async () => {
            // Mock successful file read for first path
            const mockConfig = {
                settings: validConfig.settings,
                locations: validConfig.locations
            };
            mockReadJson.mockResolvedValueOnce(mockConfig);

            const result = await ConfigFileHandler.readConfigFile();

            expect(result.status).toBe(true);
            expect(result.content).toEqual(validConfig);
            expect(mockReadJson).toHaveBeenCalledWith(mockConfigPaths[0]);
        });

        it('should handle missing config file', async () => {
            // Mock file not found error for all paths
            const enoentError = new Error('ENOENT: no such file or directory');
            mockConfigPaths.forEach(() => {
                mockReadJson.mockRejectedValueOnce(enoentError);
            });

            const result = await ConfigFileHandler.readConfigFile();

            expect(result.status).toBe(false);
            expect(result.error).toBeDefined();
            expect(result.error.message).toBe('Failed to read config file from any location');
            expect(mockReadJson).toHaveBeenCalledTimes(mockConfigPaths.length);
        });

        it('should handle invalid JSON in config file', async () => {
            // Mock JSON parse error
            const parseError = new SyntaxError('Unexpected token');
            mockReadJson.mockRejectedValueOnce(parseError);

            const result = await ConfigFileHandler.readConfigFile();

            expect(result.status).toBe(false);
            expect(result.error).toBe(parseError);
            expect(mockReadJson).toHaveBeenCalledWith(mockConfigPaths[0]);
        });

        it('should validate required settings section', async () => {
            // Mock config without settings
            mockReadJson.mockResolvedValueOnce({
                locations: validConfig.locations
            });

            const result = await ConfigFileHandler.readConfigFile();

            expect(result.status).toBe(false);
            expect(result.error).toBeDefined();
            expect(result.error.message).toContain('missing or invalid settings section');
            expect(mockReadJson).toHaveBeenCalledWith(mockConfigPaths[0]);
        });

        it('should validate required locations section', async () => {
            // Mock config without locations
            mockReadJson.mockResolvedValueOnce({
                settings: validConfig.settings
            });

            const result = await ConfigFileHandler.readConfigFile();

            expect(result.status).toBe(false);
            expect(result.error).toBeDefined();
            expect(result.error.message).toContain('missing or invalid locations section');
            expect(mockReadJson).toHaveBeenCalledWith(mockConfigPaths[0]);
        });

        it('should handle empty config file', async () => {
            // Mock empty config
            mockReadJson.mockResolvedValueOnce({});

            const result = await ConfigFileHandler.readConfigFile();

            expect(result.status).toBe(false);
            expect(result.error).toBeDefined();
            expect(result.error.message).toBe('Config file is empty');
            expect(mockReadJson).toHaveBeenCalledWith(mockConfigPaths[0]);
        });
    });

    describe('updateConfigFile', () => {
        it('should successfully update config file', async () => {
            // Mock successful file write
            mockOutputJson.mockResolvedValueOnce();

            const result = await ConfigFileHandler.updateConfigFile(validConfig);

            expect(result.status).toBe(true);
            expect(mockOutputJson).toHaveBeenCalledWith(
                mockConfigPaths[0],
                {
                    ...validConfig,
                    $schema: "http://json-schema.org/draft-07/schema#",
                    title: "GitHub Users Monitor Configuration",
                    description: "Configuration for tracking top GitHub users by country",
                    version: "2.0.0",
                    lastUpdated: expect.any(String)
                },
                { spaces: 2 }
            );
        });

        it('should handle write errors', async () => {
            const writeError = new Error('Write failed');
            mockOutputJson.mockRejectedValueOnce(writeError);

            const result = await ConfigFileHandler.updateConfigFile(validConfig);

            expect(result.status).toBe(false);
            expect(result.error).toBe(writeError);
        });
    });
});
