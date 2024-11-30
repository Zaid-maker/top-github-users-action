class OctokitPageInfoModel {
    #endCursor;
    #hasNextPage;

    constructor({ endCursor = null, hasNextPage = false } = {}) {
        this.#endCursor = this.#validateCursor(endCursor);
        this.#hasNextPage = Boolean(hasNextPage);
    }

    #validateCursor(cursor) {
        return cursor && typeof cursor === 'string' ? cursor : null;
    }

    get endCursor() {
        return this.#endCursor;
    }

    get hasNextPage() {
        return this.#hasNextPage;
    }

    hasMore() {
        return this.#hasNextPage === true;
    }

    getNextCursor() {
        return this.#endCursor;
    }

    clone() {
        return new OctokitPageInfoModel({
            endCursor: this.#endCursor,
            hasNextPage: this.#hasNextPage
        });
    }

    toJSON() {
        return {
            endCursor: this.endCursor,
            hasNextPage: this.hasNextPage
        };
    }

    toString() {
        return `OctokitPageInfoModel(cursor=${this.endCursor}, hasNext=${this.hasNextPage})`;
    }

    static createEmpty() {
        return new OctokitPageInfoModel();
    }

    static fromJSON(json) {
        return new OctokitPageInfoModel({
            endCursor: json?.endCursor,
            hasNextPage: json?.hasNextPage
        });
    }
}

export default OctokitPageInfoModel;