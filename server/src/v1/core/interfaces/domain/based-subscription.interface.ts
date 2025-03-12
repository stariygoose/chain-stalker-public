import { Token } from "./token-target.interface.js";
import { Nft } from "./nft-target.interface.js";

export interface BasedSubscription<T extends Token | Nft> {
	percentage: number;
	target: T;
}