import { Types } from "mongoose";

import { Subscription } from "#core/entities/subscription/index.js";
import { ISubscriptionRepository } from "#core/repositories/subscription-repository.interface.js";
import { Target } from "#core/entities/targets/index.js";

import { SubscriptionModel } from "#infrastructure/database/mongodb/models/index.js";
import { ISubscriptionDbDto } from "#infrastructure/dtos/subscription/subscription-dto.interfaces.js";
import { SubscriptionDbRecord } from "#infrastructure/dtos/subscription/subscription.dto.js";
import { DatabaseError } from "#infrastructure/errors/database-errors/database-errors.abstract.js";
import { LayerError } from "#infrastructure/errors/index.js";
import { InfrastructureError } from "#infrastructure/errors/infrastructure-error.abstract.js";
import { SubscriptionMapper } from "#infrastructure/mappers/subscription/subscription.mapper.js";

import { logger } from "#utils/logger.js";


export class SubscriptionRepository implements ISubscriptionRepository {
	public async create(subscription: Subscription): Promise<Subscription> {
		try {
			const res = await SubscriptionModel.create({
				userId: subscription.userId,
				target: subscription.target,
				strategy: subscription.strategy,
				isActive: subscription.isActive
			});

			const record = new SubscriptionDbRecord(
				res._id,
				res.userId,
				res.target as Target,
				res.strategy,
				res.isActive
			)

			return SubscriptionMapper.toDomain(record);
		} catch (error: unknown) {
			if (error instanceof Error) {
				logger.error(`Unexpected Error: ${error.message}`);
				throw error;
			}
			logger.error('Unknown error occurred');
			throw new Error('Unknown error occurred');
		}
	}

	public async getById(id: string): Promise<Subscription> {
		try {
			if (!Types.ObjectId.isValid(id)) {
				throw new LayerError.InvalidIdDbError(id);
			}

			const subscriptionFromDb = await SubscriptionModel.findById<ISubscriptionDbDto>(id);

			if (!subscriptionFromDb) {
				throw new LayerError.NotFoundDbError(
					`Subscription with id: ${id} doesn't exist.`
				);
			}
			const { _id, userId, target, strategy, isActive } = subscriptionFromDb;
			return SubscriptionMapper.toDomain(new SubscriptionDbRecord(
				_id,
				userId,
				target,
				strategy,
				isActive
			));
		} catch (error: unknown) {
			if (error instanceof LayerError.NotFoundDbError) {
				logger.warn(error.message);
			}
			if (error instanceof DatabaseError || error instanceof InfrastructureError) {
				logger.error(`Database Error: ${error.message}`);
				throw error;
			}
			if (error instanceof Error) {
				logger.error(`Unexpected Error: ${error.message}`);
				throw error;
			}
			logger.error('Unknown error occurred');
			throw new Error('Unknown error occurred');
		}
	}

	public async drop(): Promise<void> {
		await SubscriptionModel.deleteMany({});
	}
}