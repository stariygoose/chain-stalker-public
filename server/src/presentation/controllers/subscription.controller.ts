import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost, httpPut, next, queryParam, request, requestParam, response } from "inversify-express-utils";

import { ISubscriptionService } from "#application/services/subscription.service.js";
import { TYPES } from "#di/types.js";
import { joiValidator } from "#presentation/middlewares/validation/subscription.create.validator.js";
import { subscriptionCreateSchema } from "#presentation/schemas/subscription.create.schema.js";
import { AuthenticatedRequest } from "#presentation/middlewares/auth/auth.middleware.js";


@controller('/subscriptions')
export class SubscriptionController {
	constructor (
		@inject(TYPES.SubscriptionService)
		private readonly _subscriptionService: ISubscriptionService
	) {}

	@httpGet("/")
  public async getAllByUserId(
    @queryParam("type") type: string,
    @request() req: AuthenticatedRequest,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    try {
			const { context } = req;

      const subs = await this._subscriptionService.getAllByUserId(context.userId, type);

      return res.status(200).json(subs);
    } catch (error) {
      next(error);
    }
  }

	@httpGet('/:id')
	public async getById(
		@requestParam("id") id: string,
		@request() req: AuthenticatedRequest,
		@response() res: Response,
		@next() next: NextFunction
	) {
		const { context } = req;
		try {
			const subscription = await this._subscriptionService.getById(context.userId, id);

			return res.status(200).json(subscription);
		} catch (error: unknown) {
			next(error);
		}
	}

	@httpPost('/create', joiValidator(subscriptionCreateSchema))
	public async create(
		@request() req: AuthenticatedRequest,
		@response() res: Response,
		@next() next: NextFunction
	) {
		try {
			const { body, context } = req;

			const subscription = await this._subscriptionService.create(context.userId, body);

			return res.status(201).json(subscription);

		} catch (error: unknown) {
			next(error);
		}
	}

	@httpPut('/change_status/:id')
	public async changeStatus(
		@requestParam("id") id: string,
		@request() req: AuthenticatedRequest,
		@response() res: Response,
		@next() next: NextFunction
	) {
		try {
			const { userId } = req.context;

			const subscription = await this._subscriptionService.changeStatusById(userId, id);

			return res.status(201).json(subscription);
		} catch (error: unknown) {
			next(error);
		}
	}


}
