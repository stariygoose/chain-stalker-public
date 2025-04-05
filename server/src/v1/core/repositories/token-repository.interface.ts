import { ITokenSubscription } from "#core/entities/subscription/token-subscription.class.js";

export interface ITokenRepository {
	getAllByUser(userId: number): Promise<ITokenSubscription[] | null>;
	getOneByUserAndToken(userId: number, symbol: string): Promise<ITokenSubscription | null>;
	updateLastNotifiedPrice(_id: string, price: number): Promise<void>;
}