import { FC, useEffect } from "react";
import { NftIcon } from "@/shared/assets/icons/NftIcon";
import { CoinIcon } from "@/shared/assets/icons/CoinIcon";
import { DashboardNavigationOptions, DashboardNavigationOptionsTypes } from "@/widgets/dashboard/navigation/model/types";
import { SubscriptionsIcon } from "@/shared/assets/icons/SubscriptionsIcon";
import { DashboardNavigationOption } from "./DashboardNavigationOption";

interface IDashboardNavigation {
	activeTab: DashboardNavigationOptionsTypes | null,
}

export const DashboardNavigation: FC<IDashboardNavigation> = ({ activeTab }) => {
	const options = [
		{
			id: DashboardNavigationOptions.all,
			path: "",
			icon: <SubscriptionsIcon />,
			title: "All",
			activeTab: activeTab,
		},
		{
			id: DashboardNavigationOptions.tokens,
			path: "tokens",
			icon: <CoinIcon />,
			title: "Tokens",
			activeTab: activeTab,
		},
		{
			id: DashboardNavigationOptions.collections,
			path: "collections",
			icon: <NftIcon />,
			title: "Collections",
			activeTab: activeTab,
		}
	];

	useEffect(() => {
		console.log('DashboardNavigation mounted')
	}, [])
	useEffect(() => {
		console.log('DashboardNavigation rerender')
	})

	return (
		<div className="p-2 mt-3 flex gap-4 border-b-1 border-t-1 
		border-gray-300/20 text-lg cursor-pointer overflow-x-scroll"
		style={{scrollbarWidth: 'none'}}>
			{
				options.map((option, index) => (
					<DashboardNavigationOption
						key={index}
						id={option.id as DashboardNavigationOptionsTypes}
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