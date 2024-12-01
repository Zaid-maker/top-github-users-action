import path from 'path';
import markdownFile from '../../helper/file/markdown_file.js';

class MarkdownOutputHandler {
    static formatCountryName(country) {
        return country.replace(/\s/g, '_').toLowerCase();
    }

    static getFilePaths() {
        return {
            index: 'README.md',
            publicContributions: country => path.join('markdown', 'public_contributions', `${this.formatCountryName(country)}.md`),
            totalContributions: country => path.join('markdown', 'total_contributions', `${this.formatCountryName(country)}.md`),
            followers: country => path.join('markdown', 'followers', `${this.formatCountryName(country)}.md`)
        };
    }

    static async saveMarkdownFile(filePath, content) {
        try {
            await markdownFile.outputMarkdownFile(filePath, content);
        } catch (error) {
            console.error(`Error saving markdown file ${filePath}:`, error);
            throw error;
        }
    }

    static async saveIndexMarkdown(markdown) {
        const filePath = this.getFilePaths().index;
        await this.saveMarkdownFile(filePath, markdown);
    }

    static async savePublicContributionsMarkdown(country, markdown) {
        const filePath = this.getFilePaths().publicContributions(country);
        await this.saveMarkdownFile(filePath, markdown);
    }

    static async saveTotalContributionsMarkdown(country, markdown) {
        const filePath = this.getFilePaths().totalContributions(country);
        await this.saveMarkdownFile(filePath, markdown);
    }

    static async saveFollowersMarkdown(country, markdown) {
        const filePath = this.getFilePaths().followers(country);
        await this.saveMarkdownFile(filePath, markdown);
    }
}

export default MarkdownOutputHandler;