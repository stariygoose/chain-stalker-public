import { ISubscription } from "#core/entities/subscription/subscription.interface.js";

export interface ISubscriptionRepository {
	getById(id: string): ISubscription;
	getAllByUserId(userId: number): ISubscription;
	getAllByUserIdAndType(userId: number, type: 'nft' | 'token'): ISubscription;
}