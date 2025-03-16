import { ISubscriptionTarget } from "#core/entities/targets/index";
import { INotificationStrategy } from "#core/strategies/notification/index";

/**
 * Represents a subscription that tracks changes in a specific target and determines 
 * when a notification should be sent based on a defined strategy.
 * 
 * @template T - The type of the subscription target (e.g., an NFT collection, a token, etc.).
 * @template S - The type of the notification strategy used to evaluate state changes.
 */
export interface ISubscription<
	T extends ISubscriptionTarget = ISubscriptionTarget,
	S extends INotificationStrategy<unknown, unknown> = INotificationStrategy<unknown, unknown>
> {
	/** The unique identifier of the subscription, or `null` if not assigned. */
	readonly id: string | null;

	/** The ID of the user who owns this subscription. */
	readonly userId: number;

	/** The target entity being tracked by the subscription. */
	readonly target: T;

	/** The strategy used to determine when a notification should be sent. */
	readonly strategy: S;

	/** Indicates whether the subscription is currently active. */
	readonly isActive: boolean;

	/**
	 * Determines whether a notification should be triggered based on the new state.
	 * 
	 * @param {unknown} newState - The updated state of the tracked target.
	 * @returns {boolean} Whether the new state meets the notification criteria.
	 */
	shouldNotify(newState: unknown): boolean;

	/**
	 * Creates a new subscription instance with an updated state.
	 * 
	 * @param {unknown} newState - The updated state of the tracked target.
	 * @returns {ISubscription} A new subscription instance reflecting the updated state.
	 */
	withUpdatedState(newState: unknown): ISubscription;
}
