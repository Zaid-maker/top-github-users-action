import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class GitPullHandler {
    static async pull() {
        try {
            const { stdout, stderr } = await execAsync('git pull');
            if (stderr) {
                console.error('Git pull stderr:', stderr);
            }
            console.log('Git pull stdout:', stdout);
            return true;
        } catch (error) {
            console.error('Error executing git pull:', error);
            return false;
        }
    }
}

export { GitPullHandler as pullGit };