import { MenuState } from "./menuState.js";
import { NetworkStateKeys } from "./networkState.js"
import { UserState } from "./userState.js"

export interface StalkingResponse {
	message: string
}

export interface IUserContext<T extends ICollection | ICoin> {
	state: UserState | null;
	prevMsgId: number | null;
	btnType: MenuState | null;
	network: NetworkStateKeys | null;
	contract: string | null;
	percentage: number | null;
	target: T | null;
}

export interface ICollection {
	address: string,
	chain: string,
	collection: string,
	name: string,
	floorPrice: number,
	floorPriceSymbol: string,
}

export interface ICoin {
	symbol: string
	price: number
}

export const SubscriptionType = {
	coin: "CoinSubscription",
	nft: "NftSubscription"
} as const
export type SubscriptionTypeKeys = typeof SubscriptionType[keyof typeof SubscriptionType];
export interface ISubscription<T extends ICollection | ICoin> {
	userId: number,
	type: SubscriptionTypeKeys,
	target: T,
	percentage: number,
	isStalked: boolean,	
	createdAt: Date,
	updatedAt: Date
}

export interface IPing<T extends ICollection | ICoin>{
	userId: number
	target: T,
	percentage: number,
}

export interface IUserSubscriptions {
	userId: number,
	subscriptions: Array<ISubscription<ICollection | ICoin>>
}