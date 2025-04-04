import { injectable, inject } from "inversify";

import { CreateSubscriptionRequestDto, ICreateSubscriptionRequest } from "#application/dtos/requests/subscription/create-request.dto.js";
import { ISubscriptionRepository } from "#core/repositories/subscription-repository.interface.js";
import { SubscriptionFactory } from "#core/factories/subscription.factory.js";
import { CreateSubscriptionResponseDto, ICreateSubscriptionResponse } from "#application/dtos/response/subscription/create-response.dto.js";
import { TYPES } from "#di/types.js";
import { WebsocketManager } from "#infrastructure/websockets/websocket-manager.js";

export interface ISubscriptionService {
	create(data: ICreateSubscriptionRequest): Promise<ICreateSubscriptionResponse>;
}

@injectable()
export class SubscriptionService implements ISubscriptionService {
	constructor (
		@inject(TYPES.SubscriptionRepository)
		private readonly repository: ISubscriptionRepository,
		@inject(TYPES.WebsocketManager)
		private readonly _wm: WebsocketManager
	) {}

	public async create(data: ICreateSubscriptionRequest): Promise<ICreateSubscriptionResponse> {
		const subscriptionDto = new CreateSubscriptionRequestDto(data);
		const { userId, target, strategyType, threshold } = subscriptionDto;

		const subscription = SubscriptionFactory.create(
			null,
			userId,
			target,
			threshold,
			strategyType
		);

		const subscriptionFromDb = await this.repository.create(subscription);
		const id: string = subscriptionFromDb.id!;

		const { type } = subscriptionFromDb.target;
		switch (type) {
			case "nft":
				this._wm.stalkFromOpensea(
					subscriptionFromDb.userId,
					subscriptionFromDb.target.slug
				);
				break;
			case "token":
				break;
			default:
				const exhaustiveCheck: never = type;
				throw new Error(`Unhandled type ${exhaustiveCheck}`);
		}

		return new CreateSubscriptionResponseDto(
			id,
			subscriptionFromDb.userId,
			subscriptionFromDb.target,
			subscriptionFromDb.strategy,
			subscriptionFromDb.isActive
		);
	}
}