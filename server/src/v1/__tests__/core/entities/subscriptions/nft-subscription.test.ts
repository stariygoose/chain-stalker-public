import { NftSubscription } from "#core/entities/subscription/nft-subscription.class.js";
import { INftTarget } from "#core/entities/targets/index.js"
import { DomainError } from "#core/errors/index.js";
import { AbsoluteChangeStrategy, IPriceChangeStrategy, PercentageChangeStrategy } from "#core/strategies/notification/index.js";

describe('NftSubscription with Percentage Strategy Unit Tests', () => {
	describe('constructor', () => {
		let target: INftTarget;
		let strategy: IPriceChangeStrategy;
		
		beforeEach(() => {
			const slug = "nft_slug";
			const name = "Nft Name";
			const chain = "ethereum";
			const floorPrice = 2; // ETH
			const symbol = 'ETH';

			target = {
				type: 'nft',
				slug,
				name,
				chain,
				floorPrice,
				symbol
			};

			strategy = new PercentageChangeStrategy(5);
		});

		it('should create an instance of NftSubscription', () => {
			const id = '1';
			const userId = 2032;

			const res = new NftSubscription(
				id,
				userId,
				target,
				strategy
			);

			expect(res).toBeInstanceOf(NftSubscription);
			expect(res.id).toEqual(id);
			expect(res.userId).toEqual(userId);
			expect(res.target).toStrictEqual(target);
			expect(res.strategy).toStrictEqual(strategy);
		});

		it('should throw an error if floor price of target is NaN', () => {
			const id = '1';
			const userId = 2032;

			const slug = "nft_slug";
			const name = "Nft Name";
			const chain = "ethereum";
			const floorPrice = NaN; // ETH
			const symbol = 'ETH';
			const target: INftTarget = {
				type: 'nft',
				slug,
				name,
				chain,
				floorPrice,
				symbol
			};

			expect(() => {
				new NftSubscription(
					id,
					userId,
					target,
					strategy
				);
			}).toThrow(DomainError.PriceTargetConfigurationError);
		});

		it('should throw an error if floor price of target is Infinity', () => {
			const id = '1';
			const userId = 2032;
	
			const slug = "nft_slug";
			const name = "Nft Name";
			const chain = "ethereum";
			const floorPrice = Infinity; // ETH
			const symbol = 'ETH';
			const target: INftTarget = {
				type: 'nft',
				slug,
				name,
				chain,
				floorPrice,
				symbol
			};
	
			expect(() => {
				new NftSubscription(
					id,
					userId,
					target,
					strategy
				);
			}).toThrow(DomainError.PriceTargetConfigurationError);
		});

		it('should throw an error if slug of target is not valid', () => {
			const id = '1';
			const userId = 2032;
	
			const slug = "nft_slug_";
			const name = "Nft Name";
			const chain = "ethereum";
			const floorPrice = 2; // ETH
			const symbol = 'ETH';
			const target: INftTarget = {
				type: 'nft',
				slug,
				name,
				chain,
				floorPrice,
				symbol
			};
	
			expect(() => {
				new NftSubscription(
					id,
					userId,
					target,
					strategy
				);
			}).toThrow(DomainError.SlugTargetConfigurationError);
		});
	});

	describe('withUpdatedState', () => {
		let target: INftTarget;
		let strategy: IPriceChangeStrategy;
		let subscription: NftSubscription;

		beforeEach(() => {
			const slug = "nft_slug";
			const name = "Nft Name";
			const chain = "ethereum";
			const floorPrice = 2; // ETH
			const symbol = 'ETH';

			target = {
				type: 'nft',
				slug,
				name,
				chain,
				floorPrice,
				symbol
			};

			strategy = new PercentageChangeStrategy(5);

			subscription = new NftSubscription(
				'123245',
				54321,
				target,
				strategy
			);
		});

		it('should return correct Nft Subscription when new price is valid', () => {
			const newPrice = 5;

			const res = subscription.withUpdatedState(newPrice);

			expect(res.target.floorPrice).toBe(newPrice);
		});

		it('should throw error Nft Subscription when new price is NaN', () => {
			const newPrice = NaN;

			expect(() => {
				subscription.withUpdatedState(newPrice);
			}).toThrow(DomainError.PriceTargetConfigurationError);
		});

		it('should throw error Nft Subscription when new price is Infinity', () => {
			const newPrice = Infinity;

			expect(() => {
				subscription.withUpdatedState(newPrice);
			}).toThrow(DomainError.PriceTargetConfigurationError);
		});
	});
	
	describe('shouldNotify', () => {
		let target: INftTarget;
		let strategy: IPriceChangeStrategy;
		let subscription: NftSubscription;

		beforeEach(() => {
			const slug = "nft_slug";
			const name = "Nft Name";
			const chain = "ethereum";
			const floorPrice = 100; // ETH
			const symbol = 'ETH';

			target = {
				type: 'nft',
				slug,
				name,
				chain,
				floorPrice,
				symbol
			};

			strategy = new PercentageChangeStrategy(5);

			subscription = new NftSubscription(
				'123245',
				54321,
				target,
				strategy
			);
		});

		it('should return true when price has been changed by threshold', () => {
			const newPrice = 95; // ETH

			const res = subscription.shouldNotify(newPrice);

			expect(res).toBe(true);
		});

		it('should return true when price has been changed by (floorPrice / 2)', () => {
			const newPrice = subscription.target.floorPrice / 2; // ETH

			const res = subscription.shouldNotify(newPrice);

			expect(res).toBe(true);
		});

		it('should return false when price has been changed by (threshold - 0.01)', () => {
			const newPrice = 95.01; // ETH

			const res = subscription.shouldNotify(newPrice);

			expect(res).toBe(false);
		});

		it('should throw error when new price is NaN', () => {
			const newPrice = NaN; // ETH

			expect(() => {
				subscription.shouldNotify(newPrice);
			}).toThrow(DomainError.InvalidNumberError);
		});

		it('should throw error when new price is Infinity', () => {
			const newPrice = Infinity; // ETH

			expect(() => {
				subscription.shouldNotify(newPrice);
			}).toThrow(DomainError.InvalidNumberError);
		});
	});

	describe('shouldNotify', () => {
		let target: INftTarget;
		let strategy: IPriceChangeStrategy;
		let subscription: NftSubscription;

		beforeEach(() => {
			const slug = "nft_slug";
			const name = "Nft Name";
			const chain = "ethereum";
			const floorPrice = 100; // ETH
			const symbol = 'ETH';

			target = {
				type: 'nft',
				slug,
				name,
				chain,
				floorPrice,
				symbol
			};

			strategy = new PercentageChangeStrategy(5);

			subscription = new NftSubscription(
				'123245',
				54321,
				target,
				strategy
			);
		});

		it('should calculate correct number', () => {
			const newPrice = 105;

			const res = subscription.calculateDifference(newPrice);

			expect(res).toBeCloseTo(5);
		});

		it('should calculate correct number when a big change', () => {
			const newPrice = 10000000000;

			const res = subscription.calculateDifference(newPrice);

			expect(res).toBe(9999999900);
		});

		it('should calculate correct number when a little change', () => {
			const newPrice = 100.0001;

			const res = subscription.calculateDifference(newPrice);

			expect(res).toBeCloseTo(0.0001);
		});

		it('should throw error when change is NaN', () => {
			const newPrice = NaN;

			expect(() => {
				subscription.calculateDifference(newPrice);
			}).toThrow(DomainError.InvalidNumberError);
		});
		
		it('should throw error when change is Infinity', () => {
			const newPrice = Infinity;

			expect(() => {
				subscription.calculateDifference(newPrice);
			}).toThrow(DomainError.InvalidNumberError);
		});
	});
});


