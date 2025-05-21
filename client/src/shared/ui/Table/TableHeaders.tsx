import { ReactNode } from "react";

export interface Column<T> {
	key: string,
	title: ReactNode,
	sortable: boolean,
	render?: (item: T) => ReactNode,
	className?: string,
	onClick?: () => void
}

interface TableHeadresProps<T> {
	columns: Column<T>[],
	className: string,
	onSort?: ((key: string) => void)
}

export function TableHeaders<T>({
	columns,
	className,
	onSort
}: TableHeadresProps<T>) {
	return (
		<thead>
			<tr className={className}>
				{
					columns.map((column) => {
						return (
							<th
								key={column.key}
								className={column.className}
								onClick={() => {
									if (column.sortable && onSort) onSort(column.key);
									if (column.onClick) column.onClick();
								}}
							>
								{column.title}
							</th>
						);
					})
				}
			</tr>
		</thead>
	);
}