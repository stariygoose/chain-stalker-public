import { AxiosError } from "axios";
import { inject, injectable } from "inversify";

import { TYPES } from "#di/types.js";
import { HttpService } from "#lib/api/http.service.js";
import { MyContext } from "#context/context.interface.js";
import { ResponseCollection, ResponseJwt, ResponseMyStalks, ResponseToken, Subscription } from '#lib/api/response.js';
import { ILogger } from "#config/index.js";
import { ApiError, BadRequestApiError, DuplicateApiError } from "#errors/errors/api.error.js";
import { ChainStalkerMessage } from "#ui/index.js";
import { Scenes } from "telegraf";
import { ICreateCollectionSceneWizard } from "#scenes/scenes/create-collection/create-collection.scene.js";
import { ICreateTokenSceneWizard } from "#scenes/scenes/create-token/create-token.scene.js";
import { IChangeStrategyScene } from "#scenes/scenes/edit-subscription/change-strategy.scene.js";


@injectable()
export class ApiService {
	constructor (
		@inject(TYPES.HttpService)
		private readonly _httpService: HttpService,
		@inject(TYPES.Logger)
		private readonly _logger: ILogger
	) {}

	public async login(ctx: MyContext): Promise<void> {
		const user = ctx.from?.id;

		try {
			const tokens = await this._httpService.post<ResponseJwt>(
				HttpService.LOGIN_URL,
				{
					userId: user
				},
				ctx.session
			);

			ctx.session.jwt = tokens;

		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				switch (error.response?.status) {
					case 409:
						this._logger.warn(`User ${user} tried to log in, but was already logged in. Error: ${error.response.data.error}`);
						throw new DuplicateApiError(
							error.response.data.error,
							ChainStalkerMessage.API.LOGIN_CONFLICT
						);
					case 400:
						this._logger.warn(`User tried to log in, but received an error ${error.response?.data.error} | Details: ${error.response.data.details}`)
						throw new BadRequestApiError(
							error.response.data.error + `| Details: ${error.response.data.details}`,
							ChainStalkerMessage.API.LOGIN_BAD_REQUEST
						);
					default:
						this._logger.error(`Login request failed for user ${user}: ${error.response?.data.error ?? error.message}`);
						throw new ApiError(
							error.response?.data.error,
							ChainStalkerMessage.API.LOGIN_GENERIC
						)
				}
			}
		}
	}

	// Can be used with type
	// ApiService.SUBSCRIPTION_URL + '?type=' + type
	public async getStalks(
		ctx: MyContext,
		type?: string
	): Promise<ResponseMyStalks> {
		try {
			const response = await this._httpService.get<ResponseMyStalks>(
				HttpService.SUBSCRIPTIONS_URL,
				ctx.session
			);

			return response;
		} catch(error: unknown) {
			const userId = ctx.from?.id;

			if (error instanceof AxiosError) {
				switch (error.response?.status) {
					case 400:
						this._logger.warn(`User ${userId} tried to get all subscriptions data, but received an error: ${error.response?.data.error} | Details: ${error.response.data.details}`)
						throw new BadRequestApiError(
							error.response.data.error + `| Details: ${error.response.data.details}`,
							ChainStalkerMessage.API.GET_STALKS_BAD_REQUEST
						);
					case 404:
						this._logger.warn(`User ${userId} tried to get all subscriptions data, but received an error: ${error.response.data.error}`);
						throw new ApiError(
							error.response.data.error,
							ChainStalkerMessage.API.GET_STALKS_NOT_FOUND
						);
					default:
						this._logger.warn(`Get all subscriptions request failed for user ${userId}: ${error.response?.data.error ?? error.message}`);
						throw new ApiError(
							error.response?.data.error,
							ChainStalkerMessage.API.GET_STALKS_GENERIC
						);
				}
			}

			this._logger.error(`[CRITICAL] Unexpected error while triyng to send getMyStalks request with parameters: ${JSON.stringify({
				userId: userId,
				type: type
			})}. Error: ${(error as Error).message}`);
			throw error;
		}
	}

	public async getSubscription(
		ctx: MyContext,
		id: string
	): Promise<Subscription> {
		try {
			const subscription = await this._httpService.get<Subscription>(
				`${HttpService.SUBSCRIPTIONS_URL}/${id}`,
				ctx.session
			);

			return subscription;
		} catch (error: unknown) {
			const userId = ctx.from?.id;

			if (error instanceof AxiosError) {
				switch (error.response?.status) {
					case 400:
						this._logger.warn(`User ${userId} tried to get a subscription data ${id}, but received an error: ${error.response?.data.error} | Details: ${error.response.data.details}`)
						throw new BadRequestApiError(
							error.response.data.error + `| Details: ${error.response.data.details}`,
							ChainStalkerMessage.API.GET_SUB_BAD_REQUEST
						);
					case 404:
						this._logger.warn(`User ${userId} tried to get a subscription data ${id}, but received an error: ${error.response.data.error}`);
						throw new ApiError(
							error.response.data.error,
							ChainStalkerMessage.API.GET_SUB_NOT_FOUND
						);
					default:
						this._logger.warn(`Get subscription ${id} request failed for user ${userId}: ${error.response?.data.error ?? error.message}`);
						throw new ApiError(
							error.response?.data.error,
							ChainStalkerMessage.API.GET_SUB_GENERIC
						);
				}
			}

			this._logger.error(`[CRITICAL] Unexpected error while triyng to send getSubscription request with parameters: ${JSON.stringify({
				userId: userId,
				subscriptionId: id
			})}. Error: ${(error as Error).message}`);
			throw error;
		}
	}

	public async changeStatus(ctx: MyContext): Promise<void> {
		const id = ctx.session.targetToEdit?.id;

		try {
			await this._httpService.put(
				HttpService.SUBSCRIPTIONS_CHANGE_STATUS_URL + '/' + id,
				{},
				ctx.session
			);
		} catch (error: unknown) {
			const userId = ctx.from?.id;

			if (error instanceof AxiosError) {
				switch (error.response?.status) {
					case 400:
						this._logger.warn(`User ${userId} tried to change a subscription status ${id}, but received an error: ${error.response?.data.error} | Details: ${error.response.data.details}`)
						throw new BadRequestApiError(
							error.response.data.error + `| Details: ${error.response.data.details}`,
							ChainStalkerMessage.API.CHANGE_STATUS_BAD_REQUEST
						);
					case 404:
						this._logger.warn(`User ${userId} tried to change a subscription status ${id}, but received an error: ${error.response.data.error}`);
						throw new ApiError(
							error.response.data.error,
							ChainStalkerMessage.API.CHANGE_STATUS_NOT_FOUND
						);
					default:
						this._logger.warn(`Change subscription status ${id} request failed for user ${userId}: ${error.response?.data.error ?? error.message}`);
						throw new ApiError(
							error.response?.data.error,
							ChainStalkerMessage.API.CHANGE_STATUS_GENERIC
						);
				}
			}

			this._logger.error(`[CRITICAL] Unexpected error while triyng to send changeStatus request with parameters: ${JSON.stringify({
				userId: userId,
				subscriptionId: id
			})}. Error: ${(error as Error).message}`);
			throw error;
		}
	}

	public async getNftCollection<T extends Scenes.WizardSessionData>(
		ctx: MyContext<T>,
		slug: string
	): Promise<ResponseCollection> {
		try {
			const collectionData = await this._httpService.get<ResponseCollection>(
				HttpService.COLLECTION_URL + '/' + slug,
				ctx.session
			);

			return collectionData;
		} catch (error: unknown) {
			const userId = ctx.from?.id;

			if (error instanceof AxiosError) {
				switch (error.response?.status) {
					case 400:
						this._logger.warn(`User ${userId} tried to get a collection data, but received a Bad Request error: ${error.response?.data.error} | Details: ${error.response.data.details}`)
						throw new BadRequestApiError(
							error.response.data.error + `| Details: ${error.response.data.details}`,
							ChainStalkerMessage.API.GET_COLLECTION_BAD_REQUEST
						);
					case 404:
						this._logger.warn(`User ${userId} tried to get a collection data, but received an error: ${error.response.data.error}`);
						throw new ApiError(
							error.response.data.error,
							ChainStalkerMessage.API.GET_COLLECTION_NOT_FOUND
						);
					default:
						this._logger.warn(`Get a collection ${slug} request failed for user ${userId}: ${error.response?.data.error ?? error.message}`);
						throw new ApiError(
							error.response?.data.error,
							ChainStalkerMessage.API.GET_COLLECTION_GENERIC
						);
				}
			}

			this._logger.error(`[CRITICAL] Unexpected error while triyng to send getNftCollection request with parameters: ${JSON.stringify({
				userId: userId,
				slug: slug
			})}. Error: ${(error as Error).message}`);
			throw error;
		}
	}

	public async getToken<T extends Scenes.WizardSessionData>(
		ctx: MyContext<T>,
		symbol: string
	): Promise<ResponseToken> {
		try {
			const tokenData = await this._httpService.get<ResponseToken>(
				HttpService.TOKEN_URL + '/' + symbol,
				ctx.session
			);

			return tokenData;
		} catch (error: unknown) {
			const userId = ctx.from?.id;

			if (error instanceof AxiosError) {
				switch (error.response?.status) {
					case 400:
						this._logger.warn(`User ${userId} tried to get a token data, but received a Bad Request error: ${error.response?.data.error} | Details: ${error.response.data.details}`)
						throw new BadRequestApiError(
							error.response.data.error + `| Details: ${error.response.data.details}`,
							ChainStalkerMessage.API.GET_TOKEN_BAD_REQUEST
						);
					case 404:
						this._logger.warn(`User ${userId} tried to get a token data, but received an error: ${error.response.data.error}`);
						throw new ApiError(
							error.response.data.error,
							ChainStalkerMessage.API.GET_TOKEN_NOT_FOUND
						);
					default:
						this._logger.warn(`Get a token ${symbol} request failed for user ${userId}: ${error.response?.data.error ?? error.message}`);
						throw new ApiError(
							error.response?.data.error,
							ChainStalkerMessage.API.GET_TOKEN_GENERIC
						);
				}
			}

			this._logger.error(`[CRITICAL] Unexpected error while triyng to send getToken request with parameters: ${JSON.stringify({
				userId: userId,
				symbol: symbol
			})}. Error: ${(error as Error).message}`);
			throw error;
		}
	}

	public async createNftSubscription<T extends ICreateCollectionSceneWizard>(
		ctx: MyContext<T>
	): Promise<void> {
		const { slug, name, chain, symbol, floorPrice, strategy, threshold } = ctx.wizard.state;

		try {
			await this._httpService.post(
				HttpService.CREATE_URL, 
				{
					target: {
						type: "nft",
						slug: slug,
						name: name,
						chain: chain,
						symbol: symbol,
						lastNotifiedPrice: floorPrice
					},
					strategy: {
						type: strategy,
						threshold: threshold
					}
				}, 
				ctx.session
			);
		} catch(error: unknown) {
			const userId = ctx.from?.id;

			if (error instanceof AxiosError) {
				switch (error.response?.status) {
					case 400:
						this._logger.warn(`User ${userId} tried to create a NftSubscription ${slug}, but received a Bad Request error: ${error.response?.data.error} | Details: ${error.response.data.details}`)
						throw new BadRequestApiError(
							error.response.data.error + `| Details: ${error.response.data.details}`,
							ChainStalkerMessage.API.CREATE_NFT_SUBSCRIPTION_BAD_REQUEST
						);
					default:
						this._logger.warn(`Create a Nft Subscription ${slug} request failed for user ${userId}: ${error.response?.data.error ?? error.message}`);
						throw new ApiError(
							error.response?.data.error,
							ChainStalkerMessage.API.CREATE_NFT_SUBSCRIPTION_GENERIC
						);
				}
			}

			this._logger.error(`[CRITICAL] Unexpected error while triyng to send createNftSubscription request with parameters: ${JSON.stringify({
				target: {
					type: "nft",
					slug: slug,
					name: name,
					chain: chain,
					symbol: symbol,
					lastNotifiedPrice: floorPrice
				},
				strategy: {
					type: strategy,
					threshold: threshold
				}
			})}. Error: ${(error as Error).message}`);
			throw error;
		}
	}

	public async createTokenSubscription<T extends ICreateTokenSceneWizard>(
		ctx: MyContext<T>
	): Promise<void> {
		const { symbol, price, strategy, threshold } = ctx.wizard.state;

		try {
			await this._httpService.post(
				HttpService.CREATE_URL, 
				{
					target: {
						type: "token",
						symbol: symbol,
						lastNotifiedPrice: price
					},
					strategy: {
						type: strategy,
						threshold: threshold
					}
				}, 
				ctx.session
			);
		} catch(error: unknown) {
			const userId = ctx.from?.id;

			if (error instanceof AxiosError) {
				switch (error.response?.status) {
					case 400:
						this._logger.warn(`User ${userId} tried to create a Token Subscription ${symbol}, but received a Bad Request error: ${error.response?.data.error} | Details: ${error.response.data.details}`)
						throw new BadRequestApiError(
							error.response.data.error + `| Details: ${error.response.data.details}`,
							ChainStalkerMessage.API.CREATE_TOKEN_SUBSCRIPTION_BAD_REQUEST
						);
					default:
						this._logger.warn(`Create a Token Subscription ${symbol} request failed for user ${userId}: ${error.response?.data.error ?? error.message}`);
						throw new ApiError(
							error.response?.data.error,
							ChainStalkerMessage.API.CREATE_TOKEN_SUBSCRIPTION_GENERIC
						);
				}
			}

			this._logger.error(`[CRITICAL] Unexpected error while triyng to send createTokenSubscription request with parameters: ${JSON.stringify({
				target: {
					type: "token",
					symbol: symbol,
					lastNotifiedPrice: price
				},
				strategy: {
					type: strategy,
					threshold: threshold
				}
			})}. Error: ${(error as Error).message}`);
			throw error;
		}
	}

	public async changeStrategy<T extends IChangeStrategyScene>(
		ctx: MyContext<T>,
		id: string
	): Promise<void> {
		const { strategy } = ctx.wizard.state;

		try {
			await this._httpService.put(
				HttpService.STRATEGY_EDIT + '/' + id,
				{ strategy },
				ctx.session
			);
		} catch (error: unknown) {
			const userId = ctx.from?.id;

			if (error instanceof AxiosError) {
				switch (error.response?.status) {
					case 400:
						this._logger.warn(`User ${userId} tried to change a subscription strategy ${id}, but received an error: ${error.response?.data.error} | Details: ${error.response.data.details}`)
						throw new BadRequestApiError(
							error.response.data.error + `| Details: ${error.response.data.details}`,
							ChainStalkerMessage.API.CHANGE_STRATEGY_BAD_REQUEST
						);
					case 404:
						this._logger.warn(`User ${userId} tried to change a subscription strategy ${id}, but received an error: ${error.response.data.error}`);
						throw new ApiError(
							error.response.data.error,
							ChainStalkerMessage.API.CHANGE_STRATEGY_NOT_FOUND
						);
					default:
						this._logger.warn(`Change a subscription strategy ${id} request failed for user ${userId}: ${error.response?.data.error ?? error.message}`);
						throw new ApiError(
							error.response?.data.error,
							ChainStalkerMessage.API.CHANGE_STRATEGY_GENERIC
						);
				}
			}

			this._logger.error(`[CRITICAL] Unexpected error while triyng to send changeStrategy request with parameters: ${JSON.stringify({
				userId: userId,
				subscriptionId: id,
				strategy: strategy
			})}. Error: ${(error as Error).message}`);
			throw error;
		}
	}

	public async deleteSubscription(
		ctx: MyContext,
		id: string
	) {
		try {
			await this._httpService.delete(
				HttpService.SUBSCRIPTION_DELETE + '/' + id,
				ctx.session
			);
		} catch(error: unknown) {
			const userId = ctx.from?.id;

			if (error instanceof AxiosError) {
				switch (error.response?.status) {
					case 400:
						this._logger.warn(`User ${userId} tried to delete a subscription ${id}, but received an error: ${error.response?.data.error} | Details: ${error.response.data.details}`)
						throw new BadRequestApiError(
							error.response.data.error + `| Details: ${error.response.data.details}`,
							ChainStalkerMessage.API.DELETE_SUB_BAD_REQUEST
						);
					case 404:
						this._logger.warn(`User ${userId} tried to delete a subscription ${id}, but received an error: ${error.response.data.error}`);
						throw new ApiError(
							error.response.data.error,
							ChainStalkerMessage.API.DELETE_SUB_NOT_FOUND
						);
					default:
						this._logger.warn(`Delete subscription ${id} request failed for user ${userId}: ${error.response?.data.error ?? error.message}`);
						throw new ApiError(
							error.response?.data.error,
							ChainStalkerMessage.API.DELETE_SUB_GENERIC
						);
				}
			}

			this._logger.error(`[CRITICAL] Unexpected error while triyng to send deleteSubscription request with parameters: ${JSON.stringify({
				userId: userId,
				subscriptionId: id
			})}. Error: ${(error as Error).message}`);
			throw error;
		}


	}

	// private handleResponseError(
	// 	error: AxiosError
	// ): never {
	// 	const { response } = error;

	// 	switch (response?.status) {
	// 		case 400:
	// 			this._logger.warn(response?.data.error + `| Details: ${error.response.data.details}`)
	// 			throw new BadRequestApiError(
	// 				error.response.data.error + `| Details: ${error.response.data.details}`,
	// 				`⚠️ Error while creating subscription. Please check your data and try again.`
	// 			);
	// 		case 503:
	// 			this._logger.warn(error.response.data.error);
	// 			throw new ApiError(
	// 				error.response.data.error,
	// 				`⚠️ Your target probably doesn't exist or is not supported by the server.`
	// 			)
	// 		case 404:
	// 			this._logger.warn(error.response.data.error);
	// 			throw new ApiError(
	// 				error.response.data.error,
	// 				`⚠️ This target doesn't exist or is not supported by the server.`
	// 			)
	// 		default:
	// 			this._logger.error(`Unexpected error while sending request to a server: ${error.message}`);
	// 			throw new ApiError(
	// 				error.message,
	// 				`⚠️ Iternal server error. Please try again later.`
	// 			);
	// 	}
	// }
}