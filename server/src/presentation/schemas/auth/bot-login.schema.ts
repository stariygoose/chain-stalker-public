import Joi from "joi";

export const botLoginSchema = Joi.object({
	userId: Joi.number().required()
})