import * as StrategyErrors from "./strategy-errors.js";
import * as SubscriptionErrors from "./subscription-errors.js";
import * as TargetErrors from "./target-errors.js";

export const DomainError = {
	...StrategyErrors,
	...SubscriptionErrors,
	...TargetErrors
}