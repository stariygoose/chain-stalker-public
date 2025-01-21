import { NextFunction, Request, Response } from "express";

import { SubsService } from "../services/SubsService.js";
import { BadRequestError } from "../errors/Errors.js";

export class SubsController {
	public getSubscriptionsByUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		try {
			const { userId } = req.params;
			if (!userId) {
				throw new BadRequestError();
			}

			const subs = await new SubsService().getSubscriptionsByUser(+userId);
			return res.status(200).json({ userId: +userId, subscriptions: subs });
		} catch (error) {
			next(error);
		}
	}

	public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		try {
			const { userId } = req.params;
			if (!userId) {
				throw new BadRequestError();
			}
			
			await new SubsService().deleteUser(+userId);
			return res.sendStatus(204);
		} catch (error) {
			next(error);
		}
	}
}
