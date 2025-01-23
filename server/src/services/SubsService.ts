import { DBManager } from "../db/DBManager.js";
import { DataBaseError, NotFoundError } from "../errors/Errors.js";
import { ISubscription, ICoin, ICollection } from "../interfaces/interfaces.js";

class SubsService {
	private db: DBManager;

	constructor() {
		this.db = new DBManager();
	}

	public async getSubscriptionsByUser(userId: number)
		: Promise<Array<ISubscription<ICollection | ICoin>>> {
		try {
			return await this.db.getAllSubscriptions(userId);
		} catch (error: any) {
			if (error instanceof DataBaseError)
				throw error;

			console.error(`[ERROR]: Failed to retrieve ALL subscriptions for user <${userId}>.`, {
				userId: userId,
				error: error.message
			});
			throw new Error(`Unexpected error.`);
		}
	}

	public async deleteUser(userId: number): Promise<void> {
		try {
			await this.db.deleteUser(userId);
		} catch (error: any) {
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

export { SubsService }
