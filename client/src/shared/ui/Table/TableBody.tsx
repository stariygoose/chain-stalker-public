import { getItemByKey } from "../../lib/helpers/getItemByKey";
import { Column } from "./TableHeaders"

interface TableBodyProps<T> {
	columns: Column<T>[],
	data: T[],
	className?: string,
	onElementClick?: (el: T) => void
}

export function TableBody<T>({
	columns,
	data,
	className,
	onElementClick
}: TableBodyProps<T>) {
	return (
		<tbody>
			{data.map((item, index) => (
          <tr key={index} className={className} onClick={onElementClick ? () => onElementClick(item) : undefined}>
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