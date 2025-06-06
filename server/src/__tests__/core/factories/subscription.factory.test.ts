import { NftSubscription } from "#core/entities/subscription/nft-subscription.class.js";
import { TokenSubscription } from "#core/entities/subscription/token-subscription.class.js";
import { INftTarget } from "#core/entities/targets/nft-target.interface.js";
import { ITokenTarget } from "#core/entities/targets/token-target.interface.js";
import { DomainError } from "#core/errors/index.js";
import { SubscriptionFactory } from "#core/factories/subscription.factory.js";
import { AbsoluteChangeStrategy, PercentageChangeStrategy } from "#core/strategies/notification/price-change.strategies.js";

describe('Subscription Factory Unit Tests', () => {
	describe('create', () => {
		it('should return correct Nft Subscription with percentage strategy', () => {
			const id = '123';
			const userId = 123456;
			const instance: INftTarget = {
				type: 'nft',
				slug: 'test_slug',
				name: 'Test Name',
				chain: 'ethereum',
				lastNotifiedPrice: 0.11,
				symbol: 'ETH'
			};
			const threshold = 5;
			
			const subscription = SubscriptionFactory.create(
				id,
				userId, 
				instance,
				threshold,
				'percentage'
			);

			expect(subscription).toBeInstanceOf(NftSubscription);
			expect(subscription.isActive).toBe(true);
			expect(subscription.id).toBe(id);
			expect(subscription.target).toBe(instance);
			expect(subscription.strategy.threshold).toBe(threshold);
			expect(subscription.strategy).toBeInstanceOf(PercentageChangeStrategy);
		});

		it('should return correct Nft Subscription with absolute strategy', () => {
			const id = '123';
			const userId = 123456;
			const instance: INftTarget = {
				type: 'nft',
				slug: 'test_slug',
				name: 'Test Name',
				chain: 'ethereum',
				lastNotifiedPrice: 0.11,
				symbol: 'ETH'
			};
			const threshold = 5;
			
			const subscription = SubscriptionFactory.create(
				id,
				userId, 
				instance,
				threshold,
				'absolute'
			);

			expect(subscription).toBeInstanceOf(NftSubscription);
			expect(subscription.isActive).toBe(true);
			expect(subscription.id).toBe(id);
			expect(subscription.target).toBe(instance);
			expect(subscription.strategy.threshold).toBe(threshold);
			expect(subscription.strategy).toBeInstanceOf(AbsoluteChangeStrategy);
		});

		it('should return correct Token Subscription with percentage strategy', () => {
			const id = '123';
			const userId = 123456;
			const target: ITokenTarget = {
				type: 'token',
				lastNotifiedPrice: 2345,
				symbol: 'ETH'
			};
			const threshold = 5;
			
			const subscription = SubscriptionFactory.create(
				id,
				userId, 
				target,
				threshold,
				'percentage'
			);

			expect(subscription).toBeInstanceOf(TokenSubscription);
			expect(subscription.isActive).toBe(true);
			expect(subscription.id).toBe(id);
			expect(subscription.userId).toBe(userId);
			expect(subscription.target).toBe(target);
			expect(subscription.strategy.threshold).toBe(threshold);
			expect(subscription.strategy).toBeInstanceOf(PercentageChangeStrategy);
		});

		it('should return correct Token Subscription with absolute strategy', () => {
			const id = '123';
			const userId = 123456;
			const target: ITokenTarget = {
				type: 'token',
				lastNotifiedPrice: 2345,
				symbol: 'ETH'
			};
			const threshold = 100;
			
			const subscription = SubscriptionFactory.create(
				id,
				userId, 
				target,
				threshold,
				'absolute'
			);

			expect(subscription).toBeInstanceOf(TokenSubscription);
			expect(subscription.isActive).toBe(true);
			expect(subscription.id).toBe(id);
			expect(subscription.userId).toBe(userId);
			expect(subscription.target).toBe(target);
			expect(subscription.strategy.threshold).toBe(threshold);
			expect(subscription.strategy).toBeInstanceOf(AbsoluteChangeStrategy);
		});

		it('should throw error when invalid threshold', () => {
			const id = '123';
			const userId = 123456;
			const instance: INftTarget = {
				type: 'nft',
				slug: 'test_slug',
				name: 'Test Name',
				chain: 'ethereum',
				lastNotifiedPrice: 0.11,
				symbol: 'ETH'
			};
			let threshold = NaN;
			
			expect(() => {
				SubscriptionFactory.create(
					id,
					userId, 
					instance,
					threshold,
					'percentage'
				);
			}).toThrow(DomainError.ThresholdStrategyConfigurationErrror);

			threshold = Infinity;
			expect(() => {
				SubscriptionFactory.create(
					id,
					userId, 
					instance,
					threshold,
					'percentage'
				);
			}).toThrow(DomainError.RangeStrategyConfigurationError);

			threshold = 0;
			expect(() => {
				SubscriptionFactory.create(
					id,
					userId, 
					instance,
					threshold,
					'percentage'
				);
			}).toThrow(DomainError.RangeStrategyConfigurationError);
		});

		it('shoud throw error when Nft Target is not valid', () => {
			const id = '123';
			const userId = 123456;
			const instance: INftTarget = {
				type: 'nft',
				slug: 'test_slug',
				name: 'Test Name',
				chain: 'ethereum',
				lastNotifiedPrice: NaN,
				symbol: 'ETH'
			};
			let threshold = 5;
			
			expect(() => {
				SubscriptionFactory.create(
					id,
					userId, 
					instance,
					threshold,
					'percentage'
				);
			}).toThrow(DomainError.PriceTargetConfigurationError);
		});

		it('shoud throw error when Token Target is not valid', () => {
			const id = '123';
			const userId = 123456;
			const target: ITokenTarget = {
				type: 'token',
				lastNotifiedPrice: NaN,
				symbol: 'ETH'
			};
			const threshold = 100;
			
			expect(() => {
				SubscriptionFactory.create(
					id,
					userId, 
					target,
					threshold,
					'percentage'
				);
			}).toThrow(DomainError.PriceTargetConfigurationError);
		});
	});
});