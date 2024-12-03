import fs from 'fs/promises';
import path from 'path';

const CONFIG_FILE_PATH = path.join(process.cwd(), 'config.json');

async function updateCountryData() {
    try {
        // Read the current config file
        const configData = await fs.readFile(CONFIG_FILE_PATH, 'utf8');
        const config = JSON.parse(configData);

        // Create a new config object with the base structure
        const newConfig = {
            $schema: "http://json-schema.org/draft-07/schema#",
            title: "GitHub Users Monitor Configuration",
            description: "Configuration for tracking top GitHub users by country",
            version: "2.0.0",
            settings: {
                devMode: false,
                minUsersThreshold: 750,
                maxErrorIterations: 4,
                updateFrequency: "daily"
            },
            locations: config.locations,
            lastUpdated: new Date().toISOString()
        };

        // Write the updated config back to file with proper formatting
        await fs.writeFile(
            CONFIG_FILE_PATH,
            JSON.stringify(newConfig, null, 2),
            'utf8'
        );

        console.log('✅ Successfully updated country data in config.json');
        console.log(`📊 Total countries: ${newConfig.locations.length}`);
    } catch (error) {
        console.error('❌ Error updating country data:', error);
        process.exit(1);
    }
}

// Run the update function
updateCountryData();
