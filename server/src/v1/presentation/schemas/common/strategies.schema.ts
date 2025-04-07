import Joi from "joi";

export const strategyPercentageSchema = Joi.object({
	type: Joi.string().valid("percentage").required(),
	threshold: Joi.number().required()
});

export const strategyAbsoluteSchema = Joi.object({
	type: Joi.string().valid("absolute").required(),
	threshold: Joi.number().required()
});