import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpPost, next, request, response } from "inversify-express-utils";

import { IAuthService } from "#application/services/auth.service.js";
import { TYPES } from "#di/types.js";
import { joiValidator } from "#presentation/middlewares/validation/subscription.create.validator.js";
import { botLoginSchema } from "#presentation/schemas/auth/bot-login.schema.js";
import { refreshTokenSchema } from "#presentation/schemas/auth/refresh-token.schema.js";


@controller('/auth')
export class AuthController {
	constructor(
		@inject(TYPES.AuthService)
		private readonly _authService: IAuthService,
	) {}

	@httpPost('/bot-login', joiValidator(botLoginSchema))
	public async botLogin(
		@request() req: Request,
		@response() res: Response,
		@next() next: NextFunction
	) {
		try {
			const { userId } = req.body;

			const tokens = await this._authService.botLogin(userId);

			return res.status(201).json(tokens);
		} catch (error) {
			next(error);
		}
	}

	@httpPost('/refresh', joiValidator(refreshTokenSchema))
	public async refresh(
		@request() req: Request,
		@response() res: Response,
		@next() next: NextFunction
	) {
		try {
			const { refreshToken } = req.body;
			console.log(`Received a refresh token: ${refreshToken}`);

			const tokens = await this._authService.refreshToken(refreshToken);
			console.log(`Tokens: ${JSON.stringify(tokens)}`);
			return res.status(201).json(tokens);
		} catch (error) {
			next(error);
		}
	}
} 