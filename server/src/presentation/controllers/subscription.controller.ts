import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost, next, queryParam, request, requestParam, response } from "inversify-express-utils";

import { ISubscriptionService } from "#application/services/subscription.service.js";
import { TYPES } from "#di/types.js";
import { joiValidator } from "#presentation/middlewares/validation/subscription.create.validator.js";
import { subscriptionCreateSchema } from "#presentation/schemas/subscription.create.schema.js";


@controller('/subscriptions')
export class SubscriptionController {
	constructor (
		@inject(TYPES.SubscriptionService)
		private readonly _subscriptionService: ISubscriptionService
	) {}

	@httpGet("/")
  public async getAllByUserId(
    @queryParam("userId") userId: number,
    @queryParam("type") type: string,
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    try {
      const subs = await this._subscriptionService.getAllByUserId(userId, type);

      return res.status(200).json(subs);
    } catch (error) {
      next(error);
    }
  }

	@httpGet('/:id')
	public async getById(
		@requestParam("id") id: string,
		@request() req: Request,
		@response() res: Response,
		@next() next: NextFunction
	) {
		try {
			const subscription = await this._subscriptionService.getById(id);

			return res.status(200).json(subscription);
		} catch (error: unknown) {
			next(error);
		}
	}

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
