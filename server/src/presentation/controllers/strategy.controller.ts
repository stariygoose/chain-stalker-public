import { controller, httpPut, next, request, requestParam, response } from "inversify-express-utils";
import { inject } from "inversify";
import { NextFunction, Response } from "express";

import { TYPES } from "#di/types.js";
import { IStrategyService } from "#application/services/strategy.service.js";
import { joiValidator } from "#presentation/middlewares/validation/subscription.create.validator.js";
import { strategyUpdateSchema } from "#presentation/schemas/strategy.update.schema.js";
import { AuthenticatedRequest } from "#presentation/middlewares/auth/auth.middleware.js";


@controller('/strategy')
export class StrategyController {
	constructor (
		@inject(TYPES.StrategyService)
		private readonly _strategyService: IStrategyService
	) {}

	public async updateById(
	@httpPut('/update/:id', joiValidator(strategyUpdateSchema))
		@requestParam("id") id: string,
		@request() req: AuthenticatedRequest,
		@response() res: Response,
		@next() next: NextFunction
	) {
		try {
			const { body, context } = req;

			const subscription = await this._strategyService.updateById(context.userId, id, body);

			return res.status(201).json(subscription);
		} catch (error: unknown) {
			next(error);
		}
	}

	@httpPut('/update/nft/:slug', joiValidator(strategyUpdateSchema))
	public async updateByUserIdAndSlug(
		@requestParam("slug") slug: string,
		@request() req: AuthenticatedRequest,
		@response() res: Response,
		@next() next: NextFunction
	) {
		try {
			const { body, context } = req;

			const subscription = await this._strategyService.updateByUserIdAndSlug(context.userId, slug, body);

			return res.status(201).json(subscription);
		} catch (error: unknown) {
			next(error);
		}
	}

	@httpPut('/update/token/:symbol', joiValidator(strategyUpdateSchema))
	public async updateByUserIdAndSymbol(
		@requestParam("symbol") symbol: string,
		@request() req: AuthenticatedRequest,
		@response() res: Response,
		@next() next: NextFunction
	) {
		try {
			const { body, context } = req;

			const subscription = await this._strategyService.updateByUserIdAndSymbol(context.userId, symbol, body);

			return res.status(201).json(subscription);
		} catch (error: unknown) {
			next(error);
		}
	}
}