import fs from 'fs';
import path from 'path';
import { CacheHandler } from '../../../helper/cache/output_cache.js';

class RankingJsonFileCreator {
    static async create(readConfigResponseModel) {
        const countriesArray = [];
        for await (const locationDataModel of readConfigResponseModel.locations) {
            if (locationDataModel.geoName === null) {
                console.log(`Ranking not available for ${locationDataModel.country}`);
            } else {
                console.log(`Ranking available for ${locationDataModel.country}`);
                const readCacheResponseModel = await CacheHandler.readCacheFile(locationDataModel.country);
                let totalPublicContributions = 0;
                if (readCacheResponseModel.status) {
                    for (const user of readCacheResponseModel.users) {
                        if (user.publicContributions > 10000) {
                            totalPublicContributions = totalPublicContributions + 10000;
                        } else {
                            totalPublicContributions = totalPublicContributions + (user.publicContributions);
                        }
                    }
                    countriesArray.push({ name: locationDataModel.geoName, value: totalPublicContributions });
                }
            }
        }
        return { ranking: countriesArray };
    }
}

export { RankingJsonFileCreator as createRankingJsonFile };