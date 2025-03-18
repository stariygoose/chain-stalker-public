export abstract class Validator<T> {
	constructor (public readonly objective: T) {}

	abstract validate(): void;
}