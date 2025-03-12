import { NftCollection } from "./models/NftCollectionModel.js";
import { NftSubscription, CoinSubscription } from "./models/SubscriptionModel.js";
import { DataBaseError, NotFoundError } from "../errors/Errors.js";
import { UserModel } from "./models/UserModel.js";
import { TokenModel } from "./models/TokenModel.js";
class DBManager {
    async getUser(userId) {
        try {
            return await UserModel.findOne({ userId });
        }
        catch (error) {
            console.error(`[ERROR]: Unexpected error while trying to find a User Metadata in Database: `, {
                error: error.message,
                userId: userId
            });
            throw new DataBaseError(`Unexpected error while trying to find a refresh token in Database.`);
        }
    }
    async findToken(refreshToken) {
        try {
            return await TokenModel.findOne({ refreshToken });
        }
        catch (error) {
            console.error(`[ERROR]: Unexpected error while trying to find a refresh token in Database: `, {
                error: error.message,
                refreshToken: refreshToken
            });
            throw new DataBaseError(`Unexpected error while trying to find a refresh token in Database.`);
        }
    }
    async addOrUpdateRefreshToken(userId, refreshToken) {
        try {
            return await TokenModel.findOneAndUpdate({ userId }, // search
            {
                userId: userId,
                refreshToken
            }, // update,
            { upsert: true, new: true });
        }
        catch (error) {
            console.error(`[ERROR]: Unexpected error while trying to update a user's refresh token: `, {
                userId: userId,
                error: error.message
            });
            throw new DataBaseError(`Unexpected error while trying to update a user's refresh token.`);
        }
    }
    async addOrUpdateUser(userId) {
        try {
            return await UserModel.findOneAndUpdate({ userId: userId }, // search
            { userId: userId }, // update
            { upsert: true, new: true } // create if not found
            );
        }
        catch (error) {
            console.error(`[ERROR]: Unexpected error while trying to create a user: `, {
                userId: userId,
                error: error.message
            });
            throw new DataBaseError(`Unexpected error while trying to create a user.`);
        }
    }
    async getSubscriptionsByCoinSymbol(symbol) {
        try {
            return await CoinSubscription.find({ 'target.symbol': symbol });
        }
        catch (error) {
            console.error(`ERROR]: Error while getting subscriptions by coin symbol.`, {
                symbol: symbol,
                error: error.message
            });
            throw new DataBaseError(`An unexpected error while searching subscriptions by coin symbol.`);
        }
    }
    async getAllSubscriptions(userId) {
        try {
            let nftSubscriptions = [];
            let coinSubscriptions = [];
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
        }
        catch (error) {
            console.error(`[ERROR]: An unexpected error in getAllSubscriptions.`, {
                userId: userId,
                error: error.message
            });
            throw new DataBaseError("Unexpected error. Can't get all subscriptions from the database for user.");
        }
    }
    async getNftSubscriptions(userId) {
        try {
            let subscriptions = [];
            if (typeof userId === "number")
                subscriptions = await NftSubscription.find({ userId: userId });
            else
                subscriptions = await NftSubscription.find({});
            return subscriptions;
        }
        catch (error) {
            console.error(`[ERROR]: An unexpected error in getNftSubscriptions.`, {
                userId: userId,
                error: error.message
            });
            throw new DataBaseError(`Can't get subscriptions with target NFT from the database.`);
        }
    }
    async getCoinSubscriptions(userId) {
        try {
            let subscriptions = [];
            if (typeof userId === "number")
                subscriptions = await CoinSubscription.find({ userId });
            else
                subscriptions = await CoinSubscription.find({});
            return subscriptions;
        }
        catch (error) {
            console.error(`[ERROR]: An unexpected error in getCoinSubscriptions.`, {
                userId: userId,
                error: error.messsage
            });
            throw new DataBaseError(`Can't get subscriptions with coin target from the database.`);
        }
    }
    async getFloorPriceFromDB(userId, slug) {
        try {
            const collection = await NftSubscription.findOne({ userId: userId, 'target.collection': slug });
            if (!collection)
                throw new NotFoundError(`No subscription found for user <${userId}> with slug <${slug}>.`);
            return collection.target.floorPrice;
        }
        catch (error) {
            if (error instanceof NotFoundError)
                throw error;
            console.error(`[ERROR]: An unexpected error in getFloorPriceFromDB.`, {
                userId: userId,
                target: { collection: slug },
                error: error.message
            });
            throw new DataBaseError(`Can't get the floor price from the database.`);
        }
    }
    async updateFloorPrice(userId, slug, fp) {
        try {
            const sub = await NftSubscription.findOneAndUpdate({ userId: userId, 'target.collection': slug }, {
                'target.floorPrice': fp,
                updatedAt: new Date()
            }, { new: true });
            if (!sub)
                throw new NotFoundError(`Can't find the subscription with slug <${slug}> for user <${userId}>`);
            return sub;
        }
        catch (error) {
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
    async addSubAndCollection(data) {
        try {
            const subscription = await this.addOrUpdateNftSubscription(data);
            await this.addOrUpdateNftCollection(data);
            return subscription;
        }
        catch (error) {
            console.error(`[ERROR]: Unexpected error in addSubAndCollection.`, {
                data: data,
                error: error.message
            });
            throw new DataBaseError(`Can't add subscription and collection to the database.`);
        }
    }
    async addOrUpdateNftSubscription(data) {
        const { userId, target, percentage } = data;
        try {
            return await NftSubscription.findOneAndUpdate({ userId: userId, 'target.collection': target.collection }, // search
            {
                userId: userId,
                target: target,
                percentage: percentage,
                updatedAt: new Date()
            }, // update
            { upsert: true, new: true } // create if not found
            );
        }
        catch (error) {
            console.error(`[ERROR] Error adding or updating NFT subscription for user: ${error.message}`, {
                userId: userId,
                target: target,
                percentage: percentage,
            });
            throw new DataBaseError(`Can't add or update nft subscription in database.`);
        }
    }
    async addOrUpdateNftCollection(data) {
        const { target } = data;
        try {
            return await NftCollection.findOneAndUpdate({ collection: target.collection }, // search
            {
                ...target,
                updatedAt: new Date()
            }, // update
            { upsert: true, new: true } // create
            );
        }
        catch (error) {
            console.error(`[ERROR]: Error adding NFT collection.`, {
                target: target,
                error: error.message
            });
            throw new DataBaseError(`Can't add NFT collection to the database.`);
        }
    }
    async addOrUpdateCoinSubscription(data) {
        const { userId, target, percentage } = data;
        try {
            return await CoinSubscription.findOneAndUpdate({ userId: userId, "target.symbol": target.symbol }, // search
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
        }
        catch (error) {
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
    async deleteUser(userId) {
        try {
            await CoinSubscription.deleteMany({ userId: userId });
            await NftSubscription.deleteMany({ userId: userId });
        }
        catch (error) {
            console.error(`[ERROR]: Unexpected error while trying to delete a user.`, {
                userId: userId,
                error: error.message
            });
            throw new DataBaseError(`Unexpected error while trying to delete a user <${userId}>`);
        }
    }
}
export { DBManager };