describe('NftSubscription with Absolute Strategy Unit Tests', () => {
	describe('constructor', () => {
		let target: INftTarget;
		let strategy: IPriceChangeStrategy;
		
		beforeEach(() => {
			const slug = "nft_slug";
			const name = "Nft Name";
			const chain = "ethereum";
			const floorPrice = 0.1; // ETH
			const symbol = 'ETH';

			target = {
				type: 'nft',
				slug,
				name,
				chain,
				floorPrice,
				symbol
			};

			strategy = new AbsoluteChangeStrategy(100);
		});

		it('should create an instance of NftSubscription with Absolute Strategy', () => {
			const id = '1';
			const userId = 2032;

			const res = new NftSubscription(
				id,
				userId,
				target,
				strategy
			);

			expect(res).toBeInstanceOf(NftSubscription);
			expect(res.id).toEqual(id);
			expect(res.userId).toEqual(userId);
			expect(res.target).toStrictEqual(target);
			expect(res.strategy).toStrictEqual(strategy);
		});
	
	describe('shouldNotify', () => {
		let target: INftTarget;
		let strategy: IPriceChangeStrategy;
		let subscription: NftSubscription;

		beforeEach(() => {
			const slug = "nft_slug";
			const name = "Nft Name";
			const chain = "ethereum";
			const floorPrice = 0.1; // ETH
			const symbol = 'ETH';

			target = {
				type: 'nft',
				slug,
				name,
				chain,
				floorPrice,
				symbol
			};

			strategy = new AbsoluteChangeStrategy(0.02);

			subscription = new NftSubscription(
				'123245',
				54321,
				target,
				strategy
			);
		});

		it('should return true when price has been changed by exactly the same value of threshold', () => {
			const newPrice = 0.8; // ETH

			const res = subscription.shouldNotify(newPrice);

			expect(res).toBe(true);
		});

		it('should return true when price has been changed by (floorPrice / 2)', () => {
			const newPrice = subscription.target.floorPrice / 2; // ETH

			const res = subscription.shouldNotify(newPrice);

			expect(res).toBe(true);
		});

		it('should return false when price has been changed by (threshold - 0.00001)', () => {
			const newPrice = subscription.target.floorPrice - (subscription.strategy.threshold - 0.00001); // ETH

			const res = subscription.shouldNotify(newPrice);

			expect(res).toBe(false);
		});

		it('should throw error when new price is NaN', () => {
			const newPrice = NaN; // ETH

			expect(() => {
				subscription.shouldNotify(newPrice);
			}).toThrow(DomainError.InvalidNumberError);
		});

		it('should throw error when new price is Infinity', () => {
			const newPrice = Infinity; // ETH

			expect(() => {
				subscription.shouldNotify(newPrice);
			}).toThrow(DomainError.InvalidNumberError);
		});
	});

	describe('shouldNotify', () => {
		let target: INftTarget;
		let strategy: IPriceChangeStrategy;
		let subscription: NftSubscription;

		beforeEach(() => {
			const slug = "nft_slug";
			const name = "Nft Name";
			const chain = "ethereum";
			const floorPrice = 0.1; // ETH
			const symbol = 'ETH';

			target = {
				type: 'nft',
				slug,
				name,
				chain,
				floorPrice,
				symbol
			};

			strategy = new AbsoluteChangeStrategy(0.02);

			subscription = new NftSubscription(
				'123245',
				54321,
				target,
				strategy
			);
		});

		it('should calculate correct number', () => {
			const newPrice = 0.08;

			const res = subscription.calculateDifference(newPrice);

			expect(res).toBeCloseTo(0.02);
		});

		it('should calculate correct number when a big change', () => {
			const newPrice = 100000000;

			const res = subscription.calculateDifference(newPrice);

			expect(res).toBeCloseTo(99999999.9);
		});

		it('should calculate correct number when a little change', () => {
			const newPrice = 0.1000001;

			const res = subscription.calculateDifference(newPrice);

			expect(res).toBeCloseTo(0.0000001);
		});

		it('should throw error when change is NaN', () => {
			const newPrice = NaN;

			expect(() => {
				subscription.calculateDifference(newPrice);
			}).toThrow(DomainError.InvalidNumberError);
		});
		
		it('should throw error when change is Infinity', () => {
			const newPrice = Infinity;

			expect(() => {
				subscription.calculateDifference(newPrice);
			}).toThrow(DomainError.InvalidNumberError);
		});
	});
	});
});