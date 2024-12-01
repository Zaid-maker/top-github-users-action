class OctokitPageInfoModel {
    #hasNextPage;
    #endCursor;

    constructor(hasNextPage, endCursor) {
        this.#hasNextPage = hasNextPage;
        this.#endCursor = endCursor;
    }

    get hasNextPage() {
        return this.#hasNextPage;
    }

    get endCursor() {
        return this.#endCursor;
    }

    toJSON() {
        return {
            hasNextPage: this.#hasNextPage,
            endCursor: this.#endCursor
        };
    }
}

export default OctokitPageInfoModel;