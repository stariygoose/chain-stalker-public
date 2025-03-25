import { injectable, inject } from "inversify";

import { CreateSubscriptionRequestDto, ICreateSubscriptionRequest } from "#application/dtos/requests/subscription/create-request.dto.js";
import { ISubscriptionRepository } from "#core/repositories/subscription-repository.interface.js";
import { SubscriptionRepository } from "#infrastructure/database/mongodb/repositories/subscription.repository.js";
import { SubscriptionFactory } from "#core/factories/subscription.factory.js";
import { CreateSubscriptionResponseDto, ICreateSubscriptionResponse } from "#application/dtos/response/subscription/create-response.dto.js";


@injectable()
export class SubscriptionService {
	constructor (
		@inject(SubscriptionRepository)
		readonly repository: ISubscriptionRepository
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

		return new CreateSubscriptionResponseDto(
			id,
			subscriptionFromDb.userId,
			subscriptionFromDb.target,
			subscriptionFromDb.strategy,
			subscriptionFromDb.isActive
		);
	}
}