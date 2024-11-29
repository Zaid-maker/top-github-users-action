import path from 'path';
import file from '../../core/file';
import ReadConfigResponseModel from '../../model/config/ReadConfigResponseModel';

class ConfigFileHandler {
    static CONFIG_PATH = 'config.json';

    static async readConfigFile() {
        try {
            const response = await file.readJson(this.CONFIG_PATH);
            console.log(response.message);

            if (!response.status) {
                throw new Error(`Failed to read config file: ${response.message}`);
            }

            return new ReadConfigResponseModel(true, response.content);
        } catch (error) {
            console.error('Error reading config file:', error);
            return new ReadConfigResponseModel(false, null, error.message);
        }
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

            const response = await file.outputJson(this.CONFIG_PATH, updatedConfig);
            console.log(response.message);

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