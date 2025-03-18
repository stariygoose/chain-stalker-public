import {DomainError} from "#core/errors/domain-error.abstract.js";

export class InvalidNumberError extends DomainError {
	constructor(readonly instance: string, readonly reason: string) {
		super(`Invalid number input in "${instance}": ${reason}`);
	}
}

export class InvalidSlugError extends DomainError {
	constructor(readonly slug: string) {
		super(`Invalid slug: ${slug}`);
	}
}