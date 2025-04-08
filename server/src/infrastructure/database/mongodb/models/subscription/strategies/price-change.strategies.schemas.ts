import { PriceStrategy } from "#infrastructure/database/mongodb/models/subscription/strategies/strategies.interfaces.js";
import { Schema } from "mongoose";


export const StrategySchema = new Schema<PriceStrategy>(
	{
		type: { type: String, enum: ['absolute', 'percentage'], required: true }
	},
	{ discriminatorKey: 'type', _id: false }
);

const PercentageStrategySchema = new Schema(
	{
		threshold: { type: Number, required: true }
	},
	{ _id: false }
);

const AbsoluteStrategySchema = new Schema(
	{
		threshold: { type: Number, required: true }
	},
	{ _id: false }
);


StrategySchema.discriminator('absolute', AbsoluteStrategySchema);
StrategySchema.discriminator('percentage', PercentageStrategySchema);
