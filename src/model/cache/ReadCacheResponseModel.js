import UserDataModel from '../data/UserDataModel.js';

class ReadCacheResponseModel {
    #status;
    #content;

    constructor(status, content = null) {
        this.#status = status;
        this.#content = content;
    }

    get status() {
        return this.#status;
    }

    get content() {
        return this.#content;
    }

    toJSON() {
        let validate = (value) => (value === '' || value === null || value === undefined);
        let setValue = (value) => validate(value) ? "undefined value" : value;
        let setUsers = (content) => {
            let array = [];
            for (const user of content) {
                let userDataModel = new UserDataModel(
                    setValue(user.login),
                    setValue(user.name),
                    setValue(user.avatarUrl),
                    setValue(user.location),
                    setValue(user.company),
                    setValue(user.twitterUsername),
                    setValue(user.followers),
                    setValue(user.privateContributions),
                    setValue(user.publicContributions))
                array.push(userDataModel)
            }
            return array;
        }
        return {
            status: this.#status,
            users: this.#status ? setUsers(this.#content) : null
        };
    }
}

export default ReadCacheResponseModel;