import { TokenTarget } from "#core/entities/targets/index.js";
import { DomainError } from "#core/errors/index.js";

describe('TokenTarget Unit Tests', () => {
	describe('constructor', () => {
		it('should return valid target', () => {
			const price = 1980; // USD
			const symbol = 'ETH';

			const result = new TokenTarget(
				price,
				symbol
			);

			expect(result).toBeInstanceOf(TokenTarget);
			expect(result.price).toEqual(price);
			expect(result.symbol).toEqual(symbol);
		});

		it('should throw error when price is NaN', () => {
			const price = NaN; // USD
			const symbol = 'ETH';

			expect(() => {
				new TokenTarget(
					price,
					symbol
				);
			}).toThrow(DomainError.PriceTargetConfigurationError);
		});

		it('should throw error when price is Infinity', () => {
			const price = Infinity; // USD
			const symbol = 'ETH';

			expect(() => {
				new TokenTarget(
					price,
					symbol
				);
			}).toThrow(DomainError.PriceTargetConfigurationError);
		});
	})
})