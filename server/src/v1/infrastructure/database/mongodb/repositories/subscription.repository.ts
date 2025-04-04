import { Types } from "mongoose";
import { inject, injectable } from "inversify";

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
import { TYPES } from "#di/types.js";
import { ILogger } from "#utils/logger.js";


@injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
	constructor (
		@inject(TYPES.Logger)
		private readonly logger: ILogger
	) {}

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
				this.logger.error(`Unexpected Error: ${error.message}`);
				throw error;
			}
			this.logger.error('Unknown error occurred.');
			throw new Error('Unknown error occurred.');
		}
	}

	public async updateById(_id: string, data: Partial<Subscription>): Promise<void> {
		try {
			if (!Types.ObjectId.isValid(_id)) {
				throw new LayerError.InvalidIdDbError(_id);
			}

			await SubscriptionModel.updateOne(
				{ _id },
				{ $set: data }
			);
		} catch (error: unknown) {
			throw error;
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
				this.logger.warn(error.message);
			}
			if (error instanceof DatabaseError || error instanceof InfrastructureError) {
				this.logger.error(`${error.message}`);
				throw error;
			}
			if (error instanceof Error) {
				this.logger.error(`Unexpected Error: ${error.message}`);
				throw error;
			}
			this.logger.error('Unknown error occurred.');
			throw new Error('Unknown error occurred.');
		}
	}

	public async getOneByUserIdAndSlug(userId: number, slug: string): Promise<Subscription> {
		try {
			const subscriptionFromDb = await SubscriptionModel.findOne({
				userId: userId,
				'target.slug': slug
			});
			if (!subscriptionFromDb) {
				throw new LayerError.NotFoundDbError(
					`Subscription for user: ${userId} with target: ${slug} doesn't exist.`
				);
			}

			const { _id, target, strategy, isActive } = subscriptionFromDb;

			return SubscriptionMapper.toDomain(new SubscriptionDbRecord(
				_id,
				subscriptionFromDb.userId,
				target as Target,
				strategy,
				isActive
			));
		} catch (error: unknown) {
			if (error instanceof LayerError.NotFoundDbError) {
				this.logger.warn(error.message);
			}
			if (error instanceof DatabaseError || error instanceof InfrastructureError) {
				this.logger.error(`${error.message}`);
				throw error;
			}
			if (error instanceof Error) {
				this.logger.error(`Unexpected Error: ${error.message}`);
				throw error;
			}
			this.logger.error('Unknown error occurred.');
			throw new Error('Unknown error occurred.');
		}
	}

	public async drop(): Promise<void> {
		try {
			await SubscriptionModel.deleteMany({});
		} catch (error: unknown) {
			this.logger.error('Unexpected error while dropping a database.');
			throw error;
		}
	}
}