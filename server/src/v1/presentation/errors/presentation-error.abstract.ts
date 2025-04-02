export class PresentationError extends Error {
	constructor (
		public readonly status: number,
		message: string
	) {
		super(message);
		Error.captureStackTrace(this, this.constructor);
	}
}