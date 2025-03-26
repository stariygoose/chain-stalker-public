import { inject, injectable } from "inversify";
import mongoose from "mongoose";

import { ConfigService } from "#config/config.service.js";
import { EnvVariables } from "#config/env-variables.js";
import { TYPES } from "#di/types.js";


export interface IMongoDbConfig {
	connect(): Promise<void>;
}

@injectable()
export class MongoDbConfig implements IMongoDbConfig {
	private readonly _baseUrl: string;
	constructor (
		@inject(TYPES.ConfigService)
		private readonly _config: ConfigService
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

	private getBaseUrl(): string {
		return this._config.get(EnvVariables.MONGODB_URL);
	}

	// private createModels(): void {
	// 	this._mongoose.
	// }
}