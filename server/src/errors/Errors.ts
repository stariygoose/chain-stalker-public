export class ApiError extends Error {
	public statusCode: number

	constructor (message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class NotFoundError extends ApiError {
	constructor(message: string) {
		super(message, 404);
	}
}

export class BadRequestError extends ApiError {
	constructor() {
		super("Bad request.", 400);
	}
}

export class UnauthorizedError extends ApiError {
	constructor(message?: string) {
		super(message ?? "Unauthorized request.", 401);
	}
}

export class DataBaseError extends ApiError {
	constructor(message: string) {
		super(message, 500);
	}
}
