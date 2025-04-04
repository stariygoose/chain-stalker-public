import { InfrastructureError } from "#infrastructure/errors/infrastructure-error.abstract.js"

export class SubscriptionNotFound extends InfrastructureError {
	constructor (message: string) {
		super(message);
	}
}