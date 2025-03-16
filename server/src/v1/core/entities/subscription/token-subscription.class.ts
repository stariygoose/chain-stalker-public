import { ITokenTarget } from "#core/entities/targets/index";
import { DomainError } from "#core/errors/index";
import { IPriceChangeStrategy } from "#core/strategies/notification/notification-strategies.interface";
import { AbstractSubscription } from "./subscription.abstract";


/**
 * Represents a subscription for tracking changes in a token's price.
 * Determines when a notification should be sent based on a defined price change strategy.
 */
export class TokenSubscription extends AbstractSubscription<ITokenTarget, IPriceChangeStrategy> {
	/**
	 * Creates an instance of TokenSubscription.
	 * 
	 * @param {string | null} id - The unique identifier of the subscription, or `null` if not assigned.
	 * @param {number} userId - The ID of the user who owns this subscription.
	 * @param {ITokenTarget} target - The token being tracked, including its price and symbol.
	 * @param {IPriceChangeStrategy} strategy - The strategy used to determine notification conditions.
	 * @param {boolean} [isActive] - Whether the subscription is currently active (defaults to `true`).
	 */
	constructor (
		id: string | null,
		userId: number,
		target: ITokenTarget,
		strategy: IPriceChangeStrategy,
		isActive?: boolean
	) {
		super(id, userId, target, strategy, isActive);
		this.validateSubscription();
	}

	/**
	 * Determines whether a notification should be triggered based on the new token price.
	 * 
	 * @param {number} newState - The updated price of the token.
	 * @returns {boolean} Whether the price change meets the notification criteria.
	 */
	public shouldNotify(newState: number): boolean {
		return this.strategy.shouldNotify(this.target.price, newState);
	}

	/**
	 * Creates a new TokenSubscription instance with an updated token price.
	 * 
	 * @param {number} newState - The updated price of the token.
	 * @returns {TokenSubscription} A new TokenSubscription instance reflecting the updated state.
	 */
	public withUpdatedState(newState: number): TokenSubscription {
		const updatedState: ITokenTarget = {
			...this.target,
			price: newState
		};

		return new TokenSubscription(
			this.id,
			this.userId,
			updatedState,
			this.strategy,
			this.isActive
		);
	}

	/**
	 * Validates the configuration of a TokenSubscription instance.
	 * Ensures that the target price is a valid number.
	 * 
	 * @throws {DomainError.InvalidSubscriptionConfigurationError} If the target's floor price is NaN.
	 */
	protected validateSubscription(): void {
		if (isNaN(this.target.price)) {
			throw new DomainError.InvalidSubscriptionConfigurationError(
				this.constructor.name,
				`The new price for subscription target cannot be NaN.`
			);
		}
	}
}
