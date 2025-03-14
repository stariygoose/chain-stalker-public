export interface INotificationStrategy<T, U> {
	readonly type: string;
	shouldNotify(currentState: T, newState: U): boolean;
}

export interface IPriceChangeStrategy extends INotificationStrategy<number, number> {
	readonly type: 'price-change';
}

const PriceChangeStrategies = {
	ABSOLUTE: 'absolute',
	PERCENTAGE: 'percentage'
} as const
export type PriceStrategies = typeof PriceChangeStrategies[keyof typeof PriceChangeStrategies]