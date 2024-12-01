import { formatMarkdown } from '../format_markdown.js';

class ShortcutMenuComponent {
    static create(indexUrl, country, index) {
        let publicContributionsUrl  = `${indexUrl}/blob/main/markdown/public_contributions/${formatMarkdown.getCountryName(country)}.md`;
        let totalContributionsUrl  = `${indexUrl}/blob/main/markdown/total_contributions/${formatMarkdown.getCountryName(country)}.md`;
        let followersUrl  = `${indexUrl}/blob/main/markdown/followers/${formatMarkdown.getCountryName(country)}.md`;
        let table = '<table>\n';
        table = table + '<tr>\n';
        if(index === 0){
            table = table + '<td>\n';
            table = table + '<strong>Top Users By Public Contributions</strong>\n';
            table = table + '</td>\n';
        } else {
            table = table + '<td>\n';
            table = table + `<a href="${publicContributionsUrl}">Top Users By Public Contributions</a>\n`;
            table = table + '</td>\n';
        }
        if(index === 1){
            table = table + '<td>\n';
            table = table + '<strong>Top Users By Total Contributions</strong>\n';
            table = table + '</td>\n';
        } else {
            table = table + '<td>\n';
            table = table + `<a href="${totalContributionsUrl}">Top Users By Total Contributions</a>\n`;
            table = table + '</td>\n';
        }
        if(index === 2){
            table = table + '<td>\n';
            table = table + '<strong>Top Users By Followers</strong>\n';
            table = table + '</td>\n';
        } else {
            table = table + '<td>\n';
            table = table + `<a href="${followersUrl}">Top Users By Followers</a>\n`;
            table = table + '</td>\n';
        }
        table = table + '</tr>\n';
        table = table + '</table>\n\n';
        return table;
    }
}

export { ShortcutMenuComponent as shortcutMenuComponent };
