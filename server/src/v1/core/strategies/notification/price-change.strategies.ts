import { DomainError } from "#core/errors/index.js";
import { AbstractPriceChangeStrategy } from "#core/strategies/notification/price-change.abstract.strategy.js";
import { NumberValidator } from "#core/validators/common/number-validator.class.js";

/**
 * Strategy for determining whether a price change exceeds a percentage threshold.
 * This class implements a strategy that compares the percentage change between two prices
 * and checks if the change exceeds the defined threshold to trigger a notification.
 */
export class PercentageChangeStrategy extends AbstractPriceChangeStrategy {
	/** The minimum allowable percentage threshold */
	static readonly BASE_LIMIT: number = 0;

	/** The maximum allowable percentage threshold */
	static readonly TOP_LIMIT: number = 10000;

	/**
	 * Creates an instance of PercentageChangeStrategy.
	 * The constructor verifies the validity of the provided threshold.
	 * 
	 * @param {number} threshold - The percentage threshold that must be exceeded to trigger a notification.
	 */
	constructor(threshold: number) {
		super('percentage', threshold);
		this.verifyThreshold();
	}

	/**
	 * Checks if the percentage change between the current and new price exceeds the threshold.
	 * 
	 * This method calculates the percentage change between the `currentState` and `newState`
	 * and compares it to the threshold value. If the absolute percentage change exceeds or
	 * equals the threshold, the method returns `true`; otherwise, it returns `false`.
	 * 
	 * @param {number} currentState - The previous recorded price.
	 * @param {number} newState - The new updated price.
	 * @returns {boolean} Whether the price change exceeds the percentage threshold.
	 */
	public shouldNotify(currentState: number, newState: number): boolean {
		const percentage = this.calculateDifference(currentState, newState);
		return Math.abs(percentage) >= this.threshold;
	}

	public calculateDifference(currentState: number, newState: number, precision: number = 2): number {
		if (
			NumberValidator.isInfinity(currentState) || 
			NumberValidator.isInfinity(newState) ||
			NumberValidator.isInfinity(precision)
		) {
			throw new DomainError.InvalidNumberError(
				`${this.constructor.name}:${this.calculateDifference.name}`,
				`Parameters cannot be Infinity.`
			)
		}

		if (
			NumberValidator.isNaN(currentState) ||
			NumberValidator.isNaN(newState)
		) {
			throw new DomainError.InvalidNumberError(
				`${this.constructor.name}: ${this.calculateDifference.name}`,
				`Parameters cannot be NaN.`
			)
		}
		return this.calculatePercentageChange(currentState, newState, precision);
	}

	/**
	 * Verifies if the percentage threshold is a valid value.
	 * The threshold is checked for being a valid number and within the predefined limits.
	 */
	protected verifyThreshold(): void {
		if (NumberValidator.isNaN(this.threshold)) {
			throw new DomainError.ThresholdStrategyConfigurationErrror(
				this.constructor.name,
				`The percentage threshold cannot be NaN.`
			);
		}

		if (NumberValidator.isInfinity(this.threshold)) {
			throw new DomainError.RangeStrategyConfigurationError(
				this.constructor.name,
				`The percentage threshold cannot be Infinity.`
			);
		}

		if (!NumberValidator.isInRange(
			this.threshold,
			PercentageChangeStrategy.BASE_LIMIT,
			PercentageChangeStrategy.TOP_LIMIT
		)) {
			throw new DomainError.RangeStrategyConfigurationError(
				this.constructor.name,
				`The percentage threshold must be between ${PercentageChangeStrategy.BASE_LIMIT} and ${PercentageChangeStrategy.TOP_LIMIT}`
			);
		}
	}

	/**
	 * Calculates the percentage change between two prices, handling edge cases.
	 * 
	 * @param {number} currentPrice - The initial price.
	 * @param {number} newPrice - The updated price.
	 * @returns {number} The percentage change from the current price to the new price:
	 *   - Returns 0 when both prices are zero (no change)
	 *   - Returns 100 when price appears (from zero to some value)
	 *   - Returns -100 when price disappears (from some value to zero)
	 *   - Otherwise returns the standard percentage change calculation
	 */
	private calculatePercentageChange(currentPrice: number, newPrice: number, precision: number): number {		
		if (currentPrice === 0 && newPrice === 0) {
			return 0;
		}
		if (currentPrice === 0) {
			return 100;
		}
		if (newPrice === 0) {
			return -100;
		}

		const differance = ((newPrice - currentPrice) / currentPrice) * 100;
		return Number(differance.toFixed(precision));
	}
}


