import { AbstractBotError } from "#errors/abstract-bot.error.js";

export class ApiError extends AbstractBotError {
	constructor(
		message: string,
		public readonly botMessage: string = 'An unexpected error occurred by server. Please try again later.'
	) {
		super(message);
	}
}

export class DuplicateApiError extends ApiError {
	constructor(
		message: string, 
		public readonly botMessage: string
	) {
		super(message);
	}
}