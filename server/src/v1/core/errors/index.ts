import * as StrategyErrors from "#core/errors/strategy-errors.js";
import * as SubscriptionErrors from "#core/errors/subscription-errors.js";
import * as TargetErrors from "#core/errors/target-errors.js";

export const DomainError = {
	...StrategyErrors,
	...SubscriptionErrors,
	...TargetErrors
}