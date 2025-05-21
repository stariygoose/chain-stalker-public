import { DashboardNavigationOptions, DashboardNavigationOptionsTypes } from "@/widgets/dashboard/navigation/model/types";

export function isOptionInstance(tab: string): tab is DashboardNavigationOptionsTypes {
	return Object.values(DashboardNavigationOptions).includes(tab as DashboardNavigationOptionsTypes);
}