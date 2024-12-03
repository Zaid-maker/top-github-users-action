import fs from 'fs/promises';
import path from 'path';

const CONFIG_FILE_PATH = path.join(process.cwd(), 'config.json');
const BACKUP_DIR = path.join(process.cwd(), 'backups');

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

/**
 * Validates a location object
 * @param {Object} location - Location object to validate
 * @returns {string|null} - Error message if invalid, null if valid
 */
function validateLocation(location) {
    if (!location.country || typeof location.country !== 'string') {
        return 'Invalid or missing country';
    }
    if (!location.geoName || typeof location.geoName !== 'string') {
        return 'Invalid or missing geoName';
    }
    if (!Array.isArray(location.cities) || location.cities.length === 0) {
        return 'Invalid or empty cities array';
    }
    if (!location.imageUrl || typeof location.imageUrl !== 'string' || !location.imageUrl.startsWith('http')) {
        return 'Invalid or missing imageUrl';
    }
    return null;
}

/**
 * Creates a backup of the current config file
 */
async function createBackup() {
    try {
        // Ensure backup directory exists
        await fs.mkdir(BACKUP_DIR, { recursive: true });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(BACKUP_DIR, `config-${timestamp}.json`);
        
        await fs.copyFile(CONFIG_FILE_PATH, backupPath);
        console.log(`📦 Created backup: ${path.basename(backupPath)}`);
    } catch (error) {
        console.warn('⚠️ Failed to create backup:', error.message);
    }
}

/**
 * Processes and filters locations data
 * @param {Array} locations - Array of location objects
 * @returns {Array} - Processed and filtered locations
 */
function processLocations(locations) {
    const validLocations = [];
    const invalidLocations = [];

    // Validate and filter locations
    locations.forEach(location => {
        const error = validateLocation(location);
        if (error) {
            invalidLocations.push({ location, error });
            return;
        }
        if (!EXCLUDED_COUNTRIES.has(location.country.toLowerCase())) {
            validLocations.push(location);
        }
    });

    // Log validation results
    if (invalidLocations.length > 0) {
        console.warn('⚠️ Found invalid locations:');
        invalidLocations.forEach(({ location, error }) => {
            console.warn(`   - ${location.country || 'Unknown country'}: ${error}`);
        });
    }

    // Sort locations
    return validLocations.sort((a, b) => {
        const aPriority = PRIORITY_COUNTRIES.has(a.country.toLowerCase());
        const bPriority = PRIORITY_COUNTRIES.has(b.country.toLowerCase());
        if (aPriority && !bPriority) return -1;
        if (!aPriority && bPriority) return 1;
        return a.country.localeCompare(b.country);
    });
}

async function updateCountryData() {
    try {
        console.log('🔄 Starting country data update...');

        // Create backup before making changes
        await createBackup();

        // Read and parse current config
        const configData = await fs.readFile(CONFIG_FILE_PATH, 'utf8');
        const config = JSON.parse(configData);

        // Process locations
        const filteredLocations = processLocations(config.locations);

        // Create new config
        const newConfig = {
            ...CONFIG_SCHEMA,
            settings: {
                ...DEFAULT_SETTINGS,
                ...config.settings
            },
            locations: filteredLocations,
            lastUpdated: new Date().toISOString()
        };

        // Write updated config
        await fs.writeFile(
            CONFIG_FILE_PATH,
            JSON.stringify(newConfig, null, 2),
            'utf8'
        );

        // Log results
        console.log('\n✅ Successfully updated country data in config.json');
        console.log('📊 Statistics:');
        console.log(`   - Total countries: ${newConfig.locations.length}`);
        console.log(`   - Priority countries: ${PRIORITY_COUNTRIES.size}`);
        console.log(`   - Excluded countries: ${EXCLUDED_COUNTRIES.size}`);
        
        const priorityCountriesPresent = filteredLocations
            .filter(loc => PRIORITY_COUNTRIES.has(loc.country.toLowerCase()))
            .length;
        console.log(`   - Priority countries present: ${priorityCountriesPresent}/${PRIORITY_COUNTRIES.size}`);
        
        // Calculate coverage
        const coverage = (priorityCountriesPresent / PRIORITY_COUNTRIES.size * 100).toFixed(1);
        console.log(`   - Priority country coverage: ${coverage}%`);

    } catch (error) {
        console.error('\n❌ Error updating country data:');
        console.error(`   ${error.message}`);
        process.exit(1);
    }
}

// Run the update function
updateCountryData();
