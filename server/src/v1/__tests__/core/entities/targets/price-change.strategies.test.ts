import { DomainError } from "#core/errors/index";
import { PercentageChangeStrategy } from "#core/strategies/notification/price-change.strategies";


describe('PercentageStrategy Integration Test', () => {
	describe('constructor', () => {
		it('should create instance with valid threshold', () => {
			const threshold = 5;
			const strategy = new PercentageChangeStrategy(threshold);

			expect(strategy).toBeInstanceOf(PercentageChangeStrategy);
			expect(strategy.threshold).toEqual(threshold);
			expect(strategy.type).toBe('price-change');
		});

		it('should throw error when treshold is NaN', () => {
			expect(() => {
				new PercentageChangeStrategy(NaN);
			}).toThrow(DomainError.InvalidStrategyConfigurationError);
		});

		it('should throw error when threshold is less or equal to BASE_LIMIT', () => {
			expect(() => {
				new PercentageChangeStrategy(PercentageChangeStrategy.BASE_LIMIT - 1);
			}).toThrow(DomainError.InvalidStrategyConfigurationError);

			expect(() => {
				new PercentageChangeStrategy(PercentageChangeStrategy.BASE_LIMIT);
			}).toThrow(DomainError.InvalidStrategyConfigurationError);
		});

		it('should throw error when threshold is greater then TOP_LIMIT', () => {
			expect(() => {
				new PercentageChangeStrategy(PercentageChangeStrategy.TOP_LIMIT + 1);
			}).toThrow(DomainError.InvalidStrategyConfigurationError);
		});

		it('should accept threshold at the upper boundary', () => {
			const equalToTopLimit = new PercentageChangeStrategy(PercentageChangeStrategy.TOP_LIMIT);
			
			expect(equalToTopLimit).toBeInstanceOf(PercentageChangeStrategy);
			expect(equalToTopLimit.threshold).toEqual(PercentageChangeStrategy.TOP_LIMIT);
			expect(equalToTopLimit.type).toBe('price-change');
		})
	});


	describe('shouldNotify', () => {
		let strategy: PercentageChangeStrategy;
		beforeEach(() => {
			strategy = new PercentageChangeStrategy(5); // 5%
		});

		it('should return true when price increases by exactly the threshold percentage', () => {
			const currentPrice = 100;
			const newPrice = 105; // 5% increase

			const result = strategy.shouldNotify(currentPrice, newPrice);

			expect(result).toBe(true);
		});

		it('should return true when price increases by more than the threshold percentage', () => {
			const currentPrice = 100;
			const newPrice = 115; // 15% increase

			const result = strategy.shouldNotify(currentPrice, newPrice);

			expect(result).toBe(true);
		});

		it('should return true when price decreases by exactly than the threshold percentage', () => {
			const currentPrice = 100;
			const newPrice = 95; // 5% decrease

			const result = strategy.shouldNotify(currentPrice, newPrice);

			expect(result).toBe(true);
		});

		it('should return true when price decreases by more than the threshold percentage', () => {
			const currentPrice = 100;
			const newPrice = 85; // 15% decrease

			const result = strategy.shouldNotify(currentPrice, newPrice);

			expect(result).toBe(true);
		});

		it('should return false when price increases by less than the threshold percentage', () => {
			const currentPrice = 100;
			const newPrice = 104; // 4% increase

			const result = strategy.shouldNotify(currentPrice, newPrice);

			expect(result).toBe(false);
		});

		it('should return false when price decreases by less than the threshold percentage', () => {
			const currentPrice = 100;
			const newPrice = 96; // 4% decrease

			const result = strategy.shouldNotify(currentPrice, newPrice);

			expect(result).toBe(false);
		});

		it('should return false when there is no price change', () => {
			const currentPrice = 100;
			const newPrice = 100; // 0% change

			const result = strategy.shouldNotify(currentPrice, newPrice);

			expect(result).toBe(false);
		});

		it('should handle very small price values correctly', () => {
			const strategy = new PercentageChangeStrategy(10);
			const currentPrice = 0.001;
			const newPrice = 0.0011; // 10% increase

			const result = strategy.shouldNotify(currentPrice, newPrice);

			expect(result).toBe(true);
		});

		it('should handle zero current price correctly', () => {  
      const currentPrice = 0;  
      const newPrice = 10;  
        
      expect(() => {  
        strategy.shouldNotify(currentPrice, newPrice);  
      }).not.toThrow();
    });
	});
})