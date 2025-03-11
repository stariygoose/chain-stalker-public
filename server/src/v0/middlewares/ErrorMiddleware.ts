import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/Errors.js";

const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }

    res.status(520).json({ message: "Unknown server error." });
};

export { errorMiddleware };