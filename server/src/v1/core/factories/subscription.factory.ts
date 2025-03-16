import { NftSubscription } from "#core/entities/subscription/nft-subscription.class";
import { TokenSubscription } from "#core/entities/subscription/token-subscription.class";
import { INftTarget, ITokenTarget } from "#core/entities/targets/index";
import { PriceStrategies } from "#core/strategies/notification/index";
import { StrategyFactory } from "./strategy.factory";

export class SubscriptionFactory {
	public static createNftSubscription(
		id: string | null = null,
		userId: number,
		instance: INftTarget,
		threshold: number,
		strategyType: PriceStrategies = 'percentage'
	): NftSubscription {
		const strategy = StrategyFactory.createPriceStrategy(strategyType, threshold);
		
		return new NftSubscription(
			id,
			userId,
			instance,
			strategy
		);
	}

	public static createTokenSubscription(
		id: string | null = null,
		userId: number,
		instance: ITokenTarget,
		threshold: number,
		strategyType: PriceStrategies = 'percentage'
	): TokenSubscription {
		const strategy = StrategyFactory.createPriceStrategy(strategyType, threshold);

		return new TokenSubscription(
			id,
			userId,
			instance,
			strategy
		);
	}
}