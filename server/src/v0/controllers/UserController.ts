import { NextFunction, Request, Response } from "express";

import { BadRequestError, UnauthorizedError } from "../errors/Errors.js";
import UserService from "../services/UserService.js";
import JwtService from "../services/JwtService.js";

export class UserController {
	public async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { hash, ...query } = req.query as Record<string, string>;
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
      })
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "strict"
      });

			return res.status(301).redirect("/test");
		} catch (error: any) {
			console.log(error);
			next(error);
		}
	}

	public async logout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error: any) {
      next(error);
    }
	}

	public async refresh(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
      const { refreshToken } = req.cookies;
      const tokens = await UserService.refresh(refreshToken);

			return res.status(201).json(tokens);
		} catch (error: any) {
      next(error);
		}
	}

	public async checkAuth(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { accessToken } = req.cookies;
			const decoded = JwtService.validateAccessToken(accessToken);
			if (!decoded)
				throw new UnauthorizedError("Invalid access token.");
	
			return res.status(200).json({ message: "Authenticated" });
		} catch (error: any) {
			next(error);
		}
	}
}
