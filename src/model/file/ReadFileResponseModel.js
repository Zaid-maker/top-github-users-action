class ReadFileResponseModel {
    #status;
    #message;
    #content;

    constructor(status, message, content) {
        this.#status = status;
        this.#message = message;
        this.#content = content;
    }

    get status() {
        return this.#status;
    }

    get message() {
        return this.#message;
    }

    get content() {
        return this.#content;
    }

    toJSON() {
        return {
            status: this.#status,
            message: this.#message,
            content: this.#content
        };
    }
}

export default ReadFileResponseModel;