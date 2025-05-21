import { AbstractDatabaseError } from "#infrastructure/errors/database-errors/database-errors.abstract.js";

export class DatabaseError extends AbstractDatabaseError {
	constructor (message: string) {
		super(`Not found ${message}`);
	}
}

export class InvalidIdDbError extends AbstractDatabaseError {
	constructor (id: string) {
		super(`Invalid ID format: ${id}`);
	}
}

export class InvalidDbTargetTypeError extends AbstractDatabaseError {
	constructor(type: never) {
		super(`Unhandled type of target <${type}>`);
	}
}

export class DuplicateKeyDbError extends AbstractDatabaseError {
	constructor (public readonly key: number) {
		super(`Duplicate key error: ${key}`);
	}
}