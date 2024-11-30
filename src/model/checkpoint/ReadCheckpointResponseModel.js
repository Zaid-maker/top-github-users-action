class ReadCheckpointResponseModel {
    #status;
    #checkpoint;

    constructor(status, content) {
        this.#status = status;
        this.#checkpoint = status ? this.#validateAndSetCheckpoint(content?.checkpoint) : 0;
    }

    static #isValid(value) {
        return value !== '' && value !== null && value !== undefined;
    }

    #validateAndSetCheckpoint(checkpoint) {
        return ReadCheckpointResponseModel.#isValid(checkpoint) ? checkpoint : 0;
    }

    get status() {
        return this.#status;
    }

    get checkpoint() {
        return this.#checkpoint;
    }

    toJSON() {
        return {
            status: this.status,
            checkpoint: this.checkpoint
        };
    }

    toString() {
        return `ReadCheckpointResponseModel(status=${this.status}, checkpoint=${this.checkpoint})`;
    }
}

export default ReadCheckpointResponseModel;