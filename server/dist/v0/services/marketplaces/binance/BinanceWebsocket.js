import { WebSocket } from "ws";
import axios from "axios";
import { Channel } from "../../../interfaces/interfaces.js";
import { DBManager } from "../../../db/DBManager.js";
import { calculatePercentage } from "../../../functions/functions.js";
import { BotService } from "../../BotService.js";
import { ApiError, DataBaseError, NotFoundError } from "../../../errors/Errors.js";
export class BinanceWebsocket {
    static url_http = `https://data-api.binance.vision`;
    static url_ws = 'wss://stream.binance.com:9443/ws';
    users;
    symbol;
    ws;
    db;
    constructor(userId, symbol) {
        this.users = new Set();
        this.symbol = symbol;
        this.ws = new WebSocket(BinanceWebsocket.url_ws);
        this.db = new DBManager();
        this.processEvents(userId);
    }
    static async getCoin(symbol) {
        const headers = {
            "accept": "application/json"
        };
        try {
            const res = await axios.get(`${BinanceWebsocket.url_http}/api/v3/ticker/price` +
                `?symbol=${symbol.toUpperCase()}USDT`, {
                headers: headers
            });
            return res.data;
        }
        catch (error) {
            console.error(`[ERROR]: Failed to fetch coin data from Binance API.`, {
                symbol: symbol.toUpperCase(),
                error: error.message,
            });
            if (error.status === 400)
                throw new NotFoundError(`Invalid token symbol. Can not find token on Binance.`);
            else
                throw new ApiError("Failed to fetch coin data from Binance API.", error.status);
        }
    }
    addUser(userId) {
        this.users.add(userId);
    }
    removeUser(userId) {
        this.users.delete(userId);
    }
    processEvents(userId) {
        this.ws.on('open', () => {
            console.log(`[INFO]: The Binance WebSocket connection was opened for the <${this.symbol}> coin.`);
            try {
                this.sendToBinanceChannel();
                this.addUser(userId);
            }
            catch (error) {
                throw new Error();
            }
        });
        this.ws.on('message', async (res) => {
            const message = JSON.parse(res.toString());
            const coin = {
                symbol: message.s,
                price: +message.c
            };
            this.processCoinMessage(coin);
        });
        this.ws.on('close', (status, reason) => {
            console.log(`[WEBSOCKET CLOSE]: The Binance WebSocket for the <${this.symbol}> ` +
                `coin was closed, reason: ${reason.toString('utf-8')}`);
        });
        this.ws.on('error', (error) => {
            console.error(`[CRITICAL ERROR]: Binance WebSocket error for the <${this.symbol}> coin.`, {
                error: error.message
            });
        });
    }
    sendToBinanceChannel() {
        const subscribeParams = {
            method: "SUBSCRIBE",
            params: [`${this.symbol.toLowerCase()}@ticker`],
            id: 1,
        };
        this.ws.send(JSON.stringify(subscribeParams), (error) => {
            if (error) {
                console.error(`[ERROR] Error while trying to follow to coin stream data.`, {
                    symbol: this.symbol.toLowerCase(),
                    error: error.messsage
                });
                throw new Error(`Error while trying to follow to coin <${this.symbol.toLowerCase()}> stream data.`);
            }
        });
    }
    async processCoinMessage(coin) {
        try {
            const promises = Array.from(this.users).map(async (userId) => {
                const subscriptions = await this.db.getCoinSubscriptions(userId);
                const subscription = subscriptions.find((sub) => sub.target.symbol === coin.symbol && sub.isStalked);
                if (!subscription)
                    return;
                const changedPercentage = calculatePercentage(subscription.target.price, coin.price);
                if (subscription.percentage <= Math.abs(changedPercentage)) {
                    const dataToSend = {
                        userId: userId,
                        target: coin,
                        percentage: changedPercentage
                    };
                    await BotService.sendToTGBot(dataToSend, Channel.COIN_PRICE_CHANGED);
                    await this.db.addOrUpdateCoinSubscription({
                        userId: userId,
                        target: coin,
                        percentage: subscription.percentage
                    });
                }
            });
            await Promise.all(promises);
        }
        catch (error) {
            if (error instanceof DataBaseError)
                throw error;
            console.error(`[ERROR]: An unexpected error occurred while processing the message from Binance.`, {
                coin: coin,
                error: error.message
            });
            throw new Error("An unexpected error occurred while processing the message.");
        }
    }
}
