import fs from 'fs-extra';
import path from 'path';
import ConfigFileHandler from '../../../helper/file/config_file';

// Mock fs-extra
jest.mock('fs-extra');

describe('ConfigFileHandler', () => {
    const mockConfigPath = path.join(process.cwd(), 'config.json');
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
            // Mock successful file read
            fs.readJson.mockResolvedValue(validConfig);

            const result = await ConfigFileHandler.readConfigFile();

            expect(result.status).toBe(true);
            expect(result.content).toEqual(validConfig);
            expect(fs.readJson).toHaveBeenCalledWith(mockConfigPath);
        });

        it('should handle missing config file', async () => {
            // Mock file not found error
            fs.readJson.mockRejectedValue(new Error('ENOENT: no such file or directory'));

            const result = await ConfigFileHandler.readConfigFile();

            expect(result.status).toBe(false);
            expect(result.content).toBeNull();
            expect(result.message).toContain('ENOENT');
        });

        it('should handle invalid JSON in config file', async () => {
            // Mock JSON parse error
            fs.readJson.mockRejectedValue(new SyntaxError('Unexpected token'));

            const result = await ConfigFileHandler.readConfigFile();

            expect(result.status).toBe(false);
            expect(result.content).toBeNull();
            expect(result.message).toContain('Unexpected token');
        });

        it('should validate required settings section', async () => {
            // Mock config without settings
            const invalidConfig = {
                locations: validConfig.locations
            };
            fs.readJson.mockResolvedValue(invalidConfig);

            const result = await ConfigFileHandler.readConfigFile();

            expect(result.status).toBe(false);
            expect(result.content).toBeNull();
            expect(result.message).toContain('missing required settings section');
        });

        it('should validate required locations section', async () => {
            // Mock config without locations
            const invalidConfig = {
                settings: validConfig.settings
            };
            fs.readJson.mockResolvedValue(invalidConfig);

            const result = await ConfigFileHandler.readConfigFile();

            expect(result.status).toBe(false);
            expect(result.content).toBeNull();
            expect(result.message).toContain('missing required locations section');
        });

        it('should handle empty config file', async () => {
            // Mock empty config
            fs.readJson.mockResolvedValue(null);

            const result = await ConfigFileHandler.readConfigFile();

            expect(result.status).toBe(false);
            expect(result.content).toBeNull();
            expect(result.message).toContain('empty or invalid');
        });
    });

    describe('updateConfigFile', () => {
        it('should successfully update config file', async () => {
            // Mock successful read and write
            fs.readJson.mockResolvedValue(validConfig);
            fs.outputJson.mockResolvedValue();

            const updates = {
                settings: {
                    ...validConfig.settings,
                    devMode: true
                }
            };

            const result = await ConfigFileHandler.updateConfigFile(updates);

            expect(result.status).toBe(true);
            expect(fs.outputJson).toHaveBeenCalledWith(
                mockConfigPath,
                expect.objectContaining({
                    settings: expect.objectContaining({
                        devMode: true
                    })
                })
            );
        });

        it('should handle update failure', async () => {
            // Mock read success but write failure
            fs.readJson.mockResolvedValue(validConfig);
            fs.outputJson.mockRejectedValue(new Error('Write failed'));

            const result = await ConfigFileHandler.updateConfigFile({});

            expect(result.status).toBe(false);
            expect(result.message).toContain('Write failed');
        });
    });
});
