import { INftSubscription, NftSubscription } from "#core/entities/subscription/nft-subscription.class.js";
import { ITokenSubscription, TokenSubscription } from "#core/entities/subscription/token-subscription.class.js";
import { INftTarget, ITokenTarget, Target } from "#core/entities/targets/index.js";
import { StrategyFactory } from "#core/factories/strategy.factory.js";
import { DomainError } from "#core/errors/index.js";
import { StrategyType } from "#core/strategies/notification/notification-strategies.interface.js";
import { Subscription } from "#core/entities/subscription/index.js";


export class SubscriptionFactory {
	public static create(
		id: string | null,
		userId: number,
		target: Target,
		threshold: number,
		strategyType: StrategyType,
		isActive: boolean = true
	): Subscription  {
		const { type } = target;
		switch (type) {
			case "nft":
				return SubscriptionFactory.createNftSubscription(
					id,
					userId,
					target,
					threshold,
					strategyType,
					isActive
				);
			case "token":
				return SubscriptionFactory.createTokenSubscription(
					id,
					userId,
					target,
					threshold,
					strategyType,
					isActive
				);
			default:
				const exhaustiveCheck: never = type;
				throw new DomainError.FactoryInvalidTargetTypeError(exhaustiveCheck);
		}
	}

	private static createNftSubscription(
		id: string | null = null,
		userId: number,
		target: INftTarget,
		threshold: number,
		strategyType: StrategyType = 'percentage',
		isActive: boolean
	): INftSubscription {
		const strategy = StrategyFactory.createPriceStrategy(strategyType, threshold);
		
		return new NftSubscription(
			id,
			userId,
			target,
			strategy,
			isActive
		);
	}

	private static createTokenSubscription(
		id: string | null = null,
		userId: number,
		target: ITokenTarget,
		threshold: number,
		strategyType: StrategyType = 'percentage',
		isActive: boolean
	): ITokenSubscription {
		const strategy = StrategyFactory.createPriceStrategy(strategyType, threshold);

		return new TokenSubscription(
			id,
			userId,
			target,
			strategy,
			isActive
		);
	}
}