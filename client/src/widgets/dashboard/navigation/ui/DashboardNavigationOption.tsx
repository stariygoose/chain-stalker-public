import { FC, ReactNode } from "react";
import { DashboardTypesKeys } from "../../model/types";

interface IDashboardOption {
	id: DashboardTypesKeys;
	icon: ReactNode;
	title: string;
	activeTab: DashboardTypesKeys;
	changeActiveTab: (tab: DashboardTypesKeys) => void;
}

export const DashboardNavigationOption: FC<IDashboardOption> = ({
	id,
	icon,
	title,
	activeTab,
	changeActiveTab
}) => {
	return (
		<div id={id}
			className={`flex items-center gap-1 p-2 
				hover:bg-color-hover hover:rounded
				transition-all duration-200 ease-linear
				${ activeTab === id
						? 'bg-color-second border rounded-md'
						: 'bg-transparent'}`}
			onClick={() => changeActiveTab(id)}>
			<div className="w-5 h-5">{icon}</div>
			<p>{title}</p>
		</div>
	);
}