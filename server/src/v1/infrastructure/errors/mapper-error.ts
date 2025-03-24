import { InfrastructureError } from "#infrastructure/errors/infrastructure-error.abstract.js";

export class MapperError extends InfrastructureError {
	constructor(instance: string, reason: string) {
		super(`Mapper Error in <${instance}>. Reason: ${reason}`);
	}
}