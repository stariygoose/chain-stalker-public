import { DomainError } from "#core/errors/index.js";
import { AbsoluteChangeStrategy, PercentageChangeStrategy } from "#core/strategies/notification/index.js";
import { IPriceChangeStrategy, PriceChangeStrategiesTypes } from "#core/strategies/notification/index.js";

export class StrategyFactory {
	static createPriceStrategy(type: PriceChangeStrategiesTypes, threshold: number): IPriceChangeStrategy {
		switch(type) {
			case "absolute":
				return new AbsoluteChangeStrategy(threshold);
			case "percentage":
				return new PercentageChangeStrategy(threshold);
			default:
				const exhaustiveCheck: never = type;
				throw new DomainError.PriceStrategyTypeError(exhaustiveCheck);
		}
	}
}