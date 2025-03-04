import { useOutletContext } from "react-router-dom";

import { useSortState } from "@/shared/lib/hooks/useSortState";
import { Table } from "@/shared/ui/";


interface IOutletContext {
	setSelectedElement: () => void,
	test: string
}

export const TokensPage = () => {
	const {sortState, handleSort} = useSortState('asc', 'index');
	const { setSelectedElement } = useOutletContext<IOutletContext>();

	const columns = [
		{ key: 'index', title: 'index', sortable: true, className: "font-light min-w-1 w-10", },
		{ key: 'symbol', title: 'symbol', sortable: true, className: "font-light min-w-30 w-80" },
		{ key: 'price', title: 'price', sortable: true, className: "font-light min-w-30 w-80" },
		{ key: 'percentage', title: 'percentage', sortable: true, className: "font-light min-w-30 w-80" },
	]

	const data = [
		{ type: 'token', index: 1, symbol: 'BTC', price: 344343, percentage: 3 },
		{ type: 'token', index: 2, symbol: 'PEPE', price: 0.33223, percentage: 3 },
		{ type: 'token', index: 3, symbol: 'XRP', price: 2.3, percentage: 3 },
		{ type: 'token', index: 4, symbol: 'SOL', price: 170.2, percentage: 3 },
		{ type: 'token', index: 5, symbol: 'ETH', price: 2430.2, percentage: 3 },
	]

	const sortData = (initData: typeof data) => {
		return [...initData].sort((a, b) => {
			const aValue = a[sortState.sortKey as keyof typeof a];
			const bValue = b[sortState.sortKey as keyof typeof b];

			if (typeof aValue === 'string' && typeof bValue === 'string') {
				return sortState.sortDir === 'asc'
						? aValue.localeCompare(bValue)
						: bValue.localeCompare(aValue)
			}

			if (typeof aValue === 'number' && typeof bValue === 'number') {
				return sortState.sortDir === 'asc'
						? aValue - bValue
						: bValue - aValue
			}

			return 0;
		});
	}

	return(
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