/*!
 * Top GitHub Users Action
 * Version: 1.0.0
 * 
 * Current Repository:
 * https://github.com/Zaid-maker/top-github-users-action
 * 
 * Original Work:
 * Copyright (c) 2021 Gayan Kuruppu (https://github.com/gayanvoice)
 * 
 * Current Maintenance:
 * Copyright (c) 2024 Zaid Hafeez (https://github.com/Zaid-maker)
 * 
 * This project is a modernized fork of the original work, updated with:
 * - Modern JavaScript practices
 * - Enhanced error handling
 * - Current dependencies
 * 
 * Released under the MIT License
 */
import { pullGit } from './helper/git/pull-git.js';
import { commitGit } from './helper/git/commit-git.js';
import { pushGit } from './helper/git/push-git.js';
import ConfigFileHandler from './helper/file/config_file.js';
import CheckpointHandler from './helper/checkpoint/output_checkpoint.js';
import { CacheHandler } from './helper/cache/output_cache.js';
import { outputMarkdown } from './helper/markdown/output_markdown.js';
import { createHtmlFile } from './helper/html/output_html.js';
import { createRankingJsonFile } from './helper/html/file/create_ranking_json_file.js';
import { createIndexPage } from './helper/markdown/page/create_index_page.js';
import { createPublicContributionsPage } from './helper/markdown/page/create_public_contributions_page.js';
import { createTotalContributionsPage } from './helper/markdown/page/create_total_contributions_page.js';
import { createFollowersPage } from './helper/markdown/page/create_followers_page.js';
import OctokitHandler from './helper/octokit/request_octokit.js';
import { formatMarkdown } from './helper/markdown/format_markdown.js';
import { OutputMarkdownModel } from './model/markdown/OutputMarkdownModel.js';

class GitHubUsersMonitor {
    static AUTH_KEY = process.env.CUSTOM_TOKEN;
    static GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
    static MAXIMUM_ERROR_ITERATIONS = 4;
    static MINIMUM_USERS_THRESHOLD = 750;

    static async #isCheckpoint(locationsArray, country, checkpoint) {
        const indexOfCountry = locationsArray.findIndex(location => location.country === country);
        const isMatch = indexOfCountry === checkpoint;
        console.log(`Checkpoint ${isMatch ? 'set' : 'not set'} for ${country}`);
        return isMatch;
    }

    static async #saveCache(config, checkpoint) {
        console.log('########## SaveCache ##########');
        for (const location of config.locations) {
            try {
                if (await this.#isCheckpoint(config.locations, location.country, checkpoint.checkpoint)) {
                    console.log('Checkpoint set for', location.country);

                    const octokit = new OctokitHandler(this.AUTH_KEY);
                    const response = await octokit.request(location);

                    if (!response.status) {
                        console.error(`Error fetching data for ${location.country}:`, response.message);
                        continue;
                    }

                    await CacheHandler.saveCacheFile(response.content);
                } else {
                    console.log('Checkpoint not set for', location.country);
                }
            } catch (error) {
                console.error(`Error processing cache for ${location.country}:`, error);
            }
        }
    }

    static async #saveMarkdown(config, checkpoint) {
        console.log('########## SaveMarkDown ##########');
        for (const location of config.locations) {
            try {
                if (await this.#isCheckpoint(config.locations, location.country, checkpoint.checkpoint)) {
                    console.log('Checkpoint set for', location.country);

                    const cacheResponse = await CacheHandler.readCacheFile();
                    if (!cacheResponse.status) {
                        console.error(`Error reading cache for ${location.country}:`, cacheResponse.message);
                        continue;
                    }

                    const cache = cacheResponse.content;
                    const outputModel = new OutputMarkdownModel(location, cache);

                    await Promise.all([
                        outputMarkdown.saveIndexFile(
                            createIndexPage.create(outputModel)
                        ),
                        outputMarkdown.savePublicContributionsFile(
                            createPublicContributionsPage.create(outputModel)
                        ),
                        outputMarkdown.saveTotalContributionsFile(
                            createTotalContributionsPage.create(outputModel)
                        ),
                        outputMarkdown.saveFollowersFile(
                            createFollowersPage.create(outputModel)
                        )
                    ]);

                    await CheckpointHandler.updateCheckpointFile(checkpoint.checkpoint + 1);
                } else {
                    console.log('Checkpoint not set for', location.country);
                }
            } catch (error) {
                console.error(`Error generating markdown for ${location.country}:`, error);
            }
        }
    }

    static async #saveHtml(config) {
        console.log('########## SaveHtml ##########');
        try {
            const rankingJson = await createRankingJsonFile.create(config);
            await Promise.all([
                createHtmlFile.saveRankingJsonFile(rankingJson),
                createHtmlFile.saveHtmlFile(await createHtmlFile.create())
            ]);
        } catch (error) {
            console.error('Error generating HTML files:', error);
        }
    }

    static async run() {
        try {
            const configResponse = await ConfigFileHandler.readConfigFile();
            
            // Initialize checkpoint if it doesn't exist
            let checkpoint;
            try {
                checkpoint = await CheckpointHandler.readCheckpoint();
            } catch (error) {
                console.log('No checkpoint found, initializing to 0');
                await CheckpointHandler.updateCheckpointFile(0);
                checkpoint = { status: true, checkpoint: 0 };
            }

            if (!configResponse.status || !checkpoint.status) {
                throw new Error('Failed to read configuration or checkpoint');
            }

            const config = configResponse.content;

            if (!config.settings.devMode) {
                await pullGit.pull();
            }

            const checkpointCountry = config.locations[checkpoint.checkpoint].country;

            await this.#saveCache(config, checkpoint);
            await this.#saveMarkdown(config, checkpoint);
            await this.#saveHtml(config);

            if (!config.settings.devMode) {
                const countryName = formatMarkdown.capitalizeTheFirstLetterOfEachWord(checkpointCountry);
                await commitGit.commit(`Update ${countryName}`);
                await pushGit.push();
            }
        } catch (error) {
            console.error('Error in GitHub Users Monitor:', error);
            process.exit(1);
        }
    }
}

// Run the monitor
GitHubUsersMonitor.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});

export { GitHubUsersMonitor };