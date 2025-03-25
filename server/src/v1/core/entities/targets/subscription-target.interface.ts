import { INftTarget } from "#core/entities/targets/nft-target.interface.js";
import { ITokenTarget } from "#core/entities/targets/token-target.interface.js";

export type TargetTypes = 'nft' | 'token';

export interface ISubscriptionTarget {
	readonly type: TargetTypes;
}

export type Target = INftTarget | ITokenTarget;
