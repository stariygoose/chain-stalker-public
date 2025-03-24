import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { INftTarget, ITokenTarget } from '#core/entities/targets/index.js';
import { SubscriptionFactory } from '#core/factories/index.js';
import { SubscriptionRepository } from '#infrastructure/database/mongodb/repositories/subscription.repository.js';
import { TokenSubscription } from '#core/entities/subscription/token-subscription.class.js';
import { LayerError } from '#infrastructure/errors/index.js';


describe('Subscription Repository Unit Tests', () => {
	let mongoServer: MongoMemoryServer;
	let repository: SubscriptionRepository;

	beforeAll(async () => {
		mongoServer = await MongoMemoryServer.create();
		const uri = mongoServer.getUri();

		await mongoose.connect(uri);

		repository = new SubscriptionRepository();
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoServer.stop();
	})

	beforeEach(async () => {
    await repository.drop();
  });

	describe('create', () => {
    it('should create new nft subscription', async () => {
			const userId = 123456;
			const target: INftTarget = {
				type: 'nft',
				slug: 'test_slug',
				name: 'Test Name',
				chain: 'ethereum',
				lastNotifiedPrice: 0.11,
				symbol: 'ETH'
			};
			const threshold = 5;
			const subscription = SubscriptionFactory.createNftSubscription(
				null,
				userId, 
				target,
				threshold,
				'absolute'
			);

      const sub = await repository.create(subscription);

      expect(sub).toHaveProperty('id');
      expect(sub.id).not.toBe(null);
			expect(sub.userId).toBe(userId);
			expect(sub.target).toEqual(target);
			expect(sub.strategy).toEqual(subscription.strategy);
    });

		it('should return new token subscription', async () => {
			const userId = 123456;
			const target: ITokenTarget = {
				type: 'token',
				lastNotifiedPrice: 2323,
				symbol: 'ETH'
			};
			const threshold = 5;
			const subscription = SubscriptionFactory.createTokenSubscription(
				null,
				userId, 
				target,
				threshold,
				'absolute'
			);

      const sub = await repository.create(subscription);

      expect(sub).toHaveProperty('id');
      expect(sub.id).not.toBe(null);
			expect(sub.userId).toBe(userId);
			expect(sub.target).toEqual(target);
			expect(sub.strategy).toEqual(subscription.strategy);
		});

		it('should ignore and create a subscription when id is defined', async () => {
			const userId = 123456;
			const target: ITokenTarget = {
				type: 'token',
				lastNotifiedPrice: 2323,
				symbol: 'ETH'
			};
			const threshold = 5;
			const subscription = SubscriptionFactory.createTokenSubscription(
				'123234',
				userId, 
				target,
				threshold,
				'absolute'
			);

      const sub = await repository.create(subscription);

      expect(sub).toHaveProperty('id');
      expect(sub.id).not.toBe(null);
      expect(sub.id).not.toEqual('123234');
			expect(sub.userId).toBe(userId);
			expect(sub.target).toEqual(target);
			expect(sub.strategy).toEqual(subscription.strategy);
		});
  });

	describe('getById', () => {
		it('should return correct subscription', async () => {
			const userId = 123456;
			const target: ITokenTarget = {
				type: 'token',
				lastNotifiedPrice: 2323,
				symbol: 'ETH'
			};
			const threshold = 5;
			const subscription = SubscriptionFactory.createTokenSubscription(
				'123234',
				userId, 
				target,
				threshold,
				'absolute'
			);

      const { id } = await repository.create(subscription);
			if (!id) return ;

			const sub = await repository.getById(id);

			expect(sub).toBeInstanceOf(TokenSubscription);
			expect(sub.id).toEqual(id);
			expect(sub.target).toEqual(subscription.target);
			expect(sub.strategy).toEqual(subscription.strategy);
		});

		it('should throw error when subscription with id doesnot exist', async () => {
			const userId = 123456;
			const target: ITokenTarget = {
				type: 'token',
				lastNotifiedPrice: 2323,
				symbol: 'ETH'
			};
			const threshold = 5;
			const subscription = SubscriptionFactory.createTokenSubscription(
				null,
				userId, 
				target,
				threshold,
				'absolute'
			);

      const { id } = await repository.create(subscription);
			if (!id) return ;

			const fakeId = '67e18c26a584f0d88b2e530d';

			await expect(async () => {
				await repository.getById(fakeId);
			}).rejects.toThrow(LayerError.NotFoundDbError);
		});

		it('should throw error when subscription with has invalid id', async () => {
			const userId = 123456;
			const target: ITokenTarget = {
				type: 'token',
				lastNotifiedPrice: 2323,
				symbol: 'ETH'
			};
			const threshold = 5;
			const subscription = SubscriptionFactory.createTokenSubscription(
				null,
				userId, 
				target,
				threshold,
				'absolute'
			);

      const { id } = await repository.create(subscription);
			if (!id) return ;

			await expect(async () => {
				await repository.getById(id + '2');
			}).rejects.toThrow(LayerError.InvalidIdDbError);
		});
	});
})