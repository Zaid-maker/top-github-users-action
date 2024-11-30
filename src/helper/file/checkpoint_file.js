import file from '../../core/file';
import ReadCheckpointResponseModel from '../../model/checkpoint/ReadCheckpointResponseModel';

class CheckpointFileHandler {
    static CHECKPOINT_PATH = 'checkpoint.json';

    static async outputCheckpointFile(checkpointData) {
        try {
            const response = await file.outputJson(this.CHECKPOINT_PATH, checkpointData);
            console.log(`Checkpoint saved: ${response.message}`);
            return response;
        } catch (error) {
            console.error('Error writing checkpoint file:', error);
            throw error;
        }
    }

    static async readCheckpointFile() {
        try {
            const response = await file.readJson(this.CHECKPOINT_PATH);
            console.log(`Checkpoint read: ${response.message}`);

            if (!response.status) {
                throw new Error(`Failed to read checkpoint: ${response.message}`);
            }

            return new ReadCheckpointResponseModel(true, response.content);
        } catch (error) {
            console.error('Error reading checkpoint file:', error);
            // Return a new checkpoint starting at 0 if file doesn't exist or is corrupted
            return new ReadCheckpointResponseModel(false, { checkpoint: 0 });
        }
    }

    static async updateCheckpoint(checkpoint) {
        try {
            const data = {
                checkpoint,
                lastUpdated: new Date().toISOString()
            };
            return await this.outputCheckpointFile(data);
        } catch (error) {
            console.error('Error updating checkpoint:', error);
            throw error;
        }
    }

    static async resetCheckpoint() {
        try {
            return await this.updateCheckpoint(0);
        } catch (error) {
            console.error('Error resetting checkpoint:', error);
            throw error;
        }
    }
}

export default CheckpointFileHandler;