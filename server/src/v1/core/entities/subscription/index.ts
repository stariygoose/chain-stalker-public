import { INftSubscription } from "#core/entities/subscription/nft-subscription.class.js";
import { ITokenSubscription } from "#core/entities/subscription/token-subscription.class.js";

export { ISubscription } from "#core/entities/subscription/subscription.interface.js";

export type Subscription = INftSubscription | ITokenSubscription