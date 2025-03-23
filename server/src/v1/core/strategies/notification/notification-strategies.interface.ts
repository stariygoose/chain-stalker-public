export interface INotificationStrategy<T, U> {
	readonly type: string;
	shouldNotify(currentState: T, newState: U): boolean;
}

export interface IPriceChangeStrategy extends INotificationStrategy<number, number> {
	readonly type: PriceStrategies;
	readonly threshold: number;
	calculateDifference(currentState: number, newState: number, precision?: number): number;
}

const PriceChangeStrategies = {
	ABSOLUTE: 'absolute',
	PERCENTAGE: 'percentage'
} as const
export type PriceStrategies = typeof PriceChangeStrategies[keyof typeof PriceChangeStrategies]