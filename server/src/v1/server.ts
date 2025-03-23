import dotenv from "dotenv";
dotenv.config();

import { startServer } from "#config/app.js";
import { INftTarget } from "#core/entities/targets/nft-target.interface.js";
import { SubscriptionFactory } from "#core/factories/subscription.factory.js";
import { SubscriptionModel, UserModel } from "#infrastructure/database/mongodb/models/index.js";



startServer().then(() => {
	const userId = 123456;
	UserModel.create({ userId }).then((res) => {
	
		const instance: INftTarget = {
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
			res.userId, 
			instance,
			threshold,
			'absolute'
		);
		
		SubscriptionModel.create(subscription).then((res) => console.log(res)).catch(err => console.log(err));
	
	}).catch(err => console.log(err));
}).catch((err: unknown) => console.log(err));

