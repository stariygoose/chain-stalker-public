import { DomainError } from "#core/errors/index.js";
import { AbstractPriceChangeStrategy } from "./price-change.abstract.strategy.js";

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
	 * @throws {DomainError.InvalidStrategyConfigurationError} If the threshold is invalid or out of bounds.
	 */
	constructor(private readonly threshold: number) {
		super();
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
		const percentage = this.calculatePercentageChange(currentState, newState);
		return Math.abs(percentage) >= this.threshold;
	}

	/**
	 * Verifies if the percentage threshold is a valid value.
	 * The threshold is checked for being a valid number and within the predefined limits.
	 * 
	 * @throws {DomainError.InvalidStrategyConfigurationError} If the threshold is NaN or out of bounds.
	 */
	protected verifyThreshold(): void {
		if (isNaN(this.threshold)) {
			throw new DomainError.InvalidStrategyConfigurationError(
				this.constructor.name,
				`The percentage threshold cannot be NaN.`
			);
		}
		if (!this.isCorrectLimits()) {
			throw new DomainError.InvalidStrategyConfigurationError(
				this.constructor.name,
				`The percentage threshold must be between ${PercentageChangeStrategy.BASE_LIMIT} and ${PercentageChangeStrategy.TOP_LIMIT}`
			);
		}
	}

	/**
	 * Checks if the threshold is within the valid range.
	 * 
	 * @returns {boolean} `true` if the threshold is between the base and top limits, `false` otherwise.
	 */
	private isCorrectLimits(): boolean {
		if (
			this.threshold <= PercentageChangeStrategy.BASE_LIMIT 
			|| this.threshold > PercentageChangeStrategy.TOP_LIMIT
		) {
			return false;
		}
		return true;
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
	constructor(private readonly threshold: number) {
		super();
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
		const absolute = this.calculateAbsoluteChange(currentState, newState);
		return absolute >= this.threshold;
	}

	/**
	 * Verifies if the absolute price threshold is a valid value.
	 * The threshold is checked for being a valid number and within the predefined limits.
	 * 
	 * @throws {DomainError.InvalidStrategyConfigurationError} If the threshold is NaN or out of bounds.
	 */
	protected verifyThreshold(): void {
		if (isNaN(this.threshold)) {
			throw new DomainError.InvalidStrategyConfigurationError(
				this.constructor.name,
				`The absolute price difference threshold cannot be NaN.`
			);
		}
		if (!this.isCorrectLimits()) {
			throw new DomainError.InvalidStrategyConfigurationError(
				this.constructor.name,
				`The absolute price difference threshold must be between ${AbsoluteChangeStrategy.BASE_LIMIT} and ${AbsoluteChangeStrategy.TOP_LIMIT}.`
			);
		}
	}

	/**
	 * Checks if the threshold is within the valid range.
	 * 
	 * @returns {boolean} `true` if the threshold is between the base and top limits, `false` otherwise.
	 */
	private isCorrectLimits(): boolean {
		if (
			this.threshold <= AbsoluteChangeStrategy.BASE_LIMIT 
			|| this.threshold > AbsoluteChangeStrategy.TOP_LIMIT
		) {
			return false;
		}
		return true;
	}
}
