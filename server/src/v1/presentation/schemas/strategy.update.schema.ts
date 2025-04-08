import Joi from "joi";
import { strategyAbsoluteSchema, strategyPercentageSchema } from "#presentation/schemas/common/strategies.schema.js";

export const strategyUpdateSchema = Joi.object({
	strategy: Joi.alternatives()
						.conditional(Joi.object({ type: Joi.valid("percentage").required() }).unknown(), {
							then: strategyPercentageSchema,
						})
						.conditional(Joi.object({ type: Joi.valid("absolute").required() }).unknown(), {
							then: strategyAbsoluteSchema,
						}),
});
