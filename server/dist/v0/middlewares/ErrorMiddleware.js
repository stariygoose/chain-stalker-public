import { ApiError } from "../errors/Errors.js";
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }
    res.status(520).json({ message: "Unknown server error." });
};
export { errorMiddleware };
