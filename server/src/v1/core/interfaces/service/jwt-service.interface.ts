import { IJwtToken, JwtPair } from "../domain/jwt-tokens.interface.js";

export interface IJwtService {
	generateTokens(payload: Record<any, any>): JwtPair;
	saveToken(userId: number, refreshToken: string): IJwtToken;
}