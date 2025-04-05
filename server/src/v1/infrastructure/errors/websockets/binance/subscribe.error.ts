import { InfrastructureError } from "#infrastructure/errors/infrastructure-error.abstract.js";

export class SubscribeEventError extends InfrastructureError {
	constructor (reason: string) {
		super(`BinanceEventStream | Subscribe Event Error: ${reason}`);
	}
}