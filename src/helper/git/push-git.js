import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class GitPushHandler {
    static async push() {
        try {
            const { stdout, stderr } = await execAsync('git push');
            if (stderr) {
                console.error('Git push stderr:', stderr);
            }
            console.log('Git push stdout:', stdout);
            return true;
        } catch (error) {
            console.error('Error executing git push:', error);
            return false;
        }
    }
}

export { GitPushHandler as pushGit };