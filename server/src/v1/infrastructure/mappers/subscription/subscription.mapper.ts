import { Subscription } from "#core/entities/subscription/index.js";
import { Target } from "#core/entities/targets/index.js";
import { SubscriptionFactory } from "#core/factories/subscription.factory.js";
import { ISubscriptionDbDto, TargetDbDto } from "#infrastructure/dtos/subscription/subscription-dto.interfaces.js";
import { SubscriptionDbRecord } from "#infrastructure/dtos/subscription/subscription.dto.js";
import { LayerError } from "#infrastructure/errors/index.js";
import { Types } from "mongoose";


export class SubscriptionMapper {
	public static toDomain(dbSubscription: SubscriptionDbRecord): Subscription {
		let _id: string | null = null;
		if (dbSubscription._id) {
			_id = dbSubscription._id.toString();
		}

		const target = SubscriptionMapper.convertTargetFromDb(dbSubscription.target);
		
		return SubscriptionFactory.create(
			_id,
			dbSubscription.userId,
			target,
			dbSubscription.strategy.threshold,
			dbSubscription.strategy.type,
			dbSubscription.isActive
		);
	}

	public static toDb(subscription: Subscription): ISubscriptionDbDto {
		let objectId = null;
		if (subscription.id) {
			objectId = new Types.ObjectId(subscription.id);
		}

		const target = SubscriptionMapper.convertTargetToDb(subscription.target);

		return new SubscriptionDbRecord(
			objectId,
			subscription.userId,
			target,	
			subscription.strategy,
			subscription.isActive
		);
	}

	private static convertTargetFromDb(target: TargetDbDto): Target {
		const { type } = target;
		switch (type) {
			case "nft":
				return {
					type: 'nft',
					name: target.name,
					slug: target.slug,
					chain: target.chain,
					lastNotifiedPrice: target.lastNotifiedPrice,
					symbol: target.symbol
				}
			case "token":
				return {
					type: 'token',
					lastNotifiedPrice: target.lastNotifiedPrice,
					symbol: target.symbol
				}
			default:
				const exhaustiveCheck: never = type;
				throw new LayerError.MapperError(
					this.constructor.name,
					`Exhaustive check error. ${exhaustiveCheck} didn't handled by switch in convertTarget.`
				);
		}
	}

	private static convertTargetToDb(target: Target): TargetDbDto {
		const { type } = target;
		switch (type) {
			case "nft":
				return {
					type: 'nft',
					name: target.name,
					slug: target.slug,
					chain: target.chain,
					lastNotifiedPrice: target.lastNotifiedPrice,
					symbol: target.symbol
				}
			case "token":
				return {
					type: 'token',
					lastNotifiedPrice: target.lastNotifiedPrice,
					symbol: target.symbol
				}
			default:
				const exhaustiveCheck: never = type;
				throw new LayerError.MapperError(
					this.constructor.name,
					`Exhaustive check error. ${exhaustiveCheck} didn't handled by switch in convertTarget.`
				);
		}
	}
}