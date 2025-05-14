import { Subscription } from "#core/entities/subscription/index.js";
import { ITokenSubscription } from "#core/entities/subscription/token-subscription.class.js";
import { Strategy } from "#core/strategies/notification/notification-strategies.interface.js";

export interface ISubscriptionRepository {
  createOrUpdate(subscription: Subscription): Promise<Subscription>;

	updateStrategy(filter: Partial<Record<string, any>>, payload: Partial<Strategy>): Promise<Subscription | null>;

  getById(id: string): Promise<Subscription | null>;
  getOneByUserIdAndSlug(userId: number, slug: string): Promise<Subscription | null>;
  getOneByUserAndToken(userId: number, symbol: string): Promise<ITokenSubscription | null>;

	getAll(filter: Partial<Record<string, unknown>>): Promise<Subscription[] | null>;
  getAllTokensByUser(userId: number): Promise<ITokenSubscription[] | null>;

	changeStatusById(id: string): Promise<Subscription | null>;

	drop(): Promise<void>;
}
