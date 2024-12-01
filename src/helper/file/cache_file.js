import file from '../../core/file.js';
import ReadCacheResponseModel from '../../model/cache/ReadCacheResponseModel.js';

class CacheFileHandler {
    static async outputCacheFile(fileName, json) {
        let outputFileResponseModel = await file.outputJson(fileName, json);
        console.log(outputFileResponseModel.message)
    }

    static async readCacheFile(fileName) {
        let readFileResponseModel = await file.readJson(fileName);
        console.log(readFileResponseModel.message)
        if (readFileResponseModel.status) {
            return new ReadCacheResponseModel(readFileResponseModel.status, readFileResponseModel.content)
        } else {
            return new ReadCacheResponseModel(readFileResponseModel.status)
        }
    }
}

export default CacheFileHandler;