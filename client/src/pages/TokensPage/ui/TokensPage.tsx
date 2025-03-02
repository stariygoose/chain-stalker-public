import { Table } from "@/shared/ui/";


export const TokensPage = () => {
	const columns = [
		{ key: 'index', title: 'index', sortable: true, className: "font-light min-w-1 w-10" },
		{ key: 'title', title: 'title', sortable: true, className: "font-light min-w-30 w-80" },
		{ key: 'price', title: 'price', sortable: true, className: "font-light min-w-30 w-80" },
	]

	const data = [
		{ index: 1, title: 'BTC', price: 344343 },
		{ index: 2, title: 'PEPE', price: 0.33223 },
		{ index: 3, title: 'XRP', price: 2.3 },
		{ index: 4, title: 'SOL', price: 170.2 },
		{ index: 5, title: 'ETH', price: 2430.2 },
	]
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