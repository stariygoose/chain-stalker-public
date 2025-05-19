import { NextFunction, Request, Response } from "express";
import Joi from "joi";


export function joiValidator(
  schema: Joi.ObjectSchema,
  property: 'body' | 'query' | 'params' = 'body'
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      res.status(400).json({
        error: "Bad Request. Validation failed.",
        details: error.details.map(d => d.message),
      });
			return ;
    }

    req[property] = value;
    next();
  };
}