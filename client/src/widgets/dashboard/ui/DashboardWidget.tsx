import { FC, memo, ReactNode, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { DashboardNavigationOptionsTypes } from "@/widgets/dashboard/navigation/model/types";
import { DashboardSelectedElement } from "@/widgets/dashboard/information/model/types";
import { isOptionInstance } from "@/widgets/dashboard/lib/helper/isOptionInstance";
import { DashboardNavigation } from "@/widgets/dashboard/navigation/ui/DashboardNavigation";
import { DashboardInformation } from "@/widgets/dashboard/information/ui/DashboardInformation";

const MemorizedDashboardNavigation = memo(DashboardNavigation);
const MemorizedDashboardInformation = memo(DashboardInformation);

export const DashboardWidget: FC = () => {
	const [activeTab, setActiveTab] = useState<DashboardNavigationOptionsTypes | null>(null);
	const [selectedElement, setSelectedElement] = useState<DashboardSelectedElement>(null);
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
			<MemorizedDashboardNavigation 
				activeTab={activeTab}
			/>
			<div className="flex justify-between">
				<div className="h-[calc(100vh-150px)] max-lg:w-full overflow-y-auto" style={{scrollbarWidth: 'none'}}>
					<Outlet context={{ setSelectedElement }}/>
				</div>
				<MemorizedDashboardInformation 
					selectedElement={selectedElement}
				/>
			</div>
		</section>
	);
};