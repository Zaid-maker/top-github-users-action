class LicenseComponent {
    static create(githubUsernameAndRepository) {
        let markdown = '';
        markdown = markdown + '### 📝 License\n\n';
        markdown = markdown + '- GitHub Action - [' + githubUsernameAndRepository + '/blob/main/LICENSE](https://github.com/' + githubUsernameAndRepository + '/blob/main/LICENSE)\n';
        markdown = markdown + '- Repository - [' + githubUsernameAndRepository + '](https://github.com/' + githubUsernameAndRepository + ')\n';
        markdown = markdown + '- Data in the `./cache` directory - [Open Database License](https://opendatacommons.org/licenses/odbl/1-0/)\n';
        markdown = markdown + '- Code - [MIT](./LICENSE) © [Gayan Kuruppu](https://github.com/gayanvoice)\n';
        return markdown;
    }
}

export { LicenseComponent as licenseComponent };