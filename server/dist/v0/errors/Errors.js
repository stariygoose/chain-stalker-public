export class ApiError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class NotFoundError extends ApiError {
    constructor(message) {
        super(message, 404);
    }
}
export class BadRequestError extends ApiError {
    constructor() {
        super("Bad request.", 400);
    }
}
export class UnauthorizedError extends ApiError {
    constructor(message) {
        super(message ?? "Unauthorized request.", 401);
    }
}
export class DataBaseError extends ApiError {
    constructor(message) {
        super(message, 500);
    }
}
