import { ReactNode } from "react";

export interface ICollection {
	image: ReactNode,
	title: string,
	price: number,
	percentage: number,
	symbol: string
}