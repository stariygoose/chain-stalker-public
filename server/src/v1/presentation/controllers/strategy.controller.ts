import { controller, httpPut, next, request, requestParam, response } from "inversify-express-utils";
import { inject } from "inversify";
import { NextFunction, Request, Response } from "express";

import { TYPES } from "#di/types.js";
import { IStrategyService } from "#application/services/strategy.service.js";
import { joiValidator } from "#presentation/middlewares/validation/subscription.create.validator.js";
import { strategyUpdateSchema } from "#presentation/schemas/strategy.update.schema.js";


@controller('/strategy')
export class StrategyController {
	constructor (
		@inject(TYPES.StrategyService)
		private readonly _strategyService: IStrategyService
	) {}

	@httpPut('/update/:id', joiValidator(strategyUpdateSchema))
	public async updateById(
		@requestParam("id") id: string,
		@request() req: Request,
		@response() res: Response,
		@next() next: NextFunction
	) {
		try {
			const { body } = req;

			const subscription = await this._strategyService.updateById(id, body);

			return res.status(201).json(subscription);
		} catch (error: unknown) {
			next(error);
		}
	}

	@httpPut('/update/nft/:userId/:slug', joiValidator(strategyUpdateSchema))
	public async updateByUserIdAndSlug(
		@requestParam("userId") userId: number,
		@requestParam("slug") slug: string,
		@request() req: Request,
		@response() res: Response,
		@next() next: NextFunction
	) {
		try {
			const { body } = req;

			const subscription = await this._strategyService.updateByUserIdAndSlug(userId, slug, body);

			return res.status(201).json(subscription);
		} catch (error: unknown) {
			next(error);
		}
	}

	@httpPut('/update/token/:userId/:symbol', joiValidator(strategyUpdateSchema))
	public async updateByUserIdAndSymbol(
		@requestParam("userId") userId: number,
		@requestParam("symbol") symbol: string,
		@request() req: Request,
		@response() res: Response,
		@next() next: NextFunction
	) {
		try {
			const { body } = req;

			const subscription = await this._strategyService.updateByUserIdAndSymbol(userId, symbol, body);

			return res.status(201).json(subscription);
		} catch (error: unknown) {
			next(error);
		}
	}
}