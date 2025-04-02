import { PresentationError } from "#presentation/errors/presentation-error.abstract.js";
import { ErrorRequestHandler } from "express";

export const errorMiddleware: ErrorRequestHandler = (
	error, 
	req, 
	res, 
	next
) => {
	if (error instanceof PresentationError) {
		res.status(error.status).json({ error: error.message });
		return ;
	}
	res.status(500).json({ error: 'Internal Server Error' });
	return ;
}