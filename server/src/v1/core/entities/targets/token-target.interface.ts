import { ISubscriptionTarget } from "#core/entities/targets/index.js";

export interface ITokenTarget extends ISubscriptionTarget {
	/**
	 * Type of subscription's target.
	 */
	readonly type: 'token';
	/**
	 * The cryptocurrency symbol.
	 */
	readonly symbol: string;
	/**
	 * The most recent price of the token that was sent to the user.
	 * This value is used as a reference for further price change calculations.
	 */
	readonly price: number;
}