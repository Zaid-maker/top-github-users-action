import fs from 'fs-extra';
import path from 'path';
import ConfigFileHandler from '../../../helper/file/config_file';

// Mock fs-extra
jest.mock('fs-extra');

describe('ConfigFileHandler', () => {
    const mockConfigPaths = [
        path.join(process.cwd(), 'config.json'),
        path.join(__dirname, '../../../config.json'),
        path.join(__dirname, '../../../dist/config.json')
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
        ]
    };

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('readConfigFile', () => {
        it('should successfully read a valid config file', async () => {
            // Mock successful file read for first path
            fs.readJson.mockResolvedValueOnce(validConfig);

            const result = await ConfigFileHandler.readConfigFile();

            expect(result.status).toBe(true);
            expect(result.content).toEqual(validConfig);
            expect(fs.readJson).toHaveBeenCalledWith(mockConfigPaths[0]);
        });

        it('should handle missing config file', async () => {
            // Mock file not found error for all paths
            mockConfigPaths.forEach(() => {
                fs.readJson.mockRejectedValueOnce(new Error('ENOENT: no such file or directory'));
            });

            const result = await ConfigFileHandler.readConfigFile();

            expect(result.status).toBe(false);
            expect(result.content).toBeNull();
            expect(result.message).toContain('Failed to read config file from any location');
        });

        it('should handle invalid JSON in config file', async () => {
            // Mock JSON parse error for all paths
            mockConfigPaths.forEach(() => {
                fs.readJson.mockRejectedValueOnce(new SyntaxError('Unexpected token'));
            });

            const result = await ConfigFileHandler.readConfigFile();

            expect(result.status).toBe(false);
            expect(result.content).toBeNull();
            expect(result.message).toContain('Failed to read config file from any location');
        });

        it('should validate required settings section', async () => {
            // Mock config without settings for all paths
            const invalidConfig = {
                locations: validConfig.locations
            };
            mockConfigPaths.forEach(() => {
                fs.readJson.mockResolvedValueOnce(invalidConfig);
            });

            const result = await ConfigFileHandler.readConfigFile();

            expect(result.status).toBe(false);
            expect(result.content).toBeNull();
            expect(result.message).toContain('Failed to read config file from any location');
        });

        it('should validate required locations section', async () => {
            // Mock config without locations for all paths
            const invalidConfig = {
                settings: validConfig.settings
            };
            mockConfigPaths.forEach(() => {
                fs.readJson.mockResolvedValueOnce(invalidConfig);
            });

            const result = await ConfigFileHandler.readConfigFile();

            expect(result.status).toBe(false);
            expect(result.content).toBeNull();
            expect(result.message).toContain('Failed to read config file from any location');
        });

        it('should handle empty config file', async () => {
            // Mock empty config for all paths
            mockConfigPaths.forEach(() => {
                fs.readJson.mockResolvedValueOnce({});
            });

            const result = await ConfigFileHandler.readConfigFile();

            expect(result.status).toBe(false);
            expect(result.content).toBeNull();
            expect(result.message).toContain('Failed to read config file from any location');
        });
    });

    describe('updateConfigFile', () => {
        it('should successfully update config file', async () => {
            // Mock successful file read and write
            fs.readJson.mockResolvedValue(validConfig);
            fs.outputJson.mockResolvedValue();

            const updates = { settings: { devMode: true } };
            const result = await ConfigFileHandler.updateConfigFile(updates);

            expect(result.status).toBe(true);
            expect(result.content).toEqual(expect.objectContaining(updates));
        });

        it('should handle update failure', async () => {
            // Mock successful read but failed write
            fs.readJson.mockResolvedValue(validConfig);
            fs.outputJson.mockRejectedValue(new Error('Write failed'));

            const updates = { settings: { devMode: true } };
            const result = await ConfigFileHandler.updateConfigFile(updates);

            expect(result.status).toBe(false);
            expect(result.content).toBeNull();
            expect(result.message).toContain('Write failed');
        });
    });
});
