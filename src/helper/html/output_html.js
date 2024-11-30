import path from 'path';
import htmlFile from '../../helper/file/html_file';

class HtmlOutputHandler {
    static DOCS_DIR = 'docs';
    static HTML_FILE = 'index.html';
    static RANKING_FILE = 'ranking.json';

    static getPaths() {
        return {
            html: path.join(this.DOCS_DIR, this.HTML_FILE),
            ranking: path.join(this.DOCS_DIR, this.RANKING_FILE)
        };
    }

    static async saveHtmlFile(html) {
        try {
            const filePath = this.getPaths().html;
            await htmlFile.outputHtmlFile(filePath, html);
            console.log(`HTML file saved successfully at ${filePath}`);
            return true;
        } catch (error) {
            console.error('Error saving HTML file:', error);
            throw error;
        }
    }

    static async saveRankingFile(rankingData) {
        try {
            const filePath = this.getPaths().ranking;
            const jsonData = {
                lastUpdated: new Date().toISOString(),
                data: rankingData
            };

            await htmlFile.outputJsonFile(filePath, jsonData);
            console.log(`Ranking data saved successfully at ${filePath}`);
            return true;
        } catch (error) {
            console.error('Error saving ranking file:', error);
            throw error;
        }
    }

    static async updateRankingFile(newData) {
        try {
            const filePath = this.getPaths().ranking;
            const existingData = await htmlFile.readJsonFile(filePath).catch(() => ({ data: [] }));
            
            const updatedData = {
                lastUpdated: new Date().toISOString(),
                data: [...existingData.data, ...newData]
            };

            await htmlFile.outputJsonFile(filePath, updatedData);
            console.log(`Ranking data updated successfully at ${filePath}`);
            return true;
        } catch (error) {
            console.error('Error updating ranking file:', error);
            throw error;
        }
    }
}

export default HtmlOutputHandler;