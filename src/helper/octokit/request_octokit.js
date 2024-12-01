import octokit from '../../core/octokit.js';

class OctokitRequestHandler {
    static setLocation(place) {
        return place.replace(/\s+/g, '_').toLowerCase();
    }

    static setQuery(location) {
        return location
            .map(place => `location:${this.setLocation(place)}`)
            .join(' ');
    }

    static getRandomDelay(min = 1000, max = 5000) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static async request(AUTH_KEY, MAXIMUM_ERROR_ITERATIONS, location) {
        let hasNextPage = true;
        let cursor = null;
        const users = [];
        let iterations = 0;
        let errors = 0;

        while (hasNextPage && errors < MAXIMUM_ERROR_ITERATIONS) {
            try {
                const octokitResponseModel = await octokit.request(
                    AUTH_KEY,
                    this.setQuery(location),
                    cursor
                );

                if (octokitResponseModel.status) {
                    hasNextPage = octokitResponseModel.pageInfo.hasNextPage;
                    cursor = octokitResponseModel.pageInfo.endCursor;

                    for (const userData of octokitResponseModel.node) {
                        console.log(
                            `iterations:(${iterations}) errors:(${errors}/${MAXIMUM_ERROR_ITERATIONS}) ${userData.login} ${userData.followers}`
                        );
                        users.push(userData);
                    }

                    const delayMs = this.getRandomDelay();
                    console.log(
                        `interval:${delayMs}ms hasNextPage:${hasNextPage} cursor:${cursor} users:${users.length}`
                    );
                    await this.delay(delayMs);
                    iterations++;
                } else {
                    await this.delay(60000); // 1 minute delay on error
                    errors++;
                }
            } catch (error) {
                console.error('Error fetching GitHub data:', error);
                await this.delay(60000);
                errors++;
            }
        }

        return users;
    }
}

export default OctokitRequestHandler;