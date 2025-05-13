export interface ResponseJwt {
	refreshToken: string;
	accessToken: string;
}

export interface ResponseToken {
	symbol: string;
	price: number;
}

export interface ResponseCollection {
	slug: string;
	name: string;
	chain: string;
	imageUrl: string;
	openseaUrl: string;
	symbol: string;
	floorPrice: number;
}

export interface NftSubscription {
	id: string;
	target: {
		type: 'nft';
		name: string;
		slug: string;
		chain: string;
		lastNotifiedPrice: number;
		symbol: string;
	};
	strategy: {
		type: 'percentage' | 'absolute';
		threshold: number;
	};
	isActive: boolean;
}

export interface TokenSubscription {
	id: string;
	target: {
		type: 'token';
		symbol: string;
		lastNotifiedPrice: number;
	};
	strategy: {
		type: 'percentage' | 'absolute';
		threshold: number;
	};
	isActive: boolean;
}

type Subscription = NftSubscription | TokenSubscription;

export interface ResponseMyStalks {
	userId: number;
	subscriptions: Subscription[];
}