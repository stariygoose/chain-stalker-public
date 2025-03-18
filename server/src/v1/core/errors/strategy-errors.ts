import { DomainError } from "#core/errors/domain-error.abstract.js";

export class StrategyError extends DomainError {
	constructor(message: string) {
		super(message);
	}
}

export class InvalidNumberError extends DomainError {
	constructor(instance: string, reason: string) {
		super(`Invalid number input in "${instance}": ${reason}`);
	}
}

export class StrategyConfigurationError extends DomainError {
	constructor(readonly strategy: string, readonly reason: string) {
		super(`Invalid configuration for strategy "${strategy}": ${reason}`);
	}
}

export class ThresholdStrategyConfigurationErrror extends StrategyConfigurationError {
	constructor(strategy: string, reason: string) {
		super(strategy, reason);
	}
}



export class RangeStrategyConfigurationError extends StrategyConfigurationError {
	constructor(strategy: string, reason: string) {
		super(strategy, reason);
	}
}

export class PriceStrategyTypeError extends DomainError {
	constructor(type: string) {
		super(`Unknown price strategy type: ${type}`);
	}
}