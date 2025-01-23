import axios from "axios";

import {
	ICoin,
	ICollection,
	IUserContext,
	IUserSubscriptions,
	StalkingResponse
} from "../types/interfaces.js";
import { NetworkStateKeys } from "../types/networkState.js";
import { ApiError, NotFoundError, StatusError } from "./ErrorService.js";

class ApiService {
	private url: string;
	private version: string;
	private headers: Record<string, string>;

	constructor() {
		this.url = process.env.SERVER_URL ?? "";
		this.version = "/api/v1";
		this.headers = {
			"accept": "application/json",
			"Content-Type": "application/json"
		}
	}

	public async findCoin(symbol: string): Promise<ICoin> {
		try {
			const res = await axios.get<ICoin>(`${this.url}${this.version}/coins/${symbol}`, {
				headers: this.headers
			});
			return res.data;
		} catch (error: any) {
			console.error(`[ERROR]: Failed to fetch API while finding a coin.`, {
				symbol: symbol,
				error: error.response.data.message,
				status: error.response.status
			});
			
			if (error.response.status === 404)
				throw new NotFoundError(error.response.data.message);
			else
				throw new ApiError(`Failed to fetch server API while finding a coin.`);
		}
	}

	public async findCollection(network: NetworkStateKeys, address: string): Promise<ICollection> {
		try {
			const res = await axios.get<ICollection>(`${this.url}${this.version}/collections/${network}/${address}`, {
				headers: this.headers
			});
			return res.data;
		} catch (error: any) {
			console.error(`[ERROR]: Failed to fetch API while finding a collection.`, {
				network: network,
				address: address,
				error: error.message
			});

			if (error.response.status === 404)
				throw new NotFoundError(error.response.data.message);
			else
				throw new ApiError("Failed to fetch server API while trying to find NFT collection data. Try later.");
		}
	}

	public async stalkCoin(userId: number, state: IUserContext<ICoin>)
		: Promise<StalkingResponse> {
		const { target, percentage } = state;
		const body = {
			userId: userId,
			target: target,
			percentage: percentage
		}

		try {
			const res = await axios.post<StalkingResponse>(`${this.url}${this.version}/stalk/coin`, body, {
				headers: this.headers
			});
			return res.data;
		} catch (error: any) {
			console.error(`[ERROR]: Failed to fetch server API while trying to send a request for stalking a coin.`, {
				userId: userId,
				state: state,
				error: error.message
			});
			throw new ApiError("Failed to fetch server API while trying to send request for stalking a coin. Try later.");
		}
	}

	public async stalkNftContract(userId: number, state: IUserContext<ICollection>)
		: Promise<StalkingResponse> {
		const { target, percentage } = state;
		const body = {
			userId: userId,
			target: target,
			percentage: percentage
		}

		try {
			const res = await axios.post<StalkingResponse>(`${this.url}${this.version}/stalk/collection`, body, {
				headers: this.headers
			});
			return res.data;
		} catch (error: any) {
			console.error(`[ERROR]: Failed to fetch server API while trying to send a request for stalking a NFT collection.`, {
				userId: userId,
				state: state,
				error: error.message
			});
			throw new ApiError("Failed to fetch server API while trying to send request for stalking NFT collection. Try later.");
		}
	}

	public async getSubscriptionsByUser(userId: number): Promise<IUserSubscriptions> {
		try {
			const res = await axios.get<IUserSubscriptions>(`${this.url}${this.version}/subscriptions/${userId}/`, {
				headers: this.headers
			});
			return res.data;
		} catch (error: any) {
			console.error(`[ERROR]: Failed to fetch server API while trying to get all subscriptions.`, {
				userId: userId,
				error: error.message
			});
			throw new ApiError("Failed to fetch server API while trying to get your subscriptions. Try later.");
		}
	}

	public async deleteUser(userId: number): Promise<void> {
		try {
			return await axios.delete(`${this.url}${this.version}/subscriptions/delete/${userId}`, {
				headers: this.headers
			});
		} catch (error: any) {
			console.error(`[ERROR]: Failed to fetch server API while trying to delete user's data.`, {
				userId: userId,
				error: error.message
			});
			throw new ApiError("Failed to fetch server API while trying to delete your data. Try later.");
		}
	}
}

export { ApiService };
