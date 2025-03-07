import { FC, ReactNode } from "react";
import { DashboardNavigationOptionsTypes } from "@/widgets/dashboard/navigation/model/types";
import { NavLink } from "react-router-dom";

interface IDashboardOption {
	id: DashboardNavigationOptionsTypes;
	path: string;
	icon: ReactNode;
	title: string;
	activeTab: DashboardNavigationOptionsTypes | null;
}

export const DashboardNavigationOption: FC<IDashboardOption> = ({
	id,
	path,
	icon,
	title,
	activeTab,
}) => {
	return (
		<NavLink to={path}>
			<div id={id}
				className={`flex items-center gap-1 p-2 
				hover:bg-color-hover hover:rounded
				transition-all duration-200 ease-linear
				${ activeTab === id
						? 'bg-color-second border rounded-md'
						: 'bg-transparent'}`}
			>
				<div className="w-5 h-5">
					{icon}
				</div>
				<p>
					{title}
				</p>
			</div>
		</NavLink>
	);
}