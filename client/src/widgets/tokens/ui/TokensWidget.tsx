import { useOutletContext } from "react-router-dom";

import { useSortData } from "@/shared/lib/hooks/useSortData";
import { useTokenHeader } from "../lib/hooks/useTokenHeader";
import { Table } from "@/shared/ui";


interface IOutletContext {
	setSelectedElement: () => void,
}

export const TokensWidget = () => {
	const { handleSort, sortData } = useSortData('asc', 'index');
	const { setSelectedElement } = useOutletContext<IOutletContext>();
	const columns = useTokenHeader();

	const data = [
		{ type: 'token', index: 1, symbol: 'BTC', price: 344343, percentage: 3 },
		{ type: 'token', index: 2, symbol: 'PEPE', price: 0.33223, percentage: 3 },
		{ type: 'token', index: 3, symbol: 'XRP', price: 2.3, percentage: 3 },
		{ type: 'token', index: 4, symbol: 'SOL', price: 170.2, percentage: 3 },
		{ type: 'token', index: 5, symbol: 'ETH', price: 2430.2, percentage: 3 },
	]

	return (
		<Table
			columns={columns}
			data={sortData(data)}
			headerClassName="bg-color-second w-full text-left text-lg sticky top-0 cursor-pointer select-none"
			rowClassName="text-left h-[50px] cursor-pointer hover:bg-color-hover"
			tableClassName="border-collapse"
			onSort={handleSort}
			onElementClick={setSelectedElement}
		/>
	);
}