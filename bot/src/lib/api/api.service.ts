import axios from 'axios';
import { injectable, inject } from "inversify";

import { TYPES } from "#di/types.js";
import { EnvVariables, IConfigService, ILogger } from "#config/index.js";
import { ApiError, BadRequestApiError, DuplicateApiError, NotAuthorizedApiError } from '#errors/errors/api.error.js';
import { Jwt, MySession } from '#context/context.interface.js';

@injectable()
export class ApiService {
	public static readonly V1_URL: string = '/api/v1';
	
	public static readonly LOGIN_URL: string = `${ApiService.V1_URL}/auth/bot-login`;
	public static readonly REFRESH_URL: string = `${ApiService.V1_URL}/auth/refresh`;

	public static readonly CREATE_URL: string = `${ApiService.V1_URL}/subscriptions/create`;
	public static readonly TOKEN_URL: string = `${ApiService.V1_URL}/token`;
	public static readonly COLLECTION_URL: string = `${ApiService.V1_URL}/collection`;

	private readonly BASE_URL: string;

	constructor (
		@inject(TYPES.ConfigService)
		private readonly _configService: IConfigService,
		@inject(TYPES.Logger)
		private readonly _logger: ILogger
	) {
		this.BASE_URL = this._configService.get(EnvVariables.SERVER_URL);
	}

	public async get<T>(
		endpoint: string,
		session: MySession,
		retry = true
	): Promise<T> {
		const url = `${this.BASE_URL}${endpoint}`;
		const headers = {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `Bearer ${session.jwt?.accessToken}`
		};

		try {
			const response = await axios.get<T>(url, {
				headers
			});

			return response.data;

		} catch (error: any) {
			if (error.response.status === 401 && retry) {
				const tokens = await this.refreshToken(session);
				session.jwt = tokens;

				return await this.get<T>(endpoint, session, false);
			};

			this.handleResponseError(
				error
			);
		}
	}

	public async post<T>(
		endpoint: string,
		data: unknown,
		session: MySession,
		retry = true
	): Promise<T> {
		const url = `${this.BASE_URL}${endpoint}`;
		const headers = {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `Bearer ${session.jwt?.accessToken}`
		};

		try {
			const response = await axios.post(
				url,
				data, 
				{
					headers
				}
			);

			return response.data;
		} catch (error: any) {
			if (error.response.status === 401 && retry) {
				const tokens = await this.refreshToken(session);
				session.jwt = tokens;

				return await this.post<T>(endpoint, data, session, false);
			};

			this.handleResponseError(
				error
			);
		}
	}

	private handleResponseError(
		error: any
	): never {
		switch (error.response.status) {
			case 409:
				throw new DuplicateApiError(
					error.response.data.error,
					`You are already logged in.`
				);
			case 400:
				throw new BadRequestApiError(
					error.response.data.error + `| Details: ${error.response.data.details}`,
					`Error while creating subscription. Please check your data and try again.`
				);
			case 503:
				throw new ApiError(
					error.response.data.error,
					`Your target probably doesn't exist or is not supported by the server.`
				)
			case 404:
				throw new ApiError(
					error.response.data.error,
					`This target doesn't exist or is not supported by the server.`
				)
			default:
				this._logger.error(`Unexpected error while sending request to a server: ${error.message}`);
				throw new ApiError(
					error.message,
					`Unexpected error while sending request to a server. Please try again later.`
				);
		}
	}

	private async refreshToken(session: MySession): Promise<Jwt> {
		const url = `${this.BASE_URL}${ApiService.REFRESH_URL}`;
		const headers = {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		};

		try {
			const response = await axios.post<Jwt>(
				url,
				{
					refreshToken: session.jwt?.refreshToken
				},
				{
					headers
				}
			);

			return response.data;
		} catch (error: any) {
			if (error.response.status === 400) {
				throw new ApiError(error.response.data.error);
			}
			if (error.response.status === 404) {
				throw new ApiError(
					error.response.data.error,
					`Your session has expired. Please log in again.\n /login`
				);
			}
			throw new ApiError(
				error.message,
				`Unexpected error while refreshing token. Please try again later.`
			)
		}
	}
}