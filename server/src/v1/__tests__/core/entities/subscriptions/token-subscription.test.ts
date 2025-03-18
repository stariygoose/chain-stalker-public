import { TokenSubscription } from "#core/entities/subscription/token-subscription.class.js";
import { ITokenTarget } from "#core/entities/targets/index.js"
import { DomainError } from "#core/errors/index.js";
import { AbsoluteChangeStrategy, IPriceChangeStrategy, PercentageChangeStrategy } from "#core/strategies/notification/index.js";

describe('TokenSubscription with Percentage Strategy Unit Tests', () => {
	describe('constructor', () => {
		let target: ITokenTarget;
		let strategy: IPriceChangeStrategy;
		
		beforeEach(() => {
			const price = 2000; // USD
			const symbol = 'ETH';

			target = {
				type: 'token',
				price,
				symbol
			};

			strategy = new PercentageChangeStrategy(5);
		});

		it('should create an instance of TokenSubscription', () => {
			const id = '1';
			const userId = 2032;

			const res = new TokenSubscription(
				id,
				userId,
				target,
				strategy
			);

			expect(res).toBeInstanceOf(TokenSubscription);
			expect(res.id).toEqual(id);
			expect(res.userId).toEqual(userId);
			expect(res.target).toStrictEqual(target);
			expect(res.strategy).toStrictEqual(strategy);
		});

		it('should throw an error if price of target is NaN', () => {
			const id = '1';
			const userId = 2032;

			const price = NaN; // USD
			const symbol = 'ETH';
			const target: ITokenTarget = {
				type: 'token',
				price,
				symbol
			};

			expect(() => {
				new TokenSubscription(
					id,
					userId,
					target,
					strategy
				);
			}).toThrow(DomainError.PriceTargetConfigurationError);
		});

		it('should throw an error if price of target is Infinity', () => {
			const id = '1';
			const userId = 2032;

			const price = NaN; // USD
			const symbol = 'ETH';
			const target: ITokenTarget = {
				type: 'token',
				price,
				symbol
			};
	
			expect(() => {
				new TokenSubscription(
					id,
					userId,
					target,
					strategy
				);
			}).toThrow(DomainError.PriceTargetConfigurationError);
		});
	});

	describe('withUpdatedState', () => {
		let target: ITokenTarget;
		let strategy: IPriceChangeStrategy;
		let subscription: TokenSubscription;

		beforeEach(() => {
			const price = 2000; // USD
			const symbol = 'ETH';

			target = {
				type: 'token',
				price,
				symbol
			};

			strategy = new PercentageChangeStrategy(5);

			subscription = new TokenSubscription(
				'123245',
				54321,
				target,
				strategy
			);
		});

		it('should return correct Token Subscription when new price is valid', () => {
			const newPrice = 2000;

			const res = subscription.withUpdatedState(newPrice);

			expect(res.target.price).toBe(newPrice);
		});

		it('should throw error Token Subscription when new price is NaN', () => {
			const newPrice = NaN;

			expect(() => {
				subscription.withUpdatedState(newPrice);
			}).toThrow(DomainError.PriceTargetConfigurationError);
		});

		it('should throw error Token Subscription when new price is Infinity', () => {
			const newPrice = Infinity;

			expect(() => {
				subscription.withUpdatedState(newPrice);
			}).toThrow(DomainError.PriceTargetConfigurationError);
		});
	});
	
	describe('shouldNotify', () => {
		let target: ITokenTarget;
		let strategy: IPriceChangeStrategy;
		let subscription: TokenSubscription;

		beforeEach(() => {
			const price = 2400; // USD
			const symbol = 'ETH';

			target = {
				type: 'token',
				price,
				symbol
			};

			strategy = new PercentageChangeStrategy(5);

			subscription = new TokenSubscription(
				'123245',
				54321,
				target,
				strategy
			);
		});

		it('should return true when price has been changed by threshold', () => {
			const newPrice = 2520; // ETH

			const res = subscription.shouldNotify(newPrice);

			expect(res).toBe(true);
		});

		it('should return true when price has been changed by (price / 2)', () => {
			const newPrice = subscription.target.price / 2; // ETH

			const res = subscription.shouldNotify(newPrice);

			expect(res).toBe(true);
		});

		it('should return false when price has been changed by (threshold - 0.01)', () => {
			const newPrice = subscription.target.price - (subscription.strategy.threshold - 0.00001); // ETH

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
		let target: ITokenTarget;
		let strategy: IPriceChangeStrategy;
		let subscription: TokenSubscription;

		beforeEach(() => {
			const price = 2400; // USD
			const symbol = 'ETH';

			target = {
				type: 'token',
				price,
				symbol
			};

			strategy = new PercentageChangeStrategy(5);

			subscription = new TokenSubscription(
				'123245',
				54321,
				target,
				strategy
			);
		});

		it('should calculate correct number', () => {
			const newPrice = 2520;

			const res = subscription.calculateDifference(newPrice);

			expect(res).toBeCloseTo(5);
		});

		it('should calculate correct number when a big change', () => {
			const newPrice = 10000000000;

			const res = subscription.calculateDifference(newPrice);

			expect(res).toBeCloseTo(416666566.67);
		});

		it('should calculate correct number when a little change', () => {
			const newPrice = 2400.1;

			const res = subscription.calculateDifference(newPrice);

			expect(res).toBeCloseTo(0.004);
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


describe('TokenSubscription with Absolute Strategy Unit Tests', () => {
	describe('constructor', () => {
		let target: ITokenTarget;
		let strategy: IPriceChangeStrategy;
		
		beforeEach(() => {
			const price = 2000; // USD
			const symbol = 'ETH';

			target = {
				type: 'token',
				price,
				symbol
			};

			strategy = new AbsoluteChangeStrategy(100);
		});

		it('should create an instance of NftSubscription with Absolute Strategy', () => {
			const id = '1';
			const userId = 2032;

			const res = new TokenSubscription(
				id,
				userId,
				target,
				strategy
			);

			expect(res).toBeInstanceOf(TokenSubscription);
			expect(res.id).toEqual(id);
			expect(res.userId).toEqual(userId);
			expect(res.target).toStrictEqual(target);
			expect(res.strategy).toStrictEqual(strategy);
		});
	
	describe('shouldNotify', () => {
		let target: ITokenTarget;
		let strategy: IPriceChangeStrategy;
		let subscription: TokenSubscription;

		beforeEach(() => {
			const price = 2400; // USD
			const symbol = 'ETH';

			target = {
				type: 'token',
				price,
				symbol
			};

			strategy = new AbsoluteChangeStrategy(100);

			subscription = new TokenSubscription(
				'123245',
				54321,
				target,
				strategy
			);
		});

		it('should return true when price has been changed by exactly the same value of threshold', () => {
			const newPrice = 2500; // ETH

			const res = subscription.shouldNotify(newPrice);

			expect(res).toBe(true);
		});

		it('should return true when price has been changed by (floorPrice / 2)', () => {
			const newPrice = subscription.target.price / 2; // ETH

			const res = subscription.shouldNotify(newPrice);

			expect(res).toBe(true);
		});

		it('should return false when price has been changed by (threshold - 0.00001)', () => {
			const newPrice = subscription.target.price - (subscription.strategy.threshold - 0.00001); // ETH

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
		let target: ITokenTarget;
		let strategy: IPriceChangeStrategy;
		let subscription: TokenSubscription;

		beforeEach(() => {
			const price = 2400; // USD
			const symbol = 'ETH';

			target = {
				type: 'token',
				price,
				symbol
			};

			strategy = new AbsoluteChangeStrategy(100);

			subscription = new TokenSubscription(
				'123245',
				54321,
				target,
				strategy
			);
		});

		it('should calculate correct number', () => {
			const newPrice = 2500;

			const res = subscription.calculateDifference(newPrice);

			expect(res).toBeCloseTo(100);
		});

		it('should calculate correct number when a big change', () => {
			const newPrice = 100000000;

			const res = subscription.calculateDifference(newPrice);

			expect(res).toBeCloseTo(99997600);
		});

		it('should calculate correct number when a little change', () => {
			const newPrice = 2400.0000001;

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