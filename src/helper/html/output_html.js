import path from 'path';
import htmlFile from '../../helper/file/html_file.js';

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
            console.error(`Error saving HTML file: ${error.message}`);
            return false;
        }
    }

    static async saveRankingFile(data) {
        try {
            const filePath = this.getPaths().ranking;
            await htmlFile.outputJsonFile(filePath, data);
            console.log(`Ranking file saved successfully at ${filePath}`);
            return true;
        } catch (error) {
            console.error(`Error saving ranking file: ${error.message}`);
            return false;
        }
    }

    static async create(outputHtmlModel) {
        try {
            const htmlContent = this.generateHtml(outputHtmlModel);
            await this.saveHtmlFile(htmlContent);
            await this.saveRankingFile(outputHtmlModel);
            return true;
        } catch (error) {
            console.error(`Error creating HTML output: ${error.message}`);
            return false;
        }
    }

    static generateHtml(data) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Users Ranking</title>
</head>
<body>
    <h1>GitHub Users Ranking</h1>
    <pre>${JSON.stringify(data, null, 2)}</pre>
</body>
</html>`;
    }
}

export { HtmlOutputHandler as createHtmlFile };
export default HtmlOutputHandler;