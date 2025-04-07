import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpPost, next, request, response } from "inversify-express-utils";

import { ISubscriptionService } from "#application/services/subscription.service.js";
import { TYPES } from "#di/types.js";
import { joiValidator } from "#presentation/middlewares/validation/subscription.create.validator.js";
import { subscriptionCreateSchema } from "#presentation/schemas/subscription.create.schema.js";


@controller('/subscription')
export class SubscriptionController {
	constructor (
		@inject(TYPES.SubscriptionService)
		private readonly _subscriptionService: ISubscriptionService
	) {}

	@httpPost('/create', joiValidator(subscriptionCreateSchema))
	public async create(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
		try {
			const { body } = req;

			const subscription = await this._subscriptionService.create(body);

			return res.status(201).json(subscription);

		} catch (error: unknown) {
			next(error);
		}
	}
}
