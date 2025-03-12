export interface JwtPair {
	accessToken: string;
	refreshToken: string;
}

export interface IJwtToken {
	userId: number;
	refreshToken: string;
}