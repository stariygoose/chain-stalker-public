import { DomainError } from "#core/errors/domain-error.abstract.js";
import { InvalidNumberError, InvalidSlugError } from "#core/errors/common.errors.js";

export class TargetError extends DomainError {
	constructor(message: string) {
		super(message);
	}
}

export class SlugTargetConfigurationError extends InvalidSlugError {
	constructor(readonly slug: string) {
		super(slug);
	}
}

export class PriceTargetConfigurationError extends InvalidNumberError {
	constructor(readonly instance: string, readonly reason: string) {
		super(instance, reason);
	}
}