import simpleGit from 'simple-git.js';

class GitHandler {
    constructor() {
        this.git = simpleGit();
    }

    async pull() {
        try {
            await this.git.pull();
        } catch (error) {
            console.error('Error during git pull:', error);
            throw error;
        }
    }

    async commit(username, email, message) {
        try {
            await this.git.addConfig('user.name', username);
            await this.git.addConfig('user.email', email);
            await this.git.add('./*');
            await this.git.commit(message);
        } catch (error) {
            console.error('Error during git commit:', error);
            throw error;
        }
    }

    async push(branch) {
        try {
            await this.git.push('origin', branch);
        } catch (error) {
            console.error('Error during git push:', error);
            throw error;
        }
    }
}

// Export a singleton instance
export default new GitHandler();