import { ApiError } from "#infrastructure/errors/api-errors/api-error.abstract.js";


export class NotFoundError extends ApiError {
	constructor (message: string) {
		super(404, message);
	}
}

export class ExternalApiError extends ApiError {
	constructor () {
		super(503, `Failed to fetch external API.`);
	}
}