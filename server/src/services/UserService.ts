import { createHash, createHmac } from "crypto";
import { ApiError, UnauthorizedError } from "../errors/Errors.js";
import JwtService from "./JwtService.js";
import { DBManager } from "../db/DBManager.js";


class UserService  {
	public checkHashValidity(hash: string, query: Record<string, string>): void {
		try {
		  const token = process.env.TG_BOT_TOKEN ?? "";
			const secret = createHash("sha256").update(token).digest();

			const dataCheckString = Object.keys(query)
				.sort()
				.filter((k) => query[k])
				.map(key => (`${key}=${query[key]}`))
				.join('\n');
			const hmac = createHmac("sha256", secret)
				.update(dataCheckString)
				.digest('hex');

			if (hash !== hmac)
				throw new UnauthorizedError(`Don't trynna play with me, snitch.`);
		} catch (error: any) {
			if (error instanceof ApiError)
				throw error;

			console.log(`[ERROR]: Unexpected error while checking a telegram hash validity: `, {
				error: error.message,
				hash: hash,
				query: query
			});
			throw new Error(`Unexpected error. HERE`);
		}
	}

	public async refresh(refreshToken: string | null)
		: Promise<{ accessToken: string, refreshToken: string }> {
		try {
			if (!refreshToken)
				throw new UnauthorizedError(`No refresh token in cookies.`);
			const decoded = JwtService.validateRefreshToken(refreshToken);
			const userJwtData = await JwtService.findTokenInDB(refreshToken);
			if (!decoded || !userJwtData)
				throw new UnauthorizedError();

			const userMetadata = await new DBManager().getUser(userJwtData.userId);
			if (!userMetadata)
				throw new Error(`Unexpected error.`);
			
			const newTokens = JwtService.generateTokens(userMetadata);
			await JwtService.saveToken(userJwtData.userId, newTokens.refreshToken);

			return newTokens;
		} catch (error: any) {
			if (error instanceof ApiError)
				throw error;

			console.error(`[ERROR]: Unexpected error while trying to refresh tokens: `, {
				error: error.message,
				refreshToken: refreshToken
			});
			throw new Error(`Unexpected error while trying to refresh tokens.`);
		}
	}
}

export default new UserService();