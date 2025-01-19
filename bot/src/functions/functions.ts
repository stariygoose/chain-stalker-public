import { ICoin, ICollection, IUserContext } from "../types/interfaces.js";
import { NetworkState, NetworkStateKeys } from "../types/networkState.js";

export function isValidNetwork(network: any): network is NetworkStateKeys {
	return Object.values(NetworkState).includes(network);
}

export function isTargetCoin(state: any): state is IUserContext<ICoin> {
	return (
		state.target && 
		(
			state.target.price ||
			state.target.symbol
		)
	);
}

export function isTargetNftCollection(state: any): state is IUserContext<ICollection> {
	return (
		state.target && 
		(
			state.target.floorPrice ||
			state.target.floorPriceSymbol ||
			state.target.address ||
			state.target.chain
		)
	);
}