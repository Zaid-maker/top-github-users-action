class UserDataModel {
    #login;
    #name;
    #avatarUrl;
    #location;
    #company;
    #twitterUsername;
    #followers;
    #privateContributions;
    #publicContributions;

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
        this.#login = this.#validateString(login, 'login');
        this.#name = this.#validateString(name, 'name');
        this.#avatarUrl = this.#validateString(avatarUrl, 'avatarUrl');
        this.#location = this.#validateString(location, 'location');
        this.#company = this.#validateString(company, 'company');
        this.#twitterUsername = this.#validateString(twitterUsername, 'twitterUsername');
        this.#followers = this.#validateNumber(followers, 'followers');
        this.#privateContributions = this.#validateNumber(privateContributions, 'privateContributions');
        this.#publicContributions = this.#validateNumber(publicContributions, 'publicContributions');
    }

    #validateString(value, field) {
        if (value === null || value === undefined) {
            console.warn(`${field} is undefined or null`);
            return 'undefined value';
        }
        return String(value).trim();
    }

    #validateNumber(value, field) {
        if (value === null || value === undefined) {
            console.warn(`${field} is undefined or null`);
            return 0;
        }
        const num = Number(value);
        if (isNaN(num)) {
            console.warn(`${field} is not a valid number: ${value}`);
            return 0;
        }
        return num;
    }

    get login() { return this.#login; }
    get name() { return this.#name; }
    get avatarUrl() { return this.#avatarUrl; }
    get location() { return this.#location; }
    get company() { return this.#company; }
    get twitterUsername() { return this.#twitterUsername; }
    get followers() { return this.#followers; }
    get privateContributions() { return this.#privateContributions; }
    get publicContributions() { return this.#publicContributions; }

    getTotalContributions() {
        return this.#publicContributions + this.#privateContributions;
    }

    getContributionStats() {
        return {
            total: this.getTotalContributions(),
            public: this.#publicContributions,
            private: this.#privateContributions,
            publicPercentage: this.#calculatePercentage(this.#publicContributions),
            privatePercentage: this.#calculatePercentage(this.#privateContributions)
        };
    }

    #calculatePercentage(value) {
        const total = this.getTotalContributions();
        return total === 0 ? 0 : ((value / total) * 100).toFixed(1);
    }

    getSocialLinks() {
        return {
            github: `https://github.com/${this.#login}`,
            twitter: this.#twitterUsername !== 'undefined value' 
                ? `https://twitter.com/${this.#twitterUsername}`
                : null
        };
    }

    toJSON() {
        return {
            login: this.#login,
            name: this.#name,
            avatarUrl: this.#avatarUrl,
            location: this.#location,
            company: this.#company,
            twitterUsername: this.#twitterUsername,
            followers: this.#followers,
            contributions: this.getContributionStats(),
            socialLinks: this.getSocialLinks()
        };
    }

    toString() {
        return `UserDataModel(login=${this.#login}, name=${this.#name}, contributions=${this.getTotalContributions()})`;
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
            privateContributions: data.private_contributions || 0,
            publicContributions: data.public_contributions || 0
        });
    }

    static fromGraphQLData(data) {
        return new UserDataModel({
            login: data.login,
            name: data.name,
            avatarUrl: data.avatarUrl,
            location: data.location,
            company: data.company,
            twitterUsername: data.twitterUsername,
            followers: data.followers?.totalCount,
            privateContributions: data.contributionsCollection?.restrictedContributionsCount,
            publicContributions: data.contributionsCollection?.totalContributions - 
                               (data.contributionsCollection?.restrictedContributionsCount || 0)
        });
    }
}

export default UserDataModel;