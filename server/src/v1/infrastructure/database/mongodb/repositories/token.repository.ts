import { inject, injectable } from "inversify";

import { ITokenRepository } from "#core/repositories/token-repository.interface.js";
import { TYPES } from "#di/types.js";
import { Logger } from "#utils/logger.js";
import { ITokenSubscription } from "#core/entities/subscription/token-subscription.class.js";
import { SubscriptionModel } from "#infrastructure/database/mongodb/models/index.js";
import { ITokenSubscriptionDbDto } from "#infrastructure/dtos/subscription/subscription-dto.interfaces.js";
import { LayerError } from "#infrastructure/errors/index.js";
import { SubscriptionMapper } from "#infrastructure/mappers/subscription/subscription.mapper.js";
import { SubscriptionDbRecord } from "#infrastructure/dtos/subscription/subscription.dto.js";
import { InfrastructureError } from "#infrastructure/errors/infrastructure-error.abstract.js";
import { Types } from "mongoose";


@injectable()
export class TokenRepository implements ITokenRepository {
	constructor (
		@inject(TYPES.Logger)
		private readonly _logger: Logger
	) {}

	public async getAllByUser(userId: number): Promise<ITokenSubscription[] | null> {
		try {
			const subscriptions = await SubscriptionModel.find<ITokenSubscriptionDbDto>({
				userId: userId,
				'target.type': 'token'
			});
			if (subscriptions.length <= 0) {
				return null;
			}

			const res: ITokenSubscription[] = subscriptions.map((sub) => {
				const domain = SubscriptionMapper.toDomain(new SubscriptionDbRecord(
					sub._id,
					sub.userId,
					sub.target,
					sub.strategy,
					sub.isActive
				));
			
				return domain as ITokenSubscription;
			});

			return res;
		} catch (error: unknown) {
			if (error instanceof InfrastructureError) {
				throw error;
			}
			if (error instanceof Error) {
				this._logger.error(`Unexpected Error: ${error.message}`);
				throw error;
			}
			this._logger.error('Unknown error occurred.');
			throw new Error('Unknown error occurred.');
		}
	}

	public async getOneByUserAndToken(userId: number, symbol: string): Promise<ITokenSubscription | null> {
		try {
			const subscription = await SubscriptionModel.findOne<ITokenSubscriptionDbDto>({
				userId: userId,
				'target.type': 'token',
				'target.symbol': symbol
			});
			if (!subscription) {
				return null;
			}

			return SubscriptionMapper.toDomain(new SubscriptionDbRecord(
				subscription._id,
				subscription.userId,
				subscription.target,
				subscription.strategy,
				subscription.isActive
			)) as ITokenSubscription;
		} catch (error: unknown) {
			if (error instanceof InfrastructureError) {
				throw error;
			}
			if (error instanceof Error) {
				this._logger.error(`Unexpected Error: ${error.message}`);
				throw error;
			}
			this._logger.error('Unknown error occurred.');
			throw new Error('Unknown error occurred.');
		}
	}

	public async updateLastNotifiedPrice(_id: string, price: number): Promise<void> {
		try {
			if (!Types.ObjectId.isValid(_id)) {
				throw new LayerError.InvalidIdDbError(_id);
			}

			await SubscriptionModel.updateOne(
				{ _id },
				{ $set: { 'target.lastNotifiedPrice': price }}
			);
		} catch (error: unknown) {
			throw error;
		}
	}
}