import { Subscription } from "#core/entities/subscription/index.js";

export interface ISubscriptionRepository {
	create(subscription: Subscription): Promise<Subscription>;
	getById(id: string): Promise<Subscription>;
	// getAllByUserId(userId: number): Promise<ISubscription>;
	// getAllByUserIdAndType(userId: number, type: 'nft' | 'token'): Promise<ISubscription>;
}