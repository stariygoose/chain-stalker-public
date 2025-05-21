import Joi from "joi";

export const tokenTargetSchema = Joi.object({
	type: Joi.string().valid("token").required(),
	symbol: Joi.string().required(),
	lastNotifiedPrice: Joi.number().required()
});

export const nftTargetSchema = Joi.object({
	type: Joi.string().valid("nft").required(),
	slug: Joi.string().pattern(/^[a-z0-9]+(?:[_-][a-z0-9]+)*$/).required(),
	name: Joi.string().required(),
	chain: Joi.string().required(),
	symbol: Joi.string().required(),
	lastNotifiedPrice: Joi.number().required()
});
