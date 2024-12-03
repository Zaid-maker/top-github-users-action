import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ReadConfigResponseModel {
    constructor(status, content = null, error = null) {
        this.status = status;
        this.content = content;
        this.error = error;
    }
}

class ConfigFileHandler {
    static CONFIG_PATHS = [
        path.join(process.cwd(), 'config.json'),
        path.join(dirname(dirname(dirname(__dirname))), 'config.json'),
        path.join(dirname(dirname(dirname(__dirname))), 'dist/config.json')
    ];

    static validateConfig(config) {
        // Check if config is empty
        if (!config || Object.keys(config).length === 0) {
            throw new Error('Config file is empty');
        }

        // Check required sections
        if (!config.settings || typeof config.settings !== 'object') {
            throw new Error('Invalid config format: missing or invalid settings section');
        }

        if (!config.locations || !Array.isArray(config.locations)) {
            throw new Error('Invalid config format: missing or invalid locations section');
        }

        // Validate settings fields
        const requiredSettings = ['devMode', 'minUsersThreshold', 'maxErrorIterations', 'updateFrequency'];
        const missingSettings = requiredSettings.filter(field => !(field in config.settings));
        if (missingSettings.length > 0) {
            throw new Error(`Missing required settings fields: ${missingSettings.join(', ')}`);
        }

        return true;
    }

    static getDefaultConfig(config = {}) {
        return {
            $schema: "http://json-schema.org/draft-07/schema#",
            title: "GitHub Users Monitor Configuration",
            description: "Configuration for tracking top GitHub users by country",
            version: "2.0.0",
            ...config,
            lastUpdated: new Date().toISOString()
        };
    }

    static async readConfigFile() {
        for (const configPath of this.CONFIG_PATHS) {
            try {
                console.log(`Attempting to read config from: ${configPath}`);
                const config = await fs.readJson(configPath);

                // Validate the config
                try {
                    this.validateConfig(config);
                } catch (validationError) {
                    console.error(`Validation error for ${configPath}:`, validationError);
                    return new ReadConfigResponseModel(false, null, validationError);
                }

                console.log(`Successfully loaded config file from ${configPath}`);
                return new ReadConfigResponseModel(true, this.getDefaultConfig(config));
            } catch (error) {
                console.error(`Error reading config file from ${configPath}:`, error);
                
                // If it's not a file not found error, return immediately
                if (!error.message.includes('ENOENT')) {
                    return new ReadConfigResponseModel(false, null, error);
                }

                // If we've tried all paths, return the error
                if (configPath === this.CONFIG_PATHS[this.CONFIG_PATHS.length - 1]) {
                    return new ReadConfigResponseModel(false, null, new Error('Failed to read config file from any location'));
                }
            }
        }

        return new ReadConfigResponseModel(false, null, new Error('Failed to read config file'));
    }

    static async updateConfigFile(updates) {
        try {
            // Validate the updates
            try {
                this.validateConfig(updates);
            } catch (validationError) {
                return new ReadConfigResponseModel(false, null, validationError);
            }

            const configPath = this.CONFIG_PATHS[0];
            const updatedConfig = this.getDefaultConfig(updates);

            await fs.outputJson(configPath, updatedConfig, { spaces: 2 });
            console.log(`Config file updated at ${configPath}`);
            return new ReadConfigResponseModel(true, updatedConfig);
        } catch (error) {
            console.error('Error updating config file:', error);
            return new ReadConfigResponseModel(false, null, error);
        }
    }
}

export default ConfigFileHandler;