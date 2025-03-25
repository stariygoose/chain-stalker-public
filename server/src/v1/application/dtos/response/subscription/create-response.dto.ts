import { Target } from "#core/entities/targets/index.js";
import { Strategy } from "#core/strategies/notification/notification-strategies.interface.js";

export interface ICreateSubscriptionResponse {
	readonly id: string;
	readonly userId: number;
	readonly target: Target;
	readonly strategy: Strategy;
	readonly isActive: boolean;
}

export class CreateSubscriptionResponseDto implements ICreateSubscriptionResponse {
	constructor (
		readonly id: string,
		readonly userId: number,
		readonly target: Target,
		readonly strategy: Strategy,
		readonly isActive: boolean
	) {}
}