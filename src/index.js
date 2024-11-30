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
import { pullGit } from './helper/git/pull-git';
import { commitGit } from './helper/git/commit-git';
import { pushGit } from './helper/git/push-git';
import { configFile } from './helper/file/config_file';
import { outputCheckpoint } from './helper/checkpoint/output_checkpoint';
import { outputCache } from './helper/cache/output_cache';
import { outputMarkdown } from './helper/markdown/output_markdown';
import { outputHtml } from './helper/html/output_html';
import { createHtmlFile } from './helper/html/file/create_html_file';
import { createRankingJsonFile } from './helper/html/file/create_ranking_json_file';
import { createIndexPage } from './helper/markdown/page/create_index_page';
import { createPublicContributionsPage } from './helper/markdown/page/create_public_contributions_page';
import { createTotalContributionsPage } from './helper/markdown/page/create_total_contributions_page';
import { createFollowersPage } from './helper/markdown/page/create_followers_page';
import { requestOctokit } from './helper/octokit/request_octokit';
import { formatMarkdown } from './helper/markdown/format_markdown';
import { OutputMarkdownModel } from './model/markdown/OutputMarkdownModel';

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

    static async #validateAndSaveCache(country, newUsers, existingUsers) {
        if (!existingUsers) {
            console.log(`Request success: new cache with ${newUsers.length} users`);
            await outputCache.saveCacheFile(country, newUsers);
            return;
        }

        if (existingUsers.length <= newUsers.length) {
            console.log(`Cache update: ${existingUsers.length} → ${newUsers.length} users`);
            await outputCache.saveCacheFile(country, newUsers);
            return;
        }

        if (newUsers.length >= this.MINIMUM_USERS_THRESHOLD) {
            console.log(`Minimum threshold met: ${newUsers.length} users (minimum: ${this.MINIMUM_USERS_THRESHOLD})`);
            await outputCache.saveCacheFile(country, newUsers);
            return;
        }

        console.warn(`Cache update skipped: ${newUsers.length} users below minimum threshold of ${this.MINIMUM_USERS_THRESHOLD}`);
    }

    static async #saveCache(config, checkpoint) {
        console.log('########## SaveCache ##########');
        
        for (const location of config.locations) {
            if (!await this.#isCheckpoint(config.locations, location.country, checkpoint.checkpoint)) {
                continue;
            }

            try {
                const users = await requestOctokit.request(
                    this.AUTH_KEY,
                    this.MAXIMUM_ERROR_ITERATIONS,
                    location.locations
                );

                const existingCache = await outputCache.readCacheFile(location.country);
                await this.#validateAndSaveCache(
                    location.country,
                    users,
                    existingCache.status ? existingCache.users : null
                );
            } catch (error) {
                console.error(`Error processing cache for ${location.country}:`, error);
            }
        }
    }

    static async #saveMarkdown(config, checkpoint) {
        console.log('########## SaveMarkDown ##########');
        
        for (const location of config.locations) {
            if (!await this.#isCheckpoint(config.locations, location.country, checkpoint.checkpoint)) {
                continue;
            }

            try {
                const cache = await outputCache.readCacheFile(location.country);
                if (!cache.status) {
                    console.warn(`No cache found for ${location.country}, skipping markdown generation`);
                    continue;
                }

                const markdownModel = new OutputMarkdownModel(
                    this.GITHUB_REPOSITORY,
                    location,
                    cache,
                    config
                );

                await Promise.all([
                    outputMarkdown.savePublicContributionsMarkdownFile(
                        location.country,
                        createPublicContributionsPage.create(markdownModel)
                    ),
                    outputMarkdown.saveTotalContributionsMarkdownFile(
                        location.country,
                        createTotalContributionsPage.create(markdownModel)
                    ),
                    outputMarkdown.saveFollowersMarkdownFile(
                        location.country,
                        createFollowersPage.create(markdownModel)
                    )
                ]);

                await outputCheckpoint.saveCheckpointFile(
                    config.locations,
                    location.country,
                    checkpoint.checkpoint
                );
            } catch (error) {
                console.error(`Error generating markdown for ${location.country}:`, error);
            }
        }

        if (!config.settings.devMode) {
            await outputMarkdown.saveIndexMarkdownFile(
                createIndexPage.create(this.GITHUB_REPOSITORY, config)
            );
        }
    }

    static async #saveHtml(config) {
        console.log('########## SaveHtml ##########');
        try {
            const rankingJson = await createRankingJsonFile.create(config);
            await Promise.all([
                outputHtml.saveRankingJsonFile(rankingJson),
                outputHtml.saveHtmlFile(createHtmlFile.create())
            ]);
        } catch (error) {
            console.error('Error generating HTML files:', error);
        }
    }

    static async run() {
        try {
            const configResponse = await configFile.readConfigFile();
            const checkpoint = await outputCheckpoint.readCheckpointFile();

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