import { InfrastructureError } from "#infrastructure/errors/infrastructure-error.abstract.js";

export class SubscribeEventError extends InfrastructureError {
	constructor (instance: string, reason: string) {
		super(`${instance} Subscribe Event Error. Reason: ${reason}`);
	}
}