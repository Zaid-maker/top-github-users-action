class UserDataModel {
    #login;
    #name;
    #avatarUrl;
    #url;
    #company;
    #blog;
    #location;
    #email;
    #bio;
    #twitter;
    #followers;
    #following;
    #contributions;
    #publicContributions;

    constructor(login, name, avatarUrl, url, company, blog, location, email, bio, twitter, followers, following, contributions, publicContributions) {
        this.#login = login;
        this.#name = name;
        this.#avatarUrl = avatarUrl;
        this.#url = url;
        this.#company = company;
        this.#blog = blog;
        this.#location = location;
        this.#email = email;
        this.#bio = bio;
        this.#twitter = twitter;
        this.#followers = followers;
        this.#following = following;
        this.#contributions = contributions;
        this.#publicContributions = publicContributions;
    }

    get login() {
        return this.#login;
    }

    get name() {
        return this.#name;
    }

    get avatarUrl() {
        return this.#avatarUrl;
    }

    get url() {
        return this.#url;
    }

    get company() {
        return this.#company;
    }

    get blog() {
        return this.#blog;
    }

    get location() {
        return this.#location;
    }

    get email() {
        return this.#email;
    }

    get bio() {
        return this.#bio;
    }

    get twitter() {
        return this.#twitter;
    }

    get followers() {
        return this.#followers;
    }

    get following() {
        return this.#following;
    }

    get contributions() {
        return this.#contributions;
    }

    get publicContributions() {
        return this.#publicContributions;
    }

    toJSON() {
        return {
            login: this.#login,
            name: this.#name,
            avatarUrl: this.#avatarUrl,
            url: this.#url,
            company: this.#company,
            blog: this.#blog,
            location: this.#location,
            email: this.#email,
            bio: this.#bio,
            twitter: this.#twitter,
            followers: this.#followers,
            following: this.#following,
            contributions: this.#contributions,
            publicContributions: this.#publicContributions
        };
    }
}

export default UserDataModel;