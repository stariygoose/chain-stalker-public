import { OpenSeaStreamClient } from "@opensea/stream-js";
import { inject, injectable } from "inversify";

import { ConfigService } from "#config/config.service.js";
import { EnvVariables } from "#config/env-variables.js";
import { ISubscriptionRepository } from "#core/repositories/subscription-repository.interface.js";
import { TYPES } from "#di/types.js";
import { DatabaseError } from "#infrastructure/errors/database-errors/database-errors.abstract.js";
import { NotFoundDbError } from "#infrastructure/errors/database-errors/database-errors.js";
import { LayerError } from "#infrastructure/errors/index.js";
import { fromWeiToEth } from "#infrastructure/helpers/index.js";
import { INftEventStream } from "#infrastructure/websockets/interfaces/nft-event-stream.interface.js";
import { ILogger } from "#utils/logger.js";
import { IPubSub } from "#infrastructure/lib/redis/pubsub/pubsub.interface.js";
import { OpenSeaAPI } from "#infrastructure/lib/opensea/opensea-api.class.js";
import { RedisPubSub } from "#infrastructure/lib/redis/pubsub/redis-pubsub.class.js";
import { ICache } from "#infrastructure/lib/redis/index.js";


@injectable()
export class OpenseaEventStream implements INftEventStream {
	public readonly maxEventsPerConnection: number = Infinity;
	public currentEventsPerConnection: number = 0;

	private readonly _client: OpenSeaStreamClient;
	private readonly _token: string;

	constructor (
		@inject(TYPES.ConfigService)
		private readonly _config: ConfigService,
		@inject(TYPES.SubscriptionRepository)
		private readonly _db: ISubscriptionRepository,
		@inject(TYPES.RedisPubSub)
		private readonly _redisPubSub: IPubSub,
		@inject(TYPES.RedisCache)
		private readonly _cache: ICache,
		@inject(TYPES.OpenSeaAPI)
		private readonly _osApi: OpenSeaAPI,
		@inject(TYPES.Logger)
		private readonly _logger: ILogger
	) {
		this._token = this._config.get(EnvVariables.OPENSEA_TOKEN);
		this._client = this.createClient();
	}

	public stalk(userId: number, slug: string): void {
    try {
      this._client.onItemListed(slug, async (event) => {
        const price = fromWeiToEth(event.payload.base_price);
        await this.handleEvent(userId, slug, price);
      });

      this._client.onItemSold(slug, async (event) => {
        const price = fromWeiToEth(event.payload.sale_price);
        await this.handleEvent(userId, slug, price);
      });

      this._logger.info(`New subscription for [${slug}]`);
    } catch (error) {
      throw error;
    }
  }

	public disconnect(): void {
		this._client.disconnect(() => {
			this._logger.warn(`Disconnected from OpenSea Event Stream.`);
		});
	}

	private createClient(): OpenSeaStreamClient {
		return new OpenSeaStreamClient({
			token: this._token,
			connectOptions: {
				transport: WebSocket
			},
			logLevel: 50,
			onError: (error) => {
				this._logger.error(`OpenSeaEventStream Error: ${error}`);
			}
		});
	}

	private async handleEvent(userId: number, slug: string, price: number): Promise<void> {
    try {
      const subscription = await this._db.getOneByUserIdAndSlug(userId, slug);
      const { lastNotifiedPrice } = subscription.target;

      const shouldNotify = subscription.strategy.shouldNotify(lastNotifiedPrice, price);
      if (!shouldNotify) {
        this._logger.debug(`[${userId}:${slug}] No notification needed. Skipping.`);
        return;
      }

			let floorPrice: number;
			const cached = await this._cache.get<number>(`floor:${slug}`);
			if (cached) {
				floorPrice = cached;
				this._logger.debug(`Floor price for [${slug}] restored from cache.`);
			} else {
				this._logger.debug(`Cache was cleared. Fetching API to get Floor Price for [${slug}].`);

				const fetchedFloorPrice = await this._osApi.getFloorPrice(slug);
				floorPrice = fetchedFloorPrice.floorPrice;
				await this._cache.set(`floor:${slug}`, floorPrice);
			}

      const difference = subscription.strategy.calculateDifference(lastNotifiedPrice, price);
      const updated = subscription.withUpdatedState(floorPrice);

      await Promise.all([
        this._db.updateLastNotifiedPrice(updated.id!, updated.target.lastNotifiedPrice),
        this._redisPubSub.publish(RedisPubSub.UpdatePriceChannel, {
          ...updated,
          difference
        }),
      ]);

      this._logger.debug(`Updated subscription for [${userId}:${slug}] and published update.`);

    } catch (error: any) {
			if (error instanceof NotFoundDbError) {
				throw new LayerError.SubscriptionNotFound(
					`Subscription for user ${userId} with target's slug ${slug} doesnt exist.`
				);
			}
			if (error instanceof DatabaseError) {
				throw new LayerError.UnexpectedError();
			}
			this._logger.error(`${error.name} | Message: ${error.message}`);
			throw new Error(`Unhandled Error`);
		}
	}
}