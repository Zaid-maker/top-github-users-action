import { graphql } from '@octokit/graphql.js';
import OctokitResponseModel from '../model/octokit/OctokitResponseModel.js';

class OctokitHandler {
    static getHeader(AUTH_KEY) {
        return {
            headers: {
                authorization: `token ${AUTH_KEY}`,
            },
        };
    }

    static getQuery(locations, numberOfUsers = 100, cursor) {
        return {
            query: `query {
                search(type: USER, query:"${locations} sort:followers-desc", first:${numberOfUsers}, after:${this.formatCursor(cursor)}) {
                    edges {
                        node {
                            __typename
                            ... on User {
                                login,
                                avatarUrl(size: 72),
                                name,
                                location,
                                company,
                                twitterUsername,
                                followers {
                                    totalCount
                                }
                                contributionsCollection {
                                    contributionCalendar {
                                        totalContributions
                                    }
                                    restrictedContributionsCount
                                }
                            }
                        }
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                    }
                }
            }`
        };
    }

    static formatCursor(cursor) {
        return cursor === null ? cursor : `"${cursor}"`;
    }

    static async request(AUTH_KEY, locations, cursor = null) {
        try {
            const graphqlWithAuth = graphql.defaults(this.getHeader(AUTH_KEY));
            const response = await graphqlWithAuth(this.getQuery(locations, 100, cursor));

            const users = response.search.edges.map(edge => ({
                login: edge.node.login,
                avatarUrl: edge.node.avatarUrl,
                name: edge.node.name,
                location: edge.node.location,
                company: edge.node.company,
                twitterUsername: edge.node.twitterUsername,
                followers: edge.node.followers.totalCount,
                contributions: {
                    total: edge.node.contributionsCollection.contributionCalendar.totalContributions,
                    restricted: edge.node.contributionsCollection.restrictedContributionsCount
                }
            }));

            return new OctokitResponseModel(
                true,
                'GitHub API request successful',
                users,
                response.search.pageInfo
            );
        } catch (error) {
            console.error('Error fetching GitHub data:', error);
            return new OctokitResponseModel(
                false,
                `GitHub API request failed: ${error.message}`,
                [],
                { hasNextPage: false, endCursor: null }
            );
        }
    }
}

export default OctokitHandler;