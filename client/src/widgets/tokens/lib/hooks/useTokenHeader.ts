export const useTokenHeader = () => {
	return [
		{ key: 'index', title: 'index', sortable: true, className: "font-light min-w-1 w-10", },
		{ key: 'symbol', title: 'symbol', sortable: true, className: "font-light min-w-30 w-80" },
		{ key: 'price', title: 'price', sortable: true, className: "font-light min-w-30 w-80" },
		{ key: 'percentage', title: 'percentage', sortable: true, className: "font-light min-w-30 w-80" },
	];
} 