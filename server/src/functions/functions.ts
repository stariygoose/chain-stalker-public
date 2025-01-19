import { ICoin, ICollection, IUserContext } from "../interfaces/interfaces.js";

export function calculatePercentage(currentPrice: number, newPrice: number): number {
	return ((newPrice - currentPrice) / currentPrice) * 100;
}

export function fromWeiToEth(wei: string | number): number {
	return +wei / 1e18;
}

export function isTargetCoin(state: any): state is IUserContext<ICoin> {
	return (
		state &&
		state.userId &&
		state.percentage &&
		state.target &&
		(
			state.target.price ||
			state.target.symbol
		)
	);
}

export function isTargetNftCollection(state: any): state is IUserContext<ICollection> {
	return (
		state &&
		state.userId &&
		state.percentage &&
		state.target &&
		(
			state.target.floorPrice ||
			state.target.floorPriceSymbol ||
			state.target.address ||
			state.target.chain
		)
	);
}
