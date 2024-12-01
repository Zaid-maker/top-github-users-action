import { formatMarkdown } from '../format_markdown.js';
import { headerComponent } from '../component/header_component.js';
import { starComponent } from '../component/star_component.js';
import { socialMediaComponent } from '../component/social_media_component.js';
import { shortcutMenuComponent } from '../component/shortcut_menu_component.js';
import { thirdPartyComponent } from '../component/third_party_component.js';
import { licenseComponent } from '../component/license_component.js';

class PublicContributionsPageCreator {
    static createUserTableByPublicContributions(readCacheResponseModel) {
        readCacheResponseModel.users.sort((a, b) => parseFloat(b.publicContributions) - parseFloat(a.publicContributions));
        let index = 1;
        let table = '';
        if (readCacheResponseModel.users === undefined || readCacheResponseModel.users.length === 0) {
            table = table + '<h4>The table is empty</h4>';
        } else {
            table = table + '<table>\n';
            table = table + '<tr>\n';
            table = table + '<th>#</th>\n';
            table = table + '<th>Name</th>\n';
            table = table + '<th>Company</th>\n';
            table = table + '<th>Twitter Username</th>\n';
            table = table + '<th>Location</th>\n';
            table = table + '<th>Public Contributions</th>\n';
            table = table + '</tr>\n';
            for (const user of readCacheResponseModel.users) {
                if (user.publicContributions > 0 && index <= 1000) {
                    table = table + '<tr>\n';
                    table = table + `<td>${index}</td>\n`;
                    table = table + `<td>\n`;
                    table = table + `<a href="https://github.com/${user.login}">\n`;
                    table = table + `<img src="${user.avatarUrl}" width="24" alt="Avatar of ${user.login}"> ${user.login}\n`;
                    table = table + `</a><br/>\n`;
                    table = table + `${formatMarkdown.getName(user.name)}\n`;
                    table = table + `</td>\n`;
                    table = table + `<td>${formatMarkdown.getCompany(user.company)}</td>\n`;
                    table = table + `<td>${formatMarkdown.getTwitterUsername(user.twitterUsername)}</td>\n`;
                    table = table + `<td>${user.location}</td>\n`;
                    table = table + `<td>${user.publicContributions}</td>\n`;
                    table = table + '</tr>\n';
                }
                index++;
            }
            table = table + '</table>\n\n';
        }
        return table;
    }

    static create(outputMarkdownModel) {
        let country = formatMarkdown.capitalizeTheFirstLetterOfEachWord(outputMarkdownModel.locationDataModel.country);
        let markdown = headerComponent.create(`Public Contributions`, country);
        markdown = markdown + `<a href="https://gayanvoice.github.io/top-github-users/index.html">\n`;
        markdown = markdown + `<img align="right" width="200" src="${outputMarkdownModel.locationDataModel.imageUrl}" alt="${country}">\n`;
        markdown = markdown + `</a>\n\n`;
        markdown = markdown + `The \`public contributions\` by users in ${country} on \`${formatMarkdown.getDate()}\`. `;
        markdown = markdown + `This list contains users from ${formatMarkdown.getLocations(outputMarkdownModel.locationDataModel)}.\n\n`;
        markdown = markdown + `There are \`${outputMarkdownModel.readConfigResponseModel.locations.length} countries\` and \`${formatMarkdown.getNumberOfCities(outputMarkdownModel.readConfigResponseModel)} cities\` can be found [here](https://github.com/${outputMarkdownModel.githubUsernameAndRepository}).\n\n`;
        markdown = markdown + `There are \`${outputMarkdownModel.readCacheResponseModel.users.length} users\`  in ${country}. You need at least \`${formatMarkdown.getMinimumFollowersRequirement(outputMarkdownModel.readCacheResponseModel)} followers\` to be on this list.\n\n`;
        markdown = markdown + starComponent.create();
        markdown = markdown + shortcutMenuComponent.create(
            `https://github.com/${outputMarkdownModel.githubUsernameAndRepository}`,
            outputMarkdownModel.locationDataModel.country,
            0);
        markdown = markdown + `### 🚀 Share on\n\n`;
        markdown = markdown + socialMediaComponent.create(
            `Top GitHub Users By Public Contributions in ${country}`,
            "List of most active github users based on public contributions by country",
            `https://github.com/${outputMarkdownModel.githubUsernameAndRepository}/blob/main/markdown/public_contributions/${formatMarkdown.getCountryName(outputMarkdownModel.locationDataModel.country)}.md`);
        markdown = markdown + this.createUserTableByPublicContributions(outputMarkdownModel.readCacheResponseModel);
        markdown = markdown + `### 🚀 Share on\n\n`;
        markdown = markdown + socialMediaComponent.create(
            `Top GitHub Users By Public Contributions in ${country}`,
            `List of most active github users based on public contributions by country`,
            `https://github.com/${outputMarkdownModel.githubUsernameAndRepository}/blob/main/markdown/public_contributions/${formatMarkdown.getCountryName(outputMarkdownModel.locationDataModel.country)}.md`);
        markdown = markdown + thirdPartyComponent.create();
        markdown = markdown + licenseComponent.create(outputMarkdownModel.githubUsernameAndRepository);
        return markdown;
    }
}

export { PublicContributionsPageCreator as createPublicContributionsPage };