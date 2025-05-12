export function checkStrategy(s: string): s is 'percentage' | 'absolute' {
	if (s === 'percentage') return true;
	if (s === 'absolute') return true;
	return false;
}

export function checkYesCancel(s: string): s is 'yes' | 'cancel' {
	if (s === 'yes') return true;
	if (s === 'cancel') return true;
	return false;
}