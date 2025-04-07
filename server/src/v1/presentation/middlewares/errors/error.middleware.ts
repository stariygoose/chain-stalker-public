import { DomainError } from "#core/errors/domain-error.abstract.js";
import { InfrastructureError } from "#infrastructure/errors/infrastructure-error.abstract.js";
import { ErrorRequestHandler } from "express";

export const errorMiddleware: ErrorRequestHandler = (
	error, 
	req, 
	res, 
	next
) => {
	if (error instanceof DomainError) {
		res.status(400).json({ error: error.message });
		return ;
	}
	if (error instanceof InfrastructureError) {
		res.status(502).json({ error: "External service failed" });
	}

	res.status(500).json({ error: 'Internal Server Error' });
	return ;
}