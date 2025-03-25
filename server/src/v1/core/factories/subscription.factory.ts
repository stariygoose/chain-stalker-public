import { NftSubscription } from "#core/entities/subscription/nft-subscription.class.js";
import { TokenSubscription } from "#core/entities/subscription/token-subscription.class.js";
import { INftTarget, ITokenTarget, Target } from "#core/entities/targets/index.js";
import { StrategyFactory } from "#core/factories/strategy.factory.js";
import { DomainError } from "#core/errors/index.js";
import { StrategyType } from "#core/strategies/notification/notification-strategies.interface.js";


export class SubscriptionFactory {
	public static create(
		id: string | null,
		userId: number,
		target: Target,
		threshold: number,
		strategyType: StrategyType,
		isActive: boolean = true
	) {
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
	): NftSubscription {
		const strategy = StrategyFactory.createPriceStrategy(strategyType, threshold);
		
		return new NftSubscription(
			id,
			userId,
			target,
			strategy
		);
	}

	private static createTokenSubscription(
		id: string | null = null,
		userId: number,
		target: ITokenTarget,
		threshold: number,
		strategyType: StrategyType = 'percentage',
		isActive: boolean
	): TokenSubscription {
		const strategy = StrategyFactory.createPriceStrategy(strategyType, threshold);

		return new TokenSubscription(
			id,
			userId,
			target,
			strategy
		);
	}
}