import { InfrastructureError } from "#infrastructure/errors/infrastructure-error.abstract.js";

export class NotFoundAPIError extends InfrastructureError {
	constructor (message: string) {
		super(message);
	}
}

export class UnexpectedExternalAPIError extends InfrastructureError {
	constructor (instance: string, reason: string) {
		super(`Failed to fetch ${instance}. Reason: ${reason}`);
	}
}