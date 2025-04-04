import { Subscription } from "#core/entities/subscription/index.js";

export interface ISubscriptionRepository {
	create(subscription: Subscription): Promise<Subscription>;
	updateById(_id: string, data: Partial<Subscription>): Promise<void>;
	updateLastNotifiedPrice(_id: string, price: number): Promise<void>;
	getById(id: string): Promise<Subscription>;
	getOneByUserIdAndSlug(userId: number, slug: string): Promise<Subscription>;

	// getAllByUserId(userId: number): Promise<ISubscription>;
	// getAllByUserIdAndType(userId: number, type: 'nft' | 'token'): Promise<ISubscription>;
}