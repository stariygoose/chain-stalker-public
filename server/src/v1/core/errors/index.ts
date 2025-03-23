import * as StrategyErrors from "#core/errors/strategy-errors.js";
import * as TargetErrors from "#core/errors/target-errors.js";
import * as CommonErrors from "#core/errors/common.errors.js";

export const DomainError = {
	...StrategyErrors,
	...TargetErrors,
	...CommonErrors
}