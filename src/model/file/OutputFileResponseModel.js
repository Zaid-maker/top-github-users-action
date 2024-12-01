class OutputFileResponseModel {
    #status;
    #message;

    constructor(status, message) {
        this.#status = status;
        this.#message = message;
    }

    get status() {
        return this.#status;
    }

    get message() {
        return this.#message;
    }

    toJSON() {
        return {
            status: this.#status,
            message: this.#message
        };
    }
}

export default OutputFileResponseModel;