import { inject, injectable } from "inversify";

import { TYPES } from "#di/types.js";
import { OpenseaEventStream } from "#infrastructure/websockets/marketplaces/opensea/opensea-event-stream.class.js";


@injectable()
export class WebsocketManager {
	constructor (
		@inject(TYPES.OpenseaEventStream)
		private readonly _os: OpenseaEventStream
	) {}

	public stalkFromOpensea(userId: number, slug: string) {
		try {
			this._os.stalk(userId, slug);
		} catch (error: unknown) {
			throw error;
		}
	}
} 