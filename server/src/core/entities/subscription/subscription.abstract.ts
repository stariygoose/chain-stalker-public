import { INotificationStrategy } from "#core/strategies/notification/index.js";
import { ISubscription, Subscription } from "#core/entities/subscription/index.js";
import { Target } from "#core/entities/targets/subscription-target.interface.js";


/**
 * Abstract class representing a subscription for tracking changes in a target entity.
 * 
 * @template T - The type of the subscription target.
 * @template S - The type of the notification strategy.
 */
export abstract class AbstractSubscription<
	T extends Target,
	S extends INotificationStrategy<unknown, unknown>
> implements ISubscription<T, S> {
	/**
	 * Creates an instance of AbstractSubscription.
	 * 
	 * @param {string | null} id - The unique identifier of the subscription, or `null` if not assigned.
	 * @param {number} userId - The ID of the user who owns the subscription.
	 * @param {T} target - The target entity being tracked by the subscription.
	 * @param {S} strategy - The notification strategy applied to determine when to notify the user.
	 * @param {boolean} [isActive=true] - Indicates whether the subscription is currently active.
	 */
	constructor (
		readonly id: string | null,
		readonly userId: number,
		readonly target: T,
		readonly strategy: S,
		readonly isActive: boolean = true
	) {}

	/**
	 * Determines whether a notification should be sent based on the new state.
	 * 
	 * @param {unknown} newState - The updated state of the tracked target.
	 * @returns {boolean} Whether the notification criteria are met.
	 */
	public abstract shouldNotify(newState: unknown): boolean;

	/**
	 * Creates a new subscription instance with an updated state.
	 * 
	 * @param {unknown} newState - The updated state of the tracked target.
	 * @returns {ISubscription<T, S>} A new subscription instance reflecting the updated state.
	 */
	public abstract withUpdatedState(newState: unknown): Subscription;

	/**
	 * Validates the configuration of a Subscription instance.
	 */
	protected abstract validateSubscription(): void;
}
