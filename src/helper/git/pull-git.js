import git from '../../core/git';

class GitPuller {
    static async pull() {
        console.log('Git Pull');
        try {
            await git.pull();
        } catch (error) {
            console.error('Error during git pull:', error);
            throw error; // Re-throw to allow caller to handle the error
        }
    }
}

export default GitPuller;