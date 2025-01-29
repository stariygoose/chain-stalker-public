import {
	ICollection,
	ICoin,
	IUserContext,
	ISubscription,
	IJwt,
	IUserMetadata
} from "../interfaces/interfaces.js";
import { NftCollection } from "./models/NftCollectionModel.js";
import { NftSubscription, CoinSubscription } from "./models/SubscriptionModel.js";
import { DataBaseError, NotFoundError } from "../errors/Errors.js";
import { UserModel } from "./models/UserModel.js";
import { TokenModel } from "./models/TokenModel.js";


class DBManager {
	public async getUser(userId: number): Promise<IUserMetadata | null> {
		try { 
			return await UserModel.findOne({ userId });
		} catch (error: any) {
			console.error(`[ERROR]: Unexpected error while trying to find a User Metadata in Database: `, {
				error: error.message,
				userId: userId
			});
			throw new DataBaseError(`Unexpected error while trying to find a refresh token in Database.`);
		}
	}

	public async findToken(refreshToken: string): Promise<IJwt | null> {
		try {
			return await TokenModel.findOne<IJwt>({refreshToken});
		} catch (error: any) {
			console.error(`[ERROR]: Unexpected error while trying to find a refresh token in Database: `, {
				error: error.message,
				refreshToken: refreshToken
			});
			throw new DataBaseError(`Unexpected error while trying to find a refresh token in Database.`);
		}
	}

	public async addOrUpdateRefreshToken(userId: number, refreshToken: string)
		: Promise<IJwt> {
		try {
			return await TokenModel.findOneAndUpdate<{userId: number, refreshToken: string}>(
				{ userId }, // search
				{ 
					userId: userId, 
					refreshToken 
				}, // update,
				{ upsert: true, new: true }
			);
		} catch (error: any) {
			console.error(`[ERROR]: Unexpected error while trying to update a user's refresh token: `, {
				userId: userId,
				error: error.message
			});
			throw new DataBaseError(`Unexpected error while trying to update a user's refresh token.`);
		}
	}

	public async addOrUpdateUser(userId: number): Promise<IUserMetadata> {
		try {
			return await UserModel.findOneAndUpdate<IUserMetadata>(
				{ userId: userId }, // search
				{ userId: userId }, // update
				{ upsert: true, new: true } // create if not found
			);
		} catch (error: any) {
			console.error(`[ERROR]: Unexpected error while trying to create a user: `, {
				userId: userId,
				error: error.message
			});
			throw new DataBaseError(`Unexpected error while trying to create a user.`);
		}
	}

	public async getSubscriptionsByCoinSymbol(symbol: string)
		: Promise<Array<ISubscription<ICoin>>> {
		try {
			return await CoinSubscription.find<ISubscription<ICoin>>({ 'target.symbol': symbol });
		} catch (error: any) {
			console.error(`ERROR]: Error while getting subscriptions by coin symbol.`, {
				symbol: symbol,
				error: error.message
			});
			throw new DataBaseError(`An unexpected error while searching subscriptions by coin symbol.`)
		}
	}

	public async getAllSubscriptions(userId?: number)
		: Promise<Array<ISubscription<ICollection | ICoin>>> {
		try {
			let nftSubscriptions: Array<ISubscription<ICollection>> = [];
			let coinSubscriptions: Array<ISubscription<ICoin>> = [];

			if (typeof userId === "number") {
				[nftSubscriptions, coinSubscriptions] = await Promise.all([
					this.getNftSubscriptions(userId),
					this.getCoinSubscriptions(userId),
				]);
			}
			else {
				[nftSubscriptions, coinSubscriptions] = await Promise.all([
					this.getNftSubscriptions(),
					this.getCoinSubscriptions(),
				]);
			}

			return [...nftSubscriptions, ...coinSubscriptions];
		} catch (error: any) {
			console.error(`[ERROR]: An unexpected error in getAllSubscriptions.`, {
				userId: userId,
				error: error.message
			});
			throw new DataBaseError("Unexpected error. Can't get all subscriptions from the database for user.");
		}
	}

	public async getNftSubscriptions(userId?: number): Promise<Array<ISubscription<ICollection>>> {
		try {
			let subscriptions: Array<ISubscription<ICollection>> = [];

			if (typeof userId === "number")
				subscriptions = await NftSubscription.find<ISubscription<ICollection>>({ userId: userId });
			else
				subscriptions = await NftSubscription.find<ISubscription<ICollection>>({});

			return subscriptions;
		} catch (error: any) {
			console.error(`[ERROR]: An unexpected error in getNftSubscriptions.`, {
				userId: userId,
				error: error.message
			});
			throw new DataBaseError(`Can't get subscriptions with target NFT from the database.`);
		}
	}

	public async getCoinSubscriptions(userId?: number): Promise<Array<ISubscription<ICoin>>> {
		try {
			let subscriptions: Array<ISubscription<ICoin>> = [];

			if (typeof userId === "number")
				subscriptions = await CoinSubscription.find<ISubscription<ICoin>>({ userId });
			else
				subscriptions = await CoinSubscription.find<ISubscription<ICoin>>({});

			return subscriptions;
		} catch (error: any) {
			console.error(`[ERROR]: An unexpected error in getCoinSubscriptions.`, {
				userId: userId,
				error: error.messsage
			});
			throw new DataBaseError(`Can't get subscriptions with coin target from the database.`);
		}
	}

