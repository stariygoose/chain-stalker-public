import { InfrastructureError } from "#infrastructure/errors/infrastructure-error.abstract.js";

export class SymbolLackError extends InfrastructureError {
	constructor () {
		super(`You must set a symbol for BinanceEventStream before calling stalk function.`);
	}
}