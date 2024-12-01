class CheckpointDataModel {
    #checkpoint;
    #country;

    constructor(checkpoint, country) {
        this.#checkpoint = checkpoint;
        this.#country = country;
    }

    get checkpoint() {
        return this.#checkpoint;
    }

    get country() {
        return this.#country;
    }

    toJSON() {
        return {
            checkpoint: this.#checkpoint,
            country: this.#country
        };
    }
}

export default CheckpointDataModel;