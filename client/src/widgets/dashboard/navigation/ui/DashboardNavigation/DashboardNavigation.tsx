import { FC } from "react";
import { NftIcon } from "../../../../../shared/assets/icons/NftIcon";
import { CoinIcon } from "../../../../../shared/assets/icons/CoinIcon";
import { DashboardTypesKeys } from "../../../model/types";
import { DashboardNavigationOption } from "../DashboardNavigationOption/DashboardNavigationOption";
import { SubscriptionsIcon } from "../../../../../shared/assets/icons/SubscriptionsIcon";

interface IDashboardNavigation {
	activeTab: DashboardTypesKeys,
	changeActiveTab: (tab: DashboardTypesKeys) => void;
}

export const DashboardNavigation: FC<IDashboardNavigation> = ({ activeTab, changeActiveTab }) => {
	const options = [
		{
			id: "all",
			icon: <SubscriptionsIcon />,
			title: "All",
			activeTab: activeTab,
			changeActiveTab: changeActiveTab
		},
		{
			id: "collections",
			icon: <NftIcon />,
			title: "Collections",
			activeTab: activeTab,
			changeActiveTab: changeActiveTab
		},
		{
			id: "tokens",
			icon: <CoinIcon />,
			title: "Tokens",
			activeTab: activeTab,
			changeActiveTab: changeActiveTab
		}
	];

	return (
		<div className="p-2 mt-3 flex gap-4 border-b-1 border-t-1 
		border-gray-300/20 text-lg cursor-pointer">
			{
				options.map((option, index) => (
					<DashboardNavigationOption
						key={index}
						id={option.id}
						icon={option.icon}
						title={option.title}
						activeTab={option.activeTab}
						changeActiveTab={option.changeActiveTab}
					/>
				))
			}
		</div>
	);
};