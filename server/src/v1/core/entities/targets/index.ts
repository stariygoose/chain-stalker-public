import { INftTarget } from "#core/entities/targets/nft-target.interface.js";
import { ITokenTarget } from "#core/entities/targets/token-target.interface.js";

export { ITokenTarget } from "#core/entities/targets/token-target.interface.js";
export { INftTarget } from "#core/entities/targets/nft-target.interface.js";
export { ISubscriptionTarget, TargetTypes } from "#core/entities/targets/subscription-target.interface.js";

export type Target = INftTarget | ITokenTarget;
