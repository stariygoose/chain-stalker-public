import { DomainError } from "./domain-error.abstract";

export class InvalidTargetError extends DomainError {
	constructor(message: string) {
		super(message);
	}
}