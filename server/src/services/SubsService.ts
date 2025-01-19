import { DBManager } from "../db/DBManager.js";
import { DataBaseError } from "../errors/Errors.js";
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
			console.error(`[ERROR]: Failed to retrieve subscriptions for user <${userId}>.`, {
				userId,
				error: error.message
			});

			if (error instanceof DataBaseError)
				throw error;

			throw new Error(`An unexpected error occurred while retrieving subscriptions for user ${userId}`);
		}
	}
}

export { SubsService }