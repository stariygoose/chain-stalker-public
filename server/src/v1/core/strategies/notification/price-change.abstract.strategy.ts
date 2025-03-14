import { IPriceChangeStrategy } from "#core/strategies/notification/index.js";

/**
 * Abstract class for price change strategies.
 * Provides utility methods for calculating percentage and absolute price changes.
 */
export abstract class AbstractPriceChangeStrategy implements IPriceChangeStrategy {
	/**  
	 * Type identifier for the strategy.  
	 */
	readonly type = "price-change";

	/**
	 * Determines whether a notification should be sent based on the price change.
	 * @param {number} currentState - The previous recorded price.
	 * @param {number} newState - The new updated price.
	 * @returns {boolean} Whether the change meets the criteria for notification.
	 */
	public abstract shouldNotify(currentState: number, newState: number): boolean;

	/**
	 * Checks if the threshold value is valid.
	 * Throws an error if the threshold is invalid.
	 */
	protected abstract verifyThreshold(): void;

	/**
	 * Calculates the percentage change between two prices.
	 * @param {number} currentPrice - The initial price.
	 * @param {number} newPrice - The updated price.
	 * @returns {number} The percentage change from the current price to the new price.
	 */
	protected calculatePercentageChange(currentPrice: number, newPrice: number): number {
		return ((newPrice - currentPrice) / currentPrice) * 100;
	}

	/**
	 * Calculates the absolute difference between two prices.
	 * @param {number} currentPrice - The initial price.
	 * @param {number} newPrice - The updated price.
	 * @returns {number} The absolute difference between the two prices.
	 */
	protected calculateAbsoluteChange(currentPrice: number, newPrice: number): number {
		return Math.abs(newPrice - currentPrice);
	}
}
