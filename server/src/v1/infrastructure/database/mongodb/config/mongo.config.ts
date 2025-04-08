import { inject, injectable } from "inversify";
import mongoose from "mongoose";

import { ConfigService } from "#config/config.service.js";
import { EnvVariables } from "#config/env-variables.js";
import { TYPES } from "#di/types.js";
import { ISubscriptionRepository } from "#core/repositories/subscription-repository.interface.js";
import { WebsocketManager } from "#infrastructure/websockets/websocket-manager.js";
import { Subscription } from "#core/entities/subscription/index.js";
import { INftTarget } from "#core/entities/targets/nft-target.interface.js";


export interface IMongoDbConfig {
	connect(): Promise<void>;
	initEventStreams(): Promise<void>;
}

@injectable()
export class MongoDbConfig implements IMongoDbConfig {
	private readonly _baseUrl: string;
	constructor (
		@inject(TYPES.ConfigService)
		private readonly _config: ConfigService,
		@inject(TYPES.SubscriptionRepository)
		private readonly _db: ISubscriptionRepository,
		@inject(TYPES.WebsocketManager)
		private readonly _wsManager: WebsocketManager
	) {
		this._baseUrl = this.getBaseUrl();
	}

	public async connect(): Promise<void> {
		try {  
			await mongoose.connect(this._baseUrl);  
		} catch (error: unknown) { 
			if (error instanceof Error) {
				console.error(`Error connecting to DB: ${error.message}`);  
				throw error;  
			}
		}
	}

	public async initEventStreams(): Promise<void> {
		const [tokenSubscriptions, nftSubscriptions] = await Promise.all([
			this._db.getAll({'target.type': 'token'}),
			this._db.getAll({'target.type': 'nft'})
		])

		tokenSubscriptions?.forEach((sub: Subscription) => {
			this._wsManager.stalkFromBinance(sub.userId, sub.target.symbol);
		});

		nftSubscriptions?.forEach((sub: Subscription) => {
			this._wsManager.stalkFromOpensea(sub.userId, (sub.target as INftTarget).slug);
		});
	}

	private getBaseUrl(): string {
		return this._config.get(EnvVariables.MONGODB_URL);
	}
}