import fs from 'fs-extra';
import OutputFileResponseModel from '../model/file/OutputFileResponseModel.js';
import ReadFileResponseModel from '../model/file/ReadFileResponseModel.js';

class FileHandler {
    static async outputJson(fileName, json) {
        try {
            await fs.outputJson(fileName, json);
            return new OutputFileResponseModel(true, `Json file has been updated at ${fileName}`);
        } catch (error) {
            console.error('Error writing JSON file:', error);
            return new OutputFileResponseModel(false, `Json file has not been updated at ${fileName}: ${error.message}`);
        }
    }

    static async outputOther(fileName, file) {
        try {
            await fs.outputFile(fileName, file);
            return new OutputFileResponseModel(true, `Other file has been updated at ${fileName}`);
        } catch (error) {
            console.error('Error writing file:', error);
            return new OutputFileResponseModel(false, `Other file has not been updated at ${fileName}: ${error.message}`);
        }
    }

    static async readJson(fileName) {
        try {
            const json = await fs.readJson(fileName);
            return new ReadFileResponseModel(true, `Json file has been read at ${fileName}`, json);
        } catch (error) {
            console.error('Error reading JSON file:', error);
            return new ReadFileResponseModel(false, `Json file has not been read at ${fileName}: ${error.message}`);
        }
    }
}

export default FileHandler;
