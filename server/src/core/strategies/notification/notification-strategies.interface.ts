export type PriceChangeStrategiesTypes = 'percentage' | 'absolute';

export type StrategyType = PriceChangeStrategiesTypes;

export interface INotificationStrategy<T, U> {
	readonly type: StrategyType;
	
	shouldNotify(currentState: T, newState: U): boolean;
}

export interface IPriceChangeStrategy extends INotificationStrategy<number, number> {
	readonly type: PriceChangeStrategiesTypes;
	readonly threshold: number;

	calculateDifference(currentState: number, newState: number, precision?: number): number;
}


export type Strategy = IPriceChangeStrategy;
