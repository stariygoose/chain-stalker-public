export type TargetTypes = 'nft' | 'token';

export interface ISubscriptionTarget {
	readonly type: TargetTypes;
}