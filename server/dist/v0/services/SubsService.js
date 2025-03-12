import { DBManager } from "../db/DBManager.js";
import { DataBaseError } from "../errors/Errors.js";
class SubsService {
    db;
    constructor() {
        this.db = new DBManager();
    }
    async getSubscriptionsByUser(userId) {
        try {
            return await this.db.getAllSubscriptions(userId);
        }
        catch (error) {
            if (error instanceof DataBaseError)
                throw error;
            console.error(`[ERROR]: Failed to retrieve ALL subscriptions for user <${userId}>.`, {
                userId: userId,
                error: error.message
            });
            throw new Error(`Unexpected error.`);
        }
    }
    async deleteUser(userId) {
        try {
            await this.db.deleteUser(userId);
        }
        catch (error) {
            if (error instanceof DataBaseError)
                throw error;
            console.error(`[ERROR] Unexpected error while trying to delete a user.`, {
                userId: userId,
                error: error.message
            });
            throw new Error("Unexpected error.");
        }
    }
}
export { SubsService };
