export function checkStrategy(s: string): s is 'percentage' | 'absolute' {
	if (s === 'percentage') return true;
	if (s === 'absolute') return true;
	return false;
}