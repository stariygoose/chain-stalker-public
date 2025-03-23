import { DomainError } from "#core/errors/index.js";
import { Validator } from "#core/validators/validator.abstract.js";
import { NumberValidator } from "#core/validators/common/number-validator.class.js";
import { ITokenTarget } from "#core/entities/targets/token-target.interface.js";

export class TokenTargetValidator extends Validator<ITokenTarget> {
	constructor (objective: ITokenTarget) {
		super(objective);
	}

	public validate(): void {
		if (NumberValidator.isInfinity(this.objective.lastNotifiedPrice)) {
			throw new DomainError.PriceTargetConfigurationError(
				this.constructor.name,
				`Price cannot be Infinity.`
			)
		}

		if (NumberValidator.isNaN(this.objective.lastNotifiedPrice)) {
			throw new DomainError.PriceTargetConfigurationError(
				this.constructor.name,
				`Price cannot be NaN.`
			)
		}
	}
}