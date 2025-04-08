import { inject } from "inversify";
import { controller, httpGet, next, request, requestParam, response } from "inversify-express-utils";

import { TYPES } from "#di/types.js";
import { NextFunction, Request, Response } from "express";
import { ICollectionService } from "#application/services/collection.service.js";


@controller('/collection')
export class CollectionController {
	constructor (
		@inject(TYPES.CollectionService)
		private readonly _collectionService: ICollectionService
	) {}

	@httpGet('/:slug')
	public async getNftBySlug(
		@requestParam('slug') slug: string,
		@request() req: Request,
		@response() res: Response,
		@next() next: NextFunction
	) {
		try {
			const collection = await this._collectionService.getCollection(slug);

			return res.status(200).json(collection);
		} catch (error: unknown) {
			next(error);
		}
	}
}