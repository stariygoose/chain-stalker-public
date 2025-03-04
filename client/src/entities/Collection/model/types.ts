import { ReactNode } from "react";

export interface ICollection {
	type: 'collection'
	image: ReactNode,
	title: string,
	price: number,
	percentage: number,
	symbol: string
}