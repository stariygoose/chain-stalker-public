export function fromWeiToEth(wei: string | number): number {
	return +wei / 1e18;
}