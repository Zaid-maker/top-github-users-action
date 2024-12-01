import fs from 'fs';
import path from 'path';
import { createIndexPage } from './page/create_index_page.js';
import { createPublicContributionsPage } from './page/create_public_contributions_page.js';
import { createTotalContributionsPage } from './page/create_total_contributions_page.js';
import { createFollowersPage } from './page/create_followers_page.js';

class OutputMarkdownHandler {
    static async create(outputMarkdownModel) {
        try {
            // Create index page
            const indexPagePath = path.join('markdown', 'index.md');
            await fs.promises.mkdir(path.dirname(indexPagePath), { recursive: true });
            await fs.promises.writeFile(indexPagePath, createIndexPage.create(outputMarkdownModel));

            // Create public contributions page
            const publicContributionsPagePath = path.join('markdown', 'public_contributions', outputMarkdownModel.locationDataModel.country.toLowerCase() + '.md');
            await fs.promises.mkdir(path.dirname(publicContributionsPagePath), { recursive: true });
            await fs.promises.writeFile(publicContributionsPagePath, createPublicContributionsPage.create(outputMarkdownModel));

            // Create total contributions page
            const totalContributionsPagePath = path.join('markdown', 'total_contributions', outputMarkdownModel.locationDataModel.country.toLowerCase() + '.md');
            await fs.promises.mkdir(path.dirname(totalContributionsPagePath), { recursive: true });
            await fs.promises.writeFile(totalContributionsPagePath, createTotalContributionsPage.create(outputMarkdownModel));

            // Create followers page
            const followersPagePath = path.join('markdown', 'followers', outputMarkdownModel.locationDataModel.country.toLowerCase() + '.md');
            await fs.promises.mkdir(path.dirname(followersPagePath), { recursive: true });
            await fs.promises.writeFile(followersPagePath, createFollowersPage.create(outputMarkdownModel));

            return true;
        } catch (error) {
            console.error('Error creating markdown files:', error);
            return false;
        }
    }
}

export { OutputMarkdownHandler as outputMarkdown };