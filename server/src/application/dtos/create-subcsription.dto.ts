import { Target } from "#core/entities/targets/index.js";
import { StrategyType } from "#core/strategies/notification/notification-strategies.interface.js";


export interface ICreateSubscriptionRequest {
	userId: number;
	target: Target;
	strategy: {
		type: StrategyType;
		threshold: number;
	};
};

export class CreateSubscriptionRequestDto {
	public readonly userId: number;
	public readonly target: Target;
	public readonly strategyType: StrategyType;
	public readonly threshold: number;

	constructor (data: ICreateSubscriptionRequest) {
		const { userId, target, strategy } = data;
		const { symbol } = target;
		
		this.userId = userId;
		this.target = {
			...target,
			symbol: symbol.toUpperCase()
		};
		this.strategyType = strategy.type;
		this.threshold = strategy.threshold;
	}
}