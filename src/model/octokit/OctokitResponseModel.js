import OctokitPageInfoModel from './OctokitPageInfoModel';
import UserDataModel from '../data/UserDataModel';

class OctokitResponseModel {
    constructor(status, message, users = [], pageInfo = null) {
        this.status = status;
        this.message = message;
        this.node = users;
        this.pageInfo = pageInfo ? new OctokitPageInfoModel(pageInfo) : null;
    }

    static validate(value) {
        return value === '' || value === null || value === undefined;
    }

    static setValue(value) {
        return this.validate(value) ? "undefined value" : value;
    }

    static calculatePublicContributions(contributionsCollection) {
        const totalContributions = contributionsCollection.contributionCalendar.totalContributions;
        const privateContributions = contributionsCollection.restrictedContributionsCount;
        return totalContributions - privateContributions;
    }

    static processUserData(userData) {
        if (userData.__typename !== 'User') {
            return null;
        }

        return new UserDataModel(
            this.setValue(userData.login),
            this.setValue(userData.name),
            this.setValue(userData.avatarUrl),
            this.setValue(userData.location),
            this.setValue(userData.company),
            this.setValue(userData.twitterUsername),
            this.setValue(userData.followers.totalCount),
            this.setValue(userData.contributionsCollection.restrictedContributionsCount),
            this.setValue(this.calculatePublicContributions(userData.contributionsCollection))
        );
    }

    static fromApiResponse(status, response) {
        if (!status || !response) {
            return new OctokitResponseModel(false, 'Invalid response', [], null);
        }

        const users = response.search.edges
            .map(edge => this.processUserData(edge.node))
            .filter(user => user !== null);

        return new OctokitResponseModel(
            true,
            'Successfully processed response',
            users,
            response.search.pageInfo
        );
    }
}

export default OctokitResponseModel;