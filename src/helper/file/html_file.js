import file from '../../core/file';

class HtmlFileHandler {
    static async outputHtmlFile(fileName, html) {
        try {
            const response = await file.outputOther(fileName, html);
            console.log(`HTML file saved: ${response.message}`);
            return response;
        } catch (error) {
            console.error(`Error writing HTML file ${fileName}:`, error);
            throw error;
        }
    }

    static async outputJsonFile(fileName, json) {
        try {
            const response = await file.outputJson(fileName, json);
            console.log(`JSON file saved: ${response.message}`);
            return response;
        } catch (error) {
            console.error(`Error writing JSON file ${fileName}:`, error);
            throw error;
        }
    }

    static async readJsonFile(fileName) {
        try {
            const response = await file.readJson(fileName);
            if (!response.status) {
                throw new Error(`Failed to read JSON file: ${response.message}`);
            }
            return response.content;
        } catch (error) {
            console.error(`Error reading JSON file ${fileName}:`, error);
            throw error;
        }
    }

    static async appendToHtmlFile(fileName, content) {
        try {
            const existingContent = await file.readOther(fileName).catch(() => '');
            const newContent = existingContent ? `${existingContent}\n${content}` : content;
            return await this.outputHtmlFile(fileName, newContent);
        } catch (error) {
            console.error(`Error appending to HTML file ${fileName}:`, error);
            throw error;
        }
    }
}

export default HtmlFileHandler;