	public async getFloorPriceFromDB(userId: number, slug: string): Promise<number> {
		try {
			const collection = await NftSubscription.findOne<ISubscription<ICollection>>(
				{ userId: userId, 'target.collection': slug }
			)
			if (!collection)
				throw new NotFoundError(`No subscription found for user <${userId}> with slug <${slug}>.`);

			return collection.target.floorPrice;
		} catch (error: any) {
			if (error instanceof NotFoundError)
				throw error;
			
			console.error(`[ERROR]: An unexpected error in getFloorPriceFromDB.`, {
				userId: userId,
				target: { collection: slug },
				error: error.message
			})
			throw new DataBaseError(`Can't get the floor price from the database.`);
		}
	}

	public async updateFloorPrice(userId: number, slug: string, fp: number)
		: Promise<ISubscription<ICollection>> {
		try {
			const sub = await NftSubscription.findOneAndUpdate<ISubscription<ICollection>>(
				{ userId: userId, 'target.collection': slug },
				{
					'target.floorPrice': fp,
					updatedAt: new Date()
				},
				{ new: true }
			)
			if (!sub)
				throw new NotFoundError(`Can't find the subscription with slug <${slug}> for user <${userId}>`);

			return sub;
		} catch (error: any) {
			if (error instanceof NotFoundError)
				throw error;

			console.error(`[ERROR]: Error adding or updating NFT subscription for user.`, {
				userId: userId,
				target: {
					collection: slug,
					floorPrice: fp
				},
				error: error.message
			});
			throw new DataBaseError("Can't add or update NFT subscription in the database.");
		}
	}

	public async addSubAndCollection(data: IUserContext<ICollection>)
		: Promise<ISubscription<ICollection>> {
		try {
			const subscription = await this.addOrUpdateNftSubscription(data);
			await this.addOrUpdateNftCollection(data);

			return subscription;
		} catch (error: any) {
			console.error(`[ERROR]: Unexpected error in addSubAndCollection.`, {
				data: data,
				error: error.message
			});
			throw new DataBaseError(`Can't add subscription and collection to the database.`);
		}
	}

	private async addOrUpdateNftSubscription(data: IUserContext<ICollection>)
		: Promise<ISubscription<ICollection>> {
		const { userId, target, percentage } = data;

		try {
			return await NftSubscription.findOneAndUpdate<ISubscription<ICollection>>(
				{ userId: userId, 'target.collection': target.collection }, // search
				{
					userId: userId,
					target: target,
					percentage: percentage,
					updatedAt: new Date()
				}, // update
				{ upsert: true, new: true } // create if not found
			);
		} catch (error: any) {
			console.error(`[ERROR] Error adding or updating NFT subscription for user: ${error.message}`, {
				userId: userId,
				target: target,
				percentage: percentage,
			});
			throw new DataBaseError(`Can't add or update nft subscription in database.`);
		}
	}

	private async addOrUpdateNftCollection(data: IUserContext<ICollection>): Promise<ICollection> {
		const { target } = data;

		try {
			return await NftCollection.findOneAndUpdate<ICollection>(
				{ collection: target.collection }, // search
				{
					...target,
					updatedAt: new Date()
				}, // update
				{ upsert: true, new: true } // create
			);
		} catch (error: any) {
			console.error(`[ERROR]: Error adding NFT collection.`, {
				target: target,
				error: error.message
			});
			throw new DataBaseError(`Can't add NFT collection to the database.`);
		}
	}

	public async addOrUpdateCoinSubscription(data: IUserContext<ICoin>)
		: Promise<ISubscription<ICoin>> {
		const { userId, target, percentage } = data;

		try {
			return await CoinSubscription.findOneAndUpdate<ISubscription<ICoin>>(
				{ userId: userId, "target.symbol": target.symbol }, // search
				{
					userId: userId,
					target: {
						symbol: target.symbol,
						price: target.price
					},
					percentage: percentage,
					updatedAt: new Date()
				}, // update
				{ upsert: true, new: true } // create
			);
		} catch (error: any) {
			console.error(`[ERROR]: Error adding COIN subscription.`, {
				userId: userId,
				target: {
					symbol: target.symbol,
					price: target.price
				},
				percentage: percentage,
				error: error.message
			});
			throw new DataBaseError("Can't add or update coin subscription in the database.");
		}
	}

	public async deleteUser(userId: number) {
		try {
			await CoinSubscription.deleteMany({ userId: userId });
			await NftSubscription.deleteMany({ userId: userId });
		} catch (error: any) {
			console.error(`[ERROR]: Unexpected error while trying to delete a user.`, {
				userId: userId,
				error: error.message
			});
			throw new DataBaseError(`Unexpected error while trying to delete a user <${userId}>`);
		}
	}
}

export { DBManager };
