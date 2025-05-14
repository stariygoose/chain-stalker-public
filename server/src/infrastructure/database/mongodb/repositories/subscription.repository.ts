import { Types } from "mongoose";
import { inject, injectable } from "inversify";

import { Subscription } from "#core/entities/subscription/index.js";
import { ISubscriptionRepository } from "#core/repositories/subscription-repository.interface.js";

import { SubscriptionModel } from "#infrastructure/database/mongodb/models/index.js";
import { SubscriptionDbRecord } from "#infrastructure/dtos/subscription/subscription.dto.js";
import { AbstractDatabaseError } from "#infrastructure/errors/database-errors/database-errors.abstract.js";
import { LayerError } from "#infrastructure/errors/index.js";
import { SubscriptionMapper } from "#infrastructure/mappers/subscription/subscription.mapper.js";
import { TYPES } from "#di/types.js";
import { ILogger } from "#utils/logger.js";
import { ITokenSubscriptionDbDto, SubscriptionDbDto } from "#infrastructure/dtos/subscription/subscription-dto.interfaces.js";
import { ITokenSubscription } from "#core/entities/subscription/token-subscription.class.js";
import { Target } from "#core/entities/targets/index.js";
import { Strategy } from "#core/strategies/notification/notification-strategies.interface.js";


@injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
	constructor (
		@inject(TYPES.Logger)
		private readonly _logger: ILogger
	) {}

	public async createOrUpdate(subscription: Subscription): Promise<Subscription> {
		try {
			const { id, userId, target, strategy, isActive } = subscription;
	
			const filter = id && Types.ObjectId.isValid(id)
				? { _id: new Types.ObjectId(id) }
				: this._buildTargetFilter(userId, target);
	
			const result = await SubscriptionModel.findOneAndUpdate(
				filter,
				{ $set: { userId, target, strategy, isActive } },
				{ upsert: true, new: true, setDefaultsOnInsert: true }
			).lean<SubscriptionDbDto>();
	
			return SubscriptionMapper.toDomain(new SubscriptionDbRecord(
				result._id,
				result.userId,
				result.target,
				result.strategy,
				result.isActive
			));
		} catch (error: unknown) {
			this._handleDbError(error);
		}
	}

	public async updateStrategy(
		filter: Partial<Record<string, any>>, 
		payload: Partial<Strategy>
	): Promise<Subscription | null> {
		try {
			const result = await SubscriptionModel.findOneAndUpdate(
				filter,
				{ $set: payload },
				{ new: true }
			).lean<SubscriptionDbDto | null>();
		
			if (!result) return null;
		
			return SubscriptionMapper.toDomain(new SubscriptionDbRecord(
				result._id,
				result.userId,
				result.target,
				result.strategy,
				result.isActive
			));
		} catch (error: unknown) {
			this._handleDbError(error);
		}
	}

	public async getById(id: string): Promise<Subscription | null> {
		try {
			const subscriptionFromDb = await SubscriptionModel.findById(id).lean<SubscriptionDbDto>();

			if (!subscriptionFromDb) return null;

			return SubscriptionMapper.toDomain(new SubscriptionDbRecord(
				subscriptionFromDb._id,
				subscriptionFromDb.userId,
				subscriptionFromDb.target,
				subscriptionFromDb.strategy,
				subscriptionFromDb.isActive
			));
		} catch (error) {
			this._handleDbError(error);
		}
	}

	public async getOneByUserIdAndSlug(userId: number, slug: string): Promise<Subscription | null> {
		try {
			const subscriptionFromDb = await SubscriptionModel.findOne({
				userId,
				'target.slug': slug
			}).lean<SubscriptionDbDto>();
	
			if (!subscriptionFromDb) return null;

			return SubscriptionMapper.toDomain(new SubscriptionDbRecord(
				subscriptionFromDb._id,
				subscriptionFromDb.userId,
				subscriptionFromDb.target,
				subscriptionFromDb.strategy,
				subscriptionFromDb.isActive
			));
		} catch (error) {
			this._handleDbError(error);
		}
	}

	public async getOneByUserAndToken(userId: number, symbol: string): Promise<ITokenSubscription | null> {
		try {
			const subscription = await SubscriptionModel.findOne({
				userId,
				'target.type': 'token',
				'target.symbol': symbol
			}).lean<ITokenSubscriptionDbDto>();

			if (!subscription) return null;

			return SubscriptionMapper.toDomain(new SubscriptionDbRecord(
				subscription._id,
				subscription.userId,
				subscription.target,
				subscription.strategy,
				subscription.isActive
			)) as ITokenSubscription;
		} catch (error) {
			this._handleDbError(error);
		}
	}

	public async getAll(filter: Partial<Record<string, unknown>>): Promise<Subscription[] | null> {
		try {
			const subscriptions = await SubscriptionModel.find(filter).lean<SubscriptionDbDto[]>();

			if (subscriptions.length <= 0) return null;

			return subscriptions.map(sub => {
				return SubscriptionMapper.toDomain(new SubscriptionDbRecord(
					sub._id,
					sub.userId,
					sub.target,
					sub.strategy,
					sub.isActive
				));
			});
		} catch (error: unknown) {
			this._handleDbError(error);
		}
	}

	public async getAllTokensByUser(userId: number): Promise<ITokenSubscription[] | null> {
		try {
			const subscriptions = await SubscriptionModel.find({
				userId,
				'target.type': 'token'
			}).lean<ITokenSubscriptionDbDto[]>();

			if (subscriptions.length === 0) return null;

			return subscriptions.map(sub => 
				SubscriptionMapper.toDomain(new SubscriptionDbRecord(
					sub._id,
					sub.userId,
					sub.target,
					sub.strategy,
					sub.isActive
				)) as ITokenSubscription
			);
		} catch (error) {
			this._handleDbError(error);
		}
	}

	public async changeStatusById(id: string): Promise<Subscription | null> {
		try {
			const subscription = await SubscriptionModel.findById(id).lean<SubscriptionDbDto>();

			if (!subscription) return null;

			const updatedSubscription = await SubscriptionModel.findByIdAndUpdate(
				id,
				{ isActive: !subscription.isActive },
				{ new: true }
			).lean<SubscriptionDbDto>();

			if (!updatedSubscription) return null;
			
			return SubscriptionMapper.toDomain(new SubscriptionDbRecord(
				updatedSubscription._id,
				updatedSubscription.userId,
				updatedSubscription.target,
				updatedSubscription.strategy,
				updatedSubscription.isActive
			));
		} catch (error: unknown) {
			this._handleDbError(error);
		}
	}

	public async drop(): Promise<void> {
		try {
			await SubscriptionModel.deleteMany({});
			this._logger.warn(`DATABASE WAS DROPPED.`);
		} catch (error: unknown) {
			this._handleDbError(error);
		}
	}

	private _handleDbError(error: unknown): never {
		if (error instanceof AbstractDatabaseError) {
			this._logger.error(error.message);
			throw error;
		}
	
		this._logger.error(`Unexpected Database Error. Reason: ${(error as Error).message}`);
		throw new LayerError.DatabaseError('Unexpected Database Error.');
	}

	private _buildTargetFilter(userId: number, target: Target): Record<string, any> {
		const { type } = target;
		switch (type) {
			case 'nft':
				return { userId, 'target.type': 'nft', 'target.slug': target.slug };
			case 'token':
				return { userId, 'target.type': 'token', 'target.symbol': target.symbol };
			default:
				const exhaustiveCheck: never = type;
				throw new LayerError.InvalidDbTargetTypeError(exhaustiveCheck);
		}
	}
}