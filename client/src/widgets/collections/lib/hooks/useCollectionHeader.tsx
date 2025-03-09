import { ICollection } from "@/entities/Collection/model/types"
import { Column } from "@/shared/ui/Table/TableHeaders"

export const useCollectionHeader = (): Column<ICollection>[] => {
	return [
		{ 
			key: 'image',
			title: '',
			sortable: false,
			className: "min-w-6 max-w-10 w-10",
			render: (col: ICollection) => (col.image)
		},
		{
			key: 'title',
			title: 'title',
			sortable: true,
			className: "font-light min-w-30 w-80"
		},
		{ 
			key: 'price',
			title: 'price',
			sortable: true,
			className: "font-light min-w-10 w-10",
			render: (col: ICollection) => (
				<div className="flex justify-end pr-4">
					<span>{col.price}</span>
				</div>
			)
		},
		{ 
			key: 'symbol',
			title: 'symbol',
			sortable: true,
			className: "font-light min-w-10 w-15"
		},
		{ 
			key: 'percentage',
			title: 'percentage',
			sortable: true,
			className: "font-light min-w-10 w-10",
			render: (col: ICollection) => (
				<div className="flex justify-center">
					<span>{col.percentage}%</span>
				</div>
			)
		}
	]
}