import { INftTarget } from "#core/entities/targets/index.js";
import { IPriceChangeStrategy } from "#core/strategies/notification/index.js";
import { AbstractSubscription } from "#core/entities/subscription/subscription.abstract.js";
import { NftTargetValidator } from "#core/validators/targets/nft-target.validator.js";

/**
 * Represents an NFT subscription that tracks changes in the floor price of an NFT collection.
 */
export class NftSubscription extends AbstractSubscription<INftTarget, IPriceChangeStrategy> {
	/**
	 * Creates an instance of NftSubscription.
	 * 
	 * @param {string | null} id - The unique identifier of the subscription, or `null` if not assigned.
	 * @param {number} userId - The ID of the user who owns the subscription.
	 * @param {INftTarget} target - The NFT collection being tracked.
	 * @param {IPriceChangeStrategy} strategy - The strategy used to determine when a notification should be sent.
	 * @param {boolean} [isStalked] - Indicates whether the subscription is actively monitoring the target.
	 */
	constructor (
		id: string | null,
		userId: number,
		target: INftTarget,
		strategy: IPriceChangeStrategy,
		isStalked?: boolean
	) {
		super(id, userId, target, strategy, isStalked);
		this.validateSubscription();
	}

	/**
	 * Determines whether a notification should be sent based on the new floor price.
	 * 
	 * @param {number} newState - The updated floor price of the NFT collection.
	 * @returns {boolean} Whether the floor price change meets the notification criteria.
	 */
	public shouldNotify(newState: number): boolean {
		return this.strategy.shouldNotify(this.target.lastNotifiedPrice, newState);
	}

	public calculateDifference(newState: number, precision?: number): number {
		return this.strategy.calculateDifference(this.target.lastNotifiedPrice, newState, precision);
	}

	/**
	 * Creates a new subscription instance with an updated floor price.
	 * 
	 * @param {number} newState - The updated floor price of the NFT collection.
	 * @returns {NftSubscription} A new NftSubscription instance reflecting the updated state.
	 */
	public withUpdatedState(newState: number): NftSubscription {
		const updatedState: INftTarget = {
			...this.target,
			lastNotifiedPrice: newState
		}; 

		return new NftSubscription(
			this.id,
			this.userId,
			updatedState,
			this.strategy,
			this.isActive
		);
	}

	protected validateSubscription(): void {
		new NftTargetValidator(this.target).validate();
	}
}
