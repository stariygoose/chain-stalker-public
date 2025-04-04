import { InfrastructureError } from "#infrastructure/errors/infrastructure-error.abstract.js"


export class UnexpectedError extends InfrastructureError {
	constructor () {
		super(`Database error.`);
	}
}