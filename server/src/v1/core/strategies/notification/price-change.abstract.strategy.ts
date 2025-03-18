import { DomainError } from "#core/errors/index.js";
import { IPriceChangeStrategy } from "#core/strategies/notification/index.js";
import { NumberValidator } from "#core/validator/number-validator.class.js";

/**
 * Abstract class for price change strategies.
 * Provides utility methods for calculating percentage and absolute price changes.
 */
export abstract class AbstractPriceChangeStrategy implements IPriceChangeStrategy {
	/**  
	 * Type identifier for the strategy.  
	 */
	readonly type = "price-change";

	constructor (readonly threshold: number) {}

	public abstract calculateDifference(currentState: number, newState: number): number;
	public abstract shouldNotify(currentState: number, newState: number): boolean;
	protected abstract verifyThreshold(): void;

	

	

}
