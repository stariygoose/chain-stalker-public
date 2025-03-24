import { Target } from "#core/entities/targets/index.js";
import { 
	INftSubscriptionTarget, 
	ISubscriptionTarget, 
	ITokenSubscriptionTarget
} from "#infrastructure/database/mongodb/models/subscription/targets/targets.interfaces.js";
import { Schema } from "mongoose";


export const TargetSchema = new Schema<Target>(
	{
		type: { type: String, enum: ['nft', 'token'], required: true }
	},
	{ discriminatorKey: 'type', _id: false }
)

const NftTargetSchema = new Schema<INftSubscriptionTarget>(
	{
		slug: { type: String, required: true },
		name: { type: String },
		chain: { type: String, required: true },
		lastNotifiedPrice: { type: Number, required: true },
		symbol: { type: String, required: true }
	},
	{ _id: false }
);

const TokenTargetSchema = new Schema<ITokenSubscriptionTarget>(
	{
		lastNotifiedPrice: { type: Number, required: true },
		symbol: { type: String, required: true }
	},
	{ _id: false }
);

TargetSchema.discriminator('nft', NftTargetSchema);
TargetSchema.discriminator('token', TokenTargetSchema);