import { 
	ISubscriptionDbDto,
	StrategyDbDto,
	TargetDbDto
} from "#infrastructure/dtos/subscription/subscription-dto.interfaces.js";
import { Types } from "mongoose";


export class SubscriptionDbRecord implements ISubscriptionDbDto {
	constructor (
		public readonly _id: Types.ObjectId | null,
		public readonly userId: number,
		public readonly target: TargetDbDto,
		public readonly strategy: StrategyDbDto,
		public readonly isActive: boolean
	) {}
}