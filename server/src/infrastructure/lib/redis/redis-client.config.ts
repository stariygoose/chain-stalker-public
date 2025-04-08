import { inject, injectable } from "inversify";
import { Redis } from "ioredis";

import { ConfigService } from "#config/config.service.js";
import { EnvVariables } from "#config/env-variables.js";
import { Logger } from "#utils/logger.js";
import { TYPES } from "#di/types.js";


@injectable()
export class RedisClient {
	public readonly client: Redis;
	constructor (
		@inject(TYPES.ConfigService)
		private readonly _config: ConfigService,
		@inject(TYPES.Logger)
		private readonly _logger: Logger
	) {
		const PASS = this._config.get(EnvVariables.REDIS_PASSWORD);
		const PORT = this._config.get(EnvVariables.REDIS_PORT);

		this.client = new Redis({
			host: 'redis',
			port: +PORT,
			password: PASS
		});

		this._logger.debug(`Successfuly connected to Redis on ${PORT} port`);
		this.client.on('error', (error) => this._logger.error(`${error.name} | Message: ${error.message} | ${error.cause}`));
	}
}