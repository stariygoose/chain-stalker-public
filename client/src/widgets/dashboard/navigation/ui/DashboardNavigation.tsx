import { FC } from "react";
import { NftIcon } from "@/shared/assets/icons/NftIcon";
import { CoinIcon } from "@/shared/assets/icons/CoinIcon";
import { DashboardOptions, DashboardOptionsTypes } from "@/widgets/dashboard/model/types";
import { DashboardNavigationOption } from "@/widgets/";
import { SubscriptionsIcon } from "@/shared/assets/icons/SubscriptionsIcon";

interface IDashboardNavigation {
	activeTab: DashboardOptionsTypes | null,
}

export const DashboardNavigation: FC<IDashboardNavigation> = ({ activeTab }) => {
	const options = [
		{
			id: DashboardOptions.all,
			path: "",
			icon: <SubscriptionsIcon />,
			title: "All",
			activeTab: activeTab,
		},
		{
			id: DashboardOptions.tokens,
			path: "tokens",
			icon: <CoinIcon />,
			title: "Tokens",
			activeTab: activeTab,
		},
		{
			id: DashboardOptions.collections,
			path: "collections",
			icon: <NftIcon />,
			title: "Collections",
			activeTab: activeTab,
		}
	];

	return (
		<div className="p-2 mt-3 flex gap-4 border-b-1 border-t-1 
		border-gray-300/20 text-lg cursor-pointer overflow-x-scroll"
		style={{scrollbarWidth: 'none'}}>
			{
				options.map((option, index) => (
					<DashboardNavigationOption
						key={index}
						id={option.id as DashboardOptionsTypes}
						path={option.path}
						icon={option.icon}
						title={option.title}
						activeTab={option.activeTab}
					/>
				))
			}
		</div>
	);
};