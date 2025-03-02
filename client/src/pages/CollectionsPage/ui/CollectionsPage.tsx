import { NftIcon } from "@/shared/assets";
import { Table } from "@/shared/ui";
import { ReactNode } from "react";

interface Collection {
	image: ReactNode,
	title: string,
	price: number,
	percentage: number,
	symbol: string
}

export const CollectionsPage = () => {
	const columns = [
		{ key: 'image', title: '', sortable: false, className: "min-w-6 max-w-10 w-10", render: (col:Collection) => {return col.image}},
		{ key: 'title', title: 'title', sortable: true, className: "font-light min-w-30 w-80" },
		{ key: 'price', title: 'price', sortable: true, className: "font-light min-w-30 w-80" },
		{ key: 'percentage', title: 'percentage', sortable: true, className: "font-light min-w-30 w-80" },
		{ key: 'symbol', title: 'symbol', sortable: true, className: "font-light min-w-30 w-80" },
	]

	const data = [
		{ image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'ETH' },
		{ image: <NftIcon />, title: 'Collection 1', price: 1232, percentage: 1, symbol: 'ETH' },
		{ image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'SOL' },
		{ image: <NftIcon />, title: 'Collection 1', price: 102130, percentage: 10, symbol: 'SOL' },
		{ image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 132, symbol: 'SOL' },
		{ image: <NftIcon />, title: 'Collection 1', price: 1, percentage: 10, symbol: 'SOL' },
		{ image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'SOL' },
		{ image: <NftIcon />, title: 'Collection 1', price: 1312300, percentage: 10, symbol: 'SOL' },
		{ image: <NftIcon />, title: 'Collection 1', price: 1231200, percentage: 10, symbol: 'OP' },
		{ image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'OP' },
		{ image: <NftIcon />, title: 'Collection 1', price: 1312300, percentage: 110, symbol: 'OP' },
		{ image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'ZK' },
		{ image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10000, symbol: 'ZK' },
		{ image: <NftIcon />, title: 'Collection 1', price: 13123100, percentage: 10, symbol: 'ZK' },
		{ image: <NftIcon />, title: 'Collection 1', price: 1100, percentage: 10, symbol: 'ZK' },
		{ image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'ZK' },
		{ image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'ZK' },
		{ image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'ZK' },
		{ image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'ZK' },
		{ image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'ZK' },
	];


	return(
		<Table
			columns={columns}
			data={data}
			headerClassName="bg-color-second w-full text-left text-lg sticky top-0 cursor-pointer"
			rowClassName="text-left h-[50px] cursor-pointer hover:bg-color-hover"
			tableClassName="border-collapse"
		/>
	);
}