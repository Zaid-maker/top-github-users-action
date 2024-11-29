import file from '../../core/file';

class MarkdownFileHandler {
    static async outputMarkdownFile(fileName, markdown) {
        try {
            const response = await file.outputOther(fileName, markdown);
            console.log(response.message);
            return response;
        } catch (error) {
            console.error(`Error writing markdown file ${fileName}:`, error);
            throw error;
        }
    }

    static async appendToMarkdownFile(fileName, content) {
        try {
            const existingContent = await file.readJson(fileName).catch(() => '');
            const newContent = existingContent ? `${existingContent}\n${content}` : content;
            return await this.outputMarkdownFile(fileName, newContent);
        } catch (error) {
            console.error(`Error appending to markdown file ${fileName}:`, error);
            throw error;
        }
    }
}

export default MarkdownFileHandler;