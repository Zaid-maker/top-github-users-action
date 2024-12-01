class LocationDataModel {
    #country;
    #geoName;
    #locations;
    #imageUrl;

    constructor(country, geoName, locations, imageUrl) {
        if (!country) {
            throw new Error('Country is required');
        }
        this.#country = country;
        this.#geoName = geoName || null;
        this.#locations = this.#validateLocations(locations);
        this.#imageUrl = imageUrl || null;
    }

    #validateLocations(locations) {
        if (!Array.isArray(locations)) {
            throw new Error('Locations must be an array');
        }
        return locations.filter(location => location && typeof location === 'string');
    }

    get country() {
        return this.#country;
    }

    get geoName() {
        return this.#geoName;
    }

    get locations() {
        return [...this.#locations];
    }

    get imageUrl() {
        return this.#imageUrl;
    }

    get cities() {
        return this.#locations.slice(1);
    }

    addCity(city) {
        if (!city || typeof city !== 'string') {
            throw new Error('City must be a non-empty string');
        }
        if (!this.#locations.includes(city)) {
            this.#locations.push(city);
        }
    }

    removeCity(city) {
        const index = this.#locations.indexOf(city);
        if (index > 0) { // Don't remove the country (index 0)
            this.#locations.splice(index, 1);
        }
    }

    toJSON() {
        return {
            country: this.country,
            geoName: this.geoName,
            locations: this.locations,
            imageUrl: this.imageUrl
        };
    }

    toString() {
        return `LocationDataModel(country=${this.country}, geoName=${this.geoName}, cities=[${this.cities.join(', ')}])`;
    }

    static fromJSON(json) {
        return new LocationDataModel(
            json.country,
            json.geoName,
            json.locations || [json.country],
            json.imageUrl
        );
    }
}

export { LocationDataModel as default };