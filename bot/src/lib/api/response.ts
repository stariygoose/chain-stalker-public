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