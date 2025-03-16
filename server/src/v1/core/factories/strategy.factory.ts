import { DomainError } from "#core/errors/index";
import { AbsoluteChangeStrategy, PercentageChangeStrategy } from "#core/strategies/notification/index";
import { IPriceChangeStrategy, PriceStrategies } from "#core/strategies/notification/index";

export class StrategyFactory {
	static createPriceStrategy(type: PriceStrategies, threshold: number): IPriceChangeStrategy {
		switch(type) {
			case "absolute":
				return new AbsoluteChangeStrategy(threshold);
			case "percentage":
				return new PercentageChangeStrategy(threshold);
			default:
				const exhaustiveCheck: never = type;
				throw new DomainError.InvalidPriceStrategyError(exhaustiveCheck);
		}
	}
}