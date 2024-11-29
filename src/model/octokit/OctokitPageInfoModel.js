class OctokitPageInfoModel {
    constructor({ endCursor, hasNextPage }) {
        this.endCursor = endCursor;
        this.hasNextPage = hasNextPage;
    }

    static createEmpty() {
        return new OctokitPageInfoModel({
            endCursor: null,
            hasNextPage: false
        });
    }

    hasMore() {
        return this.hasNextPage === true;
    }

    getNextCursor() {
        return this.endCursor;
    }
}

export default OctokitPageInfoModel;