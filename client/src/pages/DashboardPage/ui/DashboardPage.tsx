import { FC, useState } from "react";
import { DashboardInformation, DashboardNavigation } from "@/widgets/";
import { DashboardTypesKeys } from "@/widgets/dashboard/model/types";
import { CoinIcon } from "@/shared/assets/icons/CoinIcon";
import { Outlet } from "react-router-dom";


export const DashboardPage: FC = () => {
	const [activeTab, setActiveTab] = useState<DashboardTypesKeys>('all');

	return ( 
		<section className="w-[calc(100%-180px)] h-screen max-sm:size-full max-sm:p-2 p-5 mx-auto">
			<h1 className="text-4xl font-bold max-sm:text-center">Dashboard</h1>
			<DashboardNavigation activeTab={activeTab} changeActiveTab={setActiveTab}/>
			<div className="flex justify-between">
				<div className="h-[calc(100vh-150px)] max-lg:w-full overflow-y-auto" style={{scrollbarWidth: 'none'}}>
					<Outlet />
				</div>
				<DashboardInformation title={'Collection 1'}
					icon={<CoinIcon/>}
					percentage={5}/>
			</div>
		</section>
	);
};