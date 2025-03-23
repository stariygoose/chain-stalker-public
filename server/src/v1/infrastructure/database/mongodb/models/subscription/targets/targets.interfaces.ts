export interface ISubscriptionTarget {
	type: 'nft' | 'token';
}

export interface INftSubscriptionTarget extends ISubscriptionTarget {
	type: 'nft';
	slug: string;
	name: string;
	chain: string;
	lastNotifiedPrice: number;
	symbol: string;
}

export interface ITokenSubscriptionTarget extends ISubscriptionTarget {
	type: 'token';
	symbol: string;
	lastNotifiedPrice: number; 
}