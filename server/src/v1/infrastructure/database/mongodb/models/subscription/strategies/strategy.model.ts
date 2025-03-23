import { 
	StrategySchema 
} from "#infrastructure/database/mongodb/models/subscription/strategies/price-change.strategies.schemas.js";
import { model } from "mongoose";

export const StrategyModel = model("Strategy", StrategySchema);