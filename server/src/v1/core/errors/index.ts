import * as StrategyErrors from "./strategy-errors";
import * as SubscriptionErrors from "./subscription-errors";
import * as TargetErrors from "./target-errors";

export const DomainError = {
	...StrategyErrors,
	...SubscriptionErrors,
	...TargetErrors
}