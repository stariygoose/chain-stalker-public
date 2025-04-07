type HttpCode = 400 | 404 | 503;

export abstract class ApiError extends Error {
	constructor (
		public readonly status: HttpCode,
		public readonly error: string
	) {
		super(error);
	}
}