import { Subscription } from "#core/entities/subscription/index.js";
import { ITokenSubscription } from "#core/entities/subscription/token-subscription.class.js";

export interface ISubscriptionRepository {
  createOrUpdate(subscription: Subscription): Promise<Subscription>;

  getById(id: string): Promise<Subscription | null>;
  getOneByUserIdAndSlug(userId: number, slug: string): Promise<Subscription | null>;
	
  getOneByUserAndToken(userId: number, symbol: string): Promise<ITokenSubscription | null>;
  getAllTokensByUser(userId: number): Promise<ITokenSubscription[] | null>;
}
