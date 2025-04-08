export class ConfigError extends Error {
	constructor(public message: string) {
		super(message);
		this.name = 'ConfigError';
		Error.captureStackTrace(this, this.constructor);
	}
}