import { getItemByKey } from "../../lib/helpers/getItemByKey";
import { Column } from "./TableHeaders"

interface TableBodyProps<T> {
	columns: Column<T>[],
	data: T[],
	className?: string
}

export function TableBody<T>({
	columns,
	data,
	className
}: TableBodyProps<T>) {
	return (
		<tbody>
			{data.map((item, index) => (
          <tr key={index} className={className}>
            {columns.map((column) => (
              <td key={`${index}-${column.key}`}>
								{ column.render ? column.render(item) : getItemByKey<T>(item, column.key) }
              </td>
            ))}
          </tr>
        ))}
		</tbody>
	);
}