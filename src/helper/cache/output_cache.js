import fs from 'fs';
import path from 'path';

class CacheHandler {
    static async readCacheFile(country) {
        try {
            const cacheFilePath = path.join('cache', country.toLowerCase() + '.json');
            const cacheFileContent = await fs.promises.readFile(cacheFilePath, 'utf8');
            return { status: true, users: JSON.parse(cacheFileContent).users };
        } catch (error) {
            console.error(`Error reading cache file for ${country}:`, error);
            return { status: false, users: [] };
        }
    }

    static async writeCacheFile(country, users) {
        try {
            const cacheFilePath = path.join('cache', country.toLowerCase() + '.json');
            await fs.promises.mkdir(path.dirname(cacheFilePath), { recursive: true });
            await fs.promises.writeFile(cacheFilePath, JSON.stringify({ users }, null, 2));
            return true;
        } catch (error) {
            console.error(`Error writing cache file for ${country}:`, error);
            return false;
        }
    }
}

export { CacheHandler };
