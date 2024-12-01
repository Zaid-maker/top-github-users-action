class StarComponent {
    static create(githubUsernameAndRepository) {
        let markdown = '';
        markdown = markdown + '### ⭐ Give a Star\n\n';
        markdown = markdown + `You can also give a star to support the project. Feel free to follow ${githubUsernameAndRepository.split('/')[0]} to get notified about new updates.\n\n`;
        return markdown;
    }
}

export { StarComponent as starComponent };