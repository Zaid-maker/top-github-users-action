import { formatMarkdown } from '../format_markdown.js';
import { headerComponent } from '../component/header_component.js';
import { starComponent } from '../component/star_component.js';
import { socialMediaComponent } from '../component/social_media_component.js';
import { shortcutMenuComponent } from '../component/shortcut_menu_component.js';
import { thirdPartyComponent } from '../component/third_party_component.js';
import { licenseComponent } from '../component/license_component.js';

class TotalContributionsPageCreator {
    static createUserTableByTotalContributions(readCacheResponseModel) {
        readCacheResponseModel.users.sort((a, b) => parseFloat(b.totalContributions) - parseFloat(a.totalContributions));
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
            table = table + '<th>Total Contributions</th>\n';
            table = table + '</tr>\n';
            for (const user of readCacheResponseModel.users) {
                if (user.totalContributions > 0 && index <= 1000) {
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
                    table = table + `<td>${user.totalContributions}</td>\n`;
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
        let markdown = headerComponent.create('Total Contributions', country);
        markdown = markdown + `<a href="https://gayanvoice.github.io/top-github-users/index.html">\n`;
        markdown = markdown + `<img align="right" width="200" src="${outputMarkdownModel.locationDataModel.imageUrl}" alt="${country}">\n`;
        markdown = markdown + `</a>\n\n`;
        markdown = markdown + `The \`total contributions\` by users in ${country} on \`${formatMarkdown.getDate()}\`. `;
        markdown = markdown + `This list contains users from ${formatMarkdown.getLocations(outputMarkdownModel.locationDataModel)}.\n\n`;
        markdown = markdown + starComponent.create(outputMarkdownModel.githubUsernameAndRepository);
        markdown = markdown + socialMediaComponent.create(
            `Top GitHub Users By Total Contributions in ${country}`,
            "List of most active github users based on total contributions by country",
            `https://github.com/${outputMarkdownModel.githubUsernameAndRepository}/blob/main/markdown/total_contributions/${formatMarkdown.getCountryName(outputMarkdownModel.locationDataModel.country)}.md`);
        markdown = markdown + this.createUserTableByTotalContributions(outputMarkdownModel.readCacheResponseModel);
        markdown = markdown + `### 🚀 Share on\n\n`;
        markdown = markdown + socialMediaComponent.create(
            `Top GitHub Users By Total Contributions in ${country}`,
            "List of most active github users based on total contributions by country",
            `https://github.com/${outputMarkdownModel.githubUsernameAndRepository}/blob/main/markdown/total_contributions/${formatMarkdown.getCountryName(outputMarkdownModel.locationDataModel.country)}.md`);
        markdown = markdown + licenseComponent.create(outputMarkdownModel.githubUsernameAndRepository);
        return markdown;
    }
}

export { TotalContributionsPageCreator as createTotalContributionsPage };