import git from '../../core/git.js';

class GitCommitter {
    static async commit(message) {
        const gitHandler = git.getGit();
        await gitHandler.add('.');
        await gitHandler.commit(message);
    }
}

export { GitCommitter as commitGit };