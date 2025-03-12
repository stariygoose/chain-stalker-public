import { BasedSubscription, Token } from "#v1/core/interfaces/index.js";

export class TokenSubscription implements BasedSubscription<Token> {
	constructor (
		public readonly percentage: number,
		public readonly target: Token
	) {}
}