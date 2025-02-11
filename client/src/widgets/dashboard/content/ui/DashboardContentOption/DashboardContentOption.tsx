import { FC } from "react";
import { CoinIcon } from "../../../../../shared/assets/icons/CoinIcon";
import { IDashboardContentOption } from "../../../model/types";


export const DashboardContentOption: FC<IDashboardContentOption> = ({ title, price, percentage, symbol }) => {
	return (
		<tr className="text-left h-[50px] cursor-pointer hover:bg-color-hover">
			<td className="size-11">
				<CoinIcon />
			</td>
			<td className="font-bold text-lg">{ title }</td>
			<td>{ price }</td>
			<td>{ symbol }</td>
			<td className="text-center">{ percentage }%</td>
		</tr>
	);
};