import { ISubscriptionService } from "#application/services/subscription.service.js";
import { TYPES } from "#di/types.js";
import { PresentationError } from "#presentation/errors/index.js";
import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpPost, next, request, response } from "inversify-express-utils";

@controller('/subscription')
export class SubscriptionController {
	constructor (
		@inject(TYPES.SubscriptionService)
		private readonly _subscriptionService: ISubscriptionService
	) {}

	@httpPost('/create')
	public async create(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
		try {
			const { body } = req;
			if (!this.isValidCreateBody(body)) {
				throw new PresentationError.BadRequest('Your request must have userId, target and strategy.');
			}

			const subscription = await this._subscriptionService.create(body);
			return res.status(201).json(subscription);
		} catch (error: unknown) {
			next(error);
		}
	}

	private isValidCreateBody(body: any): boolean {
		if (!body.userId || !body.target || !body.strategy || !body.target.type) {
			return false;
		}
		return true;
	}
}
