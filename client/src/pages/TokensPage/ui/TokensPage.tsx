import { useSortState } from "@/shared/lib/hooks/useSortState";
import { Table } from "@/shared/ui/";

export const TokensPage = () => {
	const {sortState, handleSort} = useSortState('asc', 'index');

	const columns = [
		{ key: 'index', title: 'index', sortable: true, className: "font-light min-w-1 w-10", },
		{ key: 'title', title: 'title', sortable: true, className: "font-light min-w-30 w-80" },
		{ key: 'price', title: 'price', sortable: true, className: "font-light min-w-30 w-80" },
		{ key: 'percentage', title: 'percentage', sortable: true, className: "font-light min-w-30 w-80" },
	]

	const data = [
		{ index: 1, title: 'BTC', price: 344343, percentage: 3 },
		{ index: 2, title: 'PEPE', price: 0.33223, percentage: 3 },
		{ index: 3, title: 'XRP', price: 2.3, percentage: 3 },
		{ index: 4, title: 'SOL', price: 170.2, percentage: 3 },
		{ index: 5, title: 'ETH', price: 2430.2, percentage: 3 },
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
		/>
	);
}