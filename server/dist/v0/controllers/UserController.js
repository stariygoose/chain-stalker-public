import { BadRequestError, UnauthorizedError } from "../errors/Errors.js";
import UserService from "../services/UserService.js";
import JwtService from "../services/JwtService.js";
export class UserController {
    async login(req, res, next) {
        try {
            const { hash, ...query } = req.query;
            if (!query.id || !hash)
                throw new BadRequestError();
            UserService.checkHashValidity(hash, query);
            const tokens = JwtService.generateTokens({ userId: query.id });
            await JwtService.saveToken(+query.id, tokens.refreshToken);
            res.cookie('accessToken', tokens.accessToken, {
                maxAge: 30 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            });
            res.cookie('refreshToken', tokens.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            });
            return res.status(301).redirect("/test");
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return res.status(200).json({ message: "Logged out successfully" });
        }
        catch (error) {
            next(error);
        }
    }
    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const tokens = await UserService.refresh(refreshToken);
            return res.status(201).json(tokens);
        }
        catch (error) {
            next(error);
        }
    }
    async checkAuth(req, res, next) {
        try {
            const { accessToken } = req.cookies;
            const decoded = JwtService.validateAccessToken(accessToken);
            if (!decoded)
                throw new UnauthorizedError("Invalid access token.");
            return res.status(200).json({ message: "Authenticated" });
        }
        catch (error) {
            next(error);
        }
    }
}
