import path from 'path';
import file from '../../core/file.js';
import ReadConfigResponseModel from '../../model/config/ReadConfigResponseModel.js';

class ConfigFileHandler {
    static CONFIG_PATHS = [
        path.join(process.cwd(), 'config.json'),
        path.join(__dirname, '../../../config.json'),
        path.join(__dirname, '../../../dist/config.json')
    ];

    static async readConfigFile() {
        let lastError = null;

        for (const configPath of this.CONFIG_PATHS) {
            try {
                console.log(`Attempting to read config from: ${configPath}`);
                const response = await file.readJson(configPath);
                
                if (!response.status) {
                    console.error(`Config file read failed at ${configPath}: ${response.message}`);
                    continue;
                }

                if (!response.content) {
                    console.error(`Config file is empty or invalid at ${configPath}`);
                    continue;
                }

                if (!response.content.settings) {
                    console.error(`Config file missing required settings section at ${configPath}`);
                    continue;
                }

                if (!response.content.locations) {
                    console.error(`Config file missing required locations section at ${configPath}`);
                    continue;
                }

                console.log(`Successfully loaded config file from ${configPath}`);
                return new ReadConfigResponseModel(true, response.content);
            } catch (error) {
                console.error(`Error reading config file from ${configPath}:`, error);
                lastError = error;
            }
        }

        return new ReadConfigResponseModel(false, null, lastError ? lastError.message : 'Failed to read config file from any location');
    }

    static async updateConfigFile(updates) {
        try {
            const currentConfig = await this.readConfigFile();
            if (!currentConfig.status) {
                throw new Error('Failed to read existing config');
            }

            const updatedConfig = {
                ...currentConfig.content,
                ...updates,
                lastUpdated: new Date().toISOString()
            };

            const response = await file.outputJson(this.CONFIG_PATHS[0], updatedConfig);
            console.log(response.message);
            
            if (!response.status) {
                throw new Error(response.message);
            }

            return new ReadConfigResponseModel(true, updatedConfig);
        } catch (error) {
            console.error('Error updating config file:', error);
            return new ReadConfigResponseModel(false, null, error.message);
        }
    }

    static validateConfig(config) {
        const requiredFields = ['locations'];
        const missingFields = requiredFields.filter(field => !(field in config));
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields in config: ${missingFields.join(', ')}`);
        }

        return true;
    }
}

export default ConfigFileHandler;