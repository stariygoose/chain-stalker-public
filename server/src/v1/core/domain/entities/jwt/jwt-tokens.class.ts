import { IJwtToken } from "#v1/core/interfaces/index.js";

export class JwtToken implements IJwtToken {
	constructor (
		public readonly userId: number,
		public readonly refreshToken: string
	) {}
}