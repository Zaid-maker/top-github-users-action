import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

const CONFIG_FILE_PATH = path.join(process.cwd(), 'config.json');
const BACKUP_DIR = path.join(process.cwd(), 'backups');
const RESTCOUNTRIES_API = 'https://restcountries.com/v3.1';

// Configuration constants
const CONFIG_SCHEMA = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "GitHub Users Monitor Configuration",
    description: "Configuration for tracking top GitHub users by country",
    version: "2.0.0"
};

const DEFAULT_SETTINGS = {
    devMode: false,
    minUsersThreshold: 750,
    maxErrorIterations: 4,
    updateFrequency: "daily"
};

// Cache for validated countries
let validatedCountries = new Map();

// Countries to exclude - those with typically low GitHub activity or limited tech presence
const EXCLUDED_COUNTRIES = new Set([
    'afghanistan', 'andorra', 'angola', 'benin', 'bhutan', 'burkina faso',
    'burundi', 'cambodia', 'cameroon', 'chad', 'congo', 'laos', 'madagascar',
    'malawi', 'mali', 'mauritania', 'mauritius', 'mozambique', 'myanmar',
    'namibia', 'sierra leone', 'sudan', 'yemen', 'zambia', 'zimbabwe'
]);

// Key tech regions to always include, sorted by GitHub activity
const PRIORITY_COUNTRIES = new Set([
    // Tier 1: Highest GitHub activity
    'united states of america', 'china', 'india', 'united kingdom', 'germany',
    'japan', 'canada', 'france', 'brazil',
    // Tier 2: High GitHub activity
    'russia', 'australia', 'netherlands', 'spain', 'italy', 'sweden',
    'switzerland', 'singapore', 'south korea', 'israel',
    // Tier 3: Significant tech hubs
    'poland', 'ukraine', 'taiwan', 'hong kong'
]);

// Country name mappings for normalization
const COUNTRY_MAPPINGS = {
    'usa': 'united states of america',
    'united states': 'united states of america',
    'uk': 'united kingdom',
    'great britain': 'united kingdom',
    'south korea': 'korea',
    'uae': 'united arab emirates',
};

/**
 * Validates a country name against the REST Countries API
 * @param {string} countryName - Name of the country to validate
 * @returns {Promise<boolean>} - True if country is valid, false otherwise
 */
async function validateCountryWithAPI(countryName) {
    try {
        // Check cache first
        if (validatedCountries.has(countryName)) {
            return validatedCountries.get(countryName);
        }

        // Normalize country name
        const normalizedName = COUNTRY_MAPPINGS[countryName.toLowerCase()] || countryName;

        // Query REST Countries API
        const response = await fetch(`${RESTCOUNTRIES_API}/name/${encodeURIComponent(normalizedName)}`);
        const isValid = response.status === 200;
        
        // Cache the result
        validatedCountries.set(countryName, isValid);
        return isValid;
    } catch (error) {
        console.error(`Error validating country ${countryName}:`, error.message);
        return false;
    }
}

/**
 * Validates a location object
 * @param {Object} location - Location object to validate
 * @returns {Promise<string|null>} - Error message if invalid, null if valid
 */
async function validateLocation(location) {
    if (!location.country || typeof location.country !== 'string') {
        return 'Invalid or missing country';
    }
    if (!location.geoName || typeof location.geoName !== 'string') {
        return 'Invalid or missing geoName';
    }

    // Skip validation for priority countries
    if (PRIORITY_COUNTRIES.has(location.country.toLowerCase())) {
        return null;
    }

    // Validate country with API
    const isValid = await validateCountryWithAPI(location.country);
    if (!isValid) {
        return `Invalid country: ${location.country}`;
    }

    return null;
}

/**
 * Creates a backup of the current config file
 */
async function createBackup() {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(BACKUP_DIR, `config-${timestamp}.json`);
        
        // Ensure backup directory exists
        await fs.mkdir(BACKUP_DIR, { recursive: true });
        
        // Copy current config to backup
        await fs.copyFile(CONFIG_FILE_PATH, backupPath);
        console.log(`Backup created: ${backupPath}`);
    } catch (error) {
        console.error('Failed to create backup:', error);
    }
}

/**
 * Processes and filters locations data
 * @param {Array} locations - Array of location objects
 * @returns {Promise<Array>} - Processed and filtered locations
 */
async function processLocations(locations) {
    const validLocations = [];
    const errors = [];

    for (const location of locations) {
        const error = await validateLocation(location);
        if (error) {
            errors.push(`${location.country}: ${error}`);
            continue;
        }

        const countryLower = location.country.toLowerCase();
        if (EXCLUDED_COUNTRIES.has(countryLower)) {
            continue;
        }

        validLocations.push({
            country: location.country,
            geoName: location.geoName,
            priority: PRIORITY_COUNTRIES.has(countryLower)
        });
    }

    if (errors.length > 0) {
        console.warn('Validation errors:', errors);
    }

    return validLocations;
}

/**
 * Updates the country data in the configuration file
 */
async function updateCountryData() {
    try {
        // Read current config
        const configData = JSON.parse(await fs.readFile(CONFIG_FILE_PATH, 'utf8'));
        
        // Create backup before modifications
        await createBackup();
        
        // Process and validate locations
        const validLocations = await processLocations(configData.locations || []);
        
        // Update config with validated locations
        configData.locations = validLocations;
        configData.lastUpdated = new Date().toISOString();
        configData.version = CONFIG_SCHEMA.version;
        
        // Ensure required settings
        configData.settings = { ...DEFAULT_SETTINGS, ...(configData.settings || {}) };
        
        // Write updated config
        await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(configData, null, 2));
        console.log('Country data updated successfully');
        
        // Log validation summary
        console.log(`Total locations: ${validLocations.length}`);
        console.log(`Priority countries: ${validLocations.filter(l => l.priority).length}`);
    } catch (error) {
        console.error('Failed to update country data:', error);
        process.exit(1);
    }
}

// Run the update function
updateCountryData();
