import { FC } from "react";
import { IDashboardContentOption } from "../../../model/types";
import { DashboardContentOption } from "../DashboardContentOption/DashboardContentOption";

interface IDashboardContent {
	content: IDashboardContentOption[];
	handleSort: (key: keyof IDashboardContentOption) => void;
};

export const DashboardContent: FC<IDashboardContent> = ({ content, handleSort }) => {
	return (
			<table className="max-w-[75%] border-collapse">
				<thead>
					<tr className="bg-color-second w-full text-left text-lg sticky top-0 cursor-pointer">
						<th className="w-[10%]"></th>
						<th className="font-light w-[50%]" onClick={() => handleSort('title')}>Title</th>
						<th className="font-light w-[15%]" onClick={() => handleSort('price')}>Price</th>
						<th className="font-light w-[15%]" onClick={() => handleSort('symbol')}>Symbol</th>
						<th className="font-light max-w-[25%]" onClick={() => handleSort('percentage')}>Percentage</th>
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