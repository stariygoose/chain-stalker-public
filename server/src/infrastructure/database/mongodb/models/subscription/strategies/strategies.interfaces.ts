export interface PriceStrategy {
	type: 'percentage' | 'absolute';
	threshold: number;
}