import { inject, injectable } from "inversify";
import Redis from "ioredis";

import { EnvVariables, IConfigService, ILogger } from "#config/index.js";
import { TYPES } from "#di/types.js";


@injectable()
export class RedisConfig {
	private readonly _PORT: number;
	private readonly _PASSWORD: string;

	public readonly client: Redis.Redis
	
	constructor (
		@inject(TYPES.Logger)
		private readonly _logger: ILogger,
		@inject(TYPES.ConfigService)
		private readonly _config: IConfigService
	) {
		this._PORT = Number(this._config.get(EnvVariables.REDIS_PORT));
		this._PASSWORD = this._config.get(EnvVariables.REDIS_PASSWORD);
		
		this.client = new Redis({
			host: 'redis',
			port: this._PORT,
			password: this._PASSWORD
		});

		this._logger.debug(`Bot successfuly connected to Redis on ${this._PORT} port`);
		this.client.on('error', (error) => this._logger.error(`${error.name} | Message: ${error.message} | ${error.cause}`));
	}
}
