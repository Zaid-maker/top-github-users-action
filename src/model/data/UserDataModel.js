class UserDataModel {
    constructor({
        login,
        name,
        avatarUrl,
        location,
        company,
        twitterUsername,
        followers,
        privateContributions,
        publicContributions
    }) {
        this.login = this.validateString(login, 'login');
        this.name = this.validateString(name, 'name');
        this.avatarUrl = this.validateString(avatarUrl, 'avatarUrl');
        this.location = this.validateString(location, 'location');
        this.company = this.validateString(company, 'company');
        this.twitterUsername = this.validateString(twitterUsername, 'twitterUsername');
        this.followers = this.validateNumber(followers, 'followers');
        this.privateContributions = this.validateNumber(privateContributions, 'privateContributions');
        this.publicContributions = this.validateNumber(publicContributions, 'publicContributions');
    }

    validateString(value, field) {
        if (value === null || value === undefined) {
            return 'undefined value';
        }
        return String(value);
    }

    validateNumber(value, field) {
        if (value === null || value === undefined) {
            return 0;
        }
        const num = Number(value);
        return isNaN(num) ? 0 : num;
    }

    getTotalContributions() {
        return this.publicContributions + this.privateContributions;
    }

    static fromGitHubData(data) {
        return new UserDataModel({
            login: data.login,
            name: data.name,
            avatarUrl: data.avatar_url,
            location: data.location,
            company: data.company,
            twitterUsername: data.twitter_username,
            followers: data.followers,
            privateContributions: data.private_contributions,
            publicContributions: data.public_contributions
        });
    }

    toJSON() {
        return {
            login: this.login,
            name: this.name,
            avatarUrl: this.avatarUrl,
            location: this.location,
            company: this.company,
            twitterUsername: this.twitterUsername,
            followers: this.followers,
            contributions: {
                private: this.privateContributions,
                public: this.publicContributions,
                total: this.getTotalContributions()
            }
        };
    }
}

export default UserDataModel;