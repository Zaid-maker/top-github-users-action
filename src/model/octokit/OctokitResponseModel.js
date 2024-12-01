import OctokitPageInfoModel from './OctokitPageInfoModel.js';
import UserDataModel from '../data/UserDataModel.js';

class OctokitResponseModel {
    #status;
    #message;
    #users;
    #pageInfo;

    constructor(status, message, users = [], pageInfo = null) {
        this.#status = Boolean(status);
        this.#message = this.#validateMessage(message);
        this.#users = this.#validateUsers(users);
        this.#pageInfo = this.#validatePageInfo(pageInfo);
    }

    #validateMessage(message) {
        return message && typeof message === 'string' ? message : 'No message provided';
    }

    #validateUsers(users) {
        if (!Array.isArray(users)) {
            console.warn('Users must be an array, received:', typeof users);
            return [];
        }
        return users.filter(user => user instanceof UserDataModel);
    }

    #validatePageInfo(pageInfo) {
        if (pageInfo === null) {
            return OctokitPageInfoModel.createEmpty();
        }
        return pageInfo instanceof OctokitPageInfoModel
            ? pageInfo
            : new OctokitPageInfoModel(pageInfo);
    }

    get status() { return this.#status; }
    get message() { return this.#message; }
    get users() { return [...this.#users]; }
    get pageInfo() { return this.#pageInfo; }

    hasUsers() {
        return this.#users.length > 0;
    }

    getUserCount() {
        return this.#users.length;
    }

    hasNextPage() {
        return this.#pageInfo.hasMore();
    }

    getNextCursor() {
        return this.#pageInfo.getNextCursor();
    }

    addUsers(newUsers) {
        const validUsers = newUsers.filter(user => user instanceof UserDataModel);
        this.#users.push(...validUsers);
    }

    sortUsersByContributions() {
        this.#users.sort((a, b) => b.getTotalContributions() - a.getTotalContributions());
    }

    getUsersByLocation(location) {
        return this.#users.filter(user => 
            user.location.toLowerCase().includes(location.toLowerCase())
        );
    }

    toJSON() {
        return {
            status: this.#status,
            message: this.#message,
            userCount: this.getUserCount(),
            users: this.#users.map(user => user.toJSON()),
            pageInfo: this.#pageInfo.toJSON()
        };
    }

    toString() {
        return `OctokitResponseModel(status=${this.#status}, users=${this.getUserCount()}, hasNext=${this.hasNextPage()})`;
    }

    static fromApiResponse(status, response) {
        if (!status || !response) {
            return new OctokitResponseModel(false, 'Invalid response');
        }

        try {
            const users = response.search.edges
                .map(edge => this.#processUserData(edge.node))
                .filter(user => user !== null);

            const pageInfo = new OctokitPageInfoModel(response.search.pageInfo);

            return new OctokitResponseModel(
                true,
                'Successfully processed API response',
                users,
                pageInfo
            );
        } catch (error) {
            console.error('Error processing API response:', error);
            return new OctokitResponseModel(
                false,
                `Error processing API response: ${error.message}`
            );
        }
    }

    static #processUserData(userData) {
        if (!userData || userData.__typename !== 'User') {
            return null;
        }

        try {
            return UserDataModel.fromGraphQLData(userData);
        } catch (error) {
            console.warn('Error processing user data:', error);
            return null;
        }
    }

    static createEmpty(message = 'Empty response') {
        return new OctokitResponseModel(true, message);
    }
}

export default OctokitResponseModel;