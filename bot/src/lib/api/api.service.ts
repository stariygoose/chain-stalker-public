import axios from 'axios';
import { injectable, inject } from "inversify";

import { TYPES } from "#di/types.js";
import { EnvVariables, IConfigService, ILogger } from "#config/index.js";
import { ApiError, DuplicateApiError } from '#errors/errors/api.error.js';

@injectable()
export class ApiService {
	public static readonly V1_URL: string = '/api/v1';
	public static readonly LOGIN_URL: string = `${ApiService.V1_URL}/auth/bot-login`;

	private readonly BASE_URL: string;

	constructor (
		@inject(TYPES.ConfigService)
		private readonly _configService: IConfigService,
		@inject(TYPES.Logger)
		private readonly _logger: ILogger
	) {
		this.BASE_URL = this._configService.get(EnvVariables.SERVER_URL);
	}

	public async get(endpoint: string) {
		const url = `${this.BASE_URL}${endpoint}`;

		try {
			const response = await axios.get(url);
			return response;
		} catch (error: any) {
			if (axios.isAxiosError(error)) {
				this._logger.error(`Unexpected error while sending request to a server: ${error.message}`);
				throw new ApiError(`Unexpected error while sending request to a server.`);
			}
			throw error;
		}
	}

	public async post(endpoint: string, data?: unknown) {
		const url = `${this.BASE_URL}${endpoint}`;

		try {
			const response = await axios.post(url, data);

			return response.data;
		} catch (error: any) {
			this.handleResponseError(error);
		}
	}

	private handleResponseError(error: any) {
		switch (error.response.status) {
			case 409:
				throw new DuplicateApiError(
					error.response.data.error,
					`You are already logged in.`
				);
			default:
				this._logger.error(`Unexpected error while sending request to a server: ${error.message}`);
				throw new ApiError(error.message);
		}
	}
}