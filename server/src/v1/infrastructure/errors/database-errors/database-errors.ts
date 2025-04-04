import { DatabaseError } from "#infrastructure/errors/database-errors/database-errors.abstract.js";

export class NotFoundDbError extends DatabaseError {
	constructor (message: string) {
		super(`Not found ${message}`);
	}
}

export class InvalidIdDbError extends DatabaseError {
	constructor (id: string) {
		super(`Invalid ID format: ${id}`);
	}
}