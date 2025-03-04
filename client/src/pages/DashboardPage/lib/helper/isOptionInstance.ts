import { DashboardOptions, DashboardOptionsTypes } from "@/widgets/dashboard/model/types";

export function isOptionInstance(tab: string): tab is DashboardOptionsTypes {
	return Object.values(DashboardOptions).includes(tab as DashboardOptionsTypes);
}