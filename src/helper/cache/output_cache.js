import path from 'path';
import file from '../../helper/file/cache_file.js';

class CacheHandler {
    static CACHE_DIR = 'cache';

    static async saveCache(fileName, data) {
        const filePath = path.join(this.CACHE_DIR, fileName);
        return await file.outputJson(filePath, data);
    }

    static async readCache(fileName) {
        const filePath = path.join(this.CACHE_DIR, fileName);
        return await file.readJson(filePath);
    }
}

export default CacheHandler;
