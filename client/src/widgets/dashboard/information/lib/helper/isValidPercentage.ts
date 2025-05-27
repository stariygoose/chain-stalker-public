export const isValidPercentage = (numStr: string): {
	isError: boolean,
	errorMessage: string | null
} => {
	if (!/^(\d+(\.\d*)?|\d*\.\d+)$/.test(numStr)) {
		return { isError: true, errorMessage: 'Please enter a valid number' };
	}

	const num = parseFloat(numStr);
	if (isNaN(num)) {
		return { isError: true, errorMessage: 'Please enter a valid number' };
	}
	if (num < 0 || num > 1000) {
		return { isError: true, errorMessage: "Percentage must be between 0 and 1000" };
	}
	return { isError: false, errorMessage: null };
}