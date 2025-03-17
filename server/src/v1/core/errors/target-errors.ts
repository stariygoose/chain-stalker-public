import { DomainError } from "#core/errors/domain-error.abstract.js";

export class InvalidTargetError extends DomainError {
	constructor(message: string) {
		super(message);
	}
}