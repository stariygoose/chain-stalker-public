import axios from "axios";
import { WebSocket } from "ws";
import { ItemListedEvent, ItemSoldEvent, OpenSeaStreamClient } from "@opensea/stream-js";

import { Channel, ICollection, IFloorPriceOSRequest, IUserContext } from "../../interfaces/interfaces.js";
import { calculatePercentage, fromWeiToEth } from "../../functions/functions.js";
import { DBManager } from "../../db/DBManager.js";
import { BotService } from "../BotService.js";


class OpenSea {
	private url: string;
	private client: OpenSeaStreamClient;
	private db: DBManager;
	private headers: {};


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
	public async getCollection(network: string, address: string): Promise<ICollection> {
		try {
			const collection = await axios.get<ICollection>(`${this.url}/chain/${network}/contract/${address}`, {
				headers: this.headers
			});
			return collection.data;
		} catch (error) {
			console.log(`Failed to fetch collection data <${address}> from OpenSea:\n${error}`);
			throw new Error(`Failed to fetch collection data from OpenSea.`);
		}
	}

	public async getFloorPrice(slug: string): Promise<IFloorPriceOSRequest> {
		try {
			const stats = await axios.get(`${this.url}/collections/${slug}/stats`, {
				headers: this.headers
			});

			return {
				floorPrice: stats.data.total.floor_price,
				floorPriceSymbol: stats.data.total.floor_price_symbol
			};
		} catch (error) {
			console.error(`Failed to fetch floor price of collection <${slug}> from OpenSea:\n${error}`);
			throw new Error(`Failed to fetch floor price of collection from OpenSea.`);
		}
	}

	public async stalkCollection(chatId: number, slug: string, percentage: number) {
		this.client.onItemListed(slug, async (event) => {
			const fp = await this.db.getFloorPriceFromDB(chatId, slug);
			if (fp != null)
				this.onItemListed(chatId, event, percentage, fp);
		})

		this.client.onItemSold(slug, async (event) => {
			const fp = await this.db.getFloorPriceFromDB(chatId, slug);
			if (fp != null)
				this.onItemSold(chatId, event, percentage, fp);
		})
	}

	private createClient(): OpenSeaStreamClient {
		return new OpenSeaStreamClient({
			token: process.env.OPENSEA_TOKEN ?? "",
			connectOptions: {
				transport: WebSocket
			}
		})
	}

	public static async initStalksAfterReboot(openSea: OpenSea)
		: Promise<void> {
		const subs = await new DBManager().getNftSubscriptions();

		subs.forEach(({ userId, target, percentage }) => {
			openSea.stalkCollection(userId, target.collection, percentage)
		});
	}

	private async onItemListed(userId: number, event: ItemListedEvent, percentage: number, currFP: number) {
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

				const msgToBot: IUserContext<ICollection> = {
					userId: userId,
					target: subscriptionWithUpdatedFP.target,
					percentage: changedPercentage
				};
				BotService.sendToTGBot(msgToBot, Channel.NFT_PRICE_CHANGED);
			}
		}

		if (currFP < listingPrice) {
			const newFP: IFloorPriceOSRequest = await this.getFloorPrice(slug);
			const changedPercentage = calculatePercentage(currFP, newFP.floorPrice);

			if (percentage <= Math.abs(changedPercentage)) {
				const subscriptionWithUpdatedFP = await this.db.updateFloorPrice(userId, slug, newFP.floorPrice);
				if (!subscriptionWithUpdatedFP)
					return;

				const msgToBot: IUserContext<ICollection> = {
					userId: userId,
					target: subscriptionWithUpdatedFP.target,
					percentage: changedPercentage
				};
				BotService.sendToTGBot(msgToBot, Channel.NFT_PRICE_CHANGED)
			}
		}
	}

	private async onItemSold(userId: number, event: ItemSoldEvent, percentage: number, currFP: number) {
		const { slug } = event.payload.collection;
		const newFP = await this.getFloorPrice(slug);
		const changedPercentage = calculatePercentage(currFP, newFP.floorPrice);

		if (percentage <= Math.abs(changedPercentage)) {
			const subscriptionWithUpdatedFP = await this.db.updateFloorPrice(userId, slug, newFP.floorPrice);
			if (!subscriptionWithUpdatedFP)
				return;

			const msgToBot: IUserContext<ICollection> = {
				userId: userId,
				target: subscriptionWithUpdatedFP.target,
				percentage: changedPercentage
			};
			BotService.sendToTGBot(msgToBot, Channel.NFT_PRICE_CHANGED);
		}

	}
}

export { OpenSea };
