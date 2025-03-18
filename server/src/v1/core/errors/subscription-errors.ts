import { DomainError } from "#core/errors/domain-error.abstract.js";

export class InvalidSubscriptionError extends DomainError {
	constructor(message: string) {
		super(message);
	}
}

export class InvalidSubscriptionConfigurationError extends DomainError {
	constructor(readonly subscription: string, readonly reason: string) {
		super(`Invalid configuration for subscription "${subscription}": ${reason}`);
	}
}