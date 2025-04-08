import { INftTarget } from "#core/entities/targets/nft-target.interface.js";
import { DomainError } from "#core/errors/index.js";
import { Validator } from "#core/validators/validator.abstract.js";
import { NumberValidator } from "#core/validators/common/number-validator.class.js";
import { SlugValidator } from "#core/validators/common/slug-validator.class.js";

export class NftTargetValidator extends Validator<INftTarget> {
	constructor (objective: INftTarget) {
		super(objective);
	}

	public validate(): void {
		if (!SlugValidator.isSlug(this.objective.slug)) {
			throw new DomainError.SlugTargetConfigurationError(
				this.objective.slug
			);
		}

		if (NumberValidator.isInfinity(this.objective.lastNotifiedPrice)) {
			throw new DomainError.PriceTargetConfigurationError(
				this.constructor.name,
				`Floor price cannot be Infinity.`
			)
		}

		if (NumberValidator.isNaN(this.objective.lastNotifiedPrice)) {
			throw new DomainError.PriceTargetConfigurationError(
				this.constructor.name,
				`Floor price cannot be NaN.`
			)
		}
	}
}