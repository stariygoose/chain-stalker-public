import { inject, injectable } from "inversify";

import { TYPES } from "#di/types.js";
import { OpenSeaAPI } from "#infrastructure/lib/apis/index.js";
import { GetCollectionDto } from "#application/dtos/get-collection.dto.js";


export interface ICollectionService {
	getCollection(slug: string): Promise<GetCollectionDto>
}

@injectable()
export class CollectionService implements ICollectionService {
	constructor (
		@inject(TYPES.OpenSeaAPI)
		private readonly _osApi: OpenSeaAPI
	) {}

	public async getCollection(slug: string): Promise<GetCollectionDto> {
		try {
			const [collectionMetaData, collectionFloorPrice] = await Promise.all([
				this._osApi.getCollection(slug),
				this._osApi.getFloorPrice(slug)
			]);

			const collection = new GetCollectionDto(
				collectionMetaData,
				collectionFloorPrice
			);

			return collection;

		} catch (error) {
			throw error;
		}
	}
}