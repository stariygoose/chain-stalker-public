import { NftSubscription } from "#core/entities/subscription/nft-subscription.class.js";
import { TokenSubscription } from "#core/entities/subscription/token-subscription.class.js";
import { INftTarget, ITokenTarget } from "#core/entities/targets/index.js";
import { PriceStrategies } from "#core/strategies/notification/index.js";
import { StrategyFactory } from "./strategy.factory.js";

export class SubscriptionFactory {
	public static createNftSubscription(
		userId: number,
		instance: INftTarget,
		threshold: number,
		strategyType: PriceStrategies = 'percentage'
	): NftSubscription {
		const strategy = StrategyFactory.createPriceStrategy(strategyType, threshold);
		
		return new NftSubscription(
			null,
			userId,
			instance,
			strategy
		);
	}

	public static createTokenSubscription(
		userId: number,
		instance: ITokenTarget,
		threshold: number,
		strategyType: PriceStrategies = 'percentage'
	): TokenSubscription {
		const strategy = StrategyFactory.createPriceStrategy(strategyType, threshold);

		return new TokenSubscription(
			null,
			userId,
			instance,
			strategy
		);
	}
}