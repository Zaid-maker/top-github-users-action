import checkpointFile from '../../helper/file/checkpoint_file.js';
import CheckpointDataModel from '../../model/data/CheckpointDataModel.js';

class CheckpointHandler {
    static async saveCheckpoint(locationsArray, country, currentCheckpoint) {
        try {
            const countryIndex = locationsArray.findIndex(
                location => location.country === country
            );

            if (countryIndex === currentCheckpoint) {
                console.log('Checkpoint updated:', country);
                
                const nextCheckpoint = countryIndex >= locationsArray.length - 1
                    ? 0  // Reset to beginning if we're at the end
                    : countryIndex + 1;

                await this.updateCheckpointFile(nextCheckpoint);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error saving checkpoint:', error);
            throw error;
        }
    }

    static async updateCheckpointFile(checkpoint) {
        try {
            const checkpointData = new CheckpointDataModel(checkpoint);
            await checkpointFile.outputCheckpointFile(checkpointData);
            console.log(`Checkpoint file updated to: ${checkpoint}`);
        } catch (error) {
            console.error('Error updating checkpoint file:', error);
            throw error;
        }
    }

    static async readCheckpoint() {
        try {
            const response = await checkpointFile.readCheckpointFile();
            console.log('Current checkpoint:', response.checkpoint);
            return response;
        } catch (error) {
            console.error('Error reading checkpoint:', error);
            throw error;
        }
    }

    static async resetCheckpoint() {
        try {
            await this.updateCheckpointFile(0);
            console.log('Checkpoint reset to 0');
            return true;
        } catch (error) {
            console.error('Error resetting checkpoint:', error);
            throw error;
        }
    }
}

export default CheckpointHandler;