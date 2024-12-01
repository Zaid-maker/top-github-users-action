class OutputMarkdownModel {
    #country;
    #type;
    #markdown;

    constructor(country, type, markdown) {
        this.#country = country;
        this.#type = type;
        this.#markdown = markdown;
    }

    get country() {
        return this.#country;
    }

    get type() {
        return this.#type;
    }

    get markdown() {
        return this.#markdown;
    }

    toJSON() {
        return {
            country: this.#country,
            type: this.#type,
            markdown: this.#markdown
        };
    }
}

export { OutputMarkdownModel };