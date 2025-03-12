import axios from "axios";
import { WebSocket } from "ws";
import { OpenSeaStreamClient } from "@opensea/stream-js";
import { Channel } from "../../interfaces/interfaces.js";
import { calculatePercentage, fromWeiToEth } from "../../functions/functions.js";
import { DBManager } from "../../db/DBManager.js";
import { BotService } from "../BotService.js";
import { ApiError, NotFoundError } from "../../errors/Errors.js";
class OpenSea {
    url;
    client;
    db;
    headers;
    constructor() {
        this.url = `https://api.opensea.io/api/v2`;
        this.client = this.createClient();
        this.db = new DBManager();
        this.headers = {
            "accept": "application/json",
            "x-api-key": `${process.env.OPENSEA_TOKEN}`
        };
    }
    /*
     * By address
    */
    async getCollection(network, address) {
        try {
            const collection = await axios.get(`${this.url}/chain/${network}/contract/${address}`, {
                headers: this.headers
            });
            return collection.data;
        }
        catch (error) {
            console.error(`[ERROR]: Failed to fetch collection data from Opensea API.`, {
                address: address,
                network: network,
                error: error.message,
            });
            if (error.response.status === 400)
                throw new NotFoundError(`Invalid contract address. Can not find collection on Opensea.`);
            else
                throw new ApiError("Failed to fetch collection data from Opensea API.", error.status);
        }
    }
    async getFloorPrice(slug) {
        try {
            const stats = await axios.get(`${this.url}/collections/${slug}/stats`, {
                headers: this.headers
            });
            return {
                floorPrice: stats.data.total.floor_price,
                floorPriceSymbol: stats.data.total.floor_price_symbol
            };
        }
        catch (error) {
            console.error(`[ERROR]: Failed to fetch floor price data from Opensea API.`, {
                slug: slug,
                error: error.message,
            });
            if (error.response.status === 400)
                throw new NotFoundError(`Invalid slug. Can not find collection on Opensea.`);
            else
                throw new ApiError("Failed to fetch collection data from Opensea API.", error.status);
        }
    }
    async stalkCollection(chatId, slug, percentage) {
        this.client.onItemListed(slug, async (event) => {
            const fp = await this.db.getFloorPriceFromDB(chatId, slug);
            if (fp != null)
                this.onItemListed(chatId, event, percentage, fp);
        });
        this.client.onItemSold(slug, async (event) => {
            const fp = await this.db.getFloorPriceFromDB(chatId, slug);
            if (fp != null)
                this.onItemSold(chatId, event, percentage, fp);
        });
    }
    createClient() {
        return new OpenSeaStreamClient({
            token: process.env.OPENSEA_TOKEN ?? "",
            connectOptions: {
                transport: WebSocket
            }
        });
    }
    static async initStalksAfterReboot(openSea) {
        const subs = await new DBManager().getNftSubscriptions()
            .catch((error) => { throw error; });
        subs.forEach(({ userId, target, percentage }) => {
            openSea.stalkCollection(userId, target.collection, percentage);
        });
    }
    async onItemListed(userId, event, percentage, currFP) {
        const listingPrice = fromWeiToEth(+event.payload.base_price);
        const { slug } = event.payload.collection;
        if (!listingPrice || typeof listingPrice !== "number") {
            console.error(`[ERROR]: Invalid type of listing price in Opensea.onItemListed.`, {
                slug: slug,
                listingPrice: listingPrice,
                receivedTypeOfPrice: typeof listingPrice
            });
            throw new Error("Invalid type of listing price");
        }
        if (currFP > listingPrice) {
            const changedPercentage = calculatePercentage(currFP, listingPrice);
            if (percentage <= Math.abs(changedPercentage)) {
                const subscriptionWithUpdatedFP = await this.db.updateFloorPrice(userId, slug, listingPrice);
                if (!subscriptionWithUpdatedFP)
                    return;
                const msgToBot = {
                    userId: userId,
                    target: subscriptionWithUpdatedFP.target,
                    percentage: changedPercentage
                };
                BotService.sendToTGBot(msgToBot, Channel.NFT_PRICE_CHANGED);
            }
        }
        if (currFP < listingPrice) {
            const newFP = await this.getFloorPrice(slug);
            const changedPercentage = calculatePercentage(currFP, newFP.floorPrice);
            if (percentage <= Math.abs(changedPercentage)) {
                const subscriptionWithUpdatedFP = await this.db.updateFloorPrice(userId, slug, newFP.floorPrice);
                if (!subscriptionWithUpdatedFP)
                    return;
                const msgToBot = {
                    userId: userId,
                    target: subscriptionWithUpdatedFP.target,
                    percentage: changedPercentage
                };
                BotService.sendToTGBot(msgToBot, Channel.NFT_PRICE_CHANGED);
            }
        }
    }
    async onItemSold(userId, event, percentage, currFP) {
        const { slug } = event.payload.collection;
        const newFP = await this.getFloorPrice(slug);
        const changedPercentage = calculatePercentage(currFP, newFP.floorPrice);
        if (percentage <= Math.abs(changedPercentage)) {
            const subscriptionWithUpdatedFP = await this.db.updateFloorPrice(userId, slug, newFP.floorPrice);
            if (!subscriptionWithUpdatedFP)
                return;
            const msgToBot = {
                userId: userId,
                target: subscriptionWithUpdatedFP.target,
                percentage: changedPercentage
            };
            BotService.sendToTGBot(msgToBot, Channel.NFT_PRICE_CHANGED);
        }
    }
}
export { OpenSea };
