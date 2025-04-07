import { injectable, inject } from "inversify";

import { CreateSubscriptionRequestDto, ICreateSubscriptionRequest } from "#application/dtos/requests/subscription/create-request.dto.js";
import { ISubscriptionRepository } from "#core/repositories/subscription-repository.interface.js";
import { SubscriptionFactory } from "#core/factories/subscription.factory.js";
import { CreateSubscriptionResponseDto, ICreateSubscriptionResponse } from "#application/dtos/response/subscription/create-response.dto.js";
import { TYPES } from "#di/types.js";
import { WebsocketManager } from "#infrastructure/websockets/websocket-manager.js";
import { Logger } from "#utils/logger.js";
import { Target } from "#core/entities/targets/subscription-target.interface.js";


export interface ISubscriptionService {
	create(data: ICreateSubscriptionRequest): Promise<ICreateSubscriptionResponse>;
}

@injectable()
export class SubscriptionService implements ISubscriptionService {
	constructor (
		@inject(TYPES.SubscriptionRepository)
		private readonly _db: ISubscriptionRepository,
		@inject(TYPES.WebsocketManager)
		private readonly _wm: WebsocketManager,
		@inject(TYPES.Logger)
		private readonly _logger: Logger
	) {}

	public async create(data: ICreateSubscriptionRequest): Promise<ICreateSubscriptionResponse> {
		const subscriptionDto = new CreateSubscriptionRequestDto(data);
		const { userId, target, strategyType, threshold } = subscriptionDto;

		try {
			const subscription = SubscriptionFactory.create(
				null,
				userId,
				target,
				threshold,
				strategyType
			);

			const subscriptionFromDb = await this._db.createOrUpdate(subscription);
			const { id } = subscriptionFromDb;
			if (!id) {
				throw new Error('Subscription id is missing.');
			}

			this._logger.debug(`Subscription [${id}] was successfuly created.`);

			this._stalk(userId, subscription.target);

			return new CreateSubscriptionResponseDto(
				id,
				subscriptionFromDb.userId,
				subscriptionFromDb.target,
				subscriptionFromDb.strategy,
				subscriptionFromDb.isActive
			);
		} catch (error) {
			throw error;
		}
	}

	private _stalk(userId: number, target: Target): void {
		const { type } = target;
		switch (type) {
			case "nft":
				this._logger.debug(`Subscription type is <${type}>. Opening Opensea Event Stream.`);
				this._wm.stalkFromOpensea(
					userId,
					target.slug
				);
				break;
			case "token":
				this._logger.debug(`Subscription type is <${type}>. Opening Binance Event Stream.`);
				this._wm.stalkFromBinance(
					userId,
					target.symbol
				);
				break;
			default:
				const exhaustiveCheck: never = type;
				throw new Error(`Unhandled type ${exhaustiveCheck}`);
		}
	}
}