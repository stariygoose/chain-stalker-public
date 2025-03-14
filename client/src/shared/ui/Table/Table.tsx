import { TableBody } from "./TableBody";
import { Column, TableHeaders } from "./TableHeaders";

interface TableProps<T> {
	columns: Column<T>[],
	data: T[],
	onSort?: ((key: string) => void),
	onElementClick?: (el: T) => void,
	rowClassName?: string,
	headerClassName?: string,
	tableClassName?: string
}

export function Table<T>({
	columns,
	data,
	onSort,
	onElementClick,
	rowClassName = "",
	headerClassName = "",
	tableClassName = ""
}: TableProps<T>) {
	return (
		<table className={tableClassName}>
			<TableHeaders
				columns={columns}
				className={headerClassName}
				onSort={onSort}
			/>
			<TableBody
				columns={columns}
				data={data}
				className={rowClassName}
				onElementClick={onElementClick}
			/>
		</table>
	);
}