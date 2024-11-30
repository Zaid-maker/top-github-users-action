import LocationDataModel from '../data/LocationDataModel';

class ReadConfigResponseModel {
    #status;
    #devMode;
    #locations;
    #checkpoint;

    constructor(status, content) {
        this.#status = status;
        
        if (status && content) {
            this.#devMode = this.#validateAndSetDevMode(content.devMode);
            this.#locations = this.#validateAndSetLocations(content.locations);
            this.#checkpoint = content.checkpoint ?? 0;
        } else {
            this.#devMode = true;
            this.#locations = [];
            this.#checkpoint = 0;
        }
    }

    static #isValidString(value) {
        return typeof value === 'string' && value !== '';
    }

    #validateAndSetDevMode(devMode) {
        if (ReadConfigResponseModel.#isValidString(devMode)) {
            return devMode.toLowerCase() === 'true';
        }
        return true; // Default to dev mode if invalid
    }

    #validateGeoName(geoName) {
        return ReadConfigResponseModel.#isValidString(geoName) ? geoName : null;
    }

    #validateAndSetLocations(locations) {
        if (!Array.isArray(locations)) {
            console.warn('Invalid locations format: expected array');
            return [];
        }

        return locations
            .filter(location => location && typeof location === 'object')
            .map(location => {
                try {
                    const country = location.country;
                    const geoName = this.#validateGeoName(location.geoName);
                    const imageUrl = location.imageUrl;
                    
                    if (!ReadConfigResponseModel.#isValidString(country)) {
                        throw new Error(`Invalid country: ${country}`);
                    }

                    const cities = Array.isArray(location.cities) 
                        ? location.cities.filter(city => ReadConfigResponseModel.#isValidString(city))
                        : [];

                    const allLocations = [country, ...cities];
                    
                    return new LocationDataModel(country, geoName, allLocations, imageUrl);
                } catch (error) {
                    console.warn(`Skipping invalid location: ${error.message}`);
                    return null;
                }
            })
            .filter(Boolean); // Remove null entries
    }

    get status() {
        return this.#status;
    }

    get devMode() {
        return this.#devMode;
    }

    get locations() {
        return [...this.#locations];
    }

    get checkpoint() {
        return this.#checkpoint;
    }

    addLocation(country, geoName = null, cities = [], imageUrl = null) {
        const locations = [country, ...cities];
        const locationModel = new LocationDataModel(country, geoName, locations, imageUrl);
        this.#locations.push(locationModel);
    }

    removeLocation(country) {
        this.#locations = this.#locations.filter(loc => loc.country !== country);
    }

    toJSON() {
        return {
            status: this.status,
            devMode: this.devMode,
            locations: this.locations.map(loc => loc.toJSON()),
            checkpoint: this.checkpoint
        };
    }

    toString() {
        return `ReadConfigResponseModel(status=${this.status}, devMode=${this.devMode}, locations=${this.locations.length}, checkpoint=${this.checkpoint})`;
    }

    static fromJSON(json) {
        return new ReadConfigResponseModel(true, {
            devMode: json.devMode,
            locations: json.locations,
            checkpoint: json.checkpoint
        });
    }
}

export default ReadConfigResponseModel;