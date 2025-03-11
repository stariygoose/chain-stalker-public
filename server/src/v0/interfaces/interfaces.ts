import { Request } from "express";
import { OpenSea } from "../services/marketplaces/OpenSea.js";

export interface ICollection {
	address: string,
	chain: string,
	collection: string,
	name: string,
	floorPrice: number,
	floorPriceSymbol: string
}
export type ICollectionOSRequest = Omit<ICollection, "floorPrice" | "floorPriceSymbol">;
export type IFloorPriceOSRequest = Pick<ICollection, "floorPrice" | "floorPriceSymbol">;

export interface ICoin {
	symbol: string
	price: number
}

export interface IUserContext<T extends ICollection | ICoin> {
	userId: number,
	target: T,
	percentage: number
}

export interface ISubscription<T extends ICollection | ICoin> {
	userId: number,
	target: T,
	percentage: number,
	isStalked: boolean,
	createdAt: Date,
	updatedAt: Date
}

export interface IUserMetadata {
	userId: number
}

export interface IJwt {
	userId: number,
	refreshToken: string
}

export enum Channel {
	NFT_PRICE_CHANGED = "nft_price_changed",
	COIN_PRICE_CHANGED = "coin_price_changed"
}

export interface CustomRequest extends Request {
	os?: OpenSea
}