class FormatMarkdown {
    static capitalizeTheFirstLetterOfEachWord(words) {
        let separateWord = words.toLowerCase().split(' ');
        for (let i = 0; i < separateWord.length; i++) {
            separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
                separateWord[i].substring(1);
        }
        return separateWord.join(' ');
    }

    static breakWords(words, numberOfWords) {
        let separateWord = words.toLowerCase().split(' ');
        let sentence = '';
        let iterations = 1;
        for (const word of separateWord) {
            if (iterations === numberOfWords) {
                iterations = numberOfWords;
                sentence = sentence + `${this.capitalizeTheFirstLetterOfEachWord(word).substring(0, 20)}<br/>`;
            } else {
                iterations++;
                sentence = sentence + `${this.capitalizeTheFirstLetterOfEachWord(word).substring(0, 20)} `;
            }
        }
        return sentence;
    }

    static getDate() {
        let date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    static getCompany(company) {
        if (company === null || company === undefined || company === '') {
            return '-';
        } else {
            return company;
        }
    }

    static getName(name) {
        if (name === null || name === undefined || name === '') {
            return '-';
        } else {
            return name;
        }
    }

    static getTwitterUsername(twitterUsername) {
        if (twitterUsername === null || twitterUsername === undefined || twitterUsername === '') {
            return '-';
        } else {
            return `<a href="https://twitter.com/${twitterUsername}">@${twitterUsername}</a>`;
        }
    }

    static getLocations(locationDataModel) {
        let locations = '';
        if (locationDataModel.cities === undefined || locationDataModel.cities.length === 0) {
            locations = locations + `<h4>No cities in ${this.capitalizeTheFirstLetterOfEachWord(locationDataModel.country)}</h4>`;
        } else {
            for (const city of locationDataModel.cities) {
                locations = locations + `<code>${city}</code> `;
            }
        }
        return locations;
    }

    static getMinimumFollowersRequirement(readCacheResponseModel) {
        if (readCacheResponseModel.users === undefined || readCacheResponseModel.users.length === 0) {
            return 0;
        }
        return readCacheResponseModel.users[readCacheResponseModel.users.length - 1].followers;
    }

    static getCountryName(country) {
        return country.toLowerCase().replace(/ /g, '-');
    }

    static getNumberOfCities(readConfigResponseModel) {
        let count = 0;
        for (const country of readConfigResponseModel.countries) {
            if (country.cities !== undefined) {
                count = count + country.cities.length;
            }
        }
        return count;
    }
}

export { FormatMarkdown as formatMarkdown };
