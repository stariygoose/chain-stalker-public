import { FC, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { DashboardInformation, DashboardNavigation } from "@/widgets/";
import { DashboardOptionsTypes } from "@/widgets/dashboard/model/types";
import { CoinIcon } from "@/shared/assets/icons/CoinIcon";
import { isOptionInstance } from "../lib/helper/isOptionInstance";


export const DashboardPage: FC = () => {
	const [activeTab, setActiveTab] = useState<DashboardOptionsTypes | null>(null);
	const currentPath = useLocation();
	
	useEffect(() => {
		const currentTab = currentPath.pathname.split('/').slice(-1)[0];
		if (isOptionInstance(currentTab)) {
			setActiveTab(currentTab);
		}
	}, [currentPath])

	return ( 
		<section className="w-[calc(100%-180px)] h-screen max-sm:size-full max-sm:p-2 p-5 mx-auto">
			<h1 className="text-4xl font-bold max-sm:text-center">
				Dashboard
			</h1>
			<DashboardNavigation 
				activeTab={activeTab}
			/>
			<div className="flex justify-between">
				<div className="h-[calc(100vh-150px)] max-lg:w-full overflow-y-auto" style={{scrollbarWidth: 'none'}}>
					<Outlet />
				</div>
				<DashboardInformation title={'Collection 1'}
					icon={<CoinIcon/>}	
					percentage={5}
				/>
			</div>
		</section>
	);
};