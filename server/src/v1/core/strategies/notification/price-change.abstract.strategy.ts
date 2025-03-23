import { IPriceChangeStrategy, PriceStrategies } from "#core/strategies/notification/index.js";

/**
 * Abstract class for price change strategies.
 * Provides utility methods for calculating percentage and absolute price changes.
 */
export abstract class AbstractPriceChangeStrategy implements IPriceChangeStrategy {
	constructor (readonly type: PriceStrategies, readonly threshold: number) {}

	public abstract calculateDifference(currentState: number, newState: number): number;
	public abstract shouldNotify(currentState: number, newState: number): boolean;
	protected abstract verifyThreshold(): void;
}
