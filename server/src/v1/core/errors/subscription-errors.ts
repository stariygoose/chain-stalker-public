import { DomainError } from "./domain-error.abstract.js";

export class InvalidSubscriptionError extends DomainError {
	constructor(message: string) {
		super(message);
	}
}

export class InvalidSubscriptionConfigurationError extends DomainError {
	constructor(subscription: string, reason: string) {
		super(`Invalid configuration for subscription "${subscription}": ${reason}`);
	}
}