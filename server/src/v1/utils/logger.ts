import { ConfigService } from "#config/config.service.js";
import { TYPES } from "#di/types.js";
import { inject, injectable } from "inversify";
import winston, { createLogger, format } from "winston";


export interface ILogger {
	info(message: string): void;
	debug(message: string): void;
	warn(message: string): void;
	error(message: string): void;
}

@injectable()
export class Logger implements ILogger {
	private readonly _logger: winston.Logger;
	constructor (
		@inject(TYPES.ConfigService)
		private readonly _config: ConfigService
	) {
		this._logger = this.setupLogger();
	}

	public warn(message: string): void {
		this._logger.warning(message);
	}
	
	public error(message: string): void {
		this._logger.error(message);
	}

	public debug(message: string): void {
		this._logger.debug(message);
	}

	public info(message: string): void {
		this._logger.info(message);
	}

	private setupLogger(): winston.Logger {
		return createLogger({
			level: this.getLoggerLevel(),
			format: format.combine(
				format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
				format.printf(({ level, message, timestamp }) => {
					return `|${timestamp}| [${level}]: ${message}`
			}),
			),
			transports: [
				new winston.transports.Console({
					format: format.combine(format.colorize(), format.printf(({ level, message, timestamp }) => {
						return `|${timestamp}| [${level}]: ${message}`;
					}))
				}),
				new winston.transports.File({ filename: './.logs/combined.log', format: format.uncolorize() }),
				new winston.transports.File({ filename: './.logs/errors.log', format: format.uncolorize(), level: 'error' }),
				new winston.transports.File({ filename: './.logs/warnings.log', format: format.uncolorize(), level: 'warn' }),
			]
		});
	}

	private getLoggerLevel(): 'debug' | 'info' {
		return this._config.isDevMode ? 'debug' : 'info';
	}
}