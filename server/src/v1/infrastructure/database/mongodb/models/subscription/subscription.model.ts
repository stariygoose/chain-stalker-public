import { model, Schema } from "mongoose";
import { PriceStrategy } from "#infrastructure/database/mongodb/models/subscription/strategies/strategies.interfaces.js";
import { StrategySchema } from "#infrastructure/database/mongodb/models/subscription/strategies/price-change.strategies.schemas.js";
import { ISubscriptionTarget } from "#infrastructure/database/mongodb/models/subscription/targets/targets.interfaces.js";
import { TargetSchema } from "#infrastructure/database/mongodb/models/subscription/targets/targets.schemas.js";

interface ISubscriptionSchema {
	userId: number;
	isActive: boolean;
	strategy: PriceStrategy;
	target: ISubscriptionTarget;
};

const SubscriptionSchema = new Schema<ISubscriptionSchema>({
	userId: { type: Number, ref: 'Users', required: true },
	isActive: { type: Boolean, default: true },
	strategy: { type: StrategySchema, required: true },
	target: { type: TargetSchema, required: true }
});

export const SubscriptionModel = model('Subscriptions', SubscriptionSchema);