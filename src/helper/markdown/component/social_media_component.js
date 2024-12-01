class SocialMediaComponent {
    static create(title = '', description = '', url = '') {
        let markdown = '';
        markdown = markdown + '<table>\n';
        markdown = markdown + '<tr>\n';
        markdown = markdown + '<td>\n';
        markdown = markdown + `<a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}"><img src="https://github.com/gayanvoice/github-active-users-monitor/raw/master/public/images/icons/twitter.svg" height="48" width="48" alt="Twitter"/></a>\n`;
        markdown = markdown + '</td>\n';
        markdown = markdown + '<td>\n';
        markdown = markdown + `<a href="https://web.facebook.com/sharer.php?title=${encodeURIComponent(title)}&u=${encodeURIComponent(url)}"><img src="https://github.com/gayanvoice/github-active-users-monitor/raw/master/public/images/icons/facebook.svg" height="48" width="48" alt="Facebook"/></a>\n`;
        markdown = markdown + '</td>\n';
        markdown = markdown + '<td>\n';
        markdown = markdown + `<a href="https://www.linkedin.com/shareArticle?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}"><img src="https://github.com/gayanvoice/github-active-users-monitor/raw/master/public/images/icons/linkedin.svg" height="48" width="48" alt="LinkedIn"/></a>\n`;
        markdown = markdown + '</td>\n';
        markdown = markdown + '<td>\n';
        markdown = markdown + `<a href="https://reddit.com/submit?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}"><img src="https://github.com/gayanvoice/github-active-users-monitor/raw/master/public/images/icons/reddit.svg" height="48" width="48" alt="Reddit"/></a>\n`;
        markdown = markdown + '</td>\n';
        markdown = markdown + '</tr>\n';
        markdown = markdown + '</table>\n\n';
        return markdown;
    }
}

export { SocialMediaComponent as socialMediaComponent };
