import { DomainError } from "#core/errors/domain-error.abstract.js";

export class FactoryInvalidTargetTypeError extends DomainError {
	constructor (invalidType: string) {
		super(`Unresolved type for Subscription factory <${invalidType}>`);
	}
}