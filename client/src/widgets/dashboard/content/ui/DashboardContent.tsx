import { FC } from "react";
import { IDashboardContentOption } from "../../model/types";
import { DashboardContentOption } from "./DashboardContentOption";

interface IDashboardContent {
	content: IDashboardContentOption[];
	handleSort: (key: keyof IDashboardContentOption) => void;
};

export const DashboardContent: FC<IDashboardContent> = ({ content, handleSort }) => {
	return (
			<table className="border-collapse">
				<thead>
					<tr className="bg-color-second w-full text-left text-lg sticky top-0 cursor-pointer">
						<th className="min-w-6 max-w-10 w-10"></th>
						<th className="font-light min-w-30 w-80" onClick={() => handleSort('title')}>Title</th>
						<th className="font-light min-w-15 w-30" onClick={() => handleSort('price')}>Price</th>
						<th className="font-light min-w-15 w-30" onClick={() => handleSort('symbol')}>Symbol</th>
						<th className="font-light min-w-15 w-20" onClick={() => handleSort('percentage')}>Percentage</th>
					</tr>
				</thead>
				<tbody>
					{
						content.map((item, index) => (
							<DashboardContentOption
								key={index}
								title={item.title}
								price={item.price}
								percentage={item.percentage}
								symbol={item.symbol}
							/>
						))
					}
				</tbody>
			</table>
		
	);
};