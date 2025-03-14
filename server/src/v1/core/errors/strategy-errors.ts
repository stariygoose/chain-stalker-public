import { DomainError } from "./domain-error.abstract.js";

export class InvalidStrategyError extends DomainError {
	constructor(message: string) {
		super(message);
	}
}

export class InvalidStrategyConfigurationError extends DomainError {
	constructor(strategy: string, reason: string) {
		super(`Invalid configuration for strategy "${strategy}": ${reason}`);
	}
}

export class InvalidPriceStrategyError extends DomainError {
	constructor(type: string) {
		super(`Unknown price strategy type: ${type}`);
	}
}