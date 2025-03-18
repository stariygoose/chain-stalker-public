export class NumberValidator {
	public static isInfinity(n: number): boolean {
		return typeof n === 'number' && n === Infinity;
	}

	public static isNaN(n: number): boolean {
		return typeof n === 'number' && isNaN(n);
	}

	public static isInRange(n: number, BASE_LIMIT: number, TOP_LIMIT: number): boolean {
		return n <= BASE_LIMIT || n > TOP_LIMIT ? false : true;
	} 
}