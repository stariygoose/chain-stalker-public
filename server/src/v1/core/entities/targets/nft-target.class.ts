import { INftTarget } from "#core/entities/targets/index.js";
import { DomainError } from "#core/errors/index.js";
import { NumberValidator } from "#core/validator/number-validator.class.js";
import { SlugValidator } from "#core/validator/slug-validator.class.js";

export class NftTarget implements INftTarget {
	public readonly type = "nft";
	constructor(
		public readonly slug: string,
		public readonly name: string,
		public readonly chain: string,
		public readonly floorPrice: number,
		public readonly symbol: string
	) {
		this.validateTarget();
	}

	private validateTarget(): void {
		if (!SlugValidator.isSlug(this.slug)) {
			throw new DomainError.SlugTargetConfigurationError(
				this.slug
			);
		}

		if (NumberValidator.isInfinity(this.floorPrice)) {
			throw new DomainError.PriceTargetConfigurationError(
				this.constructor.name,
				`Floor price cannot be Infinity.`
			)
		}

		if (NumberValidator.isNaN(this.floorPrice)) {
			throw new DomainError.PriceTargetConfigurationError(
				this.constructor.name,
				`Floor price cannot be NaN.`
			)
		}
	}
}