/**
 * Strategy for determining whether a price change exceeds an absolute value threshold.
 * This class checks if the absolute price difference between two prices exceeds a given threshold.
 * If the difference is greater than or equal to the threshold, a notification will be triggered.
 */
export class AbsoluteChangeStrategy extends AbstractPriceChangeStrategy {
	/** The minimum allowable absolute value threshold */
	static readonly BASE_LIMIT: number = 0;

	/** The maximum allowable absolute value threshold */
	static readonly TOP_LIMIT: number = 10000000;

	/**
	 * Creates an instance of AbsoluteChangeStrategy.
	 * The constructor ensures that the provided threshold is valid by calling `verifyThreshold()`.
	 * 
	 * @param {number} threshold - The absolute price difference required to trigger a notification.
	 * @throws {DomainError.InvalidStrategyConfigurationError} If the threshold is invalid or out of bounds.
	 */
	constructor(threshold: number) {
		super('absolute', threshold);
		this.verifyThreshold();
	}

	/**
	 * Checks if the absolute price difference between the current and new price exceeds the threshold.
	 * 
	 * This method calculates the absolute difference between `currentState` and `newState`
	 * and compares it to the threshold value. If the absolute difference is greater than or
	 * equal to the threshold, it returns `true`; otherwise, it returns `false`.
	 * 
	 * @param {number} currentState - The previous recorded price.
	 * @param {number} newState - The new updated price.
	 * @returns {boolean} Whether the absolute change exceeds the threshold.
	 */
	public shouldNotify(currentState: number, newState: number): boolean {
		const absolute = this.calculateDifference(currentState, newState);
		return absolute >= this.threshold;
	}

	public calculateDifference(currentState: number, newState: number): number {
		if (
			NumberValidator.isInfinity(currentState) || 
			NumberValidator.isInfinity(newState)
		) {
			throw new DomainError.InvalidNumberError(
				`${this.constructor.name}:${this.calculateDifference.name}`,
				`Parameters cannot be Infinity.`
			)
		}

		if (
			NumberValidator.isNaN(currentState) ||
			NumberValidator.isNaN(newState)
		) {
			throw new DomainError.InvalidNumberError(
				`${this.constructor.name}: ${this.calculateDifference.name}`,
				`Parameters cannot be NaN.`
			)
		}

		return this.calculateAbsoluteChange(currentState, newState);
	}

	/**
	 * Verifies if the absolute price threshold is a valid value.
	 * The threshold is checked for being a valid number and within the predefined limits.
	 * 
	 * @throws {DomainError.InvalidStrategyConfigurationError} If the threshold is NaN or out of bounds.
	 */
	protected verifyThreshold(): void {
		if (NumberValidator.isNaN(this.threshold)) {
			throw new DomainError.ThresholdStrategyConfigurationErrror(
				this.constructor.name,
				`The absolute difference threshold cannot be NaN.`
			);
		}

		if (NumberValidator.isInfinity(this.threshold)) {
			throw new DomainError.RangeStrategyConfigurationError(
				this.constructor.name,
				`The absolute difference threshold cannot be Infinity.`
			);
		}

		if (!NumberValidator.isInRange(
				this.threshold,
				AbsoluteChangeStrategy.BASE_LIMIT,
				AbsoluteChangeStrategy.TOP_LIMIT
			)) {
			throw new DomainError.RangeStrategyConfigurationError(
				this.constructor.name,
				`The absolute price difference threshold must be between ${AbsoluteChangeStrategy.BASE_LIMIT} and ${AbsoluteChangeStrategy.TOP_LIMIT}.`
			);
		}
	}

	/**
	 * Calculates the absolute difference between two prices.
	 * @param {number} currentPrice - The initial price.
	 * @param {number} newPrice - The updated price.
	 * @returns {number} The absolute difference between the two prices.
	 */
	private calculateAbsoluteChange(currentPrice: number, newPrice: number): number {
		return Math.abs(newPrice - currentPrice);
	}
}
