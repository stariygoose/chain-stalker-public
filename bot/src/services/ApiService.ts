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
				throw new ApiError(`Failed to fetch server while finding a coin.`);
		}
	}

	public async findCollection(network: NetworkStateKeys, address: string): Promise<ICollection> {
		try {
			const res = await axios.get<ICollection>(`${this.url}${this.version}/collections/${network}/${address}`, {
				headers: this.headers
			})

			if (res.status != 200)
				throw new StatusError(res.status, "get NFT collection data");

			return res.data;
		} catch (error: any) {
			if (error instanceof StatusError) {
				console.error(`[ERROR]: Server error in ApiServer.findCollection.`, {
					network: network,
					address: address,
					status: error.status,
					error: error.message
				});
				throw error;
			}

			console.error(`[ERROR]: Failed to fetch API while finding a collection.`, {
				network: network,
				address: address,
				error: error.message
			});
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

			if (res.status != 201)
				throw new StatusError(res.status, "start stalking this coin");

			return res.data;
		} catch (error: any) {
			if (error instanceof StatusError) {
				console.error(`[ERROR]: Server error in ApiServer.stalkCoin.`, {
					userId: userId,
					state: state,
					status: error.status,
					error: error.message
				});
				throw error;
			}

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

			if (res.status != 201)
				throw new StatusError(res.status, "start stalking NFT collection");

			return res.data;
		} catch (error: any) {
			if (error instanceof StatusError) {
				console.error(`[ERROR]: Server error in ApiServer.stalkNftContract.`, {
					userId: userId,
					state: state,
					status: error.status,
					error: error.message
				});
				throw error;
			}

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

			if (res.status != 200)
				throw new StatusError(res.status, "get your stalks");

			return res.data;
		} catch (error: any) {
			if (error instanceof StatusError) {
				console.error(`[ERROR]: Server error in ApiServer.getSubscriptionsByUser.`, {
					userId: userId,
					status: error.status,
					error: error.message
				});
				throw error;
			}

			console.error(`[ERROR]: Failed to fetch server API while trying to get all subscriptions.`, {
				userId: userId,
				error: error.message
			});
			throw new ApiError("Failed to fetch server API while trying to get your subscriptions. Try later.");
		}
	}

	public async deleteUser(userId: number): Promise<void> {
		try {
			const res = await axios.delete(`${this.url}${this.version}/subscriptions/delete/${userId}`, {
				headers: this.headers
			})
			
			if (res.status != 204)
				throw new StatusError(res.status, "delete user's data.");
		} catch (error: any) {
			if (error instanceof StatusError) {
				console.error(`[ERROR]: Server error in ApiServer.deleteUser.`, {
					userId: userId,
					status: error.status,
					error: error.message
				});
				throw error;
			}

			console.error(`[ERROR]: Failed to fetch server API while trying to delete user's data.`, {
				userId: userId,
				error: error.message
			});
			throw new ApiError("Failed to fetch server API while trying to delete your data. Try later.");
		}
	}
}

export { ApiService };
