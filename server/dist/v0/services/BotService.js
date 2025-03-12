import axios from "axios";
import { DBManager } from "../db/DBManager.js";
import { ApiError, DataBaseError, NotFoundError } from "../errors/Errors.js";
import { BinanceWebsocket } from "./marketplaces/binance/BinanceWebsocket.js";
class BotService {
    openSea;
    wsManager;
    db;
    constructor(os, wsManager) {
        this.openSea = os;
        this.wsManager = wsManager;
        this.db = new DBManager();
    }
    static async sendToTGBot(state, channel) {
        try {
            await axios.post(`${process.env.BOT_URL}/${channel}`, state);
            console.log(`[INFO]: Successfully sent data to bot on channel ${channel}.`);
        }
        catch (error) {
            console.error(`[ERROR]: Failed to send data to bot.`, {
                state: state,
                channel: channel,
                error: error.message
            });
        }
    }
    /*
     * By address
    */
    async findColleciton(network, address) {
        try {
            const collection = await this.openSea.getCollection(network, address);
            const slug = collection.collection;
            const floorPrice = await this.openSea.getFloorPrice(slug);
            const res = {
                ...collection, ...floorPrice
            };
            return res;
        }
        catch (error) {
            if (error instanceof ApiError)
                throw error;
            throw new Error();
        }
    }
    /*
     * By Symbol
    */
    async findCoin(symbol) {
        try {
            return await BinanceWebsocket.getCoin(symbol);
        }
        catch (error) {
            if (error instanceof ApiError)
                throw error;
            throw new Error("Unexpected error.");
        }
    }
    async stalkCoin(data) {
        try {
            await this.db.addOrUpdateCoinSubscription(data);
            await this.wsManager.connect(data.userId, data.target.symbol);
        }
        catch (error) {
            if (error instanceof DataBaseError)
                throw error;
            console.error(`[ERROR]: Error while stalking coin ${data.target.symbol} for user ${data.userId}.`, {
                data: data,
                error: error.message
            });
            throw new Error(`Unexpected error.`);
        }
    }
    async stalkNft(data) {
        try {
            const subscription = await this.db.addSubAndCollection(data);
            const { userId, percentage, target } = subscription;
            this.openSea.stalkCollection(userId, target.collection, percentage);
        }
        catch (error) {
            if ((error instanceof DataBaseError) || (error instanceof NotFoundError))
                throw error;
            console.error(`[ERROR]: Unknown error occurred while stalking NFT collection.`, {
                data: data,
                error: error.message
            });
            throw new Error("An unknown error occurred while stalking the NFT collection.");
        }
    }
}
export { BotService };
