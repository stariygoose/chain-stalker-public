import { NftTarget } from "#core/entities/targets/index.js";
import { DomainError } from "#core/errors/index.js";

describe('NftTarget Unit Tests', () => {
	describe('constructor', () => {
		it('should return valid target', () => {
			const slug = "nft_slug";
			const name = "Nft Name";
			const chain = "ethereum";
			const floorPrice = 2; // ETH
			const symbol = 'ETH';

			const result = new NftTarget(
				slug,
				name,
				chain,
				floorPrice,
				symbol
			);

			expect(result).toBeInstanceOf(NftTarget);
			expect(result.slug).toEqual(slug);
			expect(result.name).toEqual(name);
			expect(result.chain).toEqual(chain);
			expect(result.floorPrice).toEqual(floorPrice);
			expect(result.symbol).toEqual(symbol);
		});

		it('should throw error when slug is not valid', () => {
			const slug = "nft_slug_";
			const name = "Nft Name";
			const chain = "ethereum";
			const floorPrice = 2; // ETH
			const symbol = 'ETH';

			expect(() => {
				new NftTarget(
					slug,
					name,
					chain,
					floorPrice,
					symbol
				);
			}).toThrow(DomainError.SlugTargetConfigurationError);
		});

		it('should throw error when floor price is NaN', () => {
			const slug = "nft_slug";
			const name = "Nft Name";
			const chain = "ethereum";
			const floorPrice = NaN; // ETH
			const symbol = 'ETH';

			expect(() => {
				new NftTarget(
					slug,
					name,
					chain,
					floorPrice,
					symbol
				);
			}).toThrow(DomainError.PriceTargetConfigurationError);
		});

		it('should throw error when floor price is Infinity', () => {
			const slug = "nft_slug";
			const name = "Nft Name";
			const chain = "ethereum";
			const floorPrice = Infinity; // ETH
			const symbol = 'ETH';

			expect(() => {
				new NftTarget(
					slug,
					name,
					chain,
					floorPrice,
					symbol
				);
			}).toThrow(DomainError.PriceTargetConfigurationError);
		});
	})
})