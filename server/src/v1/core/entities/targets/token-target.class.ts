import { ITokenTarget } from "#core/entities/targets/index.js";
import { DomainError } from "#core/errors/index.js";
import { NumberValidator } from "#core/validator/number-validator.class.js";

export class TokenTarget implements ITokenTarget {
	public readonly type = "token";
	constructor(
		public readonly price: number,
		public readonly symbol: string
	) {
		this.validateTarget();
	}

	private validateTarget(): void {
		if (NumberValidator.isInfinity(this.price)) {
			throw new DomainError.PriceTargetConfigurationError(
				this.constructor.name,
				`Price cannot be Infinity.`
			)
		}

		if (NumberValidator.isNaN(this.price)) {
			throw new DomainError.PriceTargetConfigurationError(
				this.constructor.name,
				`Price cannot be NaN.`
			)
		}
	}
}