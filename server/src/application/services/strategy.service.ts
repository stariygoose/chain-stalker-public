import { Types } from "mongoose";
import { inject, injectable } from "inversify";

import { Subscription } from "#core/entities/subscription/index.js";
import { Strategy } from "#core/strategies/notification/notification-strategies.interface.js";
import { TYPES } from "#di/types.js";
import { ISubscriptionRepository } from "#core/repositories/subscription-repository.interface.js";
import { Logger } from "#utils/logger.js";
import { ApiError } from "#infrastructure/errors/index.js";


export interface IStrategyService {
	updateById(userId: number, id: string, payload: unknown): Promise<Subscription>;
	updateByUserIdAndSlug(userId: number, slug: string, payload: unknown): Promise<Subscription>;
	updateByUserIdAndSymbol(userId: number, symbol: string, payload: unknown): Promise<Subscription>;
}

@injectable()
export class StrategyService implements IStrategyService {
	constructor (
		@inject(TYPES.SubscriptionRepository)
		private readonly _db: ISubscriptionRepository,
		@inject(TYPES.Logger)
		private readonly _logger: Logger
	) {}

	public async updateById(
		userId: number,
		id: string,
		payload: Strategy
	): Promise<Subscription> {
		if (!Types.ObjectId.isValid(id)) {
			throw new ApiError.BadRequestError("Invalid ID");
		}

		const filter: Record<string, unknown> = {
			_id: id,
			userId: userId
		}

		try {
			const updated = await this._db.updateStrategy(filter, payload);

			if (!updated) {
				throw new ApiError.NotFoundError("Subscription not found");
			}

			this._logger.info(`Subscription <${id}> was updated by id.`);

			return updated;
		} catch (error: unknown) {
			throw error;
		}
	}

	public async updateByUserIdAndSlug(
		userId: number,
		slug: string,
		payload: Strategy
	): Promise<Subscription> {
		const filter: Record<string, unknown> = {
			userId: userId,
			'target.slug': slug
		};

		try {
			const updated = await this._db.updateStrategy(filter, payload);

			if (!updated) {
				throw new ApiError.NotFoundError("Subscription not found");
			}

			this._logger.info(`Subscription <${updated.id}> was updated by userId and slug.`);

			return updated;
		} catch (error: unknown) {
			throw error;
		}
	}

	public async updateByUserIdAndSymbol(
		userId: number,
		symbol: string,
		payload: Strategy
	): Promise<Subscription> {
		const filter: Record<string, unknown> = {
			userId: userId,
			'target.symbol': symbol.toUpperCase()
		};

		try {
			const updated = await this._db.updateStrategy(filter, payload);

			if (!updated) {
				throw new ApiError.NotFoundError("Subscription not found");
			}

			this._logger.info(`Subscription <${updated.id}> was updated by userId and symbol.`);

			return updated;
		} catch (error: unknown) {
			throw error;
		}
	}
}