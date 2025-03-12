import jwt from "jsonwebtoken";
import { DBManager } from "../db/DBManager.js";
import { ApiError, UnauthorizedError } from "../errors/Errors.js";
class JwtService {
    generateTokens(payload) {
        const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "";
        const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "";
        const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });
        return { accessToken, refreshToken };
    }
    async saveToken(userId, refreshToken) {
        try {
            return await new DBManager().addOrUpdateRefreshToken(userId, refreshToken);
        }
        catch (error) {
            if (error instanceof ApiError)
                throw error;
            console.error(`[ERROR]: Unexpected error while trying to save a refresh token for user: `, {
                userId: userId,
                refreshToken: refreshToken,
                error: error.message
            });
            throw new Error(`Unexpected error while trying to save a refresh token for user.`);
        }
    }
    validateAccessToken(token) {
        try {
            jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? '');
            return true;
        }
        catch (error) {
            return false;
        }
    }
    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET ?? '');
        }
        catch (error) {
        }
    }
    async findTokenInDB(refreshToken) {
        try {
            const db = new DBManager();
            const userJwtData = await db.findToken(refreshToken);
            if (!userJwtData)
                throw new UnauthorizedError(`You can't refresh token before the login.`);
            return userJwtData;
        }
        catch (error) {
            throw error;
        }
    }
}
export default new JwtService();
