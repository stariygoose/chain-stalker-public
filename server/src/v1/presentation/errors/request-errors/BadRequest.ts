import { PresentationError } from "#presentation/errors/presentation-error.abstract.js";

export class BadRequest extends PresentationError {
	constructor (msg: string) {
		super(400, msg);
	}
}