import { NftIcon } from "@/shared/assets";
import { Table } from "@/shared/ui";
import { useCollectionHeader } from "../lib/hooks/useCollectionHeader";

export const CollectionsPage = () => {
	const columns = useCollectionHeader();

	const data = [
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'ETH' },
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 1232, percentage: 1, symbol: 'ETH' },
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'SOL' },
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 102130, percentage: 10, symbol: 'SOL' },
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 132, symbol: 'SOL' },
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 1, percentage: 10, symbol: 'SOL' },
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'SOL' },
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 1312300, percentage: 10, symbol: 'SOL' },
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 1231200, percentage: 10, symbol: 'OP' },
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'OP' },
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 1312300, percentage: 110, symbol: 'OP' },
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'ZK' },
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10000, symbol: 'ZK' },
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 13123100, percentage: 10, symbol: 'ZK' },
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 1100, percentage: 10, symbol: 'ZK' },
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'ZK' },
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'ZK' },
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'ZK' },
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'ZK' },
		{ type: "collection", image: <NftIcon />, title: 'Collection 1', price: 100, percentage: 10, symbol: 'ZK' },
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