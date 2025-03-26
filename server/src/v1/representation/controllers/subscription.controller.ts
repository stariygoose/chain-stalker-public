import { ISubscriptionService } from "#application/services/subscription.service.js";
import { TYPES } from "#di/types.js";
import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpPost } from "inversify-express-utils";

@controller('/subscription')
export class SubscriptionController {
	constructor (
		@inject(TYPES.SubscriptionService)
		private readonly _subscriptionService: ISubscriptionService
	) {}

	@httpPost('/create')
	public async create(req: Request, res: Response, next: NextFunction) {
		try {
			const { body } = req;
			const subscription = await this._subscriptionService.create(body);
			
			return res.json(subscription).status(201);
		} catch (error: unknown) {
			next(error);
		}
	}